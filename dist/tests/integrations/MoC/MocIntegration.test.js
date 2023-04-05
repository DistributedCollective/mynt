"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const eth_permit_1 = require("eth-permit");
// const permission = await signERC2612Permit(alice_signer, nueMockToken.address, alice_signer.address, borrowerOperations.address, decreaseAmount.toString());
// import { expect } from "chai";
const hardhat_1 = __importStar(require("hardhat")); // expect => https://hardhat.org/hardhat-chai-matchers/docs/reference
const hardhat_network_helpers_1 = require("@nomicfoundation/hardhat-network-helpers"); // https://hardhat.org/hardhat-network-helpers/docs/reference
const constants_1 = require("@utils/constants");
describe("MoC Integration", async () => {
    // let mocFake: FakeContract<IMocMintRedeemDoc>;
    let moc;
    let mocIntegration;
    let alice;
    let accounts;
    let dllr;
    let massetManager;
    let basketManager;
    let bAssetZusd;
    let bAssetDoc;
    const { ethers } = hardhat_1.default;
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
        await hardhat_1.deployments.fixture([
            "MyntAdminProxy",
            "DLLR",
            "MassetManager",
            "BasketManager",
            "MocIntegration",
        ]);
        [, alice] = accounts;
        // const mocFactory = await ethers.getContractFactory("MocMock");
        // moc = (await mocFactory.deploy()) as MocMock;
        dllr = (await ethers.getContract("DLLR"));
        massetManager = (await ethers.getContract("MassetManager"));
        basketManager = (await ethers.getContract("BasketManagerV3"));
        mocIntegration = (await ethers.getContract("MocIntegration"));
        // bAssetDoc = (await ethers.getContract("DoC")) as MockERC20;
        bAssetDoc = await ethers.getContractAt("MockERC20", await mocIntegration.doc());
        moc = (await ethers.getContractAt("MocMock", await mocIntegration.moc()));
        const erc20Factory = await ethers.getContractFactory("MockERC20");
        bAssetZusd = (await erc20Factory.deploy("Zero USD Token", "ZUSD", 18, accounts[0].address, ethers.utils.parseEther("100000000")));
        await basketManager.addBassets([bAssetZusd.address, bAssetDoc.address], [1, 1], [constants_1.ZERO_ADDRESS, constants_1.ZERO_ADDRESS], [0, 0], [1000, 1000], [false, false]);
    });
    describe("deployment", async () => {
        it("initial mocVendorAccount address should be null", async () => {
            (0, hardhat_1.expect)(await mocIntegration.mocVendorAccount()).equal(ethers.constants.AddressZero);
        });
        it("only owner can set mocVendorAccount", async () => {
            await (0, hardhat_1.expect)(mocIntegration.connect(alice).setMocVendorAccount(accounts[2].address)).to.be.revertedWith("Ownable: caller is not the owner");
            await mocIntegration.connect(accounts[0]).setMocVendorAccount(accounts[2].address);
            (0, hardhat_1.expect)(await mocIntegration.mocVendorAccount()).equal(accounts[2].address);
            await mocIntegration
                .connect(accounts[0])
                .setMocVendorAccount(ethers.constants.AddressZero);
            (0, hardhat_1.expect)(await mocIntegration.mocVendorAccount()).equal(ethers.constants.AddressZero);
        });
        it("should redeem from DLLR Money on Chain DoC and then redeem RBTC from DoC, all in one transaction", async () => {
            const dllrAmount = ethers.utils.parseEther("500").toString();
            // alice gets DLLR by minting it for
            // fund alice with 500 DoC
            await bAssetDoc.connect(alice).giveMe(dllrAmount);
            await bAssetDoc.connect(alice).approve(massetManager.address, dllrAmount);
            // await massetManager.connect(alice).mint(bAssetDoc.address, dllrAmount);
            // mint DLLR to alice & check balances updates
            await (0, hardhat_1.expect)(massetManager.connect(alice).mint(bAssetDoc.address, dllrAmount))
                .to.changeTokenBalance(dllr, alice.address, dllrAmount)
                .to.changeTokenBalance(bAssetDoc, alice.address, `-${dllrAmount}`);
            // alice permits MocIntegration contract to approve dllrAmount for calling transferFrom(...) func
            const permit = await (0, eth_permit_1.signERC2612Permit)(alice, dllr.address.toLowerCase(), alice.address.toLowerCase(), mocIntegration.address.toLowerCase(), dllrAmount);
            // prerequisites:
            // calc expected RBTC for alice to receive
            const expectedRbtcValue = await moc.getRbtcValue(dllrAmount);
            // fund Money On Chain MoC contract with RBTC
            await (0, hardhat_network_helpers_1.setBalance)(moc.address, expectedRbtcValue.mul(2));
            // alice calls MocIntegrationgetDocFromDllrAndRedeemRBTC(...)
            // to transfer DLLR dllrAmount to MoC contract and redeem RBTC
            // mocIntegration contract gets DLLR by permission from alice and calls
            // MocMock (MoC mock contract) redeem func to exchange DLLR to RBTC
            // await mocIntegration.connect(alice).getDocFromDllrAndRedeemRBTC(dllrAmount, permit);
            await (0, hardhat_1.expect)(mocIntegration.connect(alice).getDocFromDllrAndRedeemRBTC(dllrAmount, permit))
                .to.changeEtherBalances([alice.address, moc.address], [expectedRbtcValue, `-${expectedRbtcValue}`])
                .to.changeTokenBalance(dllr, alice.address, `-${dllrAmount}`);
            (0, hardhat_1.expect)((await dllr.balanceOf(alice.address)).toString()).eq("0");
            (0, hardhat_1.expect)(await ethers.provider.getBalance(moc.address)).eq(expectedRbtcValue);
        });
    });
});
//# sourceMappingURL=MocIntegration.test.js.map