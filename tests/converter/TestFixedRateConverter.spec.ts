import { expectRevert } from "@openzeppelin/test-helpers";
import { ZERO_ADDRESS, FEE_PRECISION, ZERO } from "@utils/constants";
import { BN } from "@utils/tools";
import envSetup from "@utils/env_setup";
const Token = artifacts.require("Token");
const MockMyntToken = artifacts.require("MockMyntToken");
const FixedRateConverter = artifacts.require("FixedRateConverter");
const { toWei } = web3.utils;
const { expect } = envSetup.configure();

contract("FixedRateConverter", async (accounts) => {
  const [owner, user] = accounts;

  let fixedRateConverter: FixedRateConverter;
  let sovToken: TokenInstance;
  let myntToken: TokenInstance;
  let conversionFeeRate = new BN(4723550439442834); // 0.004723550439442834
  let initialSovAmount = toWei("1000000");
  let initialMyntAmount = toWei("10000000000");

  beforeEach("before all", async () => {
    sovToken = await Token.new("SOV", "SOV", 18);
    myntToken = await MockMyntToken.new("MYNT Token", "MYNT", 18);
    fixedRateConverter = await FixedRateConverter.new(myntToken.address, sovToken.address, conversionFeeRate);

    /** Mint SOV & MYNT */
    await sovToken.mint(owner, initialSovAmount);
    await myntToken.mint(owner, initialMyntAmount);

    /** Supply SOV to the converter contract */
    await sovToken.transfer(fixedRateConverter.address, initialSovAmount);
  });

  describe("initialize", async () => {
    context("should succeed", async () => {
      it("should initialized successfully", async () => {
        const admin = await fixedRateConverter.admin();
        const sovTokenAddress = await fixedRateConverter.sovContractAddress();
        const myntTokenAddress = await fixedRateConverter.myntContractAddress();

        expect(admin).to.equal(owner);
        expect(sovTokenAddress).to.equal(sovToken.address);
        expect(myntTokenAddress).to.equal(myntToken.address);
      });

      it("setAdmin should set the admin successfully", async () => {
        let admin = await fixedRateConverter.admin();
        expect(admin).to.equal(owner);
        const newAdmin = accounts[3];
        await fixedRateConverter.setAdmin(newAdmin);
        admin = await fixedRateConverter.admin();

        expect(admin).to.equal(newAdmin);
      });

      it("setMyntContractAddress should set the mynt contract address successfully", async () => {
        let myntTokenAddress = await fixedRateConverter.myntContractAddress();
        expect(myntTokenAddress).to.equal(myntToken.address);
        const newMyntToken = await Token.new("New MYNT", "NMYNT", 18);
        await fixedRateConverter.setMyntContractAddress(newMyntToken.address);
        myntTokenAddress = await fixedRateConverter.myntContractAddress();

        expect(myntTokenAddress).to.equal(newMyntToken.address);
      });
    });

    context("should revert", async () => {
      it("setAdmin should revert if set zero address", async () => {
        let admin = await fixedRateConverter.admin();
        expect(admin).to.equal(owner);
        const newAdmin = ZERO_ADDRESS;
        await expectRevert(fixedRateConverter.setAdmin(newAdmin), "Invalid address");
      });

      it("setAdmin should revert if set by non-admin address", async () => {;
        const newAdmin = accounts[3];
        await expectRevert(fixedRateConverter.setAdmin(newAdmin, {from: accounts[3]}), "unauthorized");
      });

      it("setMyntContractAddress should revert if set by non-admin address", async () => {
        const newMyntToken = await Token.new("New MYNT", "NMYNT", 18);
        await expectRevert(fixedRateConverter.setMyntContractAddress(newMyntToken.address, {from: accounts[3]}), "unauthorized");
      });
    });
  });

  describe("convert", async () => {
    context("should success", async () => {
      it("convertAmount should return correct value", async () => {
        const myntAmount = toWei("100");
        const precision = new BN(toWei("1"));
        const convertedSovAmount = await fixedRateConverter.convertAmount(myntAmount);
        expect(convertedSovAmount.toString()).to.equal(new BN(myntAmount.toString()).mul(conversionFeeRate).div(precision));
      })

      it("convertMax should return correct value", async () => {
        const sovBalanceOfConverter = await sovToken.balanceOf(fixedRateConverter.address);
        const precision = new BN(toWei("1"));
        const maxConvertedMynt = await fixedRateConverter.convertMax();
        expect(maxConvertedMynt.toString()).to.equal(sovBalanceOfConverter.mul(precision).div(conversionFeeRate));
      })

      it("should successfully do conversion", async () => {
        const sender = accounts[0];
        const previousSenderMyntBalance = await myntToken.balanceOf(sender);
        const previousSenderSovBalance = await sovToken.balanceOf(sender);

        const previousConverterMyntBalance = await myntToken.balanceOf(fixedRateConverter.address);
        const previousConverterSovBalance = await sovToken.balanceOf(fixedRateConverter.address);

        const myntToConvert = toWei("100");
        const expectedSov = await fixedRateConverter.convertAmount(myntToConvert);
        await myntToken.approve(fixedRateConverter.address, myntToConvert);
        await fixedRateConverter.convert(myntToConvert, {from: sender});

        const latestSenderMyntBalance = await myntToken.balanceOf(sender);
        const latestSenderSovBalance = await sovToken.balanceOf(sender);

        const latestConverterMyntBalance = await myntToken.balanceOf(fixedRateConverter.address);
        const latestConverterSovBalance = await sovToken.balanceOf(fixedRateConverter.address);
        
        expect(latestSenderSovBalance.sub(previousSenderSovBalance)).to.equal(expectedSov);
        expect(previousSenderMyntBalance.sub(latestSenderMyntBalance)).to.equal(myntToConvert);

        expect(previousConverterSovBalance.sub(latestConverterSovBalance)).to.equal(expectedSov);
        expect(previousConverterMyntBalance.sub(latestConverterMyntBalance)).to.equal(0);
      })
    })

    context("should revert", async () => {
      it("should revert to convert if sov balance does not sufficient in converter contract", async () => {
        const sender = accounts[0];
        const myntToConvert = initialMyntAmount;
        await myntToken.approve(fixedRateConverter.address, myntToConvert);
        await expectRevert(fixedRateConverter.convert(myntToConvert, {from: sender}), "ERC20: transfer amount exceeds balance");
      })

      it("should revert to convert if sov balance does not sufficient in converter contract", async () => {
        const sender = accounts[0];
        const myntToConvert = initialMyntAmount;
        await myntToken.approve(fixedRateConverter.address, myntToConvert);
        await expectRevert(fixedRateConverter.convert(myntToConvert, {from: sender}), "ERC20: transfer amount exceeds balance");
      })

      it("should revert if try to convert 0 mynt", async () => {
        const sender = accounts[0];
        const myntToConvert = 0;
        await myntToken.approve(fixedRateConverter.address, myntToConvert);
        await expectRevert(fixedRateConverter.convert(myntToConvert, {from: sender}), "Error: amount must be > 0");
      })

      it("should revert if try to convert mynt amount > the sender balance", async () => {
        const sender = accounts[0];
        const myntToConvert = new BN(initialMyntAmount).add(new BN(1));
        await myntToken.approve(fixedRateConverter.address, myntToConvert);
        await expectRevert(fixedRateConverter.convert(myntToConvert, {from: sender}), "Error: amount exceeds MYNT balance");
      })
    })
  })

  describe("withdrawSov", async () => {
    context("should success", async () => {
      it("should successfully withdrawSov", async () => {
        const admin = accounts[0];
        const previousConverterSovBalance = await sovToken.balanceOf(fixedRateConverter.address);
        const previousSenderSovBalance = await sovToken.balanceOf(admin);
        await fixedRateConverter.withdrawSov({from: admin})

        const latestConverterSovBalance = await sovToken.balanceOf(fixedRateConverter.address);
        const latestSenderSovBalance = await sovToken.balanceOf(admin);

        expect(latestSenderSovBalance.sub(previousSenderSovBalance)).to.equal(previousConverterSovBalance);
        expect(latestConverterSovBalance).to.equal(0);
      })
    })

    context("should revert", async () => {
      it("should revert if withdrawSov called by non-admin contract", async () => {
        const nonAdmin = accounts[1];
        await expectRevert(fixedRateConverter.withdrawSov({from: nonAdmin}), "unauthorized");
      })
    })
  })
});
