/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-use-before-define */
import { expectRevert, expectEvent } from "@openzeppelin/test-helpers";
import { BN } from "@utils/tools";
import envSetup from "@utils/env_setup";
import { ZERO } from "@utils/constants";
import { StandardAccounts } from "@utils/standardAccounts";
import { Fees } from "types";
import { FeesManagerInstance } from "types/generated";

const { expect } = envSetup.configure();

const FeesManager = artifacts.require("FeesManager");

let standardAccounts: StandardAccounts;

const standardFees: Fees = {
    deposit: new BN(100),
    depositBridge: new BN(200),
    withdrawal: new BN(300),
    withdrawalBridge: new BN(400)
};

contract("FeesManager", async (accounts) => {
    let feesManager: FeesManagerInstance;

    standardAccounts = new StandardAccounts(accounts);

    before("before all", async () => {});

    describe("initialize", async () => {
        beforeEach(async () => {
            feesManager = await FeesManager.new();
        });

        context("should succeed", async () => {
            it("when all params are valid", async () => {
                await feesManager.initialize(1, 2, 3, 4);

                expect(await feesManager.getDepositFee()).bignumber.to.eq(new BN(1));
                expect(await feesManager.getDepositBridgeFee()).bignumber.to.eq(new BN(2));
                expect(await feesManager.getWithdrawalFee()).bignumber.to.eq(new BN(3));
                expect(await feesManager.getWithdrawalBridgeFee()).bignumber.to.eq(new BN(4));
            });
        });

        context("should fail", async () => {
            it("when already initialized", async () => {
                await feesManager.initialize(1, 2, 3, 4);
                await expectRevert(
                    feesManager.initialize(5, 6, 7, 8),
                    "VM Exception while processing transaction: reverted with reason string 'already initialized'"
                );
            });
        });
    });

    describe("setFeeAmount", async () => {
        let admin: string;

        beforeEach(async () => {
            admin = standardAccounts.governor;

            feesManager = await FeesManager.new({ from: admin });
            await feesManager.initialize(0, 0, 0, 0, { from: admin });
        });

        context("should fail", async () => {
            it("when it's not called by admin", async () => {
                const revertMessage =
                    "VM Exception while processing transaction: reverted with reason string 'InitializableOwnable: caller is not the owner'";

                await expectRevert(feesManager.setDepositFee(2, { from: standardAccounts.other }), revertMessage);
                await expectRevert(feesManager.setDepositBridgeFee(2, { from: standardAccounts.other }), revertMessage);
                await expectRevert(feesManager.setWithdrawalFee(2, { from: standardAccounts.other }), revertMessage);
                await expectRevert(feesManager.setWithdrawalBridgeFee(2, { from: standardAccounts.other }), revertMessage);
            });

            it("when amount is bigger than precision", async () => {
                const revertMessage = "VM Exception while processing transaction: reverted with reason string 'invalid fee amount'";

                const precision = await feesManager.PRECISION();
                const invalidAmount = precision.add(new BN(1));

                await expectRevert(feesManager.setDepositFee(invalidAmount, { from: admin }), revertMessage);
                await expectRevert(feesManager.setDepositBridgeFee(invalidAmount, { from: admin }), revertMessage);
                await expectRevert(feesManager.setWithdrawalFee(invalidAmount, { from: admin }), revertMessage);
                await expectRevert(feesManager.setWithdrawalBridgeFee(invalidAmount, { from: admin }), revertMessage);
            });
        });

        context("should succeed", async () => {
            it("when amount is correct", async () => {
                let tx: Truffle.TransactionResponse<Truffle.AnyEvent>;

                tx = await feesManager.setDepositFee(standardFees.deposit, { from: admin });
                await expectEvent(tx.receipt, "DepositFeeChanged", { depositFee: standardFees.deposit });

                tx = await feesManager.setDepositBridgeFee(standardFees.depositBridge, { from: admin });
                await expectEvent(tx.receipt, "DepositBridgeFeeChanged", { depositBridgeFee: standardFees.depositBridge });

                tx = await feesManager.setWithdrawalFee(standardFees.withdrawal, { from: admin });
                await expectEvent(tx.receipt, "WithdrawalFeeChanged", { withdrawalFee: standardFees.withdrawal });

                tx = await feesManager.setWithdrawalBridgeFee(standardFees.withdrawalBridge, { from: admin });
                await expectEvent(tx.receipt, "WithdrawalBridgeFeeChanged", { withdrawalBridgeFee: standardFees.withdrawalBridge });

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

                expect(await feesManager.getDepositFee()).bignumber.to.eq(ZERO);
                expect(await feesManager.getDepositBridgeFee()).bignumber.to.eq(ZERO);
                expect(await feesManager.getWithdrawalFee()).bignumber.to.eq(ZERO);
                expect(await feesManager.getWithdrawalBridgeFee()).bignumber.to.eq(ZERO);
            });
        });
    });

    describe("fees calculation", async () => {
        beforeEach(async () => {
            feesManager = await FeesManager.new();
            await feesManager.initialize(
                standardFees.deposit,
                standardFees.depositBridge,
                standardFees.withdrawal,
                standardFees.withdrawalBridge
            );
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
