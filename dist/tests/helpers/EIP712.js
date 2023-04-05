"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.domainSeparator = exports.PERMIT_TYPEHASH = exports.Permit = exports.EIP712Domain = void 0;
const eth_sig_util_1 = require("eth-sig-util");
const web3_utils_1 = require("web3-utils");
const PERMIT_TYPEHASH = (0, web3_utils_1.keccak256)("Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)");
exports.PERMIT_TYPEHASH = PERMIT_TYPEHASH;
const EIP712Domain = [
    { name: "name", type: "string" },
    { name: "version", type: "string" },
    { name: "chainId", type: "uint256" },
    { name: "verifyingContract", type: "address" },
];
exports.EIP712Domain = EIP712Domain;
const Permit = [
    { name: "owner", type: "address" },
    { name: "spender", type: "address" },
    { name: "value", type: "uint256" },
    { name: "nonce", type: "uint256" },
    { name: "deadline", type: "uint256" },
];
exports.Permit = Permit;
async function domainSeparator(name, version, chainId, verifyingContract) {
    return `0x${eth_sig_util_1.TypedDataUtils.hashStruct("EIP712Domain", { name, version, chainId, verifyingContract }, { EIP712Domain }).toString("hex")}`;
}
exports.domainSeparator = domainSeparator;
//# sourceMappingURL=EIP712.js.map