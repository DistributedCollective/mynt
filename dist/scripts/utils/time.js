"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wait = exports.waitOrMineBlocks = exports.waitForBlock = exports.mineBlocks = exports.mineBlock = exports.timeTravel = exports.blockTimestampExact = exports.blockTimestampSimple = exports.nowExact = exports.nowSimple = void 0;
const node_logs_1 = __importDefault(require("node-logs"));
const tools_1 = require("@utils/tools");
const logger = new node_logs_1.default().showInConsole(true);
const nowSimple = () => Math.ceil(Date.now() / 1000);
exports.nowSimple = nowSimple;
const nowExact = () => new tools_1.BN((0, exports.nowSimple)());
exports.nowExact = nowExact;
const blockTimestampSimple = async (web3, block = "latest") => {
    const { timestamp } = await web3.eth.getBlock(block);
    return timestamp.toString();
};
exports.blockTimestampSimple = blockTimestampSimple;
const blockTimestampExact = async (web3, block = "latest") => {
    const timestamp = await (0, exports.blockTimestampSimple)(web3, block);
    return new tools_1.BN(timestamp);
};
exports.blockTimestampExact = blockTimestampExact;
const timeTravel = async (web3, seconds) => {
    const timestamp = await (0, exports.blockTimestampSimple)(web3);
    const newTimestamp = timestamp + seconds;
    console.log(`Advancing block time ${seconds} seconds...`);
    return new Promise((resolve, reject) => {
        web3.currentProvider.send({
            jsonrpc: "2.0",
            method: "evm_mine",
            params: [newTimestamp],
            id: new Date().getTime(),
        }, (err, result) => {
            if (err) {
                return reject(err);
            }
            return resolve(result);
        });
    });
};
exports.timeTravel = timeTravel;
const mineBlock = async (provider, timestamp) => {
    logger.info(`Forcing mining new block with timestamp: ${timestamp}`);
    return provider.send('evm_mine', [timestamp]);
};
exports.mineBlock = mineBlock;
const mineBlocks = async (provider, web3, offset) => {
    logger.info(`Forcing mining ${offset} blocks`);
    for (let i = 0; i < offset; i++) {
        const currTimestamp = await (0, exports.blockTimestampSimple)(web3);
        await provider.send('evm_mine', [Number(currTimestamp) + 1]);
    }
};
exports.mineBlocks = mineBlocks;
const waitForBlock = async (web3, offset) => {
    const startingBlock = await web3.eth.getBlock("latest");
    logger.info(`Current block: ${startingBlock.number}`);
    logger.info(`Waiting for block: ${startingBlock.number + offset} ...`);
    await new Promise((resolve, revert) => {
        let interval;
        const check = async () => {
            let currentBlockNumber;
            try {
                currentBlockNumber = (await web3.eth.getBlock("latest")).number;
            }
            catch (e) {
                logger.error("Error in getting block number");
                console.log(e);
                revert(e);
                return;
            }
            if (currentBlockNumber >= (startingBlock.number + offset)) {
                clearInterval(interval);
                resolve();
            }
        };
        interval = setInterval(check, 500);
    });
};
exports.waitForBlock = waitForBlock;
const waitOrMineBlocks = async (provider, web3, offset, isDevelopmentNetwork) => {
    if (isDevelopmentNetwork) {
        await (0, exports.mineBlocks)(provider, web3, offset);
    }
    else {
        await (0, exports.waitForBlock)(web3, offset);
    }
};
exports.waitOrMineBlocks = waitOrMineBlocks;
const wait = (timeout) => new Promise((resolve) => {
    setTimeout(() => {
        resolve();
    }, timeout);
});
exports.wait = wait;
//# sourceMappingURL=time.js.map