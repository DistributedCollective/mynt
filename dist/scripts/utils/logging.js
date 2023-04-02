"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logTx = exports.logAndSanitizeArgs = exports.logObject = exports.logSeparator = exports.logBlockTimestamp = void 0;
// eslint-disable-next-line import/no-extraneous-dependencies
const chalk_1 = __importDefault(require("chalk"));
const time_1 = require("./time");
const logBlockTimestamp = async (web3, block = "latest") => {
    const timestamp = await (0, time_1.blockTimestampSimple)(web3, block);
    console.log(`Current block timestamp: ${timestamp}`);
};
exports.logBlockTimestamp = logBlockTimestamp;
const logSeparator = () => {
    console.log(chalk_1.default.gray("------------------------------------------------"));
};
exports.logSeparator = logSeparator;
const logObject = (obj) => {
    const keys = Object.keys(obj);
    console.table(keys.sort().reduce((acc, key) => ({
        [key]: obj[key].toString(),
        ...acc,
    }), {}));
};
exports.logObject = logObject;
const logAndSanitizeArgs = (args) => {
    (0, exports.logObject)(sanitizeArgs(args));
};
exports.logAndSanitizeArgs = logAndSanitizeArgs;
const sanitizeArgs = (args) => {
    // Remove indexed keys, use named keys
    return Object.keys(args)
        .filter((key) => key !== "__length__" && !Number.isInteger(parseInt(key, 10)))
        .reduce((acc, key) => ({ ...acc, [key]: args[key] }), {});
};
const logTxResponse = ({ logs }) => {
    logs.forEach(({ event, args }) => {
        console.log(chalk_1.default.gray("Event ") + chalk_1.default.italic(event));
        (0, exports.logAndSanitizeArgs)(args);
    });
};
const logTx = async (txPromise, description) => {
    (0, exports.logSeparator)();
    console.log(`${chalk_1.default.blue("[tx]")} ${description}`);
    let response;
    try {
        response = await txPromise;
    }
    catch (error) {
        console.log(chalk_1.default.blue(" --> ") + chalk_1.default.redBright("✘ Failed!"));
        throw error;
    }
    console.log(chalk_1.default.blue(" --> ") + chalk_1.default.greenBright("✔ Success!"));
    if (Array.isArray(response)) {
        response.map(logTxResponse);
    }
    else {
        logTxResponse(response);
    }
    return response;
};
exports.logTx = logTx;
// export const logTrancheData = async (forge: ForgeRewardsMUSDInstance, trancheNumber: string) => {
//     const [
//         startTime,
//         endTime,
//         claimEndTime,
//         unlockTime,
//         totalMintVolume,
//         totalRewardUnits,
//         unclaimedRewardUnits,
//         rewardees,
//     ] = await forge.getTrancheData(trancheNumber);
//     const data = {
//         startTime,
//         endTime,
//         claimEndTime,
//         unlockTime,
//         totalMintVolume,
//         totalRewardUnits,
//         unclaimedRewardUnits,
//         rewardees,
//     };
//     logSeparator();
//     console.log(`Tranche ${trancheNumber} data:`);
//     logObject(data);
//     return data;
// };
// export const logRewardeeData = async (
//     forge: ForgeRewardsMUSDInstance,
//     trancheNumber: string,
//     account: string,
// ): Promise<{
//     claimed: boolean;
//     claimWindowClosed: boolean;
//     mintVolume: BN;
//     mintWindowClosed: boolean;
//     redeemed: boolean;
//     rewardAllocation: BN;
//     unlocked: boolean;
// }> => {
//     const data: {
//         claimed: boolean;
//         claimWindowClosed: boolean;
//         mintVolume: string;
//         mintWindowClosed: boolean;
//         redeemed: boolean;
//         rewardAllocation: string;
//         unlocked: boolean;
//     } = await forge.contract.methods["getRewardeeData(uint256,address)"](
//         trancheNumber,
//         account,
//     ).call();
//     data.rewardAllocation = new BN(data.rewardAllocation);
//     data.mintVolume = new BN(data.mintVolume);
//     logSeparator();
//     console.log(`Rewardee data for ${account} in tranche ${trancheNumber}:`);
//     logAndSanitizeArgs(data);
//     return data;
// };
//# sourceMappingURL=logging.js.map