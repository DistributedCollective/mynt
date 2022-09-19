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

import Web3 from "web3";
import Logs from "node-logs";
import { promises as fsPromises } from "fs";
import { StakingInstance } from "types/generated";
import { BN } from "@utils/tools";
import { ZERO_ADDRESS } from "@utils/constants";
import { exit } from "process";

const stakingContractAddress = "0x5684a06CaB22Db16d901fEe2A5C081b4C91eA40e"

const logger = new Logs().showInConsole(true);
let fd: fsPromises.FileHandle;
let lastBlockfd: fsPromises.FileHandle;

export default async function snapshot(truffle, networkName: string): Promise<void> {
    const web3: Web3 = truffle.web3;
    const artifacts: Truffle.Artifacts = truffle.artifacts;
    const defaultAccount = (await web3.eth.getAccounts())[0];

    const Staking = artifacts.require("Staking");
    const staking = await Staking.at(stakingContractAddress);

    const addressMap: { [address: string]: number } = {};
    const originalFromBlock = 3070260;
    let fromBlock = originalFromBlock;
    const toBlock = 3454083;
    const batchSize = 10;

    const startTimestamp = await staking.kickoffTS();

    fd = await fsPromises.open("addressList_1", "a+");
    const csvContent = await fd.readFile();
    if (csvContent.length === 0) {
        fd.write("Address,VotingPower\n");
        logger.info(`Initializing CSV`);
    }

    lastBlockfd = await fsPromises.open("last_block", "r+");

    const content = await lastBlockfd.readFile();
    if (content.length > 0) {
        fromBlock = parseInt(content.toString());
        fromBlock += batchSize;
        logger.info(`Resuming from block ${fromBlock}`);
    }

    if (fromBlock > toBlock) {
        logger.info('Finished!');
        exit(0);
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

async function saveStaker(address: string, fromBlock: string | number | BN, date: string | number | BN, staking: StakingInstance, web3: Web3) {
    const code = await web3.eth.getCode(address);
    if (code.length > 3) {
        return;
    }

    if (address === ZERO_ADDRESS) {
        return;
    }

    const votingPower = await staking.getPriorVotes(address, fromBlock, date);
    if (!votingPower.gt(new BN(0))) {
        return;
    }

    fd.write(`${address},${votingPower.toString()}\n`);
    logger.info(`New staker: ${address}. VotingPower: ${votingPower.toString()}`);
}

