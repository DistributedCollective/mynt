/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-use-before-define */
import { expectRevert } from "@openzeppelin/test-helpers";
import { tokens } from "@utils/tools";
import envSetup from "@utils/env_setup";
import { FeesVaultInstance, MockERC20Instance } from "types/generated";

const { expect } = envSetup.configure();

const FeesVault = artifacts.require("FeesVault");
const MockERC20 = artifacts.require("MockERC20");

contract("FeesVault", async accounts => {
  let feesVault: FeesVaultInstance;
  let token1: MockERC20Instance;

  const [user1, user2, owner] = accounts;

  before("before all", async () => {});

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
        await expectRevert(
          feesVault.initialize(),
          "VM Exception while processing transaction: reverted with reason string 'already initialized'"
        );
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
        await token1.transfer(feesVault.address, tokens(10), { from: user1 });

        await feesVault.withdraw(token1.address, tokens(5), user2, {
          from: owner
        });
        expect(await token1.balanceOf(user2)).bignumber.to.eq(
          tokens(5),
          "tokens should be transfered"
        );
      });
    });

    context("should fail", async () => {
      it("when it's not called by owner", async () => {
        await expectRevert(
          feesVault.withdraw(token1.address, tokens(5), user2),
          "VM Exception while processing transaction: reverted with reason string 'InitializableOwnable: caller is not the owner'"
        );
      });

      it("when balance is not sufficient", async () => {
        await expectRevert(
          feesVault.withdraw(token1.address, tokens(5), user2, { from: owner }),
          "VM Exception while processing transaction: reverted with reason string 'SafeERC20: low-level call failed'"
        );

        await token1.transfer(feesVault.address, tokens(5), { from: user1 });
        await expectRevert(
          feesVault.withdraw(token1.address, tokens(10), user2, {
            from: owner
          }),
          "VM Exception while processing transaction: reverted with reason string 'SafeERC20: low-level call failed'"
        );
      });
    });
  });
});
