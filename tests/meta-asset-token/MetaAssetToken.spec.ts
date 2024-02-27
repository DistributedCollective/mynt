import { expectRevert, expectEvent } from "@openzeppelin/test-helpers";
import { toWei, toChecksumAddress } from "web3-utils";
import {
  MockMetaAssetTokenInstance,
  MetaAssetTokenInstance,
} from "types/generated";
import { MAX_UINT256, ZERO_ADDRESS } from "@utils/constants";
import Wallet from "ethereumjs-wallet";
import { fromRpcSig } from "ethereumjs-util";
import { signTypedMessage } from "eth-sig-util";
import BN from "bn.js";
import { network, ethers, upgrades } from "hardhat";
import {
  EIP712Domain,
  Permit,
  PERMIT_TYPEHASH,
  domainSeparator,
} from "../helpers/EIP712";

const MetaAssetToken = artifacts.require("MetaAssetToken");
const MockMetaAssetToken = artifacts.require("MockMetaAssetToken");
const MockApprovalReceiver = artifacts.require("MockApprovalReceiver");
const NOT_OWNER_EXCEPTION =
  "VM Exception while processing transaction: reverted with reason string 'Ownable: caller is not the owner";

const tokenName = "Meta Asset Token";
const tokenSymbol = "MAT";
const decimals = 18;
const maxDeadline = MAX_UINT256;
const name = tokenName;
const version = "1";
const { getContractFactory } = ethers;

const buildData = (
  chainId,
  verifyingContract,
  from,
  spender,
  amount,
  nonce,
  deadline = maxDeadline
) => ({
  primaryType: "Permit",
  types: { EIP712Domain, Permit },
  domain: { name, version, chainId, verifyingContract },
  message: { owner: from, spender, value: amount, nonce, deadline },
});

contract("MetaAssetToken", async (accounts) => {
  const [owner, user, newMassetManagerProxy] = accounts;

  let token: MetaAssetTokenInstance;
  let mockToken: MockMetaAssetTokenInstance;
  let chainId;
  let admin: string;
  let massetManagerProxy: string;
  let massetManagerImplementation: string;
  let basketManagerProxy: string;
  let basketManagerImplementation: string;

  beforeEach("before all", async () => {
    admin = owner;

    const assetProxyInstance = await upgrades.deployProxy(
      await getContractFactory("MockProxyImplementationMetaAssetToken"),
      [user],
      {
        initializer: "initialize",
      }
    );

    const basketManagerProxyInstance = await upgrades.deployProxy(
      await getContractFactory("MockProxyImplementationMetaAssetToken"),
      [assetProxyInstance.address],
      {
        initializer: "initialize",
      }
    );

    massetManagerProxy = assetProxyInstance.address;
    massetManagerImplementation =
      await upgrades.erc1967.getImplementationAddress(
        assetProxyInstance.address
      );
    basketManagerProxy = basketManagerProxyInstance.address;
    basketManagerImplementation =
      await upgrades.erc1967.getImplementationAddress(
        basketManagerProxyInstance.address
      );

    token = await MetaAssetToken.new(tokenName, tokenSymbol, { from: owner });
    mockToken = await MockMetaAssetToken.new(
      tokenName,
      tokenSymbol,
      accounts[8],
      accounts[9],
      { from: owner }
    );
    await token.setMassetManagerProxy(massetManagerProxy, { from: owner });
    await token.setBasketManagerProxy(basketManagerProxy, { from: owner });
  });

  describe("deployment", async () => {
    it("should have correct name", async () => {
      expect(await token.name()).to.equal(tokenName);
    });

    it("should have correct symbol", async () => {
      expect(await token.symbol()).to.equal(tokenSymbol);
    });

    it("should have correct decimal", async () => {
      expect((await token.decimals()).toNumber()).to.equal(decimals);
    });
  });

  describe("setMassetManagerProxy", async () => {
    context("should fail", async () => {
      it("when it's not called by owner", async () => {
        await expectRevert(
          token.setMassetManagerProxy(massetManagerProxy, { from: user }),
          NOT_OWNER_EXCEPTION
        );
      });
    });
    context("should succeed", async () => {
      it("when called by owner", async () => {
        const tx = await token.setMassetManagerProxy(massetManagerProxy, {
          from: owner,
        });

        expectEvent(tx, "MassetManagerProxyChanged", {
          _newMassetManagerProxy: massetManagerProxy,
        });

        const [newAssetProxyPromised, newMassetManagerImplementationPromised] =
          await Promise.all([
            token.massetManagerProxy(),
            token.massetManagerImplementation(),
          ]);
        expect(newAssetProxyPromised).to.equal(massetManagerProxy);
        expect(newMassetManagerImplementationPromised).to.equal(
          massetManagerImplementation
        );
      });
    });
  });

  describe("setBasketManagerProxy", async () => {
    context("should fail", async () => {
      it("when it's not called by owner", async () => {
        await expectRevert(
          token.setBasketManagerProxy(basketManagerProxy, { from: user }),
          NOT_OWNER_EXCEPTION
        );
      });
    });
    context("should succeed", async () => {
      it("when called by owner", async () => {
        const tx = await token.setBasketManagerProxy(basketManagerProxy, {
          from: owner,
        });

        expectEvent(tx, "BasketManagerProxyChanged", {
          _newBasketManagerProxy: basketManagerProxy,
        });

        const [
          newBasketManagerProxyPromised,
          newBasketManagerImplementationPromised,
        ] = await Promise.all([
          token.basketManagerProxy(),
          token.basketManagerImplementation(),
        ]);
        expect(newBasketManagerProxyPromised).to.equal(basketManagerProxy);
        expect(newBasketManagerImplementationPromised).to.equal(
          basketManagerImplementation
        );
      });
    });
  });

  describe("mint", async () => {
    context("should fail", async () => {
      it("when it's not called by MassetManager proxy", async () => {
        await expectRevert(
          token.mint(user, toWei("100"), { from: user }),
          "DLLR:unauthorized MassetManager proxy"
        );
      });
    });

    context("should succeed", async () => {
      it("when it's called by presale", async () => {
        const mintAmount = toWei("100");
        const initialBalance = await token.balanceOf(user);
        expect(initialBalance.toString()).to.equal("0");

        massetManagerProxy = newMassetManagerProxy;
        await token.setMassetManagerProxy(massetManagerProxy);

        const tx = await token.mint(user, mintAmount, {
          from: massetManagerProxy,
        });
        expectEvent(tx, "Transfer", {
          from: ZERO_ADDRESS,
          to: user,
          value: mintAmount,
        });

        const latestBalance = await token.balanceOf(user);
        expect(latestBalance.toString()).to.equal(mintAmount);
      });
    });
  });

  describe("burn", async () => {
    context("should fail", async () => {
      it("when it's not called by presale or by a user", async () => {
        await expectRevert(
          token.burn(user, toWei("50"), { from: owner }),
          "DLLR:unauthorized MassetManager proxy"
        );
      });
    });

    context("should succeed", async () => {
      it("when it's called by MassetManager proxy", async () => {
        massetManagerProxy = newMassetManagerProxy;
        await token.setMassetManagerProxy(massetManagerProxy);

        const amount = toWei("50");
        await token.mint(user, amount, { from: massetManagerProxy });

        const totalSupply = await token.totalSupply();

        // amount after mint
        const initialBalance = await token.balanceOf(user);
        expect(initialBalance.toString()).to.equal(amount);
        expect(totalSupply.toString()).to.equal(initialBalance.toString());

        const tx = await token.burn(user, amount, { from: massetManagerProxy });
        expectEvent(tx, "Transfer", {
          from: user,
          to: ZERO_ADDRESS,
          value: amount,
        });

        // amount after burn
        const latestBalance = await token.balanceOf(user);
        expect(latestBalance.toString()).to.equal("0");
      });
    });
  });

  describe("transfer", async () => {
    context("transfer should fail", async () => {
      it("when recipient is zero address", async () => {
        await expectRevert(
          token.transfer(ZERO_ADDRESS, toWei("100"), { from: owner }),
          "DLLR: Invalid address. Cannot transfer DLLR to the null address."
        );
      });

      it("when recipient is MetaAsset contract address", async () => {
        await expectRevert(
          token.transfer(token.address, toWei("100"), { from: owner }),
          "DLLR: Invalid address. Cannot transfer DLLR to the null address."
        );
      });
    });

    context("should succeed", async () => {
      it("transfer to valid recipient", async () => {
        token = mockToken;
        massetManagerProxy = newMassetManagerProxy;
        await token.setMassetManagerProxy(massetManagerProxy);

        const amount = toWei("100");
        const initialBalance = await token.balanceOf(user);
        expect(initialBalance.toString()).to.equal("0");

        const tx = await token.mint(user, amount, { from: massetManagerProxy });
        expectEvent(tx, "Transfer", {
          from: ZERO_ADDRESS,
          to: user,
          value: amount,
        });

        const balanceAfterMint = await token.balanceOf(user);
        expect(balanceAfterMint.toString()).to.equal(amount);

        const tx2 = await token.transfer(owner, amount, { from: user });
        expectEvent(tx2, "Transfer", { from: user, to: owner, value: amount });

        const latestUserBalance = await token.balanceOf(user);
        expect(latestUserBalance.toString()).to.equal("0");

        const latestOwnerBalance = await token.balanceOf(owner);
        expect(latestOwnerBalance.toString()).to.equal(amount);
      });
    });
  });

  describe("transferFrom", async () => {
    context("transferFrom should fail", async () => {
      it("when recipient is zero address", async () => {
        await expectRevert(
          token.transferFrom(user, ZERO_ADDRESS, toWei("100"), { from: owner }),
          "DLLR: Invalid address. Cannot transfer DLLR to the null address"
        );
      });
    });

    context("should succeed", async () => {
      it("transferFrom to valid recipient", async () => {
        token = mockToken;
        massetManagerProxy = newMassetManagerProxy;
        await token.setMassetManagerProxy(massetManagerProxy);

        const amount = toWei("100");
        const initialBalance = await token.balanceOf(user);
        expect(initialBalance.toString()).to.equal("0");

        const tx = await token.mint(user, amount, { from: massetManagerProxy });
        expectEvent(tx, "Transfer", {
          from: ZERO_ADDRESS,
          to: user,
          value: amount,
        });

        const balanceAfterMint = await token.balanceOf(user);
        expect(balanceAfterMint.toString()).to.equal(amount);

        // approve
        await token.approve(owner, amount, { from: user });

        const tx2 = await token.transferFrom(user, owner, amount, {
          from: owner,
        });
        expectEvent(tx2, "Transfer", { from: user, to: owner, value: amount });

        const latestUserBalance = await token.balanceOf(user);
        expect(latestUserBalance.toString()).to.equal("0");

        const latestOwnerBalance = await token.balanceOf(owner);
        expect(latestOwnerBalance.toString()).to.equal(amount);
      });
    });
  });

  describe("permit", async () => {
    const ownerWallet = Wallet.generate();
    const spenderWallet = Wallet.generate();
    const ownerPermit = ownerWallet.getAddressString();
    const spender = spenderWallet.getAddressString();

    before(async () => {
      chainId = await token.getChainId();
    });

    context("should failed if", async () => {
      it("invalid signature", async () => {
        const deadline = MAX_UINT256;

        const firstValue = toWei("100");
        const firstNonce = await token.nonces(ownerPermit);

        const firstData = buildData(
          chainId,
          token.address,
          ownerPermit,
          spender,
          firstValue,
          firstNonce,
          deadline
        ) as any;
        const firstSignature = signTypedMessage(ownerWallet.getPrivateKey(), {
          data: firstData,
        });

        const { v } = fromRpcSig(firstSignature);
        const { r, s }: any = fromRpcSig(firstSignature);

        // incorrect amount
        await expectRevert(
          token.permit(ownerPermit, spender, toWei("500"), deadline, v, r, s),
          "ERC20Permit: invalid signature"
        );
      });

      it("signature expired", async () => {
        const deadline = new BN(1);

        const firstValue = toWei("100");
        const firstNonce = await token.nonces(ownerPermit);

        const firstData = buildData(
          chainId,
          token.address,
          ownerPermit,
          spender,
          firstValue,
          firstNonce,
          deadline
        ) as any;
        const firstSignature = signTypedMessage(ownerWallet.getPrivateKey(), {
          data: firstData,
        });

        const { v } = fromRpcSig(firstSignature);
        const { r, s }: any = fromRpcSig(firstSignature);

        // incorrect amount
        await expectRevert(
          token.permit(ownerPermit, spender, firstValue, deadline, v, r, s),
          "ERC20Permit: expired deadline"
        );
      });
    });

    context("success permit check", async () => {
      it("has the correct DOMAIN_SEPARATOR", async () => {
        const DOMAIN_SEPARATOR = await domainSeparator(
          name,
          version,
          chainId,
          token.address
        );
        assert.equal(
          await token.DOMAIN_SEPARATOR(),
          DOMAIN_SEPARATOR,
          "eip721: domain separator"
        );
      });

      it("can set allowance through permit", async () => {
        const deadline = MAX_UINT256;

        const firstValue = toWei("100");
        const firstNonce = await token.nonces(ownerPermit);

        const firstData = buildData(
          chainId,
          token.address,
          ownerPermit,
          spender,
          firstValue,
          firstNonce,
          deadline
        ) as any;
        const firstSignature = signTypedMessage(ownerWallet.getPrivateKey(), {
          data: firstData,
        });

        const firstECDSASig = fromRpcSig(firstSignature);
        const firstReceipt = await token.permit(
          ownerPermit,
          spender,
          firstValue,
          deadline,
          firstECDSASig.v,
          firstECDSASig.r as any,
          firstECDSASig.s as any
        );
        expectEvent(firstReceipt, "Approval", {
          owner: toChecksumAddress(ownerPermit),
          spender: toChecksumAddress(spender),
          value: firstValue,
        });
        expect(
          (await token.allowance(ownerPermit, spender)).toString()
        ).to.equal(firstValue);
        expect((await token.nonces(ownerPermit)).toString()).to.equal("1");

        const secondValue = toWei("500");
        const secondNonce = await token.nonces(ownerPermit);

        const secondData = buildData(
          chainId,
          token.address,
          ownerPermit,
          spender,
          secondValue,
          secondNonce,
          deadline
        ) as any;
        const secondSignature = signTypedMessage(ownerWallet.getPrivateKey(), {
          data: secondData,
        });

        const secondECDSASig = fromRpcSig(secondSignature);

        const secondReceipt = await token.permit(
          ownerPermit,
          spender,
          secondValue,
          deadline,
          secondECDSASig.v,
          secondECDSASig.r as any,
          secondECDSASig.s as any
        );
        expectEvent(secondReceipt, "Approval", {
          owner: toChecksumAddress(ownerPermit),
          spender: toChecksumAddress(spender),
          value: secondValue,
        });
        expect(
          (await token.allowance(ownerPermit, spender)).toString()
        ).to.equal(secondValue);
        expect((await token.nonces(ownerPermit)).toString()).to.equal("2");
      });
    });
  });

  describe("transferWithPermit", async () => {
    const ownerWallet = Wallet.generate();
    const spenderWallet = Wallet.generate();
    const ownerPermit = ownerWallet.getAddressString();
    const spender = spenderWallet.getAddressString();

    before(async () => {
      chainId = await token.getChainId();
      // funding spender wallet
      const funder = await ethers.provider.getSigner(owner);
      await funder.sendTransaction({
        to: spender,
        value: toWei("10"),
      });

      // funding massetManagerProxy address
      await funder.sendTransaction({
        to: massetManagerProxy,
        value: toWei("10"),
      });
    });

    context("transferWithPermit should fail", async () => {
      it("when signature expired", async () => {
        const deadline = new BN(1);
        const amount = toWei("100");
        const nonce = await token.nonces(ownerPermit);
        const data = buildData(
          chainId,
          token.address,
          ownerPermit,
          spender,
          amount,
          nonce,
          deadline
        ) as any;
        const signature = signTypedMessage(ownerWallet.getPrivateKey(), {
          data,
        });
        const { v } = fromRpcSig(signature);
        const { r, s }: any = fromRpcSig(signature);
        await expectRevert(
          token.transferWithPermit(
            ownerPermit,
            spender,
            amount,
            deadline,
            v,
            r,
            s
          ),
          "ERC20Permit: expired deadline"
        );
      });

      it("when recipient is zero address", async () => {
        const deadline = MAX_UINT256;
        const amount = toWei("100");
        const nonce = await token.nonces(ownerPermit);
        const data = buildData(
          chainId,
          token.address,
          ownerPermit,
          spender,
          amount,
          nonce,
          deadline
        ) as any;
        const signature = signTypedMessage(ownerWallet.getPrivateKey(), {
          data,
        });
        const { v } = fromRpcSig(signature);
        const { r, s }: any = fromRpcSig(signature);

        await network.provider.request({
          method: "hardhat_impersonateAccount",
          params: [spender],
        });
        const account = await ethers.provider.getSigner(spender);
        const tokenInstance = await ethers.getContractAt(
          "MetaAssetToken",
          token.address,
          account
        );
        await expectRevert(
          tokenInstance.transferWithPermit(
            ownerPermit,
            ZERO_ADDRESS,
            amount,
            deadline.toString(),
            v,
            r,
            s
          ),
          "DLLR: Invalid address. Cannot transfer DLLR to the null address."
        );
      });

      it("if sender got insufficient balance", async () => {
        const deadline = MAX_UINT256;
        const amount = toWei("100");
        const nonce = await token.nonces(ownerPermit);
        const data = buildData(
          chainId,
          token.address,
          ownerPermit,
          spender,
          amount,
          nonce,
          deadline
        ) as any;
        const signature = signTypedMessage(ownerWallet.getPrivateKey(), {
          data,
        });
        const { v } = fromRpcSig(signature);
        const { r, s }: any = fromRpcSig(signature);

        await network.provider.request({
          method: "hardhat_impersonateAccount",
          params: [spender],
        });

        const account = await ethers.provider.getSigner(spender);
        const tokenInstance = await ethers.getContractAt(
          "MetaAssetToken",
          token.address,
          account
        );
        await expectRevert(
          tokenInstance.transferWithPermit(
            ownerPermit,
            user,
            amount,
            deadline.toString(),
            v,
            r,
            s
          ),
          "ERC20: transfer amount exceeds balance'"
        );
      });
    });

    context("should succeed", async () => {
      it("transferFrom to valid recipient", async () => {
        const oldAssetProxyAddress = massetManagerProxy;
        const deadline = MAX_UINT256;
        const initialOwnerBalance = toWei("1000000");
        const amount = toWei("100");
        const nonce = await token.nonces(ownerPermit);
        const data = buildData(
          chainId,
          token.address,
          ownerPermit,
          spender,
          amount,
          nonce,
          deadline
        ) as any;
        const signature = signTypedMessage(ownerWallet.getPrivateKey(), {
          data,
        });
        const { v } = fromRpcSig(signature);
        const { r, s }: any = fromRpcSig(signature);

        await network.provider.request({
          method: "hardhat_impersonateAccount",
          params: [spender],
        });
        massetManagerProxy = newMassetManagerProxy;
        await token.setMassetManagerProxy(massetManagerProxy);
        await token.mint(ownerPermit, initialOwnerBalance, {
          from: massetManagerProxy,
        });

        await token.setMassetManagerProxy(oldAssetProxyAddress);

        const userInitialBalance = await token.balanceOf(user);
        const ownerInitialBalance = await token.balanceOf(ownerPermit);
        const spenderInitialAllowance = await token.allowance(
          ownerPermit,
          spender
        );
        expect(userInitialBalance.toString()).to.equal("0");
        expect(spenderInitialAllowance.toString()).to.equal("0");

        const account = await ethers.provider.getSigner(spender);
        const tokenInstance = await ethers.getContractAt(
          "MetaAssetToken",
          token.address,
          account
        );
        await tokenInstance.transferWithPermit(
          ownerPermit,
          user,
          amount,
          deadline.toString(),
          v,
          r,
          s
        );

        const userLatestBalance = await token.balanceOf(user);
        const ownerLatestBalance = await token.balanceOf(ownerPermit);
        const spenderLatestAllowance = await token.allowance(
          ownerPermit,
          spender
        );
        expect(userLatestBalance.toString()).to.equal(amount);
        expect(spenderLatestAllowance.toString()).to.equal("0");
        expect(ownerLatestBalance.toString()).to.equal(
          ownerInitialBalance.sub(new BN(amount)).toString()
        );
      });

      it("permit should not be performed if Owner already have the allowance", async () => {
        const oldAssetProxyAddress = massetManagerProxy;
        const deadline = MAX_UINT256;
        const initialOwnerBalance = toWei("1000000");
        const amount = toWei("100");
        const nonce = await token.nonces(ownerPermit);
        const data = buildData(
          chainId,
          token.address,
          ownerPermit,
          spender,
          amount,
          nonce,
          deadline
        ) as any;
        const signature = signTypedMessage(ownerWallet.getPrivateKey(), {
          data,
        });
        const { v } = fromRpcSig(signature);
        const { r, s }: any = fromRpcSig(signature);

        await network.provider.request({
          method: "hardhat_impersonateAccount",
          params: [spender],
        });
        massetManagerProxy = newMassetManagerProxy;
        await token.setMassetManagerProxy(massetManagerProxy);
        await token.mint(ownerPermit, initialOwnerBalance, {
          from: massetManagerProxy,
        });

        await token.setMassetManagerProxy(oldAssetProxyAddress);

        const userInitialBalance = await token.balanceOf(user);
        const ownerInitialBalance = await token.balanceOf(ownerPermit);
        const spenderInitialAllowance = await token.allowance(
          ownerPermit,
          spender
        );
        expect(userInitialBalance.toString()).to.equal("0");
        expect(spenderInitialAllowance.toString()).to.equal("0");

        const account = await ethers.provider.getSigner(spender);
        const tokenInstance = await ethers.getContractAt(
          "MetaAssetToken",
          token.address,
          account
        );

        await tokenInstance.permit(ownerPermit, spender, amount, deadline.toString(), v, r, s)
        await tokenInstance.transferWithPermit(
          ownerPermit,
          user,
          amount,
          deadline.toString(),
          v,
          r,
          s
        );

        const userLatestBalance = await token.balanceOf(user);
        const ownerLatestBalance = await token.balanceOf(ownerPermit);
        const spenderLatestAllowance = await token.allowance(
          ownerPermit,
          spender
        );
        expect(userLatestBalance.toString()).to.equal(amount);
        expect(spenderLatestAllowance.toString()).to.equal("0");
        expect(ownerLatestBalance.toString()).to.equal(
          ownerInitialBalance.sub(new BN(amount)).toString()
        );
      });
    });
  });

  describe("approveAndCall", async () => {
    let approvalReceiver;

    before(async () => {
      approvalReceiver = await MockApprovalReceiver.new();
    });

    it("should approve for transfer and call the receiver", async () => {
      const amount = toWei("50");
      const tx = await token.approveAndCall(
        approvalReceiver.address,
        amount,
        "0x1234"
      );
      await expectEvent(tx, "Approval", {
        owner,
        spender: approvalReceiver.address,
        value: amount,
      });
      expect(await approvalReceiver.sender(), "sender").eq(owner);
      expect((await approvalReceiver.amount()).toString(), "amount").eq(amount);
      expect(await approvalReceiver.token(), "token").eq(token.address);
      expect(await approvalReceiver.data(), "data").eq("0x1234");
    });
  });
});
