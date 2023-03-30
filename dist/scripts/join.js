"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-continue */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-restricted-syntax */
const fs_1 = __importStar(require("fs"));
const node_logs_1 = __importDefault(require("node-logs"));
const readline_1 = __importDefault(require("readline"));
const logger = new node_logs_1.default().showInConsole(true);
let fd;
const newStakersJoined = [];
const main = async () => {
    fd = await fs_1.promises.open("addressList_joined", "a+");
    const csvContent = await fd.readFile();
    if (csvContent.length === 0) {
        fd.write("Address,VotingPower\n");
        logger.info(`Initializing CSV`);
    }
    const newStakersInfo = await readNewAddresses();
    const fileStream = fs_1.default.createReadStream("addressList_2_unique_copy");
    const rl = readline_1.default.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });
    for await (const line of rl) {
        const [address, power] = line.split(",");
        if (isLineValid(address, power)) {
            await saveUpdatedStaker({ address, power }, newStakersInfo);
        }
    }
    const restOfStakers = newStakersInfo.filter(({ address }) => !newStakersJoined.includes(address));
    logger.success(`Found ${newStakersJoined.length} stakers to update`);
    logger.success(`Appending rest of ${restOfStakers.length} stakers`);
    await appendRestOfNewStakers(restOfStakers);
};
const readNewAddresses = async () => {
    const stakersInfo = [];
    const fileStream = fs_1.default.createReadStream("addressList_extend_unique_copy");
    const rl = readline_1.default.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });
    for await (const line of rl) {
        const [address, power] = line.split(",");
        if (isLineValid(address, power)) {
            stakersInfo.push({ address, power });
        }
    }
    return stakersInfo;
};
const saveUpdatedStaker = async (oldData, newStakers) => {
    const updatedStaker = newStakers.find(({ address }) => address === oldData.address);
    if (updatedStaker) {
        if (!newStakersJoined.includes(updatedStaker.address)) {
            fd.write(`${updatedStaker.address},${updatedStaker.power}\n`);
            logger.warn(`Updating staker and adding old staker: ${updatedStaker.address}`);
            newStakersJoined.push(updatedStaker.address);
        }
        else {
            logger.err(`Duplacate: ${updatedStaker.address}`);
        }
        return;
    }
    fd.write(`${oldData.address},${oldData.power}\n`);
    logger.info(`Adding old staker: ${oldData.address}`);
};
const appendRestOfNewStakers = async (restOfStakers) => {
    for (const { address, power } of restOfStakers) {
        fd.write(`${address},${power}\n`);
        logger.warn(`Appending new staker: ${address}`);
    }
};
const isLineValid = (address, power) => {
    if (!address || !power)
        return false; // ignore empty lines
    if (address === "Address")
        return false; // ignore header
    return true;
};
main();
//# sourceMappingURL=join.js.map