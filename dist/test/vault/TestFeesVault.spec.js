"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-use-before-define */
const test_helpers_1 = require("@openzeppelin/test-helpers");
const tools_1 = require("@utils/tools");
const env_setup_1 = __importDefault(require("@utils/env_setup"));
const { expect } = env_setup_1.default.configure();
const FeesVault = artifacts.require("FeesVault");
const MockERC20 = artifacts.require("MockERC20");
contract("FeesVault", async (accounts) => {
    let feesVault;
    let token1;
    const [user1, user2, owner] = accounts;
    before("before all", async () => { });
    describe("initialize", async () => {
        beforeEach(async () => {
            feesVault = await FeesVault.new();
        });
        context("should succeed", async () => {
            it("when all params are valid", async () => {
                await feesVault.initialize({ from: owner });
                expect(await feesVault.owner()).to.eq(owner, "owner should be settled");
            });
        });
        context("should fail", async () => {
            it("when already initialized", async () => {
                await feesVault.initialize();
                await (0, test_helpers_1.expectRevert)(feesVault.initialize(), "VM Exception while processing transaction: reverted with reason string 'Initializable: contract is already initialized'");
            });
        });
    });
    describe("withdraw", async () => {
        beforeEach(async () => {
            feesVault = await FeesVault.new();
            await feesVault.initialize({ from: owner });
            token1 = await MockERC20.new("Token1", "T1", 18, user1, 10);
        });
        context("should succeed", async () => {
            it("when vault balance is sufficient", async () => {
                await token1.transfer(feesVault.address, (0, tools_1.tokens)(10), { from: user1 });
                await feesVault.withdraw(token1.address, (0, tools_1.tokens)(5), user2, {
                    from: owner,
                });
                expect(await token1.balanceOf(user2)).bignumber.to.eq((0, tools_1.tokens)(5), "tokens should be transfered");
            });
        });
        context("should fail", async () => {
            it("when it's not called by owner", async () => {
                await (0, test_helpers_1.expectRevert)(feesVault.withdraw(token1.address, (0, tools_1.tokens)(5), user2), "VM Exception while processing transaction: reverted with reason string 'Ownable: caller is not the owner'");
            });
            it("when balance is not sufficient", async () => {
                await (0, test_helpers_1.expectRevert)(feesVault.withdraw(token1.address, (0, tools_1.tokens)(5), user2, { from: owner }), "VM Exception while processing transaction: reverted with reason string 'ERC20: transfer amount exceeds balance'");
                await token1.transfer(feesVault.address, (0, tools_1.tokens)(5), { from: user1 });
                await (0, test_helpers_1.expectRevert)(feesVault.withdraw(token1.address, (0, tools_1.tokens)(10), user2, {
                    from: owner,
                }), "VM Exception while processing transaction: reverted with reason string 'ERC20: transfer amount exceeds balance'");
            });
        });
    });
});
//# sourceMappingURL=TestFeesVault.spec.js.map