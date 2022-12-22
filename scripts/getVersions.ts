/* eslint-disable no-console */
import hre from "hardhat";
import Logs from "node-logs";
import { getDeployed, setNetwork } from "migrations/utils/state";

const MassetManager = artifacts.require("MassetManager");
const BasketManagerV3 = artifacts.require("BasketManagerV3");

const logger = new Logs().showInConsole(true);

const main = async () => {
  const { network } = hre;
  setNetwork(network.name);

  const logVersionsForInstance = async (symbol: string) => {
    logger.warn(`-------------------- ${symbol} --------------------\n`);

    try {
      const massetManagerMock = await getDeployed(
        MassetManager,
        `${symbol}_MassetManagerProxy`
      );
      logger.success(
        `-- MassetManager version: ${await massetManagerMock.getVersion()}`
      );

      const basketManagerMock = await getDeployed(
        BasketManagerV3,
        `${symbol}_BasketManagerV3`
      );
      logger.success(
        `-- Basket Manager version: ${await basketManagerMock.getVersion()}\n`
      );
    } catch (e) {
      logger.err("error", ["bold"]);
      console.log(e);
    }
  };

  await logVersionsForInstance("XUSD");
  await logVersionsForInstance("ETHs");
  await logVersionsForInstance("BNBs");
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    logger.err("ERROR");
    console.error(error);
    process.exit(1);
  });
