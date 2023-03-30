"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-console */
const hardhat_1 = __importDefault(require("hardhat"));
const node_logs_1 = __importDefault(require("node-logs"));
const state_1 = require("migrations/utils/state");
const MassetManager = artifacts.require("MassetManager");
const BasketManagerV3 = artifacts.require("BasketManagerV3");
const logger = new node_logs_1.default().showInConsole(true);
const main = async () => {
    const { network } = hardhat_1.default;
    (0, state_1.setNetwork)(network.name);
    const logVersionsForInstance = async (symbol) => {
        logger.warn(`-------------------- ${symbol} --------------------\n`);
        try {
            const massetManagerMock = await (0, state_1.getDeployed)(MassetManager, `${symbol}_MassetManagerProxy`);
            logger.success(`-- MassetManager version: ${await massetManagerMock.getVersion()}`);
            const basketManagerMock = await (0, state_1.getDeployed)(BasketManagerV3, `${symbol}_BasketManagerV3`);
            logger.success(`-- Basket Manager version: ${await basketManagerMock.getVersion()}\n`);
        }
        catch (e) {
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
//# sourceMappingURL=getVersions.js.map