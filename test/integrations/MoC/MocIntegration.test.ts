import { signERC2612Permit } from "eth-permit";
// const permission = await signERC2612Permit(alice_signer, nueMockToken.address, alice_signer.address, borrowerOperations.address, decreaseAmount.toString());

// import { expect } from "chai";
import hre, { deployments, expect } from "hardhat"; // expect => https://hardhat.org/hardhat-chai-matchers/docs/reference
// import { FakeContract, smock } from "@defi-wonderland/smock";
import {
    DLLR,
    ERC20,
    MassetManager,
    MocIntegration,
    BasketManagerV3,
    MocMock,
    MockERC20,
} from "types/generated";

import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { setBalance } from "@nomicfoundation/hardhat-network-helpers"; // https://hardhat.org/hardhat-network-helpers/docs/reference
import { ZERO_ADDRESS } from "@utils/constants";

describe("MoC Integration", async () => {
    // let mocFake: FakeContract<IMocMintRedeemDoc>;
    let moc: MocMock;
    let mocIntegration: MocIntegration;
    let deployer: SignerWithAddress;
    let alice: SignerWithAddress;
    let bob: SignerWithAddress;
    let funder: SignerWithAddress;
    let user: SignerWithAddress;
    let accounts: SignerWithAddress[];
    let dllr: DLLR;
    let doc: ERC20;
    let massetManager: MassetManager;
    let basketManager: BasketManagerV3;
    let bAssetZusd: MockERC20;
    let bAssetDoc: MockERC20;
    const { deploy, get } = deployments;
    const { ethers } = hre;
    // let dllr: DLLR, doc: DoC,

    // to test DLLR -> DoC -> RBTC
    // instantiation:
    // deploy DLLR, MassetManager, BasketManager, 2 'bAsset' ERC20 tokens - ZUSD and DoC, MoC fake main contract mocFake
    // initialize BasketManager with MassetManager and vice versa and with bAsstes
    // 1) user3
    // get DLLR: user1 deposits DoC and gets DLLR
    //

    before("before", async () => {
        accounts = await ethers.getSigners();
    });

    beforeEach("before all", async () => {
        await deployments.fixture([
            "MyAdminProxy",
            "DLLR",
            "MassetManager",
            "BasketManager",
            "MocIntegration",
        ]);

        [deployer, alice, bob] = accounts;

        const mocFactory = await ethers.getContractFactory("MocMock");
        moc = (await mocFactory.deploy()) as MocMock;

        dllr = (await ethers.getContract("DLLR")) as DLLR;
        massetManager = (await ethers.getContract("MassetManager")) as MassetManager;
        basketManager = (await ethers.getContract("BasketManagerV3")) as BasketManagerV3;
        mocIntegration = (await ethers.getContract("MocIntegration")) as MocIntegration;

        // bAssetDoc = (await ethers.getContract("DoC")) as MockERC20;
        bAssetDoc = await ethers.getContractAt("MockERC20", await mocIntegration.doc());

        const erc20Factory = await ethers.getContractFactory("MockERC20");
        bAssetZusd = (await erc20Factory.deploy(
            "Zero USD Token",
            "ZUSD",
            18,
            accounts[0].address,
            ethers.utils.parseEther("100000000")
        )) as MockERC20;

        await basketManager.addBassets(
            [bAssetZusd.address, bAssetDoc.address],
            [1, 1],
            [ZERO_ADDRESS, ZERO_ADDRESS],
            [0, 0],
            [0, 0],
            [false, false]
        );

        const adminProxy = await get("MyntAdminProxy");
        console.log(`adminProxy: ${adminProxy.address}
                        alice:${alice.address}
                        dllr.address:${dllr.address}
                        alice.address:${alice.address}
                        mocIntegration.address:${mocIntegration.address}
                        doc.address: ${bAssetDoc.address}
                        moc.address: ${moc.address}`);
    });

    describe("deployment", async () => {
        it("should redeem from DLLR Money on Chain DoC and then redeem RBTC from DoC, all in one transaction", async () => {
            const dllrAmount = ethers.utils.parseEther("500").toString();
            console.log(`dllrAmount: ${dllrAmount}`);

            // alice gets DLLR by minting it for
            // fund alice with 500 DoC
            await bAssetDoc.connect(alice).giveMe(dllrAmount);
            await bAssetDoc.connect(alice).approve(massetManager.address, dllrAmount);

            // await massetManager.connect(alice).mint(bAssetDoc.address, dllrAmount);

            // mint DLLR to alice & check balances updates
            await expect(massetManager.connect(alice).mint(bAssetDoc.address, dllrAmount))
                .to.changeTokenBalance(dllr, alice.address, dllrAmount)
                .to.changeTokenBalance(bAssetDoc, alice.address, `-${dllrAmount}`);

            // alice permits MocIntegration contract to approve dllrAmount for calling transferFrom(...) func
            const permit = await signERC2612Permit(
                alice,
                dllr.address.toLowerCase(),
                alice.address.toLowerCase(),
                mocIntegration.address.toLowerCase(),
                dllrAmount
            );

            // prerequisites:
            // calc expected RBTC for alice to receive
            const expectedRbtcValue = (await moc.docToRbtcRate()).mul(dllrAmount);
            // fund Money On Chain MoC contract with RBTC
            await setBalance(moc.address, expectedRbtcValue.mul(2));

            // alice calls MocIntegrationgetDocFromDllrAndRedeemRBTC(...)
            // to transfer DLLR dllrAmount to MoC contract and redeem RBTC
            // mocIntegration contract gets DLLR by permission from alice and calls
            // MocMock (MoC mock contract) redeem func to exchange DLLR to RBTC

            await mocIntegration.connect(alice).getDocFromDllrAndRedeemRBTC(dllrAmount, permit);

            /* await expect(
                mocIntegration.connect(alice).getDocFromDllrAndRedeemRBTC(dllrAmount, permit)
            )
                .to.changeEtherBalances(
                    [alice.address, moc.address],
                    [expectedRbtcValue, -expectedRbtcValue]
                )
                .to.changeTokenBalance(dllr, alice.address, -dllrAmount);
                */
            // expect((await alice.getBalance()).toString()).eq(expectedRbtcValue);
            // expect((await dllr.balanceOf(alice.address)).toString()).eq(0);
            // expect(await ethers.provider.getBalance(moc.address)).eq(expectedRbtcValue);
        });
    });
});
