"use strict";
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable prefer-destructuring */
/* eslint-disable @typescript-eslint/triple-slash-reference,spaced-comment */
/// <reference path="../../types/generated/index.d.ts" />
/// <reference path="../../types/generated/types.d.ts" />
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_logs_1 = __importDefault(require("node-logs"));
const fs_1 = require("fs");
const tools_1 = require("@utils/tools");
const constants_1 = require("@utils/constants");
const process_1 = require("process");
const stakingContractAddress = "0x5684a06CaB22Db16d901fEe2A5C081b4C91eA40e";
const logger = new node_logs_1.default().showInConsole(true);
let fd;
let lastBlockfd;
async function snapshot(truffle, networkName) {
    const web3 = truffle.web3;
    const artifacts = truffle.artifacts;
    const defaultAccount = (await web3.eth.getAccounts())[0];
    const Staking = artifacts.require("Staking");
    const staking = await Staking.at(stakingContractAddress);
    const addressMap = {};
    const originalFromBlock = 3070260;
    let fromBlock = originalFromBlock;
    const toBlock = 3454083;
    const batchSize = 10;
    const startTimestamp = await staking.kickoffTS();
    fd = await fs_1.promises.open("addressList_1", "a+");
    const csvContent = await fd.readFile();
    if (csvContent.length === 0) {
        fd.write("Address,VotingPower\n");
        logger.info(`Initializing CSV`);
    }
    lastBlockfd = await fs_1.promises.open("last_block", "r+");
    const content = await lastBlockfd.readFile();
    if (content.length > 0) {
        fromBlock = parseInt(content.toString());
        fromBlock += batchSize;
        logger.info(`Resuming from block ${fromBlock}`);
    }
    if (fromBlock > toBlock) {
        logger.info('Finished!');
        (0, process_1.exit)(0);
    }
    for (let pointer = fromBlock; pointer <= toBlock; pointer += batchSize) {
        const events = await staking.getPastEvents("TokensStaked", {
            fromBlock: pointer,
            toBlock: pointer + batchSize
        });
        for (const event of events) {
            const stakerAddress = event.returnValues.staker;
            if (addressMap[stakerAddress] !== 1) {
                addressMap[stakerAddress] = 1;
                await saveStaker(stakerAddress, toBlock, startTimestamp, staking, web3);
            }
        }
        logger.info(`current block: ${pointer} events: ${events.length} progress: ${((pointer - originalFromBlock) / (toBlock - originalFromBlock)).toFixed(3)}`);
        lastBlockfd.write(pointer.toString(), 0);
    }
}
exports.default = snapshot;
async function saveStaker(address, fromBlock, date, staking, web3) {
    const code = await web3.eth.getCode(address);
    if (code.length > 3) {
        return;
    }
    if (address === constants_1.ZERO_ADDRESS) {
        return;
    }
    const votingPower = await staking.getPriorVotes(address, fromBlock, date);
    if (!votingPower.gt(new tools_1.BN(0))) {
        return;
    }
    fd.write(`${address},${votingPower.toString()}\n`);
    logger.info(`New staker: ${address}. VotingPower: ${votingPower.toString()}`);
}
//# sourceMappingURL=snapshot_list.js.map