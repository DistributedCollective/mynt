/* eslint-disable no-console */
import Logs from "node-logs";
import hre from "hardhat";
import { Instances } from "migrations/utils/addresses";
import { TransferOwnershipParams } from "./tasks/transferOwnership";

const logger = new Logs().showInConsole(true);

const main = async () => {
    const { run } = hre;

    const transferForSymbol = async (symbol: Instances) => {
        const contractsList: TransferOwnershipParams = {
            contracts: [
                `${symbol}_FeesVaultProxy`,
                `${symbol}_MassetProxy`,
                `${symbol}_BasketManagerV3`,
                `${symbol}_RewardsManager`,
            ],
            instance: symbol
        };
        await run("transferOwnership", contractsList);
    };

    // await transferForSymbol('XUSD');
    // await transferForSymbol('ETHs');
    // await transferForSymbol('BNBs');
    await transferForSymbol('MYNT');

    logger.success("Finish");
};

main()
    .then(() => process.exit(0))
    .catch((error) => {
        logger.err('ERROR');
        console.error(error);
        process.exit(1);
    });
