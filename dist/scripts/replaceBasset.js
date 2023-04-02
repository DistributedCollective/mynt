"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-console */
const hardhat_1 = __importDefault(require("hardhat"));
const node_logs_1 = __importDefault(require("node-logs"));
const state_1 = require("migrations/utils/state");
const BasketManagerV3 = artifacts.require("BasketManagerV3");
const logger = new node_logs_1.default().showInConsole(true);
const symbol = 'MYNT';
const PREV_BASSET = "0x71A2D1f9611eA45181aee147A84673f355894D70";
const NEW_BASSET = "0x71A2D1f9611eA45181aee147A84673f355894D70";
const NEW_BRIDGE = "0x71f14023e3eeacdd028e49a6776e81bb04d60b98";
const main = async () => {
    const { network } = hardhat_1.default;
    (0, state_1.setNetwork)(network.name);
    const basketManager = await (0, state_1.getDeployed)(BasketManagerV3, `${symbol}_BasketManagerV3`);
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
//# sourceMappingURL=replaceBasset.js.map