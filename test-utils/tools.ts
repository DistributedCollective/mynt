import { asciiToHex as aToH, padRight, fromWei, toWei } from "web3-utils";
import BN from "bn.js";

const tokens = (amount: string | number): BN => toWei(new BN(amount), 'ether');

export { aToH, BN, padRight, fromWei, tokens };
