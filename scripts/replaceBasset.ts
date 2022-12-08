/* eslint-disable no-console */
import hre from "hardhat";
import Logs from "node-logs";
import { getDeployed, setNetwork } from "migrations/utils/state";
import { Instances } from "migrations/utils/addresses";

const BasketManagerV3 = artifacts.require("BasketManagerV3");

const logger = new Logs().showInConsole(true);

const symbol: Instances = 'MYNT';

const PREV_BASSET = "0x71A2D1f9611eA45181aee147A84673f355894D70";

const NEW_BASSET = "0x71A2D1f9611eA45181aee147A84673f355894D70";
const NEW_BRIDGE = "0x71f14023e3eeacdd028e49a6776e81bb04d60b98";

const main = async () => {
    const { network } = hre;
    setNetwork(network.name);

    const basketManager = await getDeployed(BasketManagerV3, `${symbol}_BasketManagerV3`);

    logger.info(`removing basset: ${PREV_BASSET}`);
    await basketManager.removeBasset(PREV_BASSET);

    logger.info(`setting new basset: ${NEW_BASSET}`);
    await basketManager.addBasset(NEW_BASSET, 1, NEW_BRIDGE, 0, 1000, false);

    logger.success("Basset updated");
};

main()
    .then(() => process.exit(0))
    .catch((error) => {
        logger.err('ERROR');
        console.error(error);
        process.exit(1);
    });
