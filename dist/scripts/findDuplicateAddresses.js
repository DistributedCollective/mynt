"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-continue */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-restricted-syntax */
const fs_1 = __importDefault(require("fs"));
const node_logs_1 = __importDefault(require("node-logs"));
const readline_1 = __importDefault(require("readline"));
const logger = new node_logs_1.default().showInConsole(true);
const main = async () => {
    const stakers = [];
    const addresses = [];
    const fileStream = fs_1.default.createReadStream("addressList_joined");
    const rl = readline_1.default.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });
    for await (const line of rl) {
        const [address, power] = line.split(",");
        if (isLineValid(address, power)) {
            stakers.push({ address, power });
            addresses.push(address);
        }
    }
    const duplicateAddresses = findDuplicates(addresses);
    logger.error({ duplicateAddresses });
};
const findDuplicates = (arr) => arr.filter((item, index) => arr.indexOf(item) !== index);
const isLineValid = (address, power) => {
    if (!address || !power)
        return false; // ignore empty lines
    if (address === "Address")
        return false; // ignore header
    return true;
};
main();
//# sourceMappingURL=findDuplicateAddresses.js.map