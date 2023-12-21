import { toWei } from "web3-utils";
import { expectRevert, expectEvent } from "@openzeppelin/test-helpers";

import { BN } from "@utils/tools";
import envSetup from "@utils/env_setup";
import { ZERO, ZERO_ADDRESS } from "@utils/constants";
import { StandardAccounts } from "@utils/standardAccounts";
import { BasketManagerV3Instance, MockERC20Instance } from "types/generated";

const MockERC20 = artifacts.require("MockERC20");
const BasketManagerV3 = artifacts.require("BasketManagerV3");

const { expect } = envSetup.configure();

const tokens = (amount: string | number): BN => toWei(new BN(amount), "ether");

contract("BasketManagerV3", async (accounts) => {
  const [owner, user, massetManagerMock] = accounts;

  const sa = new StandardAccounts(accounts);
  const factors = [1, 1];
  const mins = [10, 10];
  const maxs = [100, 100];
  const pauses = [false, false];

  let basketManager: BasketManagerV3Instance;
  let mockToken1: MockERC20Instance;
  let mockToken2: MockERC20Instance;

  before("before all", async () => {
    basketManager = await BasketManagerV3.new();
  });

  describe("checkBasketBalanceForDeposit", async () => {
    beforeEach("before each", async () => {
      basketManager = await BasketManagerV3.new({ from: owner });

      mockToken1 = await MockERC20.new("", "", 18, sa.dummy1, tokens(100), {
        from: owner,
      });
      mockToken2 = await MockERC20.new("", "", 18, sa.dummy1, tokens(100), {
        from: owner,
      });

      await basketManager.initialize(massetManagerMock, { from: owner });
    });

    context("should fail", async () => {
      it("when bAsset is not valid", async () => {
        await expectRevert(
          basketManager.checkBasketBalanceForDeposit(
            mockToken1.address,
            tokens(10)
          ),
          "VM Exception while processing transaction: reverted with reason string 'invalid basset'"
        );
      });

      it("when bAsset is paused", async () => {
        await basketManager.addBasset(mockToken1.address, 1, 10, 100, true, {
          from: owner,
        });

        await expectRevert(
          basketManager.checkBasketBalanceForDeposit(
            mockToken1.address,
            tokens(10)
          ),
          "VM Exception while processing transaction: reverted with reason string 'basset is paused'"
        );
      });
    });

    context("should succeed", async () => {
      let bassets: string[];

      beforeEach("before each", async () => {
        bassets = [mockToken1.address, mockToken2.address];

        await basketManager.addBassets(bassets, factors, mins, maxs, pauses, {
          from: owner,
        });
      });

      context("should return true", async () => {
        it("when basket balance is sufficient", async () => {
          await mockToken1.giveMe(tokens(1), { from: massetManagerMock });
          await mockToken2.giveMe(tokens(100), { from: massetManagerMock });

          const result = await basketManager.checkBasketBalanceForDeposit(
            bassets[0],
            tokens(1)
          );
          expect(result).to.equal(true);
        });
      });

      context("should return false", async () => {
        it("when basket balance is not sufficient", async () => {
          const result = await basketManager.checkBasketBalanceForDeposit(
            bassets[0],
            10
          );
          expect(result).to.equal(false);
        });

        it("with ratio bigger than max", async () => {
          await mockToken1.giveMe(tokens(10), { from: massetManagerMock });
          await mockToken2.giveMe(tokens(10), { from: massetManagerMock });

          const result = await basketManager.checkBasketBalanceForDeposit(
            bassets[0],
            tokens(1)
          );
          expect(result).to.equal(false);
        });
      });
    });
  });

  describe("checkBasketBalanceForWithdrawal", async () => {
    beforeEach("before each", async () => {
      mockToken1 = await MockERC20.new("", "", 18, sa.dummy1, tokens(100), {
        from: owner,
      });
      mockToken2 = await MockERC20.new("", "", 18, sa.dummy1, tokens(100), {
        from: owner,
      });

      basketManager = await BasketManagerV3.new({ from: owner });
      await basketManager.initialize(massetManagerMock, { from: owner });
    });

    context("should fail", async () => {
      it("when bAsset is not valid", async () => {
        await expectRevert(
          basketManager.checkBasketBalanceForWithdrawal(
            mockToken1.address,
            tokens(10)
          ),
          "VM Exception while processing transaction: reverted with reason string 'invalid basset'"
        );
      });

      it("when bAsset is paused", async () => {
        await basketManager.addBasset(mockToken1.address, 1, 10, 100, true, {
          from: owner,
        });

        await expectRevert(
          basketManager.checkBasketBalanceForWithdrawal(
            mockToken1.address,
            tokens(10)
          ),
          "VM Exception while processing transaction: reverted with reason string 'basset is paused'"
        );
      });

      it("when bAsset balance is not sufficient", async () => {
        await basketManager.addBasset(mockToken1.address, 1, 10, 100, false, {
          from: owner,
        });

        await expectRevert(
          basketManager.checkBasketBalanceForWithdrawal(
            mockToken1.address,
            tokens(10)
          ),
          "VM Exception while processing transaction: reverted with reason string 'basset balance is not sufficient'"
        );
      });
    });

    context("should succeed", async () => {
      let bassets: string[];

      beforeEach("before each", async () => {
        bassets = [mockToken1.address, mockToken2.address];
        await basketManager.addBassets(bassets, factors, mins, maxs, pauses, {
          from: owner,
        });
      });

      context("should return true", async () => {
        it("with proper calculated ratio", async () => {
          await mockToken1.giveMe(tokens(1000), { from: massetManagerMock });
          await mockToken2.giveMe(tokens(10), { from: massetManagerMock });

          const result = await basketManager.checkBasketBalanceForWithdrawal(
            bassets[0],
            tokens(10)
          );
          expect(result).to.equal(true);
        });

        it("with zero minimum and full withdrawal", async () => {
          await mockToken1.giveMe(tokens(10), { from: massetManagerMock });

          await basketManager.setRange(bassets[0], 0, 1000, { from: owner });
          const result = await basketManager.checkBasketBalanceForWithdrawal(
            bassets[0],
            tokens(10)
          );
          expect(result).to.equal(true);
        });
      });

      context("should return false", async () => {
        it("with ratio smaller than min", async () => {
          await mockToken1.giveMe(tokens(10), { from: massetManagerMock });
          await mockToken2.giveMe(tokens(1000), { from: massetManagerMock });

          const result = await basketManager.checkBasketBalanceForWithdrawal(
            bassets[0],
            tokens(10)
          );
          expect(result).to.equal(false);
        });

        it("with non-zero minimum and full withdrawal", async () => {
          await mockToken1.giveMe(tokens(10), { from: massetManagerMock });

          await basketManager.setRange(bassets[0], 10, 1000, { from: owner });
          const result = await basketManager.checkBasketBalanceForWithdrawal(
            bassets[0],
            tokens(10)
          );
          expect(result).to.equal(false);
        });
      });
    });
  });

  describe("convertBassetToMassetQuantity", async () => {
    context("should fail", async () => {
      it("when bAsset is invalid", async () => {
        mockToken1 = await MockERC20.new("", "", 18, sa.dummy1, tokens(100), {
          from: owner,
        });

        await expectRevert(
          basketManager.convertBassetToMassetQuantity(
            mockToken1.address,
            tokens(10)
          ),
          "VM Exception while processing transaction: reverted with reason string 'invalid basset'"
        );
      });
    });

    context("should succeed", async () => {
      beforeEach("before each", async () => {
        mockToken1 = await MockERC20.new("", "", 18, sa.dummy1, tokens(100), {
          from: owner,
        });

        basketManager = await BasketManagerV3.new({ from: owner });
        await basketManager.initialize(massetManagerMock, { from: owner });
      });

      it("works fine with factor equal 1", async () => {
        await basketManager.addBasset(mockToken1.address, 1, 10, 100, false, {
          from: owner,
        });
        const { massetQuantity, bassetQuantity } =
          await basketManager.convertBassetToMassetQuantity(
            mockToken1.address,
            tokens(10000)
          );
        const expectedMassetAmount = tokens(10000);
        expect(massetQuantity).bignumber.to.eq(expectedMassetAmount);
        expect(bassetQuantity).bignumber.to.eq(expectedMassetAmount);
      });

      it("works fine with positive factor", async () => {
        const factor = 10;
        await basketManager.addBasset(
          mockToken1.address,
          factor,
          10,
          100,
          false,
          { from: owner }
        );

        const massetAmount = await basketManager.convertBassetToMassetQuantity(
          mockToken1.address,
          tokens(100)
        );
        const expectedMassetAmount = tokens(100).div(new BN(factor));

        expect(massetAmount[0]).bignumber.to.eq(expectedMassetAmount);
      });

      it("works fine when amount don't divide evenly", async () => {
        const factor = 10;
        await basketManager.addBasset(
          mockToken1.address,
          factor,
          10,
          100,
          false,
          { from: owner }
        );

        const { massetQuantity, bassetQuantity } =
          await basketManager.convertBassetToMassetQuantity(
            mockToken1.address,
            15
          );
        const expectedMassetAmount = "1";

        expect(massetQuantity).bignumber.to.eq(expectedMassetAmount);
        expect(bassetQuantity).bignumber.to.eq("10");
      });

      it("works fine with negative factor", async () => {
        const factor = -10;
        await basketManager.addBasset(
          mockToken1.address,
          factor,
          10,
          100,
          false,
          { from: owner }
        );

        const massetAmount = await basketManager.convertBassetToMassetQuantity(
          mockToken1.address,
          tokens(100)
        );
        const expectedMassetAmount = tokens(100).mul(new BN(-factor));

        expect(massetAmount[0]).bignumber.to.eq(expectedMassetAmount);
      });
    });
  });

  describe("convertMassetToBassetQuantity", async () => {
    context("should fail", async () => {
      it("when bAsset is invalid", async () => {
        mockToken1 = await MockERC20.new("", "", 18, sa.dummy1, tokens(100), {
          from: owner,
        });

        await expectRevert(
          basketManager.convertMassetToBassetQuantity(
            mockToken1.address,
            tokens(10)
          ),
          "VM Exception while processing transaction: reverted with reason string 'invalid basset'"
        );
      });
    });

    context("should succeed", async () => {
      beforeEach("before each", async () => {
        mockToken1 = await MockERC20.new("", "", 18, sa.dummy1, tokens(100), {
          from: owner,
        });

        basketManager = await BasketManagerV3.new({ from: owner });
        await basketManager.initialize(massetManagerMock, { from: owner });
      });

      it("works fine with factor equal 1", async () => {
        await basketManager.addBasset(mockToken1.address, 1, 10, 100, false, {
          from: owner,
        });
        const { bassetQuantity } =
          await basketManager.convertMassetToBassetQuantity(
            mockToken1.address,
            tokens(10)
          );
        const expectedBassetAmount = tokens(10);

        expect(bassetQuantity).bignumber.to.eq(expectedBassetAmount);
      });

      it("works fine when amount don't divide evenly", async () => {
        await basketManager.addBasset(
          mockToken1.address,
          -100,
          10,
          100,
          false,
          { from: owner }
        );
        const { bassetQuantity, massetQuantity } =
          await basketManager.convertMassetToBassetQuantity(
            mockToken1.address,
            5
          );
        const expectedBassetAmount = "0";

        expect(bassetQuantity).bignumber.to.eq(expectedBassetAmount);
        expect(massetQuantity).bignumber.to.eq("0");
      });

      it("works fine with positive factor", async () => {
        const factor = 10;
        await basketManager.addBasset(
          mockToken1.address,
          factor,
          10,
          100,
          false,
          { from: owner }
        );

        const { bassetQuantity } =
          await basketManager.convertMassetToBassetQuantity(
            mockToken1.address,
            tokens(100)
          );
        const expectedBassetAmount = tokens(100).mul(new BN(factor));

        expect(bassetQuantity).bignumber.to.eq(expectedBassetAmount);
      });

      it("works fine with negative factor", async () => {
        const factor = -10;
        await basketManager.addBasset(
          mockToken1.address,
          factor,
          10,
          100,
          false,
          { from: owner }
        );

        const { bassetQuantity } =
          await basketManager.convertMassetToBassetQuantity(
            mockToken1.address,
            tokens(100)
          );
        const expectedBassetAmount = tokens(100).div(new BN(-factor));

        expect(bassetQuantity).bignumber.to.eq(expectedBassetAmount);
      });
    });
  });

  describe("getTotalMassetBalance", async () => {
    let bassets: string[];

    beforeEach("before each", async () => {
      mockToken1 = await MockERC20.new("", "", 18, sa.dummy1, tokens(100), {
        from: owner,
      });
      mockToken2 = await MockERC20.new("", "", 18, sa.dummy1, tokens(100), {
        from: owner,
      });
      bassets = [mockToken1.address, mockToken2.address];

      basketManager = await BasketManagerV3.new({ from: owner });
      await basketManager.initialize(massetManagerMock, { from: owner });
    });

    it("returns 0 with no bassets", async () => {
      const totalBalance = await basketManager.getTotalMassetBalance();
      expect(totalBalance).bignumber.to.eq(ZERO);
    });

    it("returns 0 with empty balance of bassets", async () => {
      await basketManager.addBassets(bassets, factors, mins, maxs, pauses, {
        from: owner,
      });

      const totalBalance = await basketManager.getTotalMassetBalance();
      expect(totalBalance).bignumber.to.eq(ZERO);
    });

    it("properly calculates total mAasset balance", async () => {
      await basketManager.addBassets(bassets, factors, mins, maxs, pauses, {
        from: owner,
      });
      await mockToken1.giveMe(tokens(10), { from: massetManagerMock });
      await mockToken2.giveMe(tokens(1000), { from: massetManagerMock });

      const expectedTotalBalance = tokens(10).add(tokens(1000));
      const totalBalance = await basketManager.getTotalMassetBalance();
      expect(totalBalance).bignumber.to.eq(expectedTotalBalance);
    });
  });

  describe("addBasset", async () => {
    beforeEach("before each", async () => {
      mockToken1 = await MockERC20.new("", "", 18, sa.dummy1, tokens(100), {
        from: owner,
      });

      basketManager = await BasketManagerV3.new({ from: owner });
      await basketManager.initialize(massetManagerMock, { from: owner });
    });

    context("should fail", async () => {
      it("when it's not called by the owner", async () => {
        await expectRevert(
          basketManager.addBasset(mockToken1.address, 1, 10, 100, false, {
            from: user,
          }),
          "VM Exception while processing transaction: reverted with reason string 'Ownable: caller is not the owner'"
        );
      });

      it("when basset is zero address", async () => {
        await expectRevert(
          basketManager.addBasset(ZERO_ADDRESS, 1, 10, 100, false, {
            from: owner,
          }),
          "VM Exception while processing transaction: reverted with reason string 'invalid basset address'"
        );
      });

      it("when basset already exists", async () => {
        await basketManager.addBasset(mockToken1.address, 1, 10, 100, false, {
          from: owner,
        });
        await expectRevert(
          basketManager.addBasset(mockToken1.address, 1, 10, 100, false, {
            from: owner,
          }),
          "VM Exception while processing transaction: reverted with reason string 'basset already exists'"
        );
      });
    });

    context("should succeed", async () => {
      it("with all valid params", async () => {
        const { tx, receipt } = await basketManager.addBasset(
          mockToken1.address,
          1,
          10,
          100,
          false,
          { from: owner }
        );

        await expectEvent(receipt, "BassetAdded", {
          basset: mockToken1.address,
        });

        await expectEvent.inTransaction(
          tx,
          BasketManagerV3,
          "FactorChanged",
          { basset: mockToken1.address, factor: "1" },
          {}
        );

        await expectEvent.inTransaction(
          tx,
          BasketManagerV3,
          "RangeChanged",
          { basset: mockToken1.address, min: "10", max: "100" },
          {}
        );
        await expectEvent.inTransaction(
          tx,
          BasketManagerV3,
          "PausedChanged",
          { basset: mockToken1.address, paused: false },
          {}
        );

        const { 0: min, 1: max } = await basketManager.getRange(
          mockToken1.address
        );

        expect(min.toString()).to.equal("10");
        expect(max.toString()).to.equal("100");
        expect(
          (await basketManager.getFactor(mockToken1.address)).toString()
        ).to.equal("1");
        expect(await basketManager.getPaused(mockToken1.address)).to.equal(
          false
        );
      });
    });
  });

  describe("addBassets", async () => {
    beforeEach(async () => {
      mockToken1 = await MockERC20.new("", "", 18, sa.dummy1, tokens(100), {
        from: owner,
      });

      basketManager = await BasketManagerV3.new({ from: owner });
      await basketManager.initialize(massetManagerMock, { from: owner });
    });

    it("adds multiple bassets correctly", async () => {
      const bassets = [mockToken1.address, mockToken2.address];

      const { tx } = await basketManager.addBassets(
        bassets,
        factors,
        mins,
        maxs,
        pauses,
        { from: owner }
      );

      await expectEvent.inTransaction(tx, BasketManagerV3, "BassetAdded", {
        basset: bassets[0],
      });
      await expectEvent.inTransaction(tx, BasketManagerV3, "BassetAdded", {
        basset: bassets[1],
      });

      expect(await basketManager.isValidBasset(bassets[0])).to.equal(true);
      expect(await basketManager.isValidBasset(bassets[1])).to.equal(true);
    });
  });

  describe("setFactor", async () => {
    beforeEach("before each", async () => {
      basketManager = await BasketManagerV3.new({ from: owner });

      mockToken1 = await MockERC20.new("", "", 18, sa.dummy1, tokens(100), {
        from: owner,
      });

      await basketManager.initialize(massetManagerMock, { from: owner });
      await basketManager.addBasset(mockToken1.address, 1, 10, 100, false, {
        from: owner,
      });
    });

    context("should fail", async () => {
      it("when factor is zero", async () => {
        await expectRevert(
          basketManager.setFactor(mockToken1.address, 0, { from: owner }),
          "VM Exception while processing transaction: reverted with reason string 'invalid factor'"
        );
      });

      it("when factor is not a power of 10", async () => {
        await expectRevert(
          basketManager.setFactor(mockToken1.address, 2, { from: owner }),
          "VM Exception while processing transaction: reverted with reason string 'factor must be power of 10'"
        );

        await expectRevert(
          basketManager.setFactor(mockToken1.address, 110, { from: owner }),
          "VM Exception while processing transaction: reverted with reason string 'factor must be power of 10'"
        );
      });
    });

    context("should succeed", async () => {
      it("when factor is 1", async () => {
        const factor = new BN("1");
        const { receipt } = await basketManager.setFactor(
          mockToken1.address,
          factor,
          { from: owner }
        );
        const setFactor = await basketManager.getFactor(mockToken1.address);

        expect(setFactor.eq(factor)).to.equal(true);
        await expectEvent(receipt, "FactorChanged", {
          basset: mockToken1.address,
          factor,
        });
      });

      it("when factor is a power of 10", async () => {
        const factor = new BN("1000");
        await basketManager.setFactor(mockToken1.address, factor, {
          from: owner,
        });
        const setFactor = await basketManager.getFactor(mockToken1.address);

        expect(setFactor.eq(factor)).to.equal(true);
      });

      it("when factor is negative", async () => {
        const factor = new BN("-100000");
        await basketManager.setFactor(mockToken1.address, factor, {
          from: owner,
        });
        const setFactor = await basketManager.getFactor(mockToken1.address);

        expect(setFactor.eq(factor)).to.equal(true);
      });
    });
  });

  describe("removeBasset", async () => {
    beforeEach("before each", async () => {
      basketManager = await BasketManagerV3.new({ from: owner });

      mockToken1 = await MockERC20.new("", "", 18, sa.dummy1, tokens(100), {
        from: owner,
      });

      await basketManager.initialize(massetManagerMock, { from: owner });
      await basketManager.addBasset(mockToken1.address, 1, 10, 100, false, {
        from: owner,
      });
    });

    context("should fail", async () => {
      it("when it's not called by the owner", async () => {
        await expectRevert(
          basketManager.removeBasset(mockToken1.address, { from: user }),
          "VM Exception while processing transaction: reverted with reason string 'Ownable: caller is not the owner'"
        );
      });

      it("when balance is not empty", async () => {
        await mockToken1.giveMe(tokens(10), { from: massetManagerMock });
        await expectRevert(
          basketManager.removeBasset(mockToken1.address, { from: owner }),
          "VM Exception while processing transaction: reverted with reason string 'balance not zero'"
        );
      });

      it("when basset is invalid", async () => {
        await expectRevert(
          basketManager.removeBasset(sa.other, { from: owner }),
          "VM Exception while processing transaction: reverted with reason string 'invalid basset'"
        );
      });
    });

    context("should succeed", async () => {
      it("with all valid params", async () => {
        const bassetToRemove = mockToken1.address;

        const bassetsListBefore = await basketManager.getBassets();
        expect(bassetsListBefore).to.contain(bassetToRemove);

        const { receipt } = await basketManager.removeBasset(bassetToRemove, {
          from: owner,
        });

        const isValid = await basketManager.isValidBasset(bassetToRemove);
        expect(isValid).to.equal(false);

        const bassetsListAfter = await basketManager.getBassets();
        expect(bassetsListAfter).not.to.contain(bassetToRemove);

        await expectEvent(receipt, "BassetRemoved", { basset: bassetToRemove });
      });
    });
  });
});
