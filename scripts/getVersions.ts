/* eslint-disable no-console */
import hre from "hardhat";
import Logs from "node-logs";
import { getDeployed, setNetwork } from "migrations/utils/state";

const MassetV3 = artifacts.require("MassetV3");
const BasketManagerV3 = artifacts.require("BasketManagerV3");

const logger = new Logs().showInConsole(true);

const main = async () => {
    const { network } = hre;
    setNetwork(network.name);

    const logVersionsForInstance = async (symbol: string) => {
        logger.warn(`-------------------- ${symbol} --------------------\n`);

        try {
            const massetMock = await getDeployed(MassetV3, `${symbol}_MassetProxy`);
            logger.success(`-- Masset version: ${await massetMock.getVersion()}`);

            const basketManagerMock = await getDeployed(BasketManagerV3, `${symbol}_BasketManagerV3`);
            logger.success(`-- Basket Manager version: ${await basketManagerMock.getVersion()}\n`);
        } catch (e) {
            logger.err("error", ["bold"]);
            console.log(e);
        }
    };

    await logVersionsForInstance('XUSD');
    await logVersionsForInstance('ETHs');
    await logVersionsForInstance('BNBs');
};

main()
    .then(() => process.exit(0))
    .catch((error) => {
        logger.err('ERROR');
        console.error(error);
        process.exit(1);
    });
