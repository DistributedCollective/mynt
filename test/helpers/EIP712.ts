import { TypedDataUtils } from "eth-sig-util";
import { keccak256 } from "web3-utils";

const PERMIT_TYPEHASH = keccak256(
  "Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)"
);

const EIP712Domain = [
  { name: "name", type: "string" },
  { name: "version", type: "string" },
  { name: "chainId", type: "uint256" },
  { name: "verifyingContract", type: "address" },
];

const Permit = [
  { name: "owner", type: "address" },
  { name: "spender", type: "address" },
  { name: "value", type: "uint256" },
  { name: "nonce", type: "uint256" },
  { name: "deadline", type: "uint256" },
];

async function domainSeparator(name, version, chainId, verifyingContract) {
  return `0x${TypedDataUtils.hashStruct(
    "EIP712Domain",
    { name, version, chainId, verifyingContract },
    { EIP712Domain }
  ).toString("hex")}`;
}

export { EIP712Domain, Permit, PERMIT_TYPEHASH, domainSeparator };
