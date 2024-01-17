import { signERC2612Permit } from "eth-permit";
// const permission = await signERC2612Permit(alice_signer, nueMockToken.address, alice_signer.address, borrowerOperations.address, decreaseAmount.toString());

// import { expect } from "chai";
import hre, { deployments, expect } from "hardhat"; // expect => https://hardhat.org/hardhat-chai-matchers/docs/reference
// import { FakeContract, smock } from "@defi-wonderland/smock";
import {
    DLLR,
    MassetManager,
    MocIntegration,
    BasketManagerV3,
    MocMock,
    MockERC20,
} from "types/generated";

import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { setBalance } from "@nomicfoundation/hardhat-network-helpers"; // https://hardhat.org/hardhat-network-helpers/docs/reference
import { ZERO_ADDRESS } from "@utils/constants";
import { Permit2 } from "../../../types/generated";
import  { AllowanceProvider, PermitTransferFrom, SignatureTransfer } from "@uniswap/permit2-sdk";
import { BN } from "@openzeppelin/test-helpers";

function toDeadline(expiration: number): number {
    return Math.floor((Date.now() + expiration) / 1000)
}

function extractSignature(signature: string) {
    const r = signature.slice(0, 66);
    const s = '0x' + signature.slice(66, 130);
    const v = '0x' + signature.slice(130, 132);

    return {v, r, s};
}

describe("MoC Integration", async () => {
    // let mocFake: FakeContract<IMocMintRedeemDoc>;
    let moc: MocMock;
    let mocIntegration: MocIntegration;
    let alice: SignerWithAddress;
    let accounts: SignerWithAddress[];
    let dllr: DLLR;
    let massetManager: MassetManager;
    let basketManager: BasketManagerV3;
    let bAssetZusd: MockERC20;
    let bAssetDoc: MockERC20;
    let permit2: Permit2;
    const { ethers } = hre;

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
            "MyntAdminProxy",
            "DLLR",
            "MassetManager",
            "BasketManager",
            "MocIntegration",
            "Permit2",
        ]);

        [, alice] = accounts;

        // const mocFactory = await ethers.getContractFactory("MocMock");
        // moc = (await mocFactory.deploy()) as MocMock;

        dllr = (await ethers.getContract("DLLR")) as DLLR;
        massetManager = (await ethers.getContract("MassetManager")) as MassetManager;
        basketManager = (await ethers.getContract("BasketManagerV3")) as BasketManagerV3;
        mocIntegration = (await ethers.getContract("MocIntegration")) as MocIntegration;
        permit2 = (await ethers.getContract("Permit2")) as Permit2;

        // bAssetDoc = (await ethers.getContract("DoC")) as MockERC20;
        bAssetDoc = await ethers.getContractAt("MockERC20", await mocIntegration.doc());
        moc = (await ethers.getContractAt("MocMock", await mocIntegration.moc())) as MocMock;

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
            [0, 0],
            [1000, 1000],
            [false, false]
        );
    });

    describe("deployment", async () => {
        it("initial mocVendorAccount address should be null", async () => {
            expect(await mocIntegration.mocVendorAccount()).equal(ethers.constants.AddressZero);
        });

        it("only owner can set mocVendorAccount", async () => {
            await expect(
                mocIntegration.connect(alice).setMocVendorAccount(accounts[2].address)
            ).to.be.revertedWith("Ownable: caller is not the owner");

            await mocIntegration.connect(accounts[0]).setMocVendorAccount(accounts[2].address);
            expect(await mocIntegration.mocVendorAccount()).equal(accounts[2].address);

            await mocIntegration
                .connect(accounts[0])
                .setMocVendorAccount(ethers.constants.AddressZero);
            expect(await mocIntegration.mocVendorAccount()).equal(ethers.constants.AddressZero);
        });

        it("should redeem from DLLR Money on Chain DoC and then redeem RBTC from DoC through Permit2, all in one transaction", async () => {
            const dllrAmount = ethers.utils.parseEther("500").toString();

            // alice gets DLLR by minting it for
            // fund alice with 500 DoC
            await bAssetDoc.connect(alice).giveMe(dllrAmount);
            await bAssetDoc.connect(alice).approve(massetManager.address, dllrAmount);

            // await massetManager.connect(alice).mint(bAssetDoc.address, dllrAmount);

            // mint DLLR to alice & check balances updates
            await expect(massetManager.connect(alice).mint(bAssetDoc.address, dllrAmount))
                .to.changeTokenBalance(dllr, alice.address, dllrAmount)
                .to.changeTokenBalance(bAssetDoc, alice.address, `-${dllrAmount}`);


            await dllr.connect(alice).approve(permit2.address, ethers.constants.MaxUint256);

            const nonce = await mocIntegration.nonces(alice.address);
            const deadline = toDeadline(1000 * 60 * 60 * 30 /** 30 minutes */);

            const permitTransferFrom: PermitTransferFrom = {
                permitted: {
                    token: dllr.address,
                    amount: dllrAmount,
                },
                spender: mocIntegration.address.toLowerCase(),
                nonce: nonce,
                deadline: deadline
            }
            const network = await ethers.provider.getNetwork();
            const chainId = network.chainId;

            const { domain, types, values } = SignatureTransfer.getPermitData(permitTransferFrom, permit2.address, chainId);

            const signature = await alice._signTypedData(domain, types, values);

            const {v, r, s} = extractSignature(signature);

            const permitParams = {
                deadline: deadline,
                v: v,
                r: r,
                s: s
            }

            // prerequisites:
            // calc expected RBTC for alice to receive
            const expectedRbtcValue = await moc.getRbtcValue(dllrAmount);

            // fund Money On Chain MoC contract with RBTC
            await setBalance(moc.address, expectedRbtcValue.mul(2));

            // alice calls MocIntegrationgetDocFromDllrAndRedeemRBTC(...)
            // to transfer DLLR dllrAmount to MoC contract and redeem RBTC
            // mocIntegration contract gets DLLR by permission from alice and calls
            // MocMock (MoC mock contract) redeem func to exchange DLLR to RBTC

            // await mocIntegration.connect(alice).getDocFromDllrAndRedeemRBTC(dllrAmount, permit);

            await expect(
                mocIntegration.connect(alice).getDocFromDllrAndRedeemRBTC(dllrAmount, permitParams)
            )
                .to.changeEtherBalances(
                    [alice.address, moc.address],
                    [expectedRbtcValue, `-${expectedRbtcValue}`]
                )
                .to.changeTokenBalance(dllr, alice.address, `-${dllrAmount}`);

            expect((await dllr.balanceOf(alice.address)).toString()).eq("0");
            expect(await ethers.provider.getBalance(moc.address)).eq(expectedRbtcValue);
            expect(await mocIntegration.nonces(alice.address)).eq(nonce.add(1));
        });

        it("should fail to redeem from DLLR Money on Chain DoC and then redeem RBTC from DoC if yet approved the permit2", async () => {
            const dllrAmount = ethers.utils.parseEther("500").toString();

            // alice gets DLLR by minting it for
            // fund alice with 500 DoC
            await bAssetDoc.connect(alice).giveMe(dllrAmount);
            await bAssetDoc.connect(alice).approve(massetManager.address, dllrAmount);

            // await massetManager.connect(alice).mint(bAssetDoc.address, dllrAmount);

            // mint DLLR to alice & check balances updates
            await expect(massetManager.connect(alice).mint(bAssetDoc.address, dllrAmount))
                .to.changeTokenBalance(dllr, alice.address, dllrAmount)
                .to.changeTokenBalance(bAssetDoc, alice.address, `-${dllrAmount}`);

            const nonce = await mocIntegration.nonces(alice.address);
            const deadline = toDeadline(1000 * 60 * 60 * 30 /** 30 minutes */);

            const permitTransferFrom: PermitTransferFrom = {
                permitted: {
                    token: dllr.address,
                    amount: dllrAmount,
                },
                spender: mocIntegration.address.toLowerCase(),
                nonce: nonce,
                deadline: deadline
            }
            const network = await ethers.provider.getNetwork();
            const chainId = network.chainId;

            const { domain, types, values } = SignatureTransfer.getPermitData(permitTransferFrom, permit2.address, chainId);

            const signature = await alice._signTypedData(domain, types, values);

            const {v, r, s} = extractSignature(signature);

            const permitParams = {
                deadline: deadline,
                v: v,
                r: r,
                s: s
            }

            // prerequisites:
            // calc expected RBTC for alice to receive
            const expectedRbtcValue = await moc.getRbtcValue(dllrAmount);

            // fund Money On Chain MoC contract with RBTC
            await setBalance(moc.address, expectedRbtcValue.mul(2));

            // alice calls MocIntegrationgetDocFromDllrAndRedeemRBTC(...)
            // to transfer DLLR dllrAmount to MoC contract and redeem RBTC
            // mocIntegration contract gets DLLR by permission from alice and calls
            // MocMock (MoC mock contract) redeem func to exchange DLLR to RBTC

            // await mocIntegration.connect(alice).getDocFromDllrAndRedeemRBTC(dllrAmount, permit);

            await expect(
                mocIntegration.connect(alice).getDocFromDllrAndRedeemRBTC(dllrAmount, permitParams)
            ).to.be.revertedWith("TRANSFER_FROM_FAILED");

            expect(await mocIntegration.nonces(alice.address)).eq(nonce);
        });

        it("should revert to redeem from DLLR Money on Chain DoC and then redeem RBTC from DoC through Permit2, with two transactions with invalid nonce", async () => {
            const dllrAmount = ethers.utils.parseEther("500").toString();

            // alice gets DLLR by minting it for
            // fund alice with 500 DoC
            await bAssetDoc.connect(alice).giveMe(dllrAmount);
            await bAssetDoc.connect(alice).approve(massetManager.address, dllrAmount);

            // await massetManager.connect(alice).mint(bAssetDoc.address, dllrAmount);

            // mint DLLR to alice & check balances updates
            await expect(massetManager.connect(alice).mint(bAssetDoc.address, dllrAmount))
                .to.changeTokenBalance(dllr, alice.address, dllrAmount)
                .to.changeTokenBalance(bAssetDoc, alice.address, `-${dllrAmount}`);


            await dllr.connect(alice).approve(permit2.address, ethers.constants.MaxUint256);

            const nonce = await mocIntegration.nonces(alice.address);
            const deadline = toDeadline(1000 * 60 * 60 * 30 /** 30 minutes */);
            let dllrAmountToRedeem = new BN(dllrAmount).div(new BN(2)).toString();

            const permitTransferFrom: PermitTransferFrom = {
                permitted: {
                    token: dllr.address,
                    amount: dllrAmountToRedeem,
                },
                spender: mocIntegration.address.toLowerCase(),
                nonce: nonce,
                deadline: deadline
            }
            const network = await ethers.provider.getNetwork();
            const chainId = network.chainId;

            var { domain, types, values } = SignatureTransfer.getPermitData(permitTransferFrom, permit2.address, chainId);

            const signature = await alice._signTypedData(domain, types, values);

            var {v, r, s} = extractSignature(signature);

            const permitParams = {
                deadline: deadline,
                v: v,
                r: r,
                s: s
            }

            // prerequisites:
            // calc expected RBTC for alice to receive
            const initialExpectedRbtcValue = await moc.getRbtcValue(dllrAmount);

            // prerequisites:
            // calc expected RBTC for alice to receive
            const expectedRbtcValue = await moc.getRbtcValue(dllrAmountToRedeem);

            // fund Money On Chain MoC contract with RBTC
            await setBalance(moc.address, initialExpectedRbtcValue.mul(2));

            // alice calls MocIntegrationgetDocFromDllrAndRedeemRBTC(...)
            // to transfer DLLR dllrAmount to MoC contract and redeem RBTC
            // mocIntegration contract gets DLLR by permission from alice and calls
            // MocMock (MoC mock contract) redeem func to exchange DLLR to RBTC

            // await mocIntegration.connect(alice).getDocFromDllrAndRedeemRBTC(dllrAmount, permit);

            await expect(
                mocIntegration.connect(alice).getDocFromDllrAndRedeemRBTC(dllrAmountToRedeem, permitParams)
            )
                .to.changeEtherBalances(
                    [alice.address, moc.address],
                    [expectedRbtcValue, `-${expectedRbtcValue}`]
                )
                .to.changeTokenBalance(dllr, alice.address, `-${dllrAmountToRedeem}`);

            expect(await mocIntegration.nonces(alice.address)).eq(nonce.add(1));

            const deadline2 = toDeadline(1000 * 60 * 60 * 30 /** 30 minutes */);

            const permitTransferFrom2: PermitTransferFrom = {
                permitted: {
                    token: dllr.address,
                    amount: dllrAmountToRedeem,
                },
                spender: mocIntegration.address.toLowerCase(),
                nonce: nonce,
                deadline: deadline2
            }

            var { domain, types, values } = SignatureTransfer.getPermitData(permitTransferFrom2, permit2.address, chainId);

            const signature2 = await alice._signTypedData(domain, types, values);

            var {v, r, s} = extractSignature(signature2);

            const permitParams2 = {
                deadline: deadline2,
                v: v,
                r: r,
                s: s
            }

            await expect(
                mocIntegration.connect(alice).getDocFromDllrAndRedeemRBTC(dllrAmountToRedeem, permitParams2)
            ).to.revertedWithCustomError(permit2, "InvalidSigner");
                
        });

        it("should be able to redeem from DLLR Money on Chain DoC and then redeem RBTC from DoC through Permit2, with two transactions", async () => {
            const dllrAmount = ethers.utils.parseEther("500").toString();

            // alice gets DLLR by minting it for
            // fund alice with 500 DoC
            await bAssetDoc.connect(alice).giveMe(dllrAmount);
            await bAssetDoc.connect(alice).approve(massetManager.address, dllrAmount);

            // await massetManager.connect(alice).mint(bAssetDoc.address, dllrAmount);

            // mint DLLR to alice & check balances updates
            await expect(massetManager.connect(alice).mint(bAssetDoc.address, dllrAmount))
                .to.changeTokenBalance(dllr, alice.address, dllrAmount)
                .to.changeTokenBalance(bAssetDoc, alice.address, `-${dllrAmount}`);


            await dllr.connect(alice).approve(permit2.address, ethers.constants.MaxUint256);

            const nonce = await mocIntegration.nonces(alice.address);
            const deadline = toDeadline(1000 * 60 * 60 * 30 /** 30 minutes */);
            let dllrAmountToRedeem = new BN(dllrAmount).div(new BN(2)).toString();

            const permitTransferFrom: PermitTransferFrom = {
                permitted: {
                    token: dllr.address,
                    amount: dllrAmountToRedeem,
                },
                spender: mocIntegration.address.toLowerCase(),
                nonce: nonce,
                deadline: deadline
            }
            const network = await ethers.provider.getNetwork();
            const chainId = network.chainId;

            var { domain, types, values } = SignatureTransfer.getPermitData(permitTransferFrom, permit2.address, chainId);

            const signature = await alice._signTypedData(domain, types, values);

            var {v, r, s} = extractSignature(signature);

            const permitParams = {
                deadline: deadline,
                v: v,
                r: r,
                s: s
            }

            // prerequisites:
            // calc expected RBTC for alice to receive
            const initialExpectedRbtcValue = await moc.getRbtcValue(dllrAmount);

            // prerequisites:
            // calc expected RBTC for alice to receive
            const expectedRbtcValue = await moc.getRbtcValue(dllrAmountToRedeem);

            // fund Money On Chain MoC contract with RBTC
            await setBalance(moc.address, initialExpectedRbtcValue.mul(2));

            // alice calls MocIntegrationgetDocFromDllrAndRedeemRBTC(...)
            // to transfer DLLR dllrAmount to MoC contract and redeem RBTC
            // mocIntegration contract gets DLLR by permission from alice and calls
            // MocMock (MoC mock contract) redeem func to exchange DLLR to RBTC

            // await mocIntegration.connect(alice).getDocFromDllrAndRedeemRBTC(dllrAmount, permit);

            await expect(
                mocIntegration.connect(alice).getDocFromDllrAndRedeemRBTC(dllrAmountToRedeem, permitParams)
            )
                .to.changeEtherBalances(
                    [alice.address, moc.address],
                    [expectedRbtcValue, `-${expectedRbtcValue}`]
                )
                .to.changeTokenBalance(dllr, alice.address, `-${dllrAmountToRedeem}`);

            expect(await mocIntegration.nonces(alice.address)).eq(nonce.add(1));

            const nonce2 = await mocIntegration.nonces(alice.address);
            const deadline2 = toDeadline(1000 * 60 * 60 * 30 /** 30 minutes */);

            const permitTransferFrom2: PermitTransferFrom = {
                permitted: {
                    token: dllr.address,
                    amount: dllrAmountToRedeem,
                },
                spender: mocIntegration.address.toLowerCase(),
                nonce: nonce2,
                deadline: deadline2
            }

            var { domain, types, values } = SignatureTransfer.getPermitData(permitTransferFrom2, permit2.address, chainId);

            const signature2 = await alice._signTypedData(domain, types, values);

            var {v, r, s} = extractSignature(signature2);

            const permitParams2 = {
                deadline: deadline2,
                v: v,
                r: r,
                s: s
            }

            await expect(
                mocIntegration.connect(alice).getDocFromDllrAndRedeemRBTC(dllrAmountToRedeem, permitParams2)
            )
                .to.changeEtherBalances(
                    [alice.address, moc.address],
                    [expectedRbtcValue, `-${expectedRbtcValue}`]
                )
                .to.changeTokenBalance(dllr, alice.address, `-${dllrAmountToRedeem}`);

            expect((await dllr.balanceOf(alice.address)).toString()).eq("0");
            expect(await ethers.provider.getBalance(moc.address)).eq(initialExpectedRbtcValue);
            expect(await mocIntegration.nonces(alice.address)).eq(nonce2.add(1));
        });
    });
});
