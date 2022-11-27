import { expectRevert, expectEvent } from "@openzeppelin/test-helpers";
import { toWei } from "web3-utils";
import { MyntTokenInstance } from "types/generated";
import { ZERO_ADDRESS } from "@utils/constants";

const MyntToken = artifacts.require("MyntToken");
const MockApprovalReceiver = artifacts.require("MockApprovalReceiver");
const NOT_OWNER_EXCEPTION =
  "VM Exception while processing transaction: reverted with reason string 'Ownable: caller is not the owner";

contract("MyntToken", async (accounts) => {
  const [owner, user, marketMaker, presale] = accounts;

  let token: MyntTokenInstance;

  beforeEach("before all", async () => {
    token = await MyntToken.new({ from: owner });
    await token.setMarketMaker(marketMaker, { from: owner });
    await token.setPresale(presale, { from: owner });
  });

  describe("setPresale", async () => {
    context("should fail", async () => {
      it("when it's not called by owner", async () => {
        await expectRevert(
          token.setPresale(user, { from: user }),
          NOT_OWNER_EXCEPTION
        );
      });
    });
    context("should succeed", async () => {
      it("when called by owner", async () => {
        const tx = await token.setPresale(user, { from: owner });
        expectEvent(tx, "PresaleChanged", { _address: user });
      });
    });
  });

  describe("setMarketMaker", async () => {
    context("should fail", async () => {
      it("when it's not called by owner", async () => {
        await expectRevert(
          token.setMarketMaker(user, { from: user }),
          NOT_OWNER_EXCEPTION
        );
      });
    });
    context("should succeed", async () => {
      it("when called by owner", async () => {
        const tx = await token.setMarketMaker(user, { from: owner });
        expectEvent(tx, "MarketMakerChanged", { _address: user });
      });
    });
  });

  describe("mint", async () => {
    context("should fail", async () => {
      it("when it's not called by presale or market maker", async () => {
        await expectRevert(
          token.mint(user, toWei("100"), { from: user }),
          "not allowed"
        );
      });
    });

    context("should succeed", async () => {
      it("when it's called by presale", async () => {
        const tx = await token.mint(user, toWei("100"), { from: presale });
        expectEvent(tx, "Transfer", {
          from: ZERO_ADDRESS,
          to: user,
          value: toWei("100"),
        });
      });
      it("when it's called by marketMaker", async () => {
        const tx = await token.mint(user, toWei("100"), { from: marketMaker });
        expectEvent(tx, "Transfer", {
          from: ZERO_ADDRESS,
          to: user,
          value: toWei("100"),
        });
      });
    });
  });

  describe("burn", async () => {
    context("should fail", async () => {
      it("when it's not called by presale or by a user", async () => {
        await expectRevert(
          token.burn(user, toWei("50"), { from: owner }),
          "not allowed"
        );
      });
    });

    context("should succeed", async () => {
      it("when it's called by the market maker", async () => {
        await token.mint(user, toWei("50"), { from: marketMaker });
        const tx = await token.burn(user, toWei("50"), { from: marketMaker });
        expectEvent(tx, "Transfer", {
          from: user,
          to: ZERO_ADDRESS,
          value: toWei("50"),
        });
      });
      it("when it's called by the user for his own tokens", async () => {
        await token.mint(user, toWei("50"), { from: marketMaker });
        const tx = await token.burn(user, toWei("50"), { from: user });
        expectEvent(tx, "Transfer", {
          from: user,
          to: ZERO_ADDRESS,
          value: toWei("50"),
        });
      });
    });
  });

  describe("approveAndCall", async () => {
    let approvalReceiver;

    before(async () => {
      approvalReceiver = await MockApprovalReceiver.new();
    });

    it("should approve for transfer and call the receiver", async () => {
      const tx = await token.approveAndCall(
        approvalReceiver.address,
        toWei("50"),
        "0x1234"
      );
      await expectEvent(tx, "Approval", {
        owner,
        spender: approvalReceiver.address,
        value: toWei("50"),
      });
      expect(await approvalReceiver.sender(), "sender").eq(owner);
      expect((await approvalReceiver.amount()).toString(), "amount").eq(
        toWei("50")
      );
      expect(await approvalReceiver.token(), "token").eq(token.address);
      expect(await approvalReceiver.data(), "data").eq("0x1234");
    });
  });
});
