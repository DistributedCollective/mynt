"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSIP = void 0;
/* eslint-disable no-console */
const config_1 = require("hardhat/config");
const node_logs_1 = __importDefault(require("node-logs"));
const SIPArgs_1 = __importDefault(require("./args/SIPArgs"));
const logger = new node_logs_1.default().showInConsole(true);
const createSIP = async (hre, sipArgs) => {
    const { ethers, deployments: { get }, } = hre;
    const Governor = await get("GovernorOwner");
    const governor = await ethers.getContractAt(Governor.abi, Governor.address);
    logger.info("=== Creating SIP ===");
    logger.info(`Governor Address:    ${governor.address}`);
    logger.info(`Targets:              ${sipArgs.targets}`);
    logger.info(`Values:              ${sipArgs.values}`);
    logger.info(`Signatures:           ${sipArgs.signatures}`);
    logger.info(`Data:                ${sipArgs.data}`);
    logger.info(`Description:         ${sipArgs.description}`);
    logger.info(`============================================================='`);
    const tx = await governor.propose(sipArgs.targets, sipArgs.values, sipArgs.signatures, sipArgs.data, sipArgs.description);
    const receipt = await tx.wait();
    const eventData = governor.interface.parseLog(receipt.logs[0]).args;
    logger.success("=== SIP has been created ===");
    logger.success(`Governor Address:     ${governor.address}`);
    logger.success(`Proposal ID:          ${eventData.id.toString()}`);
    logger.success(`Porposer:             ${eventData.proposer}`);
    logger.success(`Targets:              ${eventData.targets}`);
    logger.success(`Values:               ${eventData.values}`);
    logger.success(`Signatures:           ${eventData.signatures}`);
    logger.success(`Data:                 ${eventData.calldatas}`);
    logger.success(`Description:          ${eventData.description}`);
    logger.success(`Start Block:          ${eventData.startBlock}`);
    logger.success(`End Block:            ${eventData.endBlock}`);
    logger.success(`============================================================='`);
};
exports.createSIP = createSIP;
(0, config_1.task)("createSIP", "Create SIP to Sovryn Governance")
    .addParam("argsModuleName", "module name that is located in tasks/sips//args folder which and returning the sip arguments")
    .setAction(async ({ argsModuleName }, hre) => {
    const sipArgs = await SIPArgs_1.default[argsModuleName](hre);
    await (0, exports.createSIP)(hre, sipArgs);
});
//# sourceMappingURL=createSIP.js.map