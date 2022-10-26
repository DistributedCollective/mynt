import { expectRevert, expectEvent } from "@openzeppelin/test-helpers";
import { toWei, toChecksumAddress } from "web3-utils";
import { MetaAssetTokenInstance } from "types/generated";
import { MAX_UINT256, ZERO_ADDRESS } from "@utils/constants";
import Wallet from "ethereumjs-wallet";
import { fromRpcSig } from "ethereumjs-util";
import { signTypedMessage } from "eth-sig-util";
import BN from "bn.js";
import { network, ethers } from "hardhat";
import { EIP712Domain, Permit, PERMIT_TYPEHASH, domainSeparator } from "../helpers/EIP712";

const MetaAssetToken = artifacts.require("MetaAssetToken");
const MockApprovalReceiver = artifacts.require("MockApprovalReceiver");
const NOT_OWNER_EXCEPTION = "VM Exception while processing transaction: reverted with reason string 'Ownable: caller is not the owner";

const tokenName = "Sovryn Dollar";
const tokenSymbol = "DLLR";
const decimals = 18;
const maxDeadline = MAX_UINT256;
const name = "Sovryn Dollar";
const version = "1";

const buildData = (chainId, verifyingContract, from, spender, amount, nonce, deadline = maxDeadline) => ({
    primaryType: "Permit",
    types: { EIP712Domain, Permit },
    domain: { name, version, chainId, verifyingContract },
    message: { owner: from, spender, value: amount, nonce, deadline }
});

contract("MetaAssetToken", async (accounts) => {
    const [owner, user, myntAssetProxy, myntAssetImplementation, myntBasketManagerProxy, myntBasketManagerImplementation] = accounts;

    let token: MetaAssetTokenInstance;
    let chainId;

    beforeEach("before all", async () => {
        token = await MetaAssetToken.new(tokenName, tokenSymbol, { from: owner });
        await token.setMyntAssetConfig(myntAssetProxy, myntAssetImplementation, { from: owner });
        await token.setMyntBasketManagerConfig(myntBasketManagerProxy, myntBasketManagerImplementation, { from: owner });
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

    describe("setMyntAssetConfig", async () => {
        context("should fail", async () => {
            it("when it's not called by owner", async () => {
                await expectRevert(token.setMyntAssetConfig(myntAssetProxy, myntAssetImplementation, { from: user }), NOT_OWNER_EXCEPTION);
            });
        });
        context("should succeed", async () => {
            it("when called by owner", async () => {
                const tx = await token.setMyntAssetConfig(myntAssetProxy, myntAssetImplementation, { from: owner });

                expectEvent(tx, "MyntAssetConfigChanged", {
                    _newMyntAssetProxy: myntAssetProxy,
                    _newMyntAssetImplementation: myntAssetImplementation
                });

                const [newMyntAssetProxyPromised, newMyntAssetImplementationPromised] = await Promise.all([
                    token.myntAssetProxy(),
                    token.myntAssetImplementation()
                ]);
                expect(newMyntAssetProxyPromised).to.equal(myntAssetProxy);
                expect(newMyntAssetImplementationPromised).to.equal(myntAssetImplementation);
            });
        });
    });

    describe("setMyntBasketManagerConfig", async () => {
        context("should fail", async () => {
            it("when it's not called by owner", async () => {
                await expectRevert(
                    token.setMyntBasketManagerConfig(myntBasketManagerProxy, myntBasketManagerImplementation, { from: user }),
                    NOT_OWNER_EXCEPTION
                );
            });
        });
        context("should succeed", async () => {
            it("when called by owner", async () => {
                const tx = await token.setMyntBasketManagerConfig(myntBasketManagerProxy, myntBasketManagerImplementation, { from: owner });

                expectEvent(tx, "MyntBasketManagerConfigChanged", {
                    _newMyntBasketManagerProxy: myntBasketManagerProxy,
                    _newMyntBasketManagerImplementation: myntBasketManagerImplementation
                });

                const [newMyntBasketManagerProxyPromised, newMyntBasketManagerImplementationPromised] = await Promise.all([
                    token.myntBasketManagerProxy(),
                    token.myntBasketManagerImplementation()
                ]);
                expect(newMyntBasketManagerProxyPromised).to.equal(myntBasketManagerProxy);
                expect(newMyntBasketManagerImplementationPromised).to.equal(myntBasketManagerImplementation);
            });
        });
    });

    describe("mint", async () => {
        context("should fail", async () => {
            it("when it's not called by mynt mAsset proxy", async () => {
                await expectRevert(token.mint(user, toWei("100"), { from: user }), "DLLR:unathorized mAsset proxy");
            });
        });

        context("should succeed", async () => {
            it("when it's called by presale", async () => {
                const mintAmount = toWei("100");
                const initialBalance = await token.balanceOf(user);
                expect(initialBalance.toString()).to.equal("0");

                const tx = await token.mint(user, mintAmount, { from: myntAssetProxy });
                expectEvent(tx, "Transfer", { from: ZERO_ADDRESS, to: user, value: mintAmount });

                const latestBalance = await token.balanceOf(user);
                expect(latestBalance.toString()).to.equal(mintAmount);
            });
        });
    });

    describe("burn", async () => {
        context("should fail", async () => {
            it("when it's not called by presale or by a user", async () => {
                await expectRevert(token.burn(user, toWei("50"), { from: owner }), "DLLR:unathorized mAsset proxy");
            });
        });

        context("should succeed", async () => {
            it("when it's called by mynt mAsset proxy", async () => {
                const amount = toWei("50");
                await token.mint(user, amount, { from: myntAssetProxy });

                // amount after mint
                const initialBalance = await token.balanceOf(user);
                expect(initialBalance.toString()).to.equal(amount);

                const tx = await token.burn(user, amount, { from: myntAssetProxy });
                expectEvent(tx, "Transfer", { from: user, to: ZERO_ADDRESS, value: amount });

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
                    "DLLR: Invalid address. Cannot transfer DLLR directly to the DLLR contract or the null address"
                );
            });

            it("when recipient is DLLR contract address", async () => {
                await expectRevert(
                    token.transfer(token.address, toWei("100"), { from: owner }),
                    "DLLR: Invalid address. Cannot transfer DLLR directly to the DLLR contract or the null address"
                );
            });

            it("when recipient is mynt mAsset proxy address", async () => {
                await expectRevert(
                    token.transfer(myntAssetProxy, toWei("100"), { from: owner }),
                    "DLLR: Invalid address. Cannot transfer DLLR directly to a Sovryn Mynt protocol address"
                );
            });

            it("when recipient is mynt mAsset implementation address", async () => {
                await expectRevert(
                    token.transfer(myntAssetImplementation, toWei("100"), { from: owner }),
                    "DLLR: Invalid address. Cannot transfer DLLR directly to a Sovryn Mynt protocol address"
                );
            });

            it("when recipient is mynt basket manager proxy address", async () => {
                await expectRevert(
                    token.transfer(myntAssetProxy, toWei("100"), { from: owner }),
                    "DLLR: Invalid address. Cannot transfer DLLR directly to a Sovryn Mynt protocol address"
                );
            });

            it("when recipient is mynt basket manager implementation address", async () => {
                await expectRevert(
                    token.transfer(myntBasketManagerImplementation, toWei("100"), { from: owner }),
                    "DLLR: Invalid address. Cannot transfer DLLR directly to a Sovryn Mynt protocol address"
                );
            });
        });

        context("should succeed", async () => {
            it("transfer to valid recipient", async () => {
                const amount = toWei("100");
                const initialBalance = await token.balanceOf(user);
                expect(initialBalance.toString()).to.equal("0");

                const tx = await token.mint(user, amount, { from: myntAssetProxy });
                expectEvent(tx, "Transfer", { from: ZERO_ADDRESS, to: user, value: amount });

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
                    "DLLR: Invalid address. Cannot transfer DLLR directly to the DLLR contract or the null address"
                );
            });

            it("when recipient is DLLR contract address", async () => {
                await expectRevert(
                    token.transferFrom(user, token.address, toWei("100"), { from: owner }),
                    "DLLR: Invalid address. Cannot transfer DLLR directly to the DLLR contract or the null address"
                );
            });

            it("when recipient is mynt mAsset proxy address", async () => {
                await expectRevert(
                    token.transferFrom(user, myntAssetProxy, toWei("100"), { from: owner }),
                    "DLLR: Invalid address. Cannot transfer DLLR directly to a Sovryn Mynt protocol address"
                );
            });

            it("when recipient is mynt mAsset implementation address", async () => {
                await expectRevert(
                    token.transferFrom(user, myntAssetImplementation, toWei("100"), { from: owner }),
                    "DLLR: Invalid address. Cannot transfer DLLR directly to a Sovryn Mynt protocol address"
                );
            });

            it("when recipient is mynt basket manager proxy address", async () => {
                await expectRevert(
                    token.transferFrom(user, myntAssetProxy, toWei("100"), { from: owner }),
                    "DLLR: Invalid address. Cannot transfer DLLR directly to a Sovryn Mynt protocol address"
                );
            });

            it("when recipient is mynt basket manager implementation address", async () => {
                await expectRevert(
                    token.transferFrom(user, myntBasketManagerImplementation, toWei("100"), { from: owner }),
                    "DLLR: Invalid address. Cannot transfer DLLR directly to a Sovryn Mynt protocol address"
                );
            });
        });

        context("should succeed", async () => {
            it("transferFrom to valid recipient", async () => {
                const amount = toWei("100");
                const initialBalance = await token.balanceOf(user);
                expect(initialBalance.toString()).to.equal("0");

                const tx = await token.mint(user, amount, { from: myntAssetProxy });
                expectEvent(tx, "Transfer", { from: ZERO_ADDRESS, to: user, value: amount });

                const balanceAfterMint = await token.balanceOf(user);
                expect(balanceAfterMint.toString()).to.equal(amount);

                // approve
                await token.approve(owner, amount, { from: user });

                const tx2 = await token.transferFrom(user, owner, amount, { from: owner });
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
            chainId = await token.getChainID();
        });

        context("should failed if", async () => {
            it("invalid signature", async () => {
                const deadline = MAX_UINT256;

                const firstValue = toWei("100");
                const firstNonce = await token.nonces(ownerPermit);

                const firstData = buildData(chainId, token.address, ownerPermit, spender, firstValue, firstNonce, deadline) as any;
                const firstSignature = signTypedMessage(ownerWallet.getPrivateKey(), { data: firstData });

                const { v } = fromRpcSig(firstSignature);
                const { r, s }: any = fromRpcSig(firstSignature);

                // incorrect amount
                await expectRevert(token.permit(ownerPermit, spender, toWei("500"), deadline, v, r, s), "DLLR:INVALID_SIGNATURE");
            });

            it("signature expired", async () => {
                const deadline = new BN(1);

                const firstValue = toWei("100");
                const firstNonce = await token.nonces(ownerPermit);

                const firstData = buildData(chainId, token.address, ownerPermit, spender, firstValue, firstNonce, deadline) as any;
                const firstSignature = signTypedMessage(ownerWallet.getPrivateKey(), { data: firstData });

                const { v } = fromRpcSig(firstSignature);
                const { r, s }: any = fromRpcSig(firstSignature);

                // incorrect amount
                await expectRevert(token.permit(ownerPermit, spender, firstValue, deadline, v, r, s), "DLLR:AUTH_EXPIRED");
            });
        });

        context("success permit check", async () => {
            it("has the correct permit typehash", async () => {
                assert.equal(await token.PERMIT_TYPEHASH(), PERMIT_TYPEHASH, "erc2612: typehash");
            });

            it("has the correct DOMAIN_SEPARATOR", async () => {
                const DOMAIN_SEPARATOR = await domainSeparator(name, version, chainId, token.address);
                assert.equal(await token.DOMAIN_SEPARATOR(), DOMAIN_SEPARATOR, "eip721: domain separator");
            });

            it("can set allowance through permit", async () => {
                const deadline = MAX_UINT256;

                const firstValue = toWei("100");
                const firstNonce = await token.nonces(ownerPermit);

                const firstData = buildData(chainId, token.address, ownerPermit, spender, firstValue, firstNonce, deadline) as any;
                const firstSignature = signTypedMessage(ownerWallet.getPrivateKey(), { data: firstData });

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
                    value: firstValue
                });
                expect((await token.allowance(ownerPermit, spender)).toString()).to.equal(firstValue);
                expect((await token.nonces(ownerPermit)).toString()).to.equal("1");

                const secondValue = toWei("500");
                const secondNonce = await token.nonces(ownerPermit);

                const secondData = buildData(chainId, token.address, ownerPermit, spender, secondValue, secondNonce, deadline) as any;
                const secondSignature = signTypedMessage(ownerWallet.getPrivateKey(), { data: secondData });

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
                    value: secondValue
                });
                expect((await token.allowance(ownerPermit, spender)).toString()).to.equal(secondValue);
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
            chainId = await token.getChainID();
            // funding spender wallet
            const funder = await ethers.provider.getSigner(owner);
            await funder.sendTransaction({
                to: spender,
                value: toWei("10")
            });
        });

        context("transferWithPermit should fail", async () => {
            it("when signature expired", async () => {
                const deadline = new BN(1);
                const amount = toWei("100");
                const nonce = await token.nonces(ownerPermit);
                const data = buildData(chainId, token.address, ownerPermit, spender, amount, nonce, deadline) as any;
                const signature = signTypedMessage(ownerWallet.getPrivateKey(), { data });
                const { v } = fromRpcSig(signature);
                const { r, s }: any = fromRpcSig(signature);
                await expectRevert(token.transferWithPermit(ownerPermit, spender, amount, deadline, v, r, s), "DLLR:AUTH_EXPIRED");
            });

            it("when recipient is zero address", async () => {
                const deadline = MAX_UINT256;
                const amount = toWei("100");
                const nonce = await token.nonces(ownerPermit);
                const data = buildData(chainId, token.address, ownerPermit, spender, amount, nonce, deadline) as any;
                const signature = signTypedMessage(ownerWallet.getPrivateKey(), { data });
                const { v } = fromRpcSig(signature);
                const { r, s }: any = fromRpcSig(signature);

                await network.provider.request({
                    method: "hardhat_impersonateAccount",
                    params: [spender]
                });
                const account = await ethers.provider.getSigner(spender);
                const tokenInstance = await ethers.getContractAt("MetaAssetToken", token.address, account);
                await expectRevert(
                    tokenInstance.transferWithPermit(ownerPermit, ZERO_ADDRESS, amount, deadline.toString(), v, r, s),
                    "DLLR: Invalid address. Cannot transfer DLLR directly to the DLLR contract or the null address"
                );
            });

            it("when recipient is DLLR contract address", async () => {
                const deadline = MAX_UINT256;
                const amount = toWei("100");
                const nonce = await token.nonces(ownerPermit);
                const data = buildData(chainId, token.address, ownerPermit, spender, amount, nonce, deadline) as any;
                const signature = signTypedMessage(ownerWallet.getPrivateKey(), { data });
                const { v } = fromRpcSig(signature);
                const { r, s }: any = fromRpcSig(signature);

                await network.provider.request({
                    method: "hardhat_impersonateAccount",
                    params: [spender]
                });
                const account = await ethers.provider.getSigner(spender);
                const tokenInstance = await ethers.getContractAt("MetaAssetToken", token.address, account);
                await expectRevert(
                    tokenInstance.transferWithPermit(ownerPermit, token.address, amount, deadline.toString(), v, r, s),
                    "DLLR: Invalid address. Cannot transfer DLLR directly to the DLLR contract or the null address"
                );
            });

            it("when recipient is mynt mAsset proxy address", async () => {
                const deadline = MAX_UINT256;
                const amount = toWei("100");
                const nonce = await token.nonces(ownerPermit);
                const data = buildData(chainId, token.address, ownerPermit, spender, amount, nonce, deadline) as any;
                const signature = signTypedMessage(ownerWallet.getPrivateKey(), { data });
                const { v } = fromRpcSig(signature);
                const { r, s }: any = fromRpcSig(signature);

                await network.provider.request({
                    method: "hardhat_impersonateAccount",
                    params: [spender]
                });
                const account = await ethers.provider.getSigner(spender);
                const tokenInstance = await ethers.getContractAt("MetaAssetToken", token.address, account);
                await expectRevert(
                    tokenInstance.transferWithPermit(ownerPermit, myntAssetProxy, amount, deadline.toString(), v, r, s),
                    "DLLR: Invalid address. Cannot transfer DLLR directly to a Sovryn Mynt protocol address"
                );
            });

            it("when recipient is mynt mAsset implementation address", async () => {
                const deadline = MAX_UINT256;
                const amount = toWei("100");
                const nonce = await token.nonces(ownerPermit);
                const data = buildData(chainId, token.address, ownerPermit, spender, amount, nonce, deadline) as any;
                const signature = signTypedMessage(ownerWallet.getPrivateKey(), { data });
                const { v } = fromRpcSig(signature);
                const { r, s }: any = fromRpcSig(signature);

                await network.provider.request({
                    method: "hardhat_impersonateAccount",
                    params: [spender]
                });
                const account = await ethers.provider.getSigner(spender);
                const tokenInstance = await ethers.getContractAt("MetaAssetToken", token.address, account);
                await expectRevert(
                    tokenInstance.transferWithPermit(ownerPermit, myntAssetImplementation, amount, deadline.toString(), v, r, s),
                    "DLLR: Invalid address. Cannot transfer DLLR directly to a Sovryn Mynt protocol address"
                );
            });

            it("when recipient is mynt basket manager proxy address", async () => {
                const deadline = MAX_UINT256;
                const amount = toWei("100");
                const nonce = await token.nonces(ownerPermit);
                const data = buildData(chainId, token.address, ownerPermit, spender, amount, nonce, deadline) as any;
                const signature = signTypedMessage(ownerWallet.getPrivateKey(), { data });
                const { v } = fromRpcSig(signature);
                const { r, s }: any = fromRpcSig(signature);

                await network.provider.request({
                    method: "hardhat_impersonateAccount",
                    params: [spender]
                });
                const account = await ethers.provider.getSigner(spender);
                const tokenInstance = await ethers.getContractAt("MetaAssetToken", token.address, account);
                await expectRevert(
                    tokenInstance.transferWithPermit(ownerPermit, myntBasketManagerProxy, amount, deadline.toString(), v, r, s),
                    "DLLR: Invalid address. Cannot transfer DLLR directly to a Sovryn Mynt protocol address"
                );
            });

            it("when recipient is mynt basket manager implementation address", async () => {
                const deadline = MAX_UINT256;
                const amount = toWei("100");
                const nonce = await token.nonces(ownerPermit);
                const data = buildData(chainId, token.address, ownerPermit, spender, amount, nonce, deadline) as any;
                const signature = signTypedMessage(ownerWallet.getPrivateKey(), { data });
                const { v } = fromRpcSig(signature);
                const { r, s }: any = fromRpcSig(signature);

                await network.provider.request({
                    method: "hardhat_impersonateAccount",
                    params: [spender]
                });
                const account = await ethers.provider.getSigner(spender);
                const tokenInstance = await ethers.getContractAt("MetaAssetToken", token.address, account);
                await expectRevert(
                    tokenInstance.transferWithPermit(ownerPermit, myntBasketManagerImplementation, amount, deadline.toString(), v, r, s),
                    "DLLR: Invalid address. Cannot transfer DLLR directly to a Sovryn Mynt protocol address"
                );
            });

            it("if sender got insufficient balance", async () => {
                const deadline = MAX_UINT256;
                const amount = toWei("100");
                const nonce = await token.nonces(ownerPermit);
                const data = buildData(chainId, token.address, ownerPermit, spender, amount, nonce, deadline) as any;
                const signature = signTypedMessage(ownerWallet.getPrivateKey(), { data });
                const { v } = fromRpcSig(signature);
                const { r, s }: any = fromRpcSig(signature);

                await network.provider.request({
                    method: "hardhat_impersonateAccount",
                    params: [spender]
                });

                const account = await ethers.provider.getSigner(spender);
                const tokenInstance = await ethers.getContractAt("MetaAssetToken", token.address, account);
                await expectRevert(
                    tokenInstance.transferWithPermit(ownerPermit, user, amount, deadline.toString(), v, r, s),
                    "ERC20: transfer amount exceeds balance'"
                );
            });
        });

        context("should succeed", async () => {
            it("transferFrom to valid recipient", async () => {
                const deadline = MAX_UINT256;
                const initialOwnerBalance = toWei("1000000");
                const amount = toWei("100");
                const nonce = await token.nonces(ownerPermit);
                const data = buildData(chainId, token.address, ownerPermit, spender, amount, nonce, deadline) as any;
                const signature = signTypedMessage(ownerWallet.getPrivateKey(), { data });
                const { v } = fromRpcSig(signature);
                const { r, s }: any = fromRpcSig(signature);

                await network.provider.request({
                    method: "hardhat_impersonateAccount",
                    params: [spender]
                });

                await token.mint(ownerPermit, initialOwnerBalance, { from: myntAssetProxy });

                const userInitialBalance = await token.balanceOf(user);
                const ownerInitialBalance = await token.balanceOf(ownerPermit);
                const spenderInitialAllowance = await token.allowance(ownerPermit, spender);
                expect(userInitialBalance.toString()).to.equal("0");
                expect(spenderInitialAllowance.toString()).to.equal("0");

                const account = await ethers.provider.getSigner(spender);
                const tokenInstance = await ethers.getContractAt("MetaAssetToken", token.address, account);
                await tokenInstance.transferWithPermit(ownerPermit, user, amount, deadline.toString(), v, r, s);

                const userLatestBalance = await token.balanceOf(user);
                const ownerLatestBalance = await token.balanceOf(ownerPermit);
                const spenderLatestAllowance = await token.allowance(ownerPermit, spender);
                expect(userLatestBalance.toString()).to.equal(amount);
                expect(spenderLatestAllowance.toString()).to.equal("0");
                expect(ownerLatestBalance.toString()).to.equal(ownerInitialBalance.sub(new BN(amount)).toString());
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
            const tx = await token.approveAndCall(approvalReceiver.address, amount, "0x1234");
            await expectEvent(tx, "Approval", { owner, spender: approvalReceiver.address, value: amount });
            expect(await approvalReceiver.sender(), "sender").eq(owner);
            expect((await approvalReceiver.amount()).toString(), "amount").eq(amount);
            expect(await approvalReceiver.token(), "token").eq(token.address);
            expect(await approvalReceiver.data(), "data").eq("0x1234");
        });
    });
});
