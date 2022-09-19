/* eslint-disable no-await-in-loop */
/* eslint-disable no-plusplus */
import Web3 from "web3";
import Logs from "node-logs";
import { BN } from "@utils/tools";
import { EthereumProvider } from "hardhat/types";

const logger = new Logs().showInConsole(true);

export const nowSimple = (): number => Math.ceil(Date.now() / 1000);

export const nowExact = (): BN => new BN(nowSimple());

export const blockTimestampSimple = async (web3: Web3, block = "latest"): Promise<string> => {
    const { timestamp } = await web3.eth.getBlock(block);
    return timestamp.toString();
};

export const blockTimestampExact = async (web3: Web3, block = "latest"): Promise<BN> => {
    const timestamp = await blockTimestampSimple(web3, block);
    return new BN(timestamp);
};

export const timeTravel = async (web3: any, seconds: number) => {
    const timestamp = await blockTimestampSimple(web3);
    const newTimestamp = timestamp + seconds;
    console.log(`Advancing block time ${seconds} seconds...`);

    return new Promise((resolve, reject) => {
        web3.currentProvider.send(
            {
                jsonrpc: "2.0",
                method: "evm_mine",
                params: [newTimestamp],
                id: new Date().getTime(),
            },
            (err, result) => {
                if (err) {
                    return reject(err);
                }
                return resolve(result);
            },
        );
    });
};

export const mineBlock = async (provider: EthereumProvider, timestamp: number): Promise<void> => {
    logger.info(`Forcing mining new block with timestamp: ${timestamp}`);
    return provider.send('evm_mine', [timestamp]);
};

export const mineBlocks = async (provider: EthereumProvider, web3: Web3, offset: number): Promise<void> => {
    logger.info(`Forcing mining ${offset} blocks`);

    for (let i = 0; i < offset; i++) {
        const currTimestamp = await blockTimestampSimple(web3);
        await provider.send('evm_mine', [Number(currTimestamp) + 1]);
    }
};

export const waitForBlock = async (web3: Web3, offset: number): Promise<void> => {
    const startingBlock = await web3.eth.getBlock("latest");

    logger.info(`Current block: ${startingBlock.number}`);
    logger.info(`Waiting for block: ${startingBlock.number + offset} ...`);

    await new Promise<void>((resolve, revert) => {
        let interval: NodeJS.Timeout;

        const check = async (): Promise<void> => {
            let currentBlockNumber: number;

            try {
                currentBlockNumber = (await web3.eth.getBlock("latest")).number;
            } catch (e) {
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

export const waitOrMineBlocks = async (provider: EthereumProvider, web3: Web3, offset: number, isDevelopmentNetwork: boolean): Promise<void> => {
    if (isDevelopmentNetwork) {
        await mineBlocks(provider, web3, offset);
    } else {
        await waitForBlock(web3, offset);
    }
};

export const wait = (timeout: number): Promise<void> => new Promise((resolve) => {
    setTimeout(() => {
        resolve();
    }, timeout);
});
