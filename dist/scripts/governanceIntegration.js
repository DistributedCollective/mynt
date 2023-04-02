"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-console */
const node_logs_1 = __importDefault(require("node-logs"));
const hardhat_1 = __importDefault(require("hardhat"));
const logger = new node_logs_1.default().showInConsole(true);
const main = async () => {
    const { run } = hardhat_1.default;
    const transferForSymbol = async (symbol) => {
        const contractsList = {
            contracts: [
                `${symbol}_FeesVaultProxy`,
                `${symbol}_MassetManagerProxy`,
                `${symbol}_BasketManagerV3`,
                `${symbol}_RewardsManager`,
            ],
            instance: symbol,
        };
        await run("transferOwnership", contractsList);
    };
    // await transferForSymbol('XUSD');
    // await transferForSymbol('ETHs');
    // await transferForSymbol('BNBs');
    await transferForSymbol("MYNT");
    logger.success("Finish");
};
main()
    .then(() => process.exit(0))
    .catch((error) => {
    logger.err("ERROR");
    console.error(error);
    process.exit(1);
});
//# sourceMappingURL=governanceIntegration.js.map