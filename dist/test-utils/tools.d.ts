import { asciiToHex as aToH, padRight, fromWei } from "web3-utils";
import BN from "bn.js";
declare const tokens: (amount: string | number) => BN;
export { aToH, BN, padRight, fromWei, tokens };
