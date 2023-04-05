"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const test_helpers_1 = require("@openzeppelin/test-helpers");
const web3_utils_1 = require("web3-utils");
const constants_1 = require("@utils/constants");
const ethereumjs_wallet_1 = __importDefault(require("ethereumjs-wallet"));
const ethereumjs_util_1 = require("ethereumjs-util");
const eth_sig_util_1 = require("eth-sig-util");
const bn_js_1 = __importDefault(require("bn.js"));
const hardhat_1 = require("hardhat");
const EIP712_1 = require("../helpers/EIP712");
const MetaAssetToken = artifacts.require("MetaAssetToken");
const MockMetaAssetToken = artifacts.require("MockMetaAssetToken");
const MockApprovalReceiver = artifacts.require("MockApprovalReceiver");
const NOT_OWNER_EXCEPTION = "VM Exception while processing transaction: reverted with reason string 'Ownable: caller is not the owner";
const tokenName = "Meta Asset Token";
const tokenSymbol = "MAT";
const decimals = 18;
const maxDeadline = constants_1.MAX_UINT256;
const name = tokenName;
const version = "1";
const { getContractFactory } = hardhat_1.ethers;
const buildData = (chainId, verifyingContract, from, spender, amount, nonce, deadline = maxDeadline) => ({
    primaryType: "Permit",
    types: { EIP712Domain: EIP712_1.EIP712Domain, Permit: EIP712_1.Permit },
    domain: { name, version, chainId, verifyingContract },
    message: { owner: from, spender, value: amount, nonce, deadline },
});
contract("MetaAssetToken", async (accounts) => {
    const [owner, user, newMassetManagerProxy] = accounts;
    let token;
    let mockToken;
    let chainId;
    let admin;
    let massetManagerProxy;
    let massetManagerImplementation;
    let basketManagerProxy;
    let basketManagerImplementation;
    beforeEach("before all", async () => {
        admin = owner;
        const assetProxyInstance = await hardhat_1.upgrades.deployProxy(await getContractFactory("MockProxyImplementationMetaAssetToken"), [user], {
            initializer: "initialize",
        });
        const basketManagerProxyInstance = await hardhat_1.upgrades.deployProxy(await getContractFactory("MockProxyImplementationMetaAssetToken"), [assetProxyInstance.address], {
            initializer: "initialize",
        });
        massetManagerProxy = assetProxyInstance.address;
        massetManagerImplementation =
            await hardhat_1.upgrades.erc1967.getImplementationAddress(assetProxyInstance.address);
        basketManagerProxy = basketManagerProxyInstance.address;
        basketManagerImplementation =
            await hardhat_1.upgrades.erc1967.getImplementationAddress(basketManagerProxyInstance.address);
        token = await MetaAssetToken.new(tokenName, tokenSymbol, { from: owner });
        mockToken = await MockMetaAssetToken.new(tokenName, tokenSymbol, accounts[8], accounts[9], { from: owner });
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
                await (0, test_helpers_1.expectRevert)(token.setMassetManagerProxy(massetManagerProxy, { from: user }), NOT_OWNER_EXCEPTION);
            });
        });
        context("should succeed", async () => {
            it("when called by owner", async () => {
                const tx = await token.setMassetManagerProxy(massetManagerProxy, {
                    from: owner,
                });
                (0, test_helpers_1.expectEvent)(tx, "MassetManagerProxyChanged", {
                    _newMassetManagerProxy: massetManagerProxy,
                });
                const [newAssetProxyPromised, newMassetManagerImplementationPromised] = await Promise.all([
                    token.massetManagerProxy(),
                    token.massetManagerImplementation(),
                ]);
                expect(newAssetProxyPromised).to.equal(massetManagerProxy);
                expect(newMassetManagerImplementationPromised).to.equal(massetManagerImplementation);
            });
        });
    });
    describe("setBasketManagerProxy", async () => {
        context("should fail", async () => {
            it("when it's not called by owner", async () => {
                await (0, test_helpers_1.expectRevert)(token.setBasketManagerProxy(basketManagerProxy, { from: user }), NOT_OWNER_EXCEPTION);
            });
        });
        context("should succeed", async () => {
            it("when called by owner", async () => {
                const tx = await token.setBasketManagerProxy(basketManagerProxy, {
                    from: owner,
                });
                (0, test_helpers_1.expectEvent)(tx, "BasketManagerProxyChanged", {
                    _newBasketManagerProxy: basketManagerProxy,
                });
                const [newBasketManagerProxyPromised, newBasketManagerImplementationPromised,] = await Promise.all([
                    token.basketManagerProxy(),
                    token.basketManagerImplementation(),
                ]);
                expect(newBasketManagerProxyPromised).to.equal(basketManagerProxy);
                expect(newBasketManagerImplementationPromised).to.equal(basketManagerImplementation);
            });
        });
    });
    describe("mint", async () => {
        context("should fail", async () => {
            it("when it's not called by MassetManager proxy", async () => {
                await (0, test_helpers_1.expectRevert)(token.mint(user, (0, web3_utils_1.toWei)("100"), { from: user }), "DLLR:unauthorized MassetManager proxy");
            });
        });
        context("should succeed", async () => {
            it("when it's called by presale", async () => {
                const mintAmount = (0, web3_utils_1.toWei)("100");
                const initialBalance = await token.balanceOf(user);
                expect(initialBalance.toString()).to.equal("0");
                massetManagerProxy = newMassetManagerProxy;
                await token.setMassetManagerProxy(massetManagerProxy);
                const tx = await token.mint(user, mintAmount, {
                    from: massetManagerProxy,
                });
                (0, test_helpers_1.expectEvent)(tx, "Transfer", {
                    from: constants_1.ZERO_ADDRESS,
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
                await (0, test_helpers_1.expectRevert)(token.burn(user, (0, web3_utils_1.toWei)("50"), { from: owner }), "DLLR:unauthorized MassetManager proxy");
            });
        });
        context("should succeed", async () => {
            it("when it's called by MassetManager proxy", async () => {
                massetManagerProxy = newMassetManagerProxy;
                await token.setMassetManagerProxy(massetManagerProxy);
                const amount = (0, web3_utils_1.toWei)("50");
                await token.mint(user, amount, { from: massetManagerProxy });
                const totalSupply = await token.totalSupply();
                // amount after mint
                const initialBalance = await token.balanceOf(user);
                expect(initialBalance.toString()).to.equal(amount);
                expect(totalSupply.toString()).to.equal(initialBalance.toString());
                const tx = await token.burn(user, amount, { from: massetManagerProxy });
                (0, test_helpers_1.expectEvent)(tx, "Transfer", {
                    from: user,
                    to: constants_1.ZERO_ADDRESS,
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
                await (0, test_helpers_1.expectRevert)(token.transfer(constants_1.ZERO_ADDRESS, (0, web3_utils_1.toWei)("100"), { from: owner }), "DLLR: Invalid address. Cannot transfer DLLR to the null address.");
            });
            it("when recipient is MetaAsset contract address", async () => {
                await (0, test_helpers_1.expectRevert)(token.transfer(token.address, (0, web3_utils_1.toWei)("100"), { from: owner }), "DLLR: Invalid address. Cannot transfer DLLR to the null address.");
            });
        });
        context("should succeed", async () => {
            it("transfer to valid recipient", async () => {
                token = mockToken;
                massetManagerProxy = newMassetManagerProxy;
                await token.setMassetManagerProxy(massetManagerProxy);
                const amount = (0, web3_utils_1.toWei)("100");
                const initialBalance = await token.balanceOf(user);
                expect(initialBalance.toString()).to.equal("0");
                const tx = await token.mint(user, amount, { from: massetManagerProxy });
                (0, test_helpers_1.expectEvent)(tx, "Transfer", {
                    from: constants_1.ZERO_ADDRESS,
                    to: user,
                    value: amount,
                });
                const balanceAfterMint = await token.balanceOf(user);
                expect(balanceAfterMint.toString()).to.equal(amount);
                const tx2 = await token.transfer(owner, amount, { from: user });
                (0, test_helpers_1.expectEvent)(tx2, "Transfer", { from: user, to: owner, value: amount });
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
                await (0, test_helpers_1.expectRevert)(token.transferFrom(user, constants_1.ZERO_ADDRESS, (0, web3_utils_1.toWei)("100"), { from: owner }), "DLLR: Invalid address. Cannot transfer DLLR to the null address");
            });
        });
        context("should succeed", async () => {
            it("transferFrom to valid recipient", async () => {
                token = mockToken;
                massetManagerProxy = newMassetManagerProxy;
                await token.setMassetManagerProxy(massetManagerProxy);
                const amount = (0, web3_utils_1.toWei)("100");
                const initialBalance = await token.balanceOf(user);
                expect(initialBalance.toString()).to.equal("0");
                const tx = await token.mint(user, amount, { from: massetManagerProxy });
                (0, test_helpers_1.expectEvent)(tx, "Transfer", {
                    from: constants_1.ZERO_ADDRESS,
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
                (0, test_helpers_1.expectEvent)(tx2, "Transfer", { from: user, to: owner, value: amount });
                const latestUserBalance = await token.balanceOf(user);
                expect(latestUserBalance.toString()).to.equal("0");
                const latestOwnerBalance = await token.balanceOf(owner);
                expect(latestOwnerBalance.toString()).to.equal(amount);
            });
        });
    });
    describe("permit", async () => {
        const ownerWallet = ethereumjs_wallet_1.default.generate();
        const spenderWallet = ethereumjs_wallet_1.default.generate();
        const ownerPermit = ownerWallet.getAddressString();
        const spender = spenderWallet.getAddressString();
        before(async () => {
            chainId = await token.getChainId();
        });
        context("should failed if", async () => {
            it("invalid signature", async () => {
                const deadline = constants_1.MAX_UINT256;
                const firstValue = (0, web3_utils_1.toWei)("100");
                const firstNonce = await token.nonces(ownerPermit);
                const firstData = buildData(chainId, token.address, ownerPermit, spender, firstValue, firstNonce, deadline);
                const firstSignature = (0, eth_sig_util_1.signTypedMessage)(ownerWallet.getPrivateKey(), {
                    data: firstData,
                });
                const { v } = (0, ethereumjs_util_1.fromRpcSig)(firstSignature);
                const { r, s } = (0, ethereumjs_util_1.fromRpcSig)(firstSignature);
                // incorrect amount
                await (0, test_helpers_1.expectRevert)(token.permit(ownerPermit, spender, (0, web3_utils_1.toWei)("500"), deadline, v, r, s), "ERC20Permit: invalid signature");
            });
            it("signature expired", async () => {
                const deadline = new bn_js_1.default(1);
                const firstValue = (0, web3_utils_1.toWei)("100");
                const firstNonce = await token.nonces(ownerPermit);
                const firstData = buildData(chainId, token.address, ownerPermit, spender, firstValue, firstNonce, deadline);
                const firstSignature = (0, eth_sig_util_1.signTypedMessage)(ownerWallet.getPrivateKey(), {
                    data: firstData,
                });
                const { v } = (0, ethereumjs_util_1.fromRpcSig)(firstSignature);
                const { r, s } = (0, ethereumjs_util_1.fromRpcSig)(firstSignature);
                // incorrect amount
                await (0, test_helpers_1.expectRevert)(token.permit(ownerPermit, spender, firstValue, deadline, v, r, s), "ERC20Permit: expired deadline");
            });
        });
        context("success permit check", async () => {
            it("has the correct DOMAIN_SEPARATOR", async () => {
                const DOMAIN_SEPARATOR = await (0, EIP712_1.domainSeparator)(name, version, chainId, token.address);
                assert.equal(await token.DOMAIN_SEPARATOR(), DOMAIN_SEPARATOR, "eip721: domain separator");
            });
            it("can set allowance through permit", async () => {
                const deadline = constants_1.MAX_UINT256;
                const firstValue = (0, web3_utils_1.toWei)("100");
                const firstNonce = await token.nonces(ownerPermit);
                const firstData = buildData(chainId, token.address, ownerPermit, spender, firstValue, firstNonce, deadline);
                const firstSignature = (0, eth_sig_util_1.signTypedMessage)(ownerWallet.getPrivateKey(), {
                    data: firstData,
                });
                const firstECDSASig = (0, ethereumjs_util_1.fromRpcSig)(firstSignature);
                const firstReceipt = await token.permit(ownerPermit, spender, firstValue, deadline, firstECDSASig.v, firstECDSASig.r, firstECDSASig.s);
                (0, test_helpers_1.expectEvent)(firstReceipt, "Approval", {
                    owner: (0, web3_utils_1.toChecksumAddress)(ownerPermit),
                    spender: (0, web3_utils_1.toChecksumAddress)(spender),
                    value: firstValue,
                });
                expect((await token.allowance(ownerPermit, spender)).toString()).to.equal(firstValue);
                expect((await token.nonces(ownerPermit)).toString()).to.equal("1");
                const secondValue = (0, web3_utils_1.toWei)("500");
                const secondNonce = await token.nonces(ownerPermit);
                const secondData = buildData(chainId, token.address, ownerPermit, spender, secondValue, secondNonce, deadline);
                const secondSignature = (0, eth_sig_util_1.signTypedMessage)(ownerWallet.getPrivateKey(), {
                    data: secondData,
                });
                const secondECDSASig = (0, ethereumjs_util_1.fromRpcSig)(secondSignature);
                const secondReceipt = await token.permit(ownerPermit, spender, secondValue, deadline, secondECDSASig.v, secondECDSASig.r, secondECDSASig.s);
                (0, test_helpers_1.expectEvent)(secondReceipt, "Approval", {
                    owner: (0, web3_utils_1.toChecksumAddress)(ownerPermit),
                    spender: (0, web3_utils_1.toChecksumAddress)(spender),
                    value: secondValue,
                });
                expect((await token.allowance(ownerPermit, spender)).toString()).to.equal(secondValue);
                expect((await token.nonces(ownerPermit)).toString()).to.equal("2");
            });
        });
    });
    describe("transferWithPermit", async () => {
        const ownerWallet = ethereumjs_wallet_1.default.generate();
        const spenderWallet = ethereumjs_wallet_1.default.generate();
        const ownerPermit = ownerWallet.getAddressString();
        const spender = spenderWallet.getAddressString();
        before(async () => {
            chainId = await token.getChainId();
            // funding spender wallet
            const funder = await hardhat_1.ethers.provider.getSigner(owner);
            await funder.sendTransaction({
                to: spender,
                value: (0, web3_utils_1.toWei)("10"),
            });
            // funding massetManagerProxy address
            await funder.sendTransaction({
                to: massetManagerProxy,
                value: (0, web3_utils_1.toWei)("10"),
            });
        });
        context("transferWithPermit should fail", async () => {
            it("when signature expired", async () => {
                const deadline = new bn_js_1.default(1);
                const amount = (0, web3_utils_1.toWei)("100");
                const nonce = await token.nonces(ownerPermit);
                const data = buildData(chainId, token.address, ownerPermit, spender, amount, nonce, deadline);
                const signature = (0, eth_sig_util_1.signTypedMessage)(ownerWallet.getPrivateKey(), {
                    data,
                });
                const { v } = (0, ethereumjs_util_1.fromRpcSig)(signature);
                const { r, s } = (0, ethereumjs_util_1.fromRpcSig)(signature);
                await (0, test_helpers_1.expectRevert)(token.transferWithPermit(ownerPermit, spender, amount, deadline, v, r, s), "ERC20Permit: expired deadline");
            });
            it("when recipient is zero address", async () => {
                const deadline = constants_1.MAX_UINT256;
                const amount = (0, web3_utils_1.toWei)("100");
                const nonce = await token.nonces(ownerPermit);
                const data = buildData(chainId, token.address, ownerPermit, spender, amount, nonce, deadline);
                const signature = (0, eth_sig_util_1.signTypedMessage)(ownerWallet.getPrivateKey(), {
                    data,
                });
                const { v } = (0, ethereumjs_util_1.fromRpcSig)(signature);
                const { r, s } = (0, ethereumjs_util_1.fromRpcSig)(signature);
                await hardhat_1.network.provider.request({
                    method: "hardhat_impersonateAccount",
                    params: [spender],
                });
                const account = await hardhat_1.ethers.provider.getSigner(spender);
                const tokenInstance = await hardhat_1.ethers.getContractAt("MetaAssetToken", token.address, account);
                await (0, test_helpers_1.expectRevert)(tokenInstance.transferWithPermit(ownerPermit, constants_1.ZERO_ADDRESS, amount, deadline.toString(), v, r, s), "DLLR: Invalid address. Cannot transfer DLLR to the null address.");
            });
            it("if sender got insufficient balance", async () => {
                const deadline = constants_1.MAX_UINT256;
                const amount = (0, web3_utils_1.toWei)("100");
                const nonce = await token.nonces(ownerPermit);
                const data = buildData(chainId, token.address, ownerPermit, spender, amount, nonce, deadline);
                const signature = (0, eth_sig_util_1.signTypedMessage)(ownerWallet.getPrivateKey(), {
                    data,
                });
                const { v } = (0, ethereumjs_util_1.fromRpcSig)(signature);
                const { r, s } = (0, ethereumjs_util_1.fromRpcSig)(signature);
                await hardhat_1.network.provider.request({
                    method: "hardhat_impersonateAccount",
                    params: [spender],
                });
                const account = await hardhat_1.ethers.provider.getSigner(spender);
                const tokenInstance = await hardhat_1.ethers.getContractAt("MetaAssetToken", token.address, account);
                await (0, test_helpers_1.expectRevert)(tokenInstance.transferWithPermit(ownerPermit, user, amount, deadline.toString(), v, r, s), "ERC20: transfer amount exceeds balance'");
            });
        });
        context("should succeed", async () => {
            it("transferFrom to valid recipient", async () => {
                const oldAssetProxyAddress = massetManagerProxy;
                const deadline = constants_1.MAX_UINT256;
                const initialOwnerBalance = (0, web3_utils_1.toWei)("1000000");
                const amount = (0, web3_utils_1.toWei)("100");
                const nonce = await token.nonces(ownerPermit);
                const data = buildData(chainId, token.address, ownerPermit, spender, amount, nonce, deadline);
                const signature = (0, eth_sig_util_1.signTypedMessage)(ownerWallet.getPrivateKey(), {
                    data,
                });
                const { v } = (0, ethereumjs_util_1.fromRpcSig)(signature);
                const { r, s } = (0, ethereumjs_util_1.fromRpcSig)(signature);
                await hardhat_1.network.provider.request({
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
                const spenderInitialAllowance = await token.allowance(ownerPermit, spender);
                expect(userInitialBalance.toString()).to.equal("0");
                expect(spenderInitialAllowance.toString()).to.equal("0");
                const account = await hardhat_1.ethers.provider.getSigner(spender);
                const tokenInstance = await hardhat_1.ethers.getContractAt("MetaAssetToken", token.address, account);
                await tokenInstance.transferWithPermit(ownerPermit, user, amount, deadline.toString(), v, r, s);
                const userLatestBalance = await token.balanceOf(user);
                const ownerLatestBalance = await token.balanceOf(ownerPermit);
                const spenderLatestAllowance = await token.allowance(ownerPermit, spender);
                expect(userLatestBalance.toString()).to.equal(amount);
                expect(spenderLatestAllowance.toString()).to.equal("0");
                expect(ownerLatestBalance.toString()).to.equal(ownerInitialBalance.sub(new bn_js_1.default(amount)).toString());
            });
        });
    });
    describe("approveAndCall", async () => {
        let approvalReceiver;
        before(async () => {
            approvalReceiver = await MockApprovalReceiver.new();
        });
        it("should approve for transfer and call the receiver", async () => {
            const amount = (0, web3_utils_1.toWei)("50");
            const tx = await token.approveAndCall(approvalReceiver.address, amount, "0x1234");
            await (0, test_helpers_1.expectEvent)(tx, "Approval", {
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
//# sourceMappingURL=MetaAssetToken.spec.js.map