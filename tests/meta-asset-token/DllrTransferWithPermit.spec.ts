import { expectRevert, expectEvent } from "@openzeppelin/test-helpers";
import { toWei, toChecksumAddress } from "web3-utils";
import {
  MockMetaAssetTokenInstance,
  MetaAssetTokenInstance,
  DllrTransferWithPermitInstance,
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
const DllrTransferWithPermit = artifacts.require("DllrTransferWithPermit");
const NOT_OWNER_EXCEPTION =
  "VM Exception while processing transaction: reverted with reason string 'Ownable: caller is not the owner";

const dllrTokenName = "Sovryn Dollar";
const dllrTokenSymbol = "DLLR";
const tokenName = "Sovryn Dollar";
const tokenSymbol = "DLLR";
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

contract("DllrTransferWithPermit", async (accounts) => {
  const [owner, user, newMassetManagerProxy] = accounts;

  let dllr: MetaAssetTokenInstance;
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

    dllr = await MetaAssetToken.new(dllrTokenName, dllrTokenSymbol, {
      from: owner,
    });

    token = await DllrTransferWithPermit.new();
    await token.initialize(dllr.address, { from: owner });

    mockToken = await MockMetaAssetToken.new(
      tokenName,
      tokenSymbol,
      accounts[8],
      accounts[9],
      { from: owner }
    );
  });

  describe("deployment", async () => {
    it("should have correct name", async () => {
      expect(await token.name()).to.equal(tokenName);
    });

    it("should have correct symbol", async () => {
      expect(await token.symbol()).to.equal(tokenSymbol);
    });

    it("should have correct decimal", async () => {
      expect((await token.decimals())).to.equal(decimals);
    });
  });

  describe("permit", async () => {
    const ownerWallet = Wallet.generate();
    const spenderWallet = Wallet.generate();
    const ownerPermit = ownerWallet.getAddressString();
    const spender = spenderWallet.getAddressString();

    before(async () => {
      chainId = (await token.getChainId()).toString();
    });

    context("should failed if", async () => {
      it("invalid signature", async () => {
        const deadline = MAX_UINT256.toString();

        const firstValue = toWei("100");
        const firstNonce = await token.nonces(ownerPermit);
        const firstData = buildData(
          chainId,
          token.address,
          ownerPermit,
          spender,
          firstValue.toString(),
          firstNonce.toString(),
          deadline
        ) as any;
;
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
        const deadline = new BN(1).toString();

        const firstValue = toWei("100");
        const firstNonce = await token.nonces(ownerPermit);

        const firstData = buildData(
          chainId,
          token.address,
          ownerPermit,
          spender,
          firstValue.toString(),
          firstNonce.toString(),
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
        const deadline = MAX_UINT256.toString();

        const firstValue = toWei("100");
        const firstNonce = await token.nonces(ownerPermit);

        const firstData = buildData(
          chainId,
          token.address,
          ownerPermit,
          spender,
          firstValue.toString(),
          firstNonce.toString(),
          deadline
        ) as any;
        const firstSignature = signTypedMessage(ownerWallet.getPrivateKey(), {
          data: firstData,
        });

        const firstECDSASig = fromRpcSig(firstSignature);
        const firstReceipt = await token.permit(
          ownerPermit,
          spender,
          firstValue.toString(),
          deadline,
          firstECDSASig.v,
          firstECDSASig.r as any,
          firstECDSASig.s as any
        );

        expectEvent(firstReceipt, "Approval", {
          owner: toChecksumAddress(ownerPermit),
          spender: toChecksumAddress(spender),
          value: firstValue.toString(),
        });
        expect(
          (await token.allowance(ownerPermit, spender)).toString()
        ).to.equal(firstValue.toString());
        expect((await token.nonces(ownerPermit)).toString()).to.equal("1");

        const secondValue = toWei("500");
        const secondNonce = await token.nonces(ownerPermit);

        const secondData = buildData(
          chainId,
          token.address,
          ownerPermit,
          spender,
          secondValue.toString(),
          secondNonce.toString(),
          deadline
        ) as any;
        const secondSignature = signTypedMessage(ownerWallet.getPrivateKey(), {
          data: secondData,
        });

        const secondECDSASig = fromRpcSig(secondSignature);

        const secondReceipt = await token.permit(
          ownerPermit,
          spender,
          secondValue.toString(),
          deadline,
          secondECDSASig.v,
          secondECDSASig.r as any,
          secondECDSASig.s as any
        );

        expectEvent(secondReceipt, "Approval", {
          owner: toChecksumAddress(ownerPermit),
          spender: toChecksumAddress(spender),
          value: secondValue.toString(),
        });
        expect(
          (await token.allowance(ownerPermit, spender)).toString()
        ).to.equal(secondValue.toString());
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
        const deadline = new BN(1).toString();
        const amount = toWei("100");
        const nonce = await token.nonces(ownerPermit);
        const data = buildData(
          chainId,
          token.address,
          ownerPermit,
          spender,
          amount.toString(),
          nonce.toString(),
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
        const deadline = MAX_UINT256.toString();
        const amount = toWei("100");
        const nonce = await token.nonces(ownerPermit);
        const data = buildData(
          chainId,
          token.address,
          ownerPermit,
          spender,
          amount.toString(),
          nonce.toString(),
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
            deadline,
            v,
            r,
            s
          ),
          "DLLR: Invalid address. Cannot transfer DLLR to the null address."
        );
      });

      it("if sender got insufficient balance", async () => {
        const deadline = MAX_UINT256.toString();
        const amount = toWei("100");
        const nonce = await dllr.nonces(ownerPermit);
        const data = buildData(
          chainId,
          dllr.address,
          ownerPermit,
          token.address,
          amount.toString(),
          nonce.toString(),
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

        /** The transferWithPermit will be performed from token contract, which is the DLLR intermediary contract */
        const account = await ethers.provider.getSigner(spender);
        const tokenInstance = await ethers.getContractAt(
          "DllrTransferWithPermit",
          token.address,
          account
        );
        await expectRevert(
          tokenInstance.transferWithPermit(
            ownerPermit,
            user,
            amount,
            deadline,
            v,
            r,
            s
          ),
          "ERC20: transfer amount exceeds balance'"
        );
      });
    });

    context("should succeed", async () => {
      it("transferFrom to valid recipient should reflect to the DLLR balance", async () => {
        const oldAssetProxyAddress = massetManagerProxy;
        const deadline = MAX_UINT256.toString();
        const initialOwnerBalance = toWei("1000000");
        const amount = toWei("100");
        const nonce = await dllr.nonces(ownerPermit);
        const data = buildData(
          chainId,
          dllr.address,
          ownerPermit,
          token.address,
          amount.toString(),
          nonce.toString(),
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
        await dllr.setMassetManagerProxy(massetManagerProxy);
        await dllr.mint(ownerPermit, initialOwnerBalance, {
          from: massetManagerProxy,
        });

        await dllr.setMassetManagerProxy(oldAssetProxyAddress);

        const userInitialBalance = await dllr.balanceOf(user);
        const ownerInitialBalance = await dllr.balanceOf(ownerPermit);
        const spenderInitialAllowance = await dllr.allowance(
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
        /** The transferWithPermit will be performed from token contract, which is the DLLR intermediary contract */
        await tokenInstance.transferWithPermit(
          ownerPermit,
          user,
          amount,
          deadline,
          v,
          r,
          s
        );

        const userLatestBalance = await dllr.balanceOf(user);
        const ownerLatestBalance = await dllr.balanceOf(ownerPermit);
        const spenderLatestAllowance = await dllr.allowance(
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

  describe("transfer to DLLR Intermediary", async () => {
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

    context("should succeed", async () => {
      it("transferWithPermit should be working as per normal using DLLR intermediary", async () => {
        const oldAssetProxyAddress = massetManagerProxy;
        const deadline = MAX_UINT256.toString();
        const initialOwnerBalance = toWei("1000000");
        const amount = toWei("100");
        const nonce = await dllr.nonces(ownerPermit);
        /** For signature, the verifying contract still needs to be DLLR, and the spender is the DLLR intermediary token contract, since it will be the one who will execute the transferWithPermit */
        const data = buildData(
          chainId,
          dllr.address,
          ownerPermit,
          token.address,
          amount.toString(),
          nonce.toString(),
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
        await dllr.setMassetManagerProxy(massetManagerProxy);
        await dllr.mint(ownerPermit, initialOwnerBalance, {
          from: massetManagerProxy,
        });

        await dllr.setMassetManagerProxy(oldAssetProxyAddress);

        const userInitialBalance = await dllr.balanceOf(user);
        const ownerInitialBalance = await dllr.balanceOf(ownerPermit);
        const spenderInitialAllowance = await dllr.allowance(
          ownerPermit,
          spender
        );
        expect(userInitialBalance.toString()).to.equal("0");
        expect(spenderInitialAllowance.toString()).to.equal("0");

        /** The transferWithPermit will be performed from token contract, which is the DLLR intermediary contract */
        await token.transferWithPermit(
          ownerPermit,
          user,
          amount,
          deadline,
          v,
          r,
          s
        );

        const userLatestBalance = await dllr.balanceOf(user);
        const ownerLatestBalance = await dllr.balanceOf(ownerPermit);
        const spenderLatestAllowance = await dllr.allowance(
          ownerPermit,
          spender
        );
        expect(userLatestBalance.toString()).to.equal(amount);
        expect(spenderLatestAllowance.toString()).to.equal("0");
        expect(ownerLatestBalance.toString()).to.equal(
          ownerInitialBalance.sub(new BN(amount)).toString()
        );
      });

      it("transferWithPermit should be working as per normal with the griefing attack trial", async () => {
        const oldAssetProxyAddress = massetManagerProxy;
        const deadline = MAX_UINT256.toString();
        const initialOwnerBalance = toWei("1000000");
        const amount = toWei("100");
        const nonce = await dllr.nonces(ownerPermit);
        /** For signature, the verifying contract still needs to be DLLR, and the spender is the DLLR intermediary token contract, since it will be the one who will execute the transferWithPermit */
        const data = buildData(
          chainId,
          dllr.address,
          ownerPermit,
          token.address,
          amount.toString(),
          nonce.toString(),
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
        await dllr.setMassetManagerProxy(massetManagerProxy);
        await dllr.mint(ownerPermit, initialOwnerBalance, {
          from: massetManagerProxy,
        });

        await dllr.setMassetManagerProxy(oldAssetProxyAddress);

        const userInitialBalance = await dllr.balanceOf(user);
        const ownerInitialBalance = await dllr.balanceOf(ownerPermit);
        const spenderInitialAllowance = await dllr.allowance(
          ownerPermit,
          spender
        );
        expect(userInitialBalance.toString()).to.equal("0");
        expect(spenderInitialAllowance.toString()).to.equal("0");

        const account = await ethers.provider.getSigner(spender);
        const dllrTransferWithPermit = await ethers.getContractAt(
          "MetaAssetToken",
          token.address,
          account
        );

        /** Attacker try to exploit the signature and front run the tx */
        await dllr.permit(
          ownerPermit,
          token.address,
          amount,
          deadline,
          v,
          r,
          s
        );
        /** The transferWithPermit from token contract, will not reverted because it won't execute the permit anymore */
        await dllrTransferWithPermit.transferWithPermit(
          ownerPermit,
          user,
          amount,
          deadline,
          v,
          r,
          s
        );

        const userLatestBalance = await dllr.balanceOf(user);
        const ownerLatestBalance = await dllr.balanceOf(ownerPermit);
        const spenderLatestAllowance = await dllr.allowance(
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
});
