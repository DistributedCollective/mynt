/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-use-before-define */
import { expectRevert, expectEvent } from "@openzeppelin/test-helpers";
import { BN, tokens } from "@utils/tools";
import envSetup from "@utils/env_setup";
import { ZERO_ADDRESS, FEE_PRECISION, ZERO } from "@utils/constants";
import { StandardAccounts } from "@utils/standardAccounts";
import { Fees } from "types";
import {
  BasketManagerV3Instance,
  MassetV3Instance,
  MockBridgeInstance,
  MockERC20Instance,
  TokenInstance,
  FeesVaultInstance,
  FeesManagerInstance
} from "types/generated";

const { expect } = envSetup.configure();

const BasketManagerV3 = artifacts.require("BasketManagerV3");
const MassetV3 = artifacts.require("MassetV3");
const Token = artifacts.require("Token");
const MockERC20 = artifacts.require("MockERC20");
const MockBridge = artifacts.require("MockBridge");
const FeesVault = artifacts.require("FeesVault");
const FeesManager = artifacts.require("FeesManager");

let standardAccounts: StandardAccounts;

const standardFees: Fees = {
  deposit: new BN(100),
  depositBridge: new BN(200),
  withdrawal: new BN(300),
  withdrawalBridge: new BN(400)
};

contract("MassetV3", async accounts => {
  let masset: MassetV3Instance;
  let basketManagerObj: BasketManagerObj;
  let token: TokenInstance;
  let vault: FeesVaultInstance;
  let mockTokenDummy: MockERC20Instance;
  let mockBridge: MockBridgeInstance;

  standardAccounts = new StandardAccounts(accounts);

  before("before all", async () => {});

  describe("initialize", async () => {
    let feesManager: FeesManagerInstance;

    beforeEach(async () => {
      vault = await FeesVault.new();
      masset = await MassetV3.new();
      feesManager = await FeesManager.new();
      basketManagerObj = await createBasketManager(masset, [18, 18], [1, 1]);
      token = await createToken(masset);
    });

    context("should succeed", async () => {
      it("when given a valid basket manager", async () => {
        await masset.initialize(
          basketManagerObj.basketManager.address,
          token.address,
          false
        );

        let version = await masset.getVersion();
        expect(version).to.eq("1.0");

        const setToken = await masset.getToken();
        expect(setToken).to.eq(token.address);

        const setBasketManager = await masset.getBasketManager();
        expect(setBasketManager).to.eq(basketManagerObj.basketManager.address);

        // migrate to V3
        await masset.upgradeToV3(
          basketManagerObj.basketManager.address,
          token.address,
          vault.address,
          feesManager.address
        );

        version = await masset.getVersion();
        expect(version).to.eq("3.0");
      });
    });
    context("should fail", async () => {
      it("when basket manager missing", async () => {
        await expectRevert(
          masset.initialize(ZERO_ADDRESS, token.address, false),
          "VM Exception while processing transaction: reverted with reason string 'invalid basket manager'"
        );
      });
      it("when token missing", async () => {
        await expectRevert(
          masset.initialize(
            basketManagerObj.basketManager.address,
            ZERO_ADDRESS,
            false
          ),
          "VM Exception while processing transaction: reverted with reason string 'invalid token'"
        );
      });
      it("when already initialized", async () => {
        await masset.initialize(
          basketManagerObj.basketManager.address,
          token.address,
          false
        );
        await expectRevert(
          masset.initialize(
            basketManagerObj.basketManager.address,
            token.address,
            false
          ),
          "VM Exception while processing transaction: reverted with reason string 'already initialized'"
        );
      });
    });
  });

  describe("mint", async () => {
    beforeEach(async () => {
      masset = await MassetV3.new();
      vault = await FeesVault.new();
      token = await createToken(masset);
      basketManagerObj = await createBasketManager(masset, [18, 18], [100, 1]);
      await initMassetV3(
        masset,
        basketManagerObj.basketManager.address,
        token.address,
        vault.address,
        standardFees
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
        const sum = tokens(1024);
        const massetQuantity = sum.div(new BN(100));
        const expectedFee = massetQuantity
          .mul(standardFees.deposit)
          .div(FEE_PRECISION);
        const expectedMassetQuantity = massetQuantity.sub(expectedFee);

        await basketManagerObj.mockToken1.approve(masset.address, sum, {
          from: standardAccounts.dummy1
        });
        const tx = await masset.mint(basketManagerObj.mockToken1.address, sum, {
          from: standardAccounts.dummy1
        });

        await expectEvent(tx.receipt, "Minted", {
          minter: standardAccounts.dummy1,
          recipient: standardAccounts.dummy1,
          massetQuantity: expectedMassetQuantity,
          bAsset: basketManagerObj.mockToken1.address,
          bassetQuantity: sum
        });

        const balance = await token.balanceOf(standardAccounts.dummy1);
        expect(balance).bignumber.to.eq(expectedMassetQuantity);

        const vaultBalance = await token.balanceOf(vault.address);
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

        await basketManagerObj.mockToken1.approve(masset.address, sum, {
          from: standardAccounts.dummy1
        });
        const tx = await masset.mint(basketManagerObj.mockToken1.address, sum, {
          from: standardAccounts.dummy1
        });

        await expectEvent(tx.receipt, "Minted", {
          minter: standardAccounts.dummy1,
          recipient: standardAccounts.dummy1,
          massetQuantity: expectedMassetQuantity,
          bAsset: basketManagerObj.mockToken1.address,
          bassetQuantity: bassetsLeft
        });

        const balance = await token.balanceOf(standardAccounts.dummy1);
        expect(balance).bignumber.to.eq(expectedMassetQuantity);

        const vaultBalance = await token.balanceOf(vault.address);
        expect(vaultBalance).bignumber.to.eq(
          expectedFee,
          "fee should be transfered to vault contract"
        );
      });
    });

    context("should fail", () => {
      it("if basset is invalid", async () => {
        await expectRevert(
          masset.mint(ZERO_ADDRESS, 10),
          "VM Exception while processing transaction: reverted with reason string 'invalid basset'"
        );
      });
      it("if basset is not in the basket", async () => {
        await expectRevert(
          masset.mint(mockTokenDummy.address, 10),
          "VM Exception while processing transaction: reverted with reason string 'invalid basset'"
        );
      });
      it("if amount is greater than the balance", async () => {
        await expectRevert(
          masset.mint(basketManagerObj.mockToken1.address, 100000),
          "VM Exception while processing transaction: reverted with reason string 'SafeERC20: low-level call failed'"
        );
      });
    });
  });
  describe("mintTo", async () => {
    beforeEach(async () => {
      vault = await FeesVault.new();
      masset = await MassetV3.new();
      basketManagerObj = await createBasketManager(masset, [18, 18], [1, 1]);
      token = await createToken(masset);

      await initMassetV3(
        masset,
        basketManagerObj.basketManager.address,
        token.address,
        vault.address,
        standardFees
      );
    });
    context("should succeed", () => {
      it("if all params are valid", async () => {
        const sum = tokens(1);
        const expectedFee = sum.mul(standardFees.deposit).div(FEE_PRECISION);
        const expectedMassetQuantity = sum.sub(expectedFee);

        await basketManagerObj.mockToken1.approve(masset.address, sum, {
          from: standardAccounts.dummy1
        });
        const tx = await masset.mintTo(
          basketManagerObj.mockToken1.address,
          sum,
          standardAccounts.dummy4,
          {
            from: standardAccounts.dummy1
          }
        );
        await expectEvent(tx.receipt, "Minted", {
          minter: standardAccounts.dummy1,
          recipient: standardAccounts.dummy4,
          massetQuantity: expectedMassetQuantity,
          bAsset: basketManagerObj.mockToken1.address,
          bassetQuantity: sum
        });
        const balance = await token.balanceOf(standardAccounts.dummy4);
        expect(balance).bignumber.to.eq(expectedMassetQuantity);

        const vaultBalance = await token.balanceOf(vault.address);
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
      masset = await MassetV3.new();
      token = await createToken(masset);
      basketManagerObj = await createBasketManager(masset, [18, 18], [1, 1]);

      await initMassetV3(
        masset,
        basketManagerObj.basketManager.address,
        token.address,
        vault.address,
        standardFees
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
        const initialBalance = await basketManagerObj.mockToken1.balanceOf(
          standardAccounts.dummy1
        );
        const sum = new BN(123123).pow(new BN(2));
        const mintFee = sum.mul(standardFees.deposit).div(FEE_PRECISION);

        await basketManagerObj.mockToken1.approve(masset.address, sum, {
          from: standardAccounts.dummy1
        });

        await masset.mint(basketManagerObj.mockToken1.address, sum, {
          from: standardAccounts.dummy1
        });

        const calculated = await basketManagerObj.basketManager.convertBassetToMassetQuantity(
          basketManagerObj.mockToken1.address,
          sum
        );
        let mintedMassets = calculated[0];

        mintedMassets = mintedMassets.sub(mintFee);

        let balance = await token.balanceOf(standardAccounts.dummy1);
        expect(balance).bignumber.to.equal(mintedMassets);

        balance = await basketManagerObj.mockToken1.balanceOf(
          standardAccounts.dummy1
        );
        expect(balance).bignumber.to.equal(initialBalance.sub(sum));

        const withdrawalFee = mintedMassets
          .mul(standardFees.withdrawal)
          .div(FEE_PRECISION);
        const withdrawnBassets = mintedMassets.sub(withdrawalFee);

        await token.approve(masset.address, mintedMassets, {
          from: standardAccounts.dummy1
        });

        const tx = await masset.redeem(
          basketManagerObj.mockToken1.address,
          mintedMassets,
          {
            from: standardAccounts.dummy1
          }
        );
        await expectEvent(tx.receipt, "Redeemed", {
          redeemer: standardAccounts.dummy1,
          recipient: standardAccounts.dummy1,
          massetQuantity: mintedMassets,
          bAsset: basketManagerObj.mockToken1.address,
          bassetQuantity: withdrawnBassets
        });

        balance = await token.balanceOf(standardAccounts.dummy1);
        expect(balance).bignumber.to.equal(tokens(0));

        balance = await basketManagerObj.mockToken1.balanceOf(
          standardAccounts.dummy1
        );
        expect(balance).bignumber.to.equal(
          initialBalance.sub(mintFee).sub(withdrawalFee)
        );

        const vaultBalance = await token.balanceOf(vault.address);
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

        await basketManagerObj.mockToken1.approve(masset.address, sum, {
          from: standardAccounts.dummy1
        });

        await masset.mint(basketManagerObj.mockToken1.address, sum, {
          from: standardAccounts.dummy1
        });

        const calculated = await basketManagerObj.basketManager.convertBassetToMassetQuantity(
          basketManagerObj.mockToken1.address,
          sum
        );
        let mintedMassets = calculated[0];

        mintedMassets = mintedMassets.sub(mintFee);

        let balance = await token.balanceOf(standardAccounts.dummy1);
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

        await token.approve(masset.address, mintedMassets, {
          from: standardAccounts.dummy1
        });

        const tx = await masset.redeem(
          basketManagerObj.mockToken1.address,
          mintedMassets,
          {
            from: standardAccounts.dummy1
          }
        );
        await expectEvent(tx.receipt, "Redeemed", {
          redeemer: standardAccounts.dummy1,
          recipient: standardAccounts.dummy1,
          massetQuantity: mintedMassets,
          bAsset: basketManagerObj.mockToken1.address,
          bassetQuantity: withdrawnBassets
        });

        balance = await token.balanceOf(standardAccounts.dummy1);
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

        const vaultBalance = await token.balanceOf(vault.address);
        expect(vaultBalance).bignumber.to.eq(mintFee.add(withdrawalFee));
      });
    });
    context("should fail", () => {
      it("if basset is invalid", async () => {
        await expectRevert(
          masset.redeem(ZERO_ADDRESS, 10),
          "VM Exception while processing transaction: reverted with reason string 'invalid basset'"
        );
      });
      it("if basset is not in the basket", async () => {
        await expectRevert(
          masset.redeem(mockTokenDummy.address, 10),
          "VM Exception while processing transaction: reverted with reason string 'invalid basset'"
        );
      });
      it("if amount is greater than the balance", async () => {
        await basketManagerObj.mockToken1.approve(masset.address, 100, {
          from: standardAccounts.dummy1
        });
        await masset.mint(basketManagerObj.mockToken1.address, 100, {
          from: standardAccounts.dummy1
        });

        await token.approve(masset.address, 100, {
          from: standardAccounts.dummy1
        });

        await expectRevert(
          masset.redeem(basketManagerObj.mockToken1.address, 1000, {
            from: standardAccounts.dummy1
          }),
          "VM Exception while processing transaction: reverted with reason string 'basset balance is not sufficient'"
        );
      });
      it("if amount is greater than balance", async () => {
        const sum = 100;
        await basketManagerObj.mockToken1.approve(masset.address, sum, {
          from: standardAccounts.dummy1
        });
        await masset.mint(basketManagerObj.mockToken1.address, sum, {
          from: standardAccounts.dummy1
        });

        await token.approve(masset.address, sum, {
          from: standardAccounts.dummy1
        });

        await expectRevert(
          // should revert because fee from minting was taken
          masset.redeem(basketManagerObj.mockToken1.address, sum, {
            from: standardAccounts.dummy1
          }),
          "VM Exception while processing transaction: reverted with reason string 'ERC20: burn amount exceeds balance'"
        );
      });
    });
  });

  describe("redeemTo", async () => {
    beforeEach(async () => {
      vault = await FeesVault.new();
      masset = await MassetV3.new();
      token = await createToken(masset);
      basketManagerObj = await createBasketManager(masset, [18, 18], [1, 1]);
      await initMassetV3(
        masset,
        basketManagerObj.basketManager.address,
        token.address,
        vault.address,
        standardFees
      );
    });

    context("should fail", () => {
      it("when recipient is not valid", async () => {
        await expectRevert(
          masset.redeemTo(
            basketManagerObj.mockToken1.address,
            tokens(10),
            ZERO_ADDRESS,
            { from: standardAccounts.dummy1 }
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

        await basketManagerObj.mockToken1.approve(masset.address, sum, {
          from: standardAccounts.dummy1
        });
        await masset.mint(basketManagerObj.mockToken1.address, sum, {
          from: standardAccounts.dummy1
        });

        await token.approve(masset.address, withdrawAmount, {
          from: standardAccounts.dummy1
        });

        await masset.redeemTo(
          basketManagerObj.mockToken1.address,
          withdrawAmount,
          recipient,
          { from: standardAccounts.dummy1 }
        );

        const tokenBalance = await token.balanceOf(standardAccounts.dummy1);
        expect(tokenBalance).bignumber.to.eq("0");

        const balance = await basketManagerObj.mockToken1.balanceOf(recipient);
        expect(balance).bignumber.to.equal(
          withdrawAmount.sub(withdrawalFee),
          "should transfer bassets to correct recipient"
        );

        const vaultBalance = await token.balanceOf(vault.address);
        expect(vaultBalance).bignumber.to.eq(mintFee.add(withdrawalFee));
      });
    });
  });

  describe("redeemToBridge", async () => {
    const mintAmount = tokens(1);
    const mintFee = mintAmount.mul(standardFees.deposit).div(FEE_PRECISION);
    const mintedMassets = mintAmount.sub(mintFee);

    beforeEach(async () => {
      vault = await FeesVault.new();
      masset = await MassetV3.new();
      token = await createToken(masset);
      mockBridge = await MockBridge.new();

      basketManagerObj = await createBasketManager(
        masset,
        [18, 18],
        [1, 1],
        [mockBridge.address, mockBridge.address]
      );

      await initMassetV3(
        masset,
        basketManagerObj.basketManager.address,
        token.address,
        vault.address,
        standardFees,
        {
          from: standardAccounts.default
        }
      );

      await basketManagerObj.mockToken1.approve(masset.address, mintAmount, {
        from: standardAccounts.dummy1
      });
      await masset.mint(basketManagerObj.mockToken1.address, mintAmount, {
        from: standardAccounts.dummy1
      });
      await token.approve(masset.address, mintAmount, {
        from: standardAccounts.dummy1
      });
    });

    context("should fail", () => {
      it("when bridge is not valid", async () => {
        await basketManagerObj.basketManager.setBridge(
          basketManagerObj.mockToken1.address,
          ZERO_ADDRESS,
          {
            from: standardAccounts.default
          }
        );

        await expectRevert(
          masset.methods[
            "redeemToBridge(address,uint256,address)"
          ](
            basketManagerObj.mockToken1.address,
            mintedMassets,
            standardAccounts.dummy2,
            { from: standardAccounts.dummy1 }
          ),
          "VM Exception while processing transaction: reverted with reason string 'invalid bridge'"
        );
      });
    });

    context("should succeed", () => {
      it("if all params are valid", async () => {
        const withdrawalFee = mintedMassets
          .mul(standardFees.withdrawalBridge)
          .div(FEE_PRECISION);

        await masset.methods[
          "redeemToBridge(address,uint256,address)"
        ](
          basketManagerObj.mockToken1.address,
          mintedMassets,
          standardAccounts.dummy2,
          { from: standardAccounts.dummy1 }
        );

        const bridgeBalance = await getBalance(
          basketManagerObj.mockToken1,
          mockBridge.address
        );
        expect(bridgeBalance).to.bignumber.eq(
          mintedMassets.sub(withdrawalFee),
          "should transfer bassets to bridge"
        );

        const vaultBalance = await token.balanceOf(vault.address);
        expect(vaultBalance).bignumber.to.eq(mintFee.add(withdrawalFee));
      });
    });
  });

  describe("onTokensMinted", async () => {
    beforeEach(async () => {
      vault = await FeesVault.new();
      masset = await MassetV3.new();
      token = await createToken(masset);
      mockBridge = await MockBridge.new();

      basketManagerObj = await createBasketManager(
        masset,
        [18, 18],
        [1, 1],
        [mockBridge.address, mockBridge.address]
      );

      await initMassetV3(
        masset,
        basketManagerObj.basketManager.address,
        token.address,
        vault.address,
        standardFees
      );
    });

    context("should fail", async () => {
      it("when it's not called by bridge", async () => {
        await expectRevert(
          masset.onTokensMinted(
            tokens(1),
            basketManagerObj.mockToken1.address,
            web3.eth.abi.encodeParameters(["bytes"], [standardAccounts.dummy1]),
            { from: standardAccounts.default }
          ),
          "VM Exception while processing transaction: reverted with reason string 'only bridge may call'"
        );
      });

      it("when recipient address is invalid", async () => {
        await expectRevert(
          mockBridge.callOnTokensMinted(
            masset.address,
            tokens(1),
            basketManagerObj.mockToken1.address,
            ZERO_ADDRESS,
            {
              from: standardAccounts.default
            }
          ),
          "VM Exception while processing transaction: reverted with reason string 'Converter: Error decoding extraData'"
        );
      });

      it("when amount is zero", async () => {
        await expectRevert(
          mockBridge.callOnTokensMinted(
            masset.address,
            tokens(0),
            basketManagerObj.mockToken1.address,
            standardAccounts.dummy1,
            {
              from: standardAccounts.default
            }
          ),
          "VM Exception while processing transaction: reverted with reason string 'amount must be > 0'"
        );
      });

      it("when basset is invalid", async () => {
        await expectRevert(
          mockBridge.callOnTokensMinted(
            masset.address,
            tokens(1),
            standardAccounts.other,
            standardAccounts.dummy1,
            {
              from: standardAccounts.default
            }
          ),
          "VM Exception while processing transaction: reverted with reason string 'invalid basset'"
        );
      });

      it("when basket is out of balance", async () => {
        await basketManagerObj.basketManager.setRange(
          basketManagerObj.mockToken1.address,
          0,
          10,
          {
            from: standardAccounts.default
          }
        );

        await expectRevert(
          mockBridge.callOnTokensMinted(
            masset.address,
            tokens(10000),
            basketManagerObj.mockToken1.address,
            standardAccounts.dummy1,
            { from: standardAccounts.default }
          ),
          "VM Exception while processing transaction: reverted with reason string 'basket out of balance'"
        );
      });
    });

    context("should succeed", async () => {
      it("whit all valid params", async () => {
        const amount = tokens(1);
        const expectedFee = amount
          .mul(standardFees.depositBridge)
          .div(FEE_PRECISION);
        const expectedMassetQuantity = amount.sub(expectedFee);

        const recipient = standardAccounts.dummy1;

        const recepit = await mockBridge.callOnTokensMinted(
          masset.address,
          amount,
          basketManagerObj.mockToken1.address,
          recipient,
          { from: standardAccounts.default }
        );

        await expectEvent.inTransaction(
          recepit.tx,
          MassetV3,
          "Minted",
          {
            minter: mockBridge.address,
            recipient,
            massetQuantity: expectedMassetQuantity,
            bAsset: basketManagerObj.mockToken1.address,
            bassetQuantity: amount
          },
          {}
        );

        const balance = await token.balanceOf(recipient);
        expect(balance).bignumber.to.eq(
          expectedMassetQuantity,
          "should mint proper amount of tokens to recipient"
        );

        const vaultBalance = await token.balanceOf(vault.address);
        expect(vaultBalance).bignumber.to.eq(
          expectedFee,
          "should mint proper amount of tokens to recipient"
        );
      });
    });
  });

  describe("redeemByBridge", async () => {
    const fees = {
      ...standardFees,
      withdrawalBridge: new BN(0)
    };

    beforeEach(async () => {
      vault = await FeesVault.new();
      masset = await MassetV3.new();
      token = await createToken(masset);
      mockBridge = await MockBridge.new();

      basketManagerObj = await createBasketManager(
        masset,
        [18, 18],
        [1, 1],
        [mockBridge.address, mockBridge.address]
      );

      await initMassetV3(
        masset,
        basketManagerObj.basketManager.address,
        token.address,
        vault.address,
        fees
      );
    });

    context("should fail", async () => {
      it("when it's not called by bridge", async () => {
        await expectRevert(
          masset.redeemByBridge(
            basketManagerObj.mockToken1.address,
            tokens(1),
            standardAccounts.dummy1,
            {
              from: standardAccounts.default
            }
          ),
          "VM Exception while processing transaction: reverted with reason string 'must be called by bridge'"
        );
      });

      it("when recipient address is invalid", async () => {
        await expectRevert(
          mockBridge.callRedeemByBridge(
            masset.address,
            basketManagerObj.mockToken1.address,
            tokens(1),
            ZERO_ADDRESS,
            {
              from: standardAccounts.default
            }
          ),
          "VM Exception while processing transaction: reverted with reason string 'must be a valid recipient'"
        );
      });

      it("when amount is zero", async () => {
        await expectRevert(
          mockBridge.callRedeemByBridge(
            masset.address,
            basketManagerObj.mockToken1.address,
            tokens(0),
            standardAccounts.dummy1,
            {
              from: standardAccounts.default
            }
          ),
          "VM Exception while processing transaction: reverted with reason string 'masset quantity must be greater than 0'"
        );
      });

      it("when basset is invalid", async () => {
        await expectRevert(
          mockBridge.callRedeemByBridge(
            masset.address,
            standardAccounts.other,
            tokens(1),
            standardAccounts.dummy1,
            {
              from: standardAccounts.default
            }
          ),
          "VM Exception while processing transaction: reverted with reason string 'invalid basset'"
        );
      });

      it("when basket is out of balance", async () => {
        await basketManagerObj.basketManager.setRange(
          basketManagerObj.mockToken1.address,
          0,
          10,
          {
            from: standardAccounts.default
          }
        );

        await expectRevert(
          mockBridge.callRedeemByBridge(
            masset.address,
            basketManagerObj.mockToken1.address,
            tokens(10000),
            standardAccounts.dummy1,
            { from: standardAccounts.default }
          ),
          "VM Exception while processing transaction: reverted with reason string 'basset balance is not sufficient'"
        );
      });
    });

    context("should succeed", async () => {
      it("whit all valid params", async () => {
        const recipient = standardAccounts.dummy1;

        // ----- make a deposit to get some massets -----

        const initialToken1Balance = await basketManagerObj.mockToken1.balanceOf(
          recipient
        );
        await basketManagerObj.mockToken1.approve(
          masset.address,
          initialToken1Balance,
          {
            from: recipient
          }
        );
        await masset.mint(
          basketManagerObj.mockToken1.address,
          initialToken1Balance,
          {
            from: recipient
          }
        );

        const expectedMintFee = initialToken1Balance
          .mul(fees.deposit)
          .div(FEE_PRECISION);

        const bassetBalanceAfterMint = await basketManagerObj.mockToken1.balanceOf(
          recipient
        );
        const massetBalanceAfterMint = await token.balanceOf(recipient);

        // ----- withdraw tokens using bridge -----

        const amount = tokens(1);
        const expectedFee = amount
          .mul(fees.withdrawalBridge)
          .div(FEE_PRECISION);
        const expectedBassetQuantity = amount.sub(expectedFee);

        const recepit = await mockBridge.callRedeemByBridge(
          masset.address,
          basketManagerObj.mockToken1.address,
          amount,
          recipient,
          { from: standardAccounts.default }
        );

        await expectEvent.inTransaction(
          recepit.tx,
          MassetV3,
          "Redeemed",
          {
            redeemer: recipient,
            recipient,
            massetQuantity: amount,
            bAsset: basketManagerObj.mockToken1.address,
            bassetQuantity: expectedBassetQuantity
          },
          {}
        );

        const massetBalance = await token.balanceOf(recipient);
        expect(massetBalance).bignumber.to.eq(
          massetBalanceAfterMint.sub(amount),
          "should take proper amount of tokens from recipient"
        );

        const bassetBalance = await basketManagerObj.mockToken1.balanceOf(
          recipient
        );
        expect(bassetBalance).bignumber.to.eq(
          bassetBalanceAfterMint.add(expectedBassetQuantity),
          "should give proper amount of bassets to recipient"
        );

        const bridgeMassetBalance = await token.balanceOf(mockBridge.address);
        expect(bridgeMassetBalance).bignumber.to.eq(
          ZERO,
          "should not take any massets from bridge"
        );

        const bridgeBassetBalance = await basketManagerObj.mockToken1.balanceOf(
          mockBridge.address
        );
        expect(bridgeBassetBalance).bignumber.to.eq(
          ZERO,
          "bridge should not get any bassets"
        );

        const vaultBalance = await token.balanceOf(vault.address);
        expect(vaultBalance).bignumber.to.eq(
          expectedMintFee.add(expectedFee),
          "should use proper fee (withdrawBridgeFee)"
        );
      });
    });
  });

  describe("precision conversion", async () => {
    const basset1Factor = new BN(100);
    const basset2Factor = new BN(-1000000);

    beforeEach(async () => {
      vault = await FeesVault.new();
      masset = await MassetV3.new();
      token = await createToken(masset);
      basketManagerObj = await createBasketManager(
        masset,
        [20, 12],
        [basset1Factor, basset2Factor]
      );

      await initMassetV3(
        masset,
        basketManagerObj.basketManager.address,
        token.address,
        vault.address,
        standardFees
      );
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
        masset.address,
        initialToken1Balance,
        {
          from: standardAccounts.dummy1
        }
      );
      await masset.mint(
        basketManagerObj.mockToken1.address,
        initialToken1Balance,
        {
          from: standardAccounts.dummy1
        }
      );
      await basketManagerObj.mockToken2.approve(
        masset.address,
        initialToken2Balance,
        {
          from: standardAccounts.dummy1
        }
      );
      await masset.mint(
        basketManagerObj.mockToken2.address,
        initialToken2Balance,
        {
          from: standardAccounts.dummy1
        }
      );

      const fee = amount.mul(standardFees.deposit).div(FEE_PRECISION);

      const account1BalanceAfterMint = amount.sub(fee).mul(new BN(2));

      expect(
        await getBalance(token, standardAccounts.dummy1)
      ).bignumber.to.equal(account1BalanceAfterMint);
      expect(
        await getBalance(basketManagerObj.mockToken1, standardAccounts.dummy1)
      ).bignumber.to.equal(tokens(0));
      expect(
        await getBalance(basketManagerObj.mockToken2, standardAccounts.dummy1)
      ).bignumber.to.equal(tokens(0));

      await token.transfer(standardAccounts.dummy2, amount, {
        from: standardAccounts.dummy1
      });
      expect(
        await getBalance(token, standardAccounts.dummy1)
      ).bignumber.to.equal(account1BalanceAfterMint.sub(amount));

      await token.approve(masset.address, amount, {
        from: standardAccounts.dummy2
      });
      await masset.redeem(basketManagerObj.mockToken2.address, amount, {
        from: standardAccounts.dummy2
      });
      expect(
        await getBalance(token, standardAccounts.dummy2)
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
      const vaultBalance = await token.balanceOf(vault.address);
      expect(vaultBalance).bignumber.to.eq(totalFee);
    });
  });
});

const zeroBridges = [ZERO_ADDRESS, ZERO_ADDRESS];

async function initMassetV3(
  masset: MassetV3Instance,
  basketManagerAddress: string,
  tokenAddress: string,
  vaultAddress: string,
  fees: Fees,
  txDetails: Truffle.TransactionDetails = { from: standardAccounts.default }
): Promise<void> {
  const feesManager = await FeesManager.new();

  await feesManager.initialize(
    fees.deposit,
    fees.depositBridge,
    fees.withdrawal,
    fees.withdrawalBridge
  );

  await masset.initialize(basketManagerAddress, tokenAddress, false, txDetails);

  await masset.upgradeToV3(
    basketManagerAddress,
    tokenAddress,
    vaultAddress,
    feesManager.address,
    txDetails
  );
}

async function createBasketManager(
  masset: MassetV3Instance,
  decimals: Array<number>,
  factors: Array<number | BN>,
  bridges = zeroBridges
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
    from: standardAccounts.default
  });
  await basketManager.initialize(masset.address, {
    from: standardAccounts.default
  });
  await basketManager.addBassets(
    bassets,
    factors,
    bridges,
    mins,
    maxs,
    pauses,
    { from: standardAccounts.default }
  );

  return {
    mockToken1,
    mockToken2,
    bassets,
    basketManager
  };
}

async function createToken(masset: MassetV3Instance) {
  const token = await Token.new("Mock1", "MK1", 18);
  token.transferOwnership(masset.address);
  return token;
}

async function getBalance(
  token: TokenInstance | MockERC20Instance,
  who: string
): Promise<BN> {
  return token.balanceOf(who);
}

type BasketManagerObj = {
  mockToken1: MockERC20Instance;
  mockToken2: MockERC20Instance;
  bassets: string[];
  basketManager: BasketManagerV3Instance;
};
