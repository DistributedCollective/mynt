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
const constants_1 = require("@utils/constants");
const standardAccounts_1 = require("@utils/standardAccounts");
const { expect } = env_setup_1.default.configure();
const FeesManager = artifacts.require("FeesManager");
let standardAccounts;
const standardFees = {
    deposit: new tools_1.BN(100),
    depositBridge: new tools_1.BN(200),
    withdrawal: new tools_1.BN(300),
    withdrawalBridge: new tools_1.BN(400),
};
contract("FeesManager", async (accounts) => {
    let feesManager;
    standardAccounts = new standardAccounts_1.StandardAccounts(accounts);
    before("before all", async () => { });
    describe("initialize", async () => {
        beforeEach(async () => {
            feesManager = await FeesManager.new();
        });
        context("should succeed", async () => {
            it("when all params are valid", async () => {
                await feesManager.initialize(1, 2, 3, 4);
                expect(await feesManager.getDepositFee()).bignumber.to.eq(new tools_1.BN(1));
                expect(await feesManager.getDepositBridgeFee()).bignumber.to.eq(new tools_1.BN(2));
                expect(await feesManager.getWithdrawalFee()).bignumber.to.eq(new tools_1.BN(3));
                expect(await feesManager.getWithdrawalBridgeFee()).bignumber.to.eq(new tools_1.BN(4));
            });
        });
        context("should fail", async () => {
            it("when already initialized", async () => {
                await feesManager.initialize(1, 2, 3, 4);
                await (0, test_helpers_1.expectRevert)(feesManager.initialize(5, 6, 7, 8), "VM Exception while processing transaction: reverted with reason string 'Initializable: contract is already initialized'");
            });
        });
    });
    describe("setFeeAmount", async () => {
        let admin;
        beforeEach(async () => {
            admin = standardAccounts.governor;
            feesManager = await FeesManager.new({ from: admin });
            await feesManager.initialize(0, 0, 0, 0, { from: admin });
        });
        context("should fail", async () => {
            it("when it's not called by admin", async () => {
                const revertMessage = "VM Exception while processing transaction: reverted with reason string 'Ownable: caller is not the owner'";
                await (0, test_helpers_1.expectRevert)(feesManager.setDepositFee(2, { from: standardAccounts.other }), revertMessage);
                await (0, test_helpers_1.expectRevert)(feesManager.setDepositBridgeFee(2, { from: standardAccounts.other }), revertMessage);
                await (0, test_helpers_1.expectRevert)(feesManager.setWithdrawalFee(2, { from: standardAccounts.other }), revertMessage);
                await (0, test_helpers_1.expectRevert)(feesManager.setWithdrawalBridgeFee(2, {
                    from: standardAccounts.other,
                }), revertMessage);
            });
            it("when amount is bigger than precision", async () => {
                const revertMessage = "VM Exception while processing transaction: reverted with reason string 'invalid fee amount'";
                const precision = await feesManager.PRECISION();
                const invalidAmount = precision.add(new tools_1.BN(1));
                await (0, test_helpers_1.expectRevert)(feesManager.setDepositFee(invalidAmount, { from: admin }), revertMessage);
                await (0, test_helpers_1.expectRevert)(feesManager.setDepositBridgeFee(invalidAmount, { from: admin }), revertMessage);
                await (0, test_helpers_1.expectRevert)(feesManager.setWithdrawalFee(invalidAmount, { from: admin }), revertMessage);
                await (0, test_helpers_1.expectRevert)(feesManager.setWithdrawalBridgeFee(invalidAmount, { from: admin }), revertMessage);
            });
        });
        context("should succeed", async () => {
            it("when amount is correct", async () => {
                let tx;
                tx = await feesManager.setDepositFee(standardFees.deposit, {
                    from: admin,
                });
                await (0, test_helpers_1.expectEvent)(tx.receipt, "DepositFeeChanged", {
                    depositFee: standardFees.deposit,
                });
                tx = await feesManager.setDepositBridgeFee(standardFees.depositBridge, {
                    from: admin,
                });
                await (0, test_helpers_1.expectEvent)(tx.receipt, "DepositBridgeFeeChanged", {
                    depositBridgeFee: standardFees.depositBridge,
                });
                tx = await feesManager.setWithdrawalFee(standardFees.withdrawal, {
                    from: admin,
                });
                await (0, test_helpers_1.expectEvent)(tx.receipt, "WithdrawalFeeChanged", {
                    withdrawalFee: standardFees.withdrawal,
                });
                tx = await feesManager.setWithdrawalBridgeFee(standardFees.withdrawalBridge, { from: admin });
                await (0, test_helpers_1.expectEvent)(tx.receipt, "WithdrawalBridgeFeeChanged", {
                    withdrawalBridgeFee: standardFees.withdrawalBridge,
                });
                expect(await feesManager.getDepositFee()).bignumber.to.eq(standardFees.deposit);
                expect(await feesManager.getDepositBridgeFee()).bignumber.to.eq(standardFees.depositBridge);
                expect(await feesManager.getWithdrawalFee()).bignumber.to.eq(standardFees.withdrawal);
                expect(await feesManager.getWithdrawalBridgeFee()).bignumber.to.eq(standardFees.withdrawalBridge);
            });
            it("when amount is zero", async () => {
                await feesManager.setDepositFee(0, { from: admin });
                await feesManager.setDepositBridgeFee(0, { from: admin });
                await feesManager.setWithdrawalFee(0, { from: admin });
                await feesManager.setWithdrawalBridgeFee(0, { from: admin });
                expect(await feesManager.getDepositFee()).bignumber.to.eq(constants_1.ZERO);
                expect(await feesManager.getDepositBridgeFee()).bignumber.to.eq(constants_1.ZERO);
                expect(await feesManager.getWithdrawalFee()).bignumber.to.eq(constants_1.ZERO);
                expect(await feesManager.getWithdrawalBridgeFee()).bignumber.to.eq(constants_1.ZERO);
            });
        });
    });
    describe("fees calculation", async () => {
        beforeEach(async () => {
            feesManager = await FeesManager.new();
            await feesManager.initialize(standardFees.deposit, standardFees.depositBridge, standardFees.withdrawal, standardFees.withdrawalBridge);
        });
        it("calculates fee corretly for deposit", async () => {
            let amount = 1000000;
            expect(await feesManager.calculateDepositFee(amount)).bignumber.to.eq("10000");
            expect(await feesManager.calculateDepositBridgeFee(amount)).bignumber.to.eq("20000");
            amount = 999;
            expect(await feesManager.calculateDepositFee(amount)).bignumber.to.eq("9");
            expect(await feesManager.calculateDepositBridgeFee(amount)).bignumber.to.eq("19");
        });
        it("calculates fee corretly for redeem", async () => {
            let amount = 1000000;
            expect(await feesManager.calculateRedeemFee(amount)).bignumber.to.eq("30000");
            expect(await feesManager.calculateRedeemBridgeFee(amount)).bignumber.to.eq("40000");
            amount = 999;
            expect(await feesManager.calculateRedeemFee(amount)).bignumber.to.eq("29");
            expect(await feesManager.calculateRedeemBridgeFee(amount)).bignumber.to.eq("39");
        });
    });
});
//# sourceMappingURL=TestFeesManager.spec.js.map