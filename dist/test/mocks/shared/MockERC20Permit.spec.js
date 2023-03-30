"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const test_helpers_1 = require("@openzeppelin/test-helpers");
const ethereumjs_wallet_1 = __importDefault(require("ethereumjs-wallet"));
const ethereumjs_util_1 = require("ethereumjs-util");
const eth_sig_util_1 = require("eth-sig-util");
const EIP712_1 = require("../../helpers/EIP712");
const { MAX_UINT256 } = test_helpers_1.constants;
const ERC20PermitMock = artifacts.require("MockERC20Permit");
contract("MockERC20Permit", function (accounts) {
    const [initialHolder, spender] = accounts;
    const name = "MetaAsset";
    const symbol = "MAT";
    const version = "1";
    const initialSupply = new test_helpers_1.BN(100);
    beforeEach(async function () {
        this.token = await ERC20PermitMock.new(name, symbol, initialHolder, initialSupply);
        // We get the chain id from the contract because Ganache (used for coverage) does not return the same chain id
        // from within the EVM as from the JSON RPC interface.
        // See https://github.com/trufflesuite/ganache-core/issues/515
        this.chainId = await this.token.getChainId();
    });
    it("initial nonce is 0", async function () {
        expect(await this.token.nonces(initialHolder)).to.be.bignumber.equal("0");
    });
    it("domain separator", async function () {
        expect(await this.token.DOMAIN_SEPARATOR()).to.equal(await (0, EIP712_1.domainSeparator)(name, version, this.chainId, this.token.address));
    });
    describe("permit", function () {
        const wallet = ethereumjs_wallet_1.default.generate();
        const owner = wallet.getAddressString();
        const value = new test_helpers_1.BN(42);
        const nonce = 0;
        const maxDeadline = MAX_UINT256;
        const buildData = (chainId, verifyingContract, deadline = maxDeadline) => ({
            primaryType: "Permit",
            types: { EIP712Domain: EIP712_1.EIP712Domain, Permit: EIP712_1.Permit },
            domain: { name, version, chainId, verifyingContract },
            message: { owner, spender, value, nonce, deadline },
        });
        it("accepts owner signature", async function () {
            const data = buildData(this.chainId, this.token.address);
            const signature = (0, eth_sig_util_1.signTypedMessage)(wallet.getPrivateKey(), { data });
            const { v, r, s } = (0, ethereumjs_util_1.fromRpcSig)(signature);
            const receipt = await this.token.permit(owner, spender, value, maxDeadline, v, r, s);
            expect(await this.token.nonces(owner)).to.be.bignumber.equal("1");
            expect(await this.token.allowance(owner, spender)).to.be.bignumber.equal(value);
        });
        it("rejects reused signature", async function () {
            const data = buildData(this.chainId, this.token.address);
            const signature = (0, eth_sig_util_1.signTypedMessage)(wallet.getPrivateKey(), { data });
            const { v, r, s } = (0, ethereumjs_util_1.fromRpcSig)(signature);
            await this.token.permit(owner, spender, value, maxDeadline, v, r, s);
            await (0, test_helpers_1.expectRevert)(this.token.permit(owner, spender, value, maxDeadline, v, r, s), "ERC20Permit: invalid signature");
        });
        it("rejects other signature", async function () {
            const otherWallet = ethereumjs_wallet_1.default.generate();
            const data = buildData(this.chainId, this.token.address);
            const signature = (0, eth_sig_util_1.signTypedMessage)(otherWallet.getPrivateKey(), { data });
            const { v, r, s } = (0, ethereumjs_util_1.fromRpcSig)(signature);
            await (0, test_helpers_1.expectRevert)(this.token.permit(owner, spender, value, maxDeadline, v, r, s), "ERC20Permit: invalid signature");
        });
        it("rejects expired permit", async function () {
            const deadline = (await test_helpers_1.time.latest()) - test_helpers_1.time.duration.weeks(1);
            const data = buildData(this.chainId, this.token.address, deadline);
            const signature = (0, eth_sig_util_1.signTypedMessage)(wallet.getPrivateKey(), { data });
            const { v, r, s } = (0, ethereumjs_util_1.fromRpcSig)(signature);
            await (0, test_helpers_1.expectRevert)(this.token.permit(owner, spender, value, deadline, v, r, s), "ERC20Permit: expired deadline");
        });
    });
});
//# sourceMappingURL=MockERC20Permit.spec.js.map