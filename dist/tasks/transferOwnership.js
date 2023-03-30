"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transferOwnership = void 0;
const config_1 = require("hardhat/config");
const node_logs_1 = __importDefault(require("node-logs"));
const helpers = __importStar(require("../scripts/utils/helpers"));
const logger = new node_logs_1.default().showInConsole(true);
(0, config_1.task)("ownership:transfer", "Upgrade implementation of feesManager contract")
    .addParam("newOwner", "New address of the owner", undefined, config_1.types.string, false)
    .addVariadicPositionalParam("contractAddresses", "Array of contract address which ownership will be transferred")
    .addOptionalParam("isMultisig", "flag if transaction needs to be intiated from the multisig contract")
    .setAction(async ({ contractAddresses, newOwner, isMultisig }, hre) => {
    await Promise.all(contractAddresses.map(async (contractAddress) => {
        await (0, exports.transferOwnership)(hre, contractAddress, newOwner, isMultisig);
    }));
});
// eslint-disable-next-line no-underscore-dangle
const transferOwnership = async (hre, contractAddress, newOwner, isMultisig = false) => {
    const { ethers, getNamedAccounts, deployments: { get }, } = hre;
    const ownableABI = [
        "function transferOwnership(address newOwner)",
        "function owner() view returns(address)",
    ];
    const ownable = await ethers.getContractAt(ownableABI, contractAddress);
    if (isMultisig) {
        const { deployer } = await getNamedAccounts();
        const multisigAddress = (await get("MultiSigWallet")).address;
        const data = ownable.interface.encodeFunctionData("transferOwnership", [
            newOwner,
        ]);
        await helpers.sendWithMultisig(multisigAddress, contractAddress, data, deployer);
    }
    else {
        await (await ownable.transferOwnership(newOwner)).wait();
        if ((await ownable.owner()) === newOwner) {
            logger.success(`Contract ${contractAddress} ownership has been transferred to: ${await ownable.owner()}`);
        }
        else {
            logger.error(`Contract ${contractAddress} ownership has NOT been transferred to: ${await ownable.owner()}`);
        }
    }
};
exports.transferOwnership = transferOwnership;
//# sourceMappingURL=transferOwnership.js.map