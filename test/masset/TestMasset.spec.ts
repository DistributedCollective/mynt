/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-use-before-define */
import { expectRevert, expectEvent } from "@openzeppelin/test-helpers";
import { ZERO_ADDRESS } from "@utils/constants";
import { StandardAccounts } from "@utils/standardAccounts";
import envSetup from "@utils/env_setup";
import { MassetManagerInstance } from "types/generated";

const { expect } = envSetup.configure();

const BasketManager = artifacts.require("BasketManager");
const MassetManager = artifacts.require("MassetManager");
const Token = artifacts.require("Token");
const MockERC20 = artifacts.require("MockERC20");

let standardAccounts;

contract("MassetManager", async (accounts) => {
  standardAccounts = new StandardAccounts(accounts);

  before("before all", async () => {});

  describe("initialize", async () => {
    let massetManager;
    let basketManagerObj;
    let token;
    beforeEach(async () => {
      massetManager = await MassetManager.new();
      basketManagerObj = await createBasketManager(
        massetManager,
        [18, 18],
        [1, 1]
      );
      token = await createToken(massetManager);
    });
    context("should succeed", async () => {
      it("when given a valid basket manager", async () => {
        await massetManager.initialize(
          basketManagerObj.basketManager.address,
          token.address,
          false
        );
      });
    });
    context("should fail", async () => {
      it("when basket manager missing", async () => {
        await expectRevert(
          massetManager.initialize(ZERO_ADDRESS, token.address, false),
          "VM Exception while processing transaction: reverted with reason string 'invalid basket manager'"
        );
      });
      it("when token missing", async () => {
        await expectRevert(
          massetManager.initialize(
            basketManagerObj.basketManager.address,
            ZERO_ADDRESS,
            false
          ),
          "VM Exception while processing transaction: reverted with reason string 'invalid token'"
        );
      });
      it("when already initialized", async () => {
        await massetManager.initialize(
          basketManagerObj.basketManager.address,
          token.address,
          false
        );
        await expectRevert(
          massetManager.initialize(
            basketManagerObj.basketManager.address,
            token.address,
            false
          ),
          "VM Exception while processing transaction: reverted with reason string 'Initializable: contract is already initialized'"
        );
      });
    });
  });

  describe("mint", async () => {
    let massetManager;
    let basketManagerObj;
    let token;
    let mockTokenDummy;
    beforeEach(async () => {
      massetManager = await MassetManager.new();
      token = await createToken(MassetManager);
      basketManagerObj = await createBasketManager(
        massetManager,
        [18, 18],
        [1, 1]
      );
      await massetManager.initialize(
        basketManagerObj.basketManager.address,
        token.address,
        false
      );
      mockTokenDummy = await MockERC20.new(
        "",
        "",
        12,
        standardAccounts.dummy1,
        1
      );
    });
    context("should succeed", () => {
      it("if all params are valid", async () => {
        const sum = "1000000000000000000";
        await basketManagerObj.mockToken1.approve(massetManager.address, sum, {
          from: standardAccounts.dummy1,
        });
        const tx = await massetManager.mint(
          basketManagerObj.mockToken1.address,
          sum,
          {
            from: standardAccounts.dummy1,
          }
        );
        await expectEvent(tx.receipt, "Minted", {
          minter: standardAccounts.dummy1,
          recipient: standardAccounts.dummy1,
          massetQuantity: sum,
          bAsset: basketManagerObj.mockToken1.address,
          bassetQuantity: sum,
        });
        const balance = await token.balanceOf(standardAccounts.dummy1);
        expect(balance.toString()).to.equal(`${sum}`);
      });
    });
    context("should fail", () => {
      it("if basset is invalid", async () => {
        await expectRevert(
          massetManager.mint(ZERO_ADDRESS, 10),
          "VM Exception while processing transaction: reverted with reason string 'invalid basset'"
        );
      });
      it("if basset is not in the basket", async () => {
        await expectRevert(
          massetManager.mint(mockTokenDummy.address, 10),
          "VM Exception while processing transaction: reverted with reason string 'invalid basset'"
        );
      });
      it("if amount is greater than the balance", async () => {
        await basketManagerObj.mockToken1.approve(
          massetManager.address,
          100000
        );

        await expectRevert(
          massetManager.mint(basketManagerObj.mockToken1.address, 100000),
          "VM Exception while processing transaction: reverted with reason string 'ERC20: transfer amount exceeds balance'"
        );
      });
    });
  });
  describe("mintTo", async () => {
    let massetManager;
    let basketManagerObj;
    let token;
    beforeEach(async () => {
      massetManager = await MassetManager.new();
      basketManagerObj = await createBasketManager(
        massetManager,
        [18, 18],
        [1, 1]
      );
      token = await createToken(massetManager);
      await massetManager.initialize(
        basketManagerObj.basketManager.address,
        token.address,
        false
      );
    });
    context("should succeed", () => {
      it("if all params are valid", async () => {
        const sum = "100000000000000000";
        await basketManagerObj.mockToken1.approve(massetManager.address, sum, {
          from: standardAccounts.dummy1,
        });
        const tx = await massetManager.mintTo(
          basketManagerObj.mockToken1.address,
          sum,
          standardAccounts.dummy4,
          {
            from: standardAccounts.dummy1,
          }
        );
        await expectEvent(tx.receipt, "Minted", {
          minter: standardAccounts.dummy1,
          recipient: standardAccounts.dummy4,
          massetQuantity: sum,
          bAsset: basketManagerObj.mockToken1.address,
          bassetQuantity: sum,
        });
        const balance = await token.balanceOf(standardAccounts.dummy4);
        expect(balance.toString()).to.equal(`${sum}`);
      });
    });
  });

  describe("redeem", async () => {
    let massetManager;
    let basketManagerObj;
    let token;
    let mockTokenDummy;
    beforeEach(async () => {
      massetManager = await MassetManager.new();
      token = await createToken(massetManager);
      basketManagerObj = await createBasketManager(
        massetManager,
        [18, 18],
        [1, 1]
      );
      await massetManager.initialize(
        basketManagerObj.basketManager.address,
        token.address,
        false
      );
      mockTokenDummy = await MockERC20.new(
        "",
        "",
        12,
        standardAccounts.dummy1,
        1
      );
    });
    context("should succeed", () => {
      it("if all params are valid", async () => {
        const sum = "100000000000000000";
        await basketManagerObj.mockToken1.approve(massetManager.address, sum, {
          from: standardAccounts.dummy1,
        });
        await massetManager.mint(basketManagerObj.mockToken1.address, sum, {
          from: standardAccounts.dummy1,
        });
        let balance = await token.balanceOf(standardAccounts.dummy1);
        expect(balance.toString()).to.equal(`${sum}`);
        balance = await basketManagerObj.mockToken1.balanceOf(
          standardAccounts.dummy1
        );
        expect(balance.toString()).to.equal("900000000000000000");
        const tx = await massetManager.redeem(
          basketManagerObj.mockToken1.address,
          sum,
          {
            from: standardAccounts.dummy1,
          }
        );
        await expectEvent(tx.receipt, "Redeemed", {
          redeemer: standardAccounts.dummy1,
          recipient: standardAccounts.dummy1,
          massetQuantity: sum,
          bAsset: basketManagerObj.mockToken1.address,
          bassetQuantity: sum,
        });
        balance = await token.balanceOf(standardAccounts.dummy1);
        expect(balance.toString()).to.equal(`0`);
        balance = await basketManagerObj.mockToken1.balanceOf(
          standardAccounts.dummy1
        );
        expect(balance.toString()).to.equal("1000000000000000000"); // original sum
      });
    });
    context("should fail", () => {
      it("if basset is invalid", async () => {
        await expectRevert(
          massetManager.redeem(ZERO_ADDRESS, 10),
          "VM Exception while processing transaction: reverted with reason string 'invalid basset'"
        );
      });
      it("if basset is not in the basket", async () => {
        await expectRevert(
          massetManager.redeem(mockTokenDummy.address, 10),
          "VM Exception while processing transaction: reverted with reason string 'invalid basset'"
        );
      });
      it("if amount is greater than the balance", async () => {
        await expectRevert(
          massetManager.redeem(basketManagerObj.mockToken1.address, 100000),
          "VM Exception while processing transaction: reverted with reason string 'ERC20: transfer amount exceeds balance'"
        );
      });
    });
  });

  describe("precision conversion", async () => {
    let massetManager;
    let basketManagerObj;
    let token;
    beforeEach(async () => {
      massetManager = await MassetManager.new();
      token = await createToken(massetManager);
      basketManagerObj = await createBasketManager(
        massetManager,
        [20, 12],
        [100, -1000000]
      );
      await massetManager.initialize(
        basketManagerObj.basketManager.address,
        token.address,
        false
      );
    });
    it("works both ways", async () => {
      expect(
        await getBalance(basketManagerObj.mockToken1, standardAccounts.dummy1)
      ).to.equal("100000000000000000000");
      expect(
        await getBalance(basketManagerObj.mockToken2, standardAccounts.dummy1)
      ).to.equal("1000000000000");

      await basketManagerObj.mockToken1.approve(
        massetManager.address,
        "100000000000000000000",
        {
          from: standardAccounts.dummy1,
        }
      );
      await massetManager.mint(
        basketManagerObj.mockToken1.address,
        "100000000000000000000",
        {
          from: standardAccounts.dummy1,
        }
      );
      await basketManagerObj.mockToken2.approve(
        massetManager.address,
        "1000000000000",
        {
          from: standardAccounts.dummy1,
        }
      );
      await massetManager.mint(
        basketManagerObj.mockToken2.address,
        "1000000000000",
        {
          from: standardAccounts.dummy1,
        }
      );

      expect(await getBalance(token, standardAccounts.dummy1)).to.equal(
        "2000000000000000000"
      );
      expect(
        await getBalance(basketManagerObj.mockToken1, standardAccounts.dummy1)
      ).to.equal("0");
      expect(
        await getBalance(basketManagerObj.mockToken2, standardAccounts.dummy1)
      ).to.equal("0");

      await token.transfer(standardAccounts.dummy2, "1000000000000000000", {
        from: standardAccounts.dummy1,
      });
      expect(await getBalance(token, standardAccounts.dummy1)).to.equal(
        "1000000000000000000"
      );

      await massetManager.redeem(
        basketManagerObj.mockToken2.address,
        "1000000000000000000",
        {
          from: standardAccounts.dummy2,
        }
      );
      expect(await getBalance(token, standardAccounts.dummy2)).to.equal("0");
      expect(
        await getBalance(basketManagerObj.mockToken2, standardAccounts.dummy2)
      ).to.equal("1000000000000");
    });
  });
});

async function createBasketManager(
  massetManager: MassetManagerInstance,
  decimals: Array<number>,
  factors: Array<number>
): Promise<any> {
  const mockToken1 = await MockERC20.new(
    "",
    "",
    decimals[0],
    standardAccounts.dummy1,
    1
  );
  const mockToken2 = await MockERC20.new(
    "",
    "",
    decimals[1],
    standardAccounts.dummy1,
    1
  );
  const bassets = [mockToken1.address, mockToken2.address];
  const bridges = [ZERO_ADDRESS, ZERO_ADDRESS];
  const basketManager = await BasketManager.new(bassets, factors, bridges);
  return {
    mockToken1,
    mockToken2,
    bassets,
    basketManager,
  };
}

async function createToken(massetManager: MassetManagerInstance): Promise<any> {
  const token = await Token.new("Mock1", "MK1", 18);
  token.transferOwnership(massetManager.address);
  return token;
}

async function getBalance(token: any, who: string): Promise<string> {
  return (await token.balanceOf(who)).toString(10);
}
