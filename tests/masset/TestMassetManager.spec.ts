/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-use-before-define */
import { expectRevert, expectEvent } from "@openzeppelin/test-helpers";
import { BN, tokens } from "@utils/tools";
import envSetup from "@utils/env_setup";
import { ZERO_ADDRESS, FEE_PRECISION, ZERO } from "@utils/constants";
import { StandardAccounts } from "@utils/standardAccounts";

import {
  BasketManagerV3Instance,
  MassetManagerInstance,
  MockERC20Instance,
  FeesVaultInstance,
  FeesManagerInstance,
  MetaAssetTokenInstance,
  MassetManagerContract,
} from "types/generated";
// import { MetaAssetTokenContract } from "types/generated/contracts/meta-asset-token/MetaAssetToken";

const { expect } = envSetup.configure();

const BasketManagerV3 = artifacts.require("BasketManagerV3");
const MassetManager = artifacts.require("MassetManager");
const MetaAssetToken = artifacts.require("MetaAssetToken");
const MockERC20 = artifacts.require("MockERC20");
const FeesVault = artifacts.require("FeesVault");
const FeesManager = artifacts.require("FeesManager");

let standardAccounts: StandardAccounts;

type Fees = {
  deposit: BN;
  withdrawal: BN;
};

const standardFees: Fees = {
  deposit: new BN(100),
  withdrawal: new BN(300),
};

contract("MassetManager", async (accounts) => {
  let massetManager: MassetManagerInstance;
  let basketManagerObj: BasketManagerObj;
  let mAsset: MetaAssetTokenInstance;
  let vault: FeesVaultInstance;
  let mockTokenDummy: MockERC20Instance;

  standardAccounts = new StandardAccounts(accounts);

  before("before all", async () => {});

  describe("initialize", async () => {
    let feesManager: FeesManagerInstance;

    beforeEach(async () => {
      vault = await FeesVault.new();
      massetManager = await MassetManager.new();
      feesManager = await FeesManager.new();
      basketManagerObj = await createBasketManager(
        massetManager,
        [18, 18],
        [1, 1]
      );
      mAsset = await createMassetToken(massetManager);
    });

    context("should succeed", async () => {
      it("when given a valid basket manager", async () => {
        await massetManager.initialize(
          basketManagerObj.basketManager.address,
          mAsset.address
        );

        let version = await massetManager.getVersion();
        expect(version).to.eq("1.0");

        const setToken = await massetManager.getToken();
        expect(setToken).to.eq(mAsset.address);

        const setBasketManager = await massetManager.getBasketManager();
        expect(setBasketManager).to.eq(basketManagerObj.basketManager.address);

        // migrate to V3
        await massetManager.upgradeToV3(
          basketManagerObj.basketManager.address,
          mAsset.address,
          vault.address,
          feesManager.address
        );

        version = await massetManager.getVersion();
        expect(version).to.eq("3.0");
      });
    });
    context("should fail", async () => {
      it("when basket manager missing", async () => {
        await expectRevert(
          massetManager.initialize(ZERO_ADDRESS, mAsset.address),
          "VM Exception while processing transaction: reverted with reason string 'invalid basket manager'"
        );
      });
      it("when token missing", async () => {
        await expectRevert(
          massetManager.initialize(
            basketManagerObj.basketManager.address,
            ZERO_ADDRESS
          ),
          "VM Exception while processing transaction: reverted with reason string 'invalid mAssetToken'"
        );
      });
      it("when already initialized", async () => {
        await massetManager.initialize(
          basketManagerObj.basketManager.address,
          mAsset.address
        );
        await expectRevert(
          massetManager.initialize(
            basketManagerObj.basketManager.address,
            mAsset.address
          ),
          "VM Exception while processing transaction: reverted with reason string 'Initializable: contract is already initialized'"
        );
      });
    });
  });

  describe("mint", async () => {
    beforeEach(async () => {
      massetManager = await MassetManager.new();
      vault = await FeesVault.new();
      mAsset = await createMassetToken(massetManager);
      basketManagerObj = await createBasketManager(
        massetManager,
        [18, 18],
        [100, 1]
      );
      await initMassetManager(
        massetManager,
        basketManagerObj.basketManager.address,
        mAsset.address,
        vault.address,
        standardFees
      );

      await setTokenProxies(mAsset, massetManager);

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
        const sum = tokens(1024);
        const massetQuantity = sum.div(new BN(100));
        const expectedFee = massetQuantity
          .mul(standardFees.deposit)
          .div(FEE_PRECISION);
        const expectedMassetQuantity = massetQuantity.sub(expectedFee);

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
          massetQuantity: expectedMassetQuantity,
          bAsset: basketManagerObj.mockToken1.address,
          bassetQuantity: sum,
        });

        const balance = await mAsset.balanceOf(standardAccounts.dummy1);
        expect(balance).bignumber.to.eq(expectedMassetQuantity);

        const vaultBalance = await mAsset.balanceOf(vault.address);
        expect(vaultBalance).bignumber.to.eq(
          expectedFee,
          "fee should be transfered to vault contract"
        );
      });

      it("if all params are valid, amounts that don't divide evenly", async () => {
        const factor = new BN(1000);
        await basketManagerObj.basketManager.setFactor(
          basketManagerObj.mockToken1.address,
          factor
        );

        const sum = new BN(1024);

        const expectedReminder = sum.mod(factor);
        const bassetsLeft = sum.sub(expectedReminder);
        const massetsToMint = sum.sub(expectedReminder).div(factor);

        const expectedFee = massetsToMint
          .mul(standardFees.deposit)
          .div(FEE_PRECISION);
        const expectedMassetQuantity = massetsToMint.sub(expectedFee);

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
          massetQuantity: expectedMassetQuantity,
          bAsset: basketManagerObj.mockToken1.address,
          bassetQuantity: bassetsLeft,
        });

        const balance = await mAsset.balanceOf(standardAccounts.dummy1);
        expect(balance).bignumber.to.eq(expectedMassetQuantity);

        const vaultBalance = await mAsset.balanceOf(vault.address);
        expect(vaultBalance).bignumber.to.eq(
          expectedFee,
          "fee should be transfered to vault contract"
        );
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
    beforeEach(async () => {
      vault = await FeesVault.new();
      massetManager = await MassetManager.new();
      basketManagerObj = await createBasketManager(
        massetManager,
        [18, 18],
        [1, 1]
      );
      mAsset = await createMassetToken(massetManager);

      await initMassetManager(
        massetManager,
        basketManagerObj.basketManager.address,
        mAsset.address,
        vault.address,
        standardFees
      );
      await setTokenProxies(mAsset, massetManager);
    });
    context("should succeed", () => {
      it("if all params are valid", async () => {
        const sum = tokens(1);
        const expectedFee = sum.mul(standardFees.deposit).div(FEE_PRECISION);
        const expectedMassetQuantity = sum.sub(expectedFee);

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
          massetQuantity: expectedMassetQuantity,
          bAsset: basketManagerObj.mockToken1.address,
          bassetQuantity: sum,
        });
        const balance = await mAsset.balanceOf(standardAccounts.dummy4);
        expect(balance).bignumber.to.eq(expectedMassetQuantity);

        const vaultBalance = await mAsset.balanceOf(vault.address);
        expect(vaultBalance).bignumber.to.eq(
          expectedFee,
          "fee should be transfered to vault contract"
        );
      });
    });
  });

  describe("redeem", async () => {
    beforeEach(async () => {
      vault = await FeesVault.new();
      massetManager = await MassetManager.new();
      mAsset = await createMassetToken(massetManager);
      basketManagerObj = await createBasketManager(
        massetManager,
        [18, 18],
        [1, 1]
      );

      await initMassetManager(
        massetManager,
        basketManagerObj.basketManager.address,
        mAsset.address,
        vault.address,
        standardFees
      );
      await setTokenProxies(mAsset, massetManager);

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
        const initialBalance = await basketManagerObj.mockToken1.balanceOf(
          standardAccounts.dummy1
        );
        const sum = new BN(123123).pow(new BN(2));
        const mintFee = sum.mul(standardFees.deposit).div(FEE_PRECISION);

        await basketManagerObj.mockToken1.approve(massetManager.address, sum, {
          from: standardAccounts.dummy1,
        });

        await massetManager.mint(basketManagerObj.mockToken1.address, sum, {
          from: standardAccounts.dummy1,
        });

        const calculated =
          await basketManagerObj.basketManager.convertBassetToMassetQuantity(
            basketManagerObj.mockToken1.address,
            sum
          );
        let mintedMassets = calculated[0];

        mintedMassets = mintedMassets.sub(mintFee);

        let balance = await mAsset.balanceOf(standardAccounts.dummy1);
        expect(balance).bignumber.to.equal(mintedMassets);

        balance = await basketManagerObj.mockToken1.balanceOf(
          standardAccounts.dummy1
        );
        expect(balance).bignumber.to.equal(initialBalance.sub(sum));

        const withdrawalFee = mintedMassets
          .mul(standardFees.withdrawal)
          .div(FEE_PRECISION);
        const withdrawnBassets = mintedMassets.sub(withdrawalFee);

        await mAsset.approve(massetManager.address, mintedMassets, {
          from: standardAccounts.dummy1,
        });

        const tx = await massetManager.redeem(
          basketManagerObj.mockToken1.address,
          mintedMassets,
          {
            from: standardAccounts.dummy1,
          }
        );
        await expectEvent(tx.receipt, "Redeemed", {
          redeemer: standardAccounts.dummy1,
          recipient: standardAccounts.dummy1,
          massetQuantity: mintedMassets,
          bAsset: basketManagerObj.mockToken1.address,
          bassetQuantity: withdrawnBassets,
        });

        balance = await mAsset.balanceOf(standardAccounts.dummy1);
        expect(balance).bignumber.to.equal(tokens(0));

        balance = await basketManagerObj.mockToken1.balanceOf(
          standardAccounts.dummy1
        );
        expect(balance).bignumber.to.equal(
          initialBalance.sub(mintFee).sub(withdrawalFee)
        );

        const vaultBalance = await mAsset.balanceOf(vault.address);
        expect(vaultBalance).bignumber.to.eq(mintFee.add(withdrawalFee));
      });

      it("if all params are valid, amounts that don't divide evenly", async () => {
        const factor = new BN(-10);
        await basketManagerObj.basketManager.setFactor(
          basketManagerObj.mockToken1.address,
          factor
        );

        const initialBalance = await basketManagerObj.mockToken1.balanceOf(
          standardAccounts.dummy1
        );
        const sum = new BN(123123);
        const bassetsLeft = sum;
        const massetsToMint = sum.mul(factor.abs());

        const mintFee = massetsToMint
          .mul(standardFees.deposit)
          .div(FEE_PRECISION);

        await basketManagerObj.mockToken1.approve(massetManager.address, sum, {
          from: standardAccounts.dummy1,
        });

        await massetManager.mint(basketManagerObj.mockToken1.address, sum, {
          from: standardAccounts.dummy1,
        });

        const calculated =
          await basketManagerObj.basketManager.convertBassetToMassetQuantity(
            basketManagerObj.mockToken1.address,
            sum
          );
        let mintedMassets = calculated[0];

        mintedMassets = mintedMassets.sub(mintFee);

        let balance = await mAsset.balanceOf(standardAccounts.dummy1);
        expect(balance).bignumber.to.equal(mintedMassets);

        balance = await basketManagerObj.mockToken1.balanceOf(
          standardAccounts.dummy1
        );
        expect(balance).bignumber.to.equal(initialBalance.sub(bassetsLeft));

        const withdrawalFee = mintedMassets
          .mul(standardFees.withdrawal)
          .div(FEE_PRECISION);
        const massetsSubFee = mintedMassets.sub(withdrawalFee);
        const redeemReminder = massetsSubFee.mod(factor.abs());
        const massetsLeft = massetsSubFee.sub(redeemReminder);
        const withdrawnBassets = massetsLeft.div(factor.abs());

        await mAsset.approve(massetManager.address, mintedMassets, {
          from: standardAccounts.dummy1,
        });

        const tx = await massetManager.redeem(
          basketManagerObj.mockToken1.address,
          mintedMassets,
          {
            from: standardAccounts.dummy1,
          }
        );
        await expectEvent(tx.receipt, "Redeemed", {
          redeemer: standardAccounts.dummy1,
          recipient: standardAccounts.dummy1,
          massetQuantity: mintedMassets,
          bAsset: basketManagerObj.mockToken1.address,
          bassetQuantity: withdrawnBassets,
        });

        balance = await mAsset.balanceOf(standardAccounts.dummy1);
        expect(balance).bignumber.to.equal(redeemReminder);

        balance = await basketManagerObj.mockToken1.balanceOf(
          standardAccounts.dummy1
        );
        expect(balance).bignumber.to.equal(
          initialBalance.sub(sum.sub(withdrawnBassets))
        );

        const sumOfOperations = mintFee
          .add(withdrawalFee)
          .add(redeemReminder)
          .div(factor.abs()) // convert to bassets
          .add(withdrawnBassets);

        expect(sumOfOperations).bignumber.to.eq(
          sum,
          "check that sum of funds in system after deposit and redeem is the same as before"
        );

        const vaultBalance = await mAsset.balanceOf(vault.address);
        expect(vaultBalance).bignumber.to.eq(mintFee.add(withdrawalFee));
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
        await basketManagerObj.mockToken1.approve(massetManager.address, 100, {
          from: standardAccounts.dummy1,
        });
        await massetManager.mint(basketManagerObj.mockToken1.address, 100, {
          from: standardAccounts.dummy1,
        });

        await mAsset.approve(massetManager.address, 100, {
          from: standardAccounts.dummy1,
        });

        await expectRevert(
          massetManager.redeem(basketManagerObj.mockToken1.address, 1000, {
            from: standardAccounts.dummy1,
          }),
          "VM Exception while processing transaction: reverted with reason string 'basset balance is not sufficient'"
        );
      });
      it("if amount is greater than balance", async () => {
        const sum = 100;
        await basketManagerObj.mockToken1.approve(massetManager.address, sum, {
          from: standardAccounts.dummy1,
        });
        await massetManager.mint(basketManagerObj.mockToken1.address, sum, {
          from: standardAccounts.dummy1,
        });

        await mAsset.approve(massetManager.address, sum, {
          from: standardAccounts.dummy1,
        });

        await expectRevert(
          // should revert because fee from minting was taken
          massetManager.redeem(basketManagerObj.mockToken1.address, sum, {
            from: standardAccounts.dummy1,
          }),
          "VM Exception while processing transaction: reverted with reason string 'ERC20: burn amount exceeds balance'"
        );
      });
    });
  });

  describe("redeemTo", async () => {
    beforeEach(async () => {
      vault = await FeesVault.new();
      massetManager = await MassetManager.new();
      mAsset = await createMassetToken(massetManager);
      basketManagerObj = await createBasketManager(
        massetManager,
        [18, 18],
        [1, 1]
      );
      await initMassetManager(
        massetManager,
        basketManagerObj.basketManager.address,
        mAsset.address,
        vault.address,
        standardFees
      );
      await setTokenProxies(mAsset, massetManager);
    });

    context("should fail", () => {
      it("when recipient is not valid", async () => {
        await expectRevert(
          massetManager.redeemTo(
            basketManagerObj.mockToken1.address,
            tokens(10),
            ZERO_ADDRESS,
            {
              from: standardAccounts.dummy1,
            }
          ),
          "VM Exception while processing transaction: reverted with reason string 'must be a valid recipient'"
        );
      });
    });

    context("should succeed", () => {
      it("if all params are valid", async () => {
        const sum = new BN(10).pow(new BN(3));
        const mintFee = sum.mul(standardFees.deposit).div(FEE_PRECISION);
        const withdrawAmount = sum.sub(mintFee);
        const withdrawalFee = withdrawAmount
          .mul(standardFees.withdrawal)
          .div(FEE_PRECISION);
        const recipient = standardAccounts.dummy2;

        await basketManagerObj.mockToken1.approve(massetManager.address, sum, {
          from: standardAccounts.dummy1,
        });
        await massetManager.mint(basketManagerObj.mockToken1.address, sum, {
          from: standardAccounts.dummy1,
        });

        await mAsset.approve(massetManager.address, withdrawAmount, {
          from: standardAccounts.dummy1,
        });

        await massetManager.redeemTo(
          basketManagerObj.mockToken1.address,
          withdrawAmount,
          recipient,
          { from: standardAccounts.dummy1 }
        );

        const tokenBalance = await mAsset.balanceOf(standardAccounts.dummy1);
        expect(tokenBalance).bignumber.to.eq("0");

        const balance = await basketManagerObj.mockToken1.balanceOf(recipient);
        expect(balance).bignumber.to.equal(
          withdrawAmount.sub(withdrawalFee),
          "should transfer bassets to correct recipient"
        );

        const vaultBalance = await mAsset.balanceOf(vault.address);
        expect(vaultBalance).bignumber.to.eq(mintFee.add(withdrawalFee));
      });
    });
  });

  describe("precision conversion", async () => {
    const basset1Factor = new BN(100);
    const basset2Factor = new BN(-1000000);

    beforeEach(async () => {
      vault = await FeesVault.new();
      massetManager = await MassetManager.new();
      mAsset = await createMassetToken(massetManager);
      basketManagerObj = await createBasketManager(
        massetManager,
        [20, 12],
        [basset1Factor, basset2Factor]
      );

      await initMassetManager(
        massetManager,
        basketManagerObj.basketManager.address,
        mAsset.address,
        vault.address,
        standardFees
      );
      await setTokenProxies(mAsset, massetManager);
    });
    it("works both ways", async () => {
      const amount = tokens(10000);
      const initialToken1Balance = await basketManagerObj.mockToken1.balanceOf(
        standardAccounts.dummy1
      );
      const initialToken2Balance = await basketManagerObj.mockToken2.balanceOf(
        standardAccounts.dummy1
      );

      await basketManagerObj.mockToken1.approve(
        massetManager.address,
        initialToken1Balance,
        {
          from: standardAccounts.dummy1,
        }
      );
      await massetManager.mint(
        basketManagerObj.mockToken1.address,
        initialToken1Balance,
        {
          from: standardAccounts.dummy1,
        }
      );
      await basketManagerObj.mockToken2.approve(
        massetManager.address,
        initialToken2Balance,
        {
          from: standardAccounts.dummy1,
        }
      );
      await massetManager.mint(
        basketManagerObj.mockToken2.address,
        initialToken2Balance,
        {
          from: standardAccounts.dummy1,
        }
      );

      const fee = amount.mul(standardFees.deposit).div(FEE_PRECISION);

      const account1BalanceAfterMint = amount.sub(fee).mul(new BN(2));

      expect(
        await getBalance(mAsset, standardAccounts.dummy1)
      ).bignumber.to.equal(account1BalanceAfterMint);
      expect(
        await getBalance(basketManagerObj.mockToken1, standardAccounts.dummy1)
      ).bignumber.to.equal(tokens(0));
      expect(
        await getBalance(basketManagerObj.mockToken2, standardAccounts.dummy1)
      ).bignumber.to.equal(tokens(0));

      await mAsset.transfer(standardAccounts.dummy2, amount, {
        from: standardAccounts.dummy1,
      });
      expect(
        await getBalance(mAsset, standardAccounts.dummy1)
      ).bignumber.to.equal(account1BalanceAfterMint.sub(amount));

      await mAsset.approve(massetManager.address, amount, {
        from: standardAccounts.dummy2,
      });
      await massetManager.redeem(basketManagerObj.mockToken2.address, amount, {
        from: standardAccounts.dummy2,
      });
      expect(
        await getBalance(mAsset, standardAccounts.dummy2)
      ).bignumber.to.equal(tokens(0));

      const withdrawalFee = amount
        .mul(standardFees.withdrawal)
        .div(FEE_PRECISION);
      const expectedBalance = amount
        .sub(withdrawalFee)
        .div(basset2Factor.neg());
      expect(
        await getBalance(basketManagerObj.mockToken2, standardAccounts.dummy2)
      ).bignumber.to.equal(expectedBalance);

      const totalFee = fee.mul(new BN(2)).add(withdrawalFee); // 2 mints and one redeem
      const vaultBalance = await mAsset.balanceOf(vault.address);
      expect(vaultBalance).bignumber.to.eq(totalFee);
    });
  });
});

async function initMassetManager(
  massetManager: MassetManagerInstance,
  basketManagerAddress: string,
  tokenAddress: string,
  vaultAddress: string,
  fees: Fees,
  txDetails: Truffle.TransactionDetails = { from: standardAccounts.default }
): Promise<void> {
  const feesManager = await FeesManager.new();

  await feesManager.initialize(fees.deposit, fees.withdrawal);

  await massetManager.initialize(basketManagerAddress, tokenAddress, txDetails);

  await massetManager.upgradeToV3(
    basketManagerAddress,
    tokenAddress,
    vaultAddress,
    feesManager.address,
    txDetails
  );
}

async function createBasketManager(
  massetManager: MassetManagerInstance,
  decimals: Array<number>,
  factors: Array<number | BN>
): Promise<BasketManagerObj> {
  const mockToken1 = await MockERC20.new(
    "",
    "",
    decimals[0],
    standardAccounts.dummy1,
    10000,
    { from: standardAccounts.default }
  );
  const mockToken2 = await MockERC20.new(
    "",
    "",
    decimals[1],
    standardAccounts.dummy1,
    10000,
    { from: standardAccounts.default }
  );

  const bassets = [mockToken1.address, mockToken2.address];

  const mins = [0, 0];
  const maxs = [1000, 1000];
  const pauses = [false, false];

  const basketManager = await BasketManagerV3.new({
    from: standardAccounts.default,
  });
  await basketManager.initialize(massetManager.address, {
    from: standardAccounts.default,
  });
  await basketManager.addBassets(bassets, factors, mins, maxs, pauses, {
    from: standardAccounts.default,
  });

  return {
    mockToken1,
    mockToken2,
    bassets,
    basketManager,
  };
}

async function createMassetToken(massetManager: MassetManagerInstance) {
  const mAsset = await MetaAssetToken.new("Mock1", "MK1");
  return mAsset;
}

async function setTokenProxies(
  mAsset: MetaAssetTokenInstance,
  massetManager: MassetManagerContract
) {
  await mAsset.setMassetManagerProxy(massetManager.address);
  await mAsset.setBasketManagerProxy(await massetManager.getBasketManager());
  await mAsset.transferOwnership(massetManager.address);
}

async function getBalance(
  mAsset: MetaAssetTokenInstance | MockERC20Instance,
  who: string
): Promise<BN> {
  return mAsset.balanceOf(who);
}

type BasketManagerObj = {
  mockToken1: MockERC20Instance;
  mockToken2: MockERC20Instance;
  bassets: string[];
  basketManager: BasketManagerV3Instance;
};
