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
const config_1 = require("hardhat/config");
const helpers = __importStar(require("../scripts/utils/helpers"));
const createSIP_1 = require("./sips/createSIP");
const node_logs_1 = __importDefault(require("node-logs"));
const logger = new node_logs_1.default().showInConsole(true);
(0, config_1.task)("mynt:get-massetManagerConfig", "Fetch massetManagerProxy address")
    .addParam("contractAddress", "Meta asset token contract address (DLLR, etc)", undefined, config_1.types.string, false)
    .setAction(async ({ contractAddress }, hre) => {
    const { ethers } = hre;
    const MetaAssetToken = await ethers.getContractAt("MetaAssetToken", contractAddress);
    console.log(`massetManagerProxy address: ${await MetaAssetToken.massetManagerProxy()}`);
    console.log(`massetManagerImplementation address: ${await MetaAssetToken.massetManagerImplementation()}`);
});
(0, config_1.task)("mynt:get-basketManagerConfig", "Fetch basketManagerProxy address")
    .addParam("contractAddress", "Meta asset token contract address (DLLR, etc)", undefined, config_1.types.string, false)
    .setAction(async ({ contractAddress }, hre) => {
    const { ethers } = hre;
    const MetaAssetToken = await ethers.getContractAt("MetaAssetToken", contractAddress);
    console.log(`basketManagerProxy address: ${await MetaAssetToken.basketManagerProxy()}`);
    console.log(`basketManagerImplementation address: ${await MetaAssetToken.basketManagerImplementation()}`);
});
(0, config_1.task)("mynt:get-chainid", "Fetch chain id")
    .addParam("contractAddress", "Meta asset token contract address (DLLR, etc)", undefined, config_1.types.string, false)
    .setAction(async ({ contractAddress }, hre) => {
    const { ethers } = hre;
    const MetaAssetToken = await ethers.getContractAt("MetaAssetToken", contractAddress);
    console.log(`chain id: ${await MetaAssetToken.getChainId()}`);
});
(0, config_1.task)("multisig:set-massetManagerProxy", "Set massetManagerProxy")
    .addParam("contractAddress", "Meta asset token contract address (DLLR, etc)", undefined, config_1.types.string, false)
    .addParam("newMassetManagerProxy", "new masset manager proxy address", undefined, config_1.types.string, false)
    .addOptionalParam("isMultisig", "flag if transaction needs to be intiated from the multisig contract")
    .addOptionalParam("isSIP", "flag if transaction needs to be initiated from the SIP")
    .setAction(async ({ contractAddress, newMassetManagerProxy, isMultisig, isSIP }, hre) => {
    // if isMultisig & isSIP are false, assign based on network tags.
    const { network } = hre;
    if (!isMultisig && !isSIP) {
        let { isMultisigFlag, isSIPFlag } = helpers.defaultValueMultisigOrSipFlag(network.tags);
        isMultisig = isMultisigFlag;
        isSIP = isSIPFlag;
    }
    helpers.injectHre(hre);
    const { ethers, deployments: { get }, getNamedAccounts, } = hre;
    const MetaAssetToken = await ethers.getContractAt("MetaAssetToken", contractAddress);
    const { deployer } = await getNamedAccounts();
    if (isMultisig) {
        const multisigAddress = (await get("MultisigWallet")).address;
        const data = MetaAssetToken.interface.encodeFunctionData("setMassetManagerProxy", [newMassetManagerProxy]);
        await helpers.sendWithMultisig(multisigAddress, MetaAssetToken.address, data, deployer);
    }
    else if (isSIP) {
        const signature = "setMassetManagerProxy(address)";
        const data = MetaAssetToken.interface.encodeFunctionData("setMassetManagerProxy", [newMassetManagerProxy]);
        const sipArgs = {
            targets: [contractAddress],
            values: [0],
            signatures: [signature],
            data: [data],
            description: "Set massetManagerProxy address",
        };
        (0, createSIP_1._createSIP)(hre, sipArgs);
    }
    else {
        await MetaAssetToken.setMassetManagerProxy(newMassetManagerProxy);
    }
});
(0, config_1.task)("multisig:set-basketManagerProxy", "Set basketManagerProxy")
    .addParam("contractAddress", "Meta asset token contract address (DLLR, etc)", undefined, config_1.types.string, false)
    .addParam("newBasketManagerProxy", "new basket manager proxy address", undefined, config_1.types.string, false)
    .addOptionalParam("isMultisig", "flag if transaction needs to be intiated from the multisig contract")
    .addOptionalParam("isSIP", "flag if transaction needs to be initiated from the SIP")
    .setAction(async ({ contractAddress, newBasketManagerProxy, isMultisig, isSIP }, hre) => {
    const { network } = hre;
    if (!isMultisig && !isSIP) {
        let { isMultisigFlag, isSIPFlag } = helpers.defaultValueMultisigOrSipFlag(network.tags);
        isMultisig = isMultisigFlag;
        isSIP = isSIPFlag;
    }
    // if isMultisig & isSIP are false, transaction will be initiated as per normal
    helpers.injectHre(hre);
    const { ethers, deployments: { get }, getNamedAccounts, } = hre;
    const MetaAssetToken = await ethers.getContractAt("MetaAssetToken", contractAddress);
    const { deployer } = await getNamedAccounts();
    if (isMultisig) {
        const multisigAddress = (await get("MultisigWallet")).address;
        const data = MetaAssetToken.interface.encodeFunctionData("setBasketManagerProxy", [newBasketManagerProxy]);
        await helpers.sendWithMultisig(multisigAddress, MetaAssetToken.address, data, deployer);
    }
    else if (isSIP) {
        const signature = "setBasketManagerProxy(address)";
        const data = MetaAssetToken.interface.encodeFunctionData("setBasketManagerProxy", [newBasketManagerProxy]);
        const sipArgs = {
            targets: [contractAddress],
            values: [0],
            signatures: [signature],
            data: [data],
            description: "Set basketManagerProxy address",
        };
        (0, createSIP_1._createSIP)(hre, sipArgs);
    }
    else {
        await MetaAssetToken.setBasketManagerProxy(newBasketManagerProxy);
    }
});
/** BasketManager contract interaction */
(0, config_1.task)("basketManager:isValidBasset", "Checks if bAasset is valid by checking its presence in the bAssets factors list")
    .addParam("basset", "Basset address to be checked", undefined, config_1.types.string, false)
    .setAction(async ({ basset }, hre) => {
    const { ethers } = hre;
    const basketManager = await ethers.getContract("BasketManagerV3"); // as BasketManagerV3;
    console.log("is valid: ", await basketManager.isValidBasset(basset));
});
(0, config_1.task)("basketManager:checkBasketBalanceForDeposit", "Checks if ratio of bAssets in basket is within limits to make a deposit of specific asset")
    .addParam("basset", "Basset address to deposit", undefined, config_1.types.string, false)
    .addParam("bassetQuantity", "Amount of bAssets to deposit", undefined, config_1.types.string, false)
    .setAction(async ({ basset, bassetQuantity }, hre) => {
    const { ethers } = hre;
    const basketManager = await ethers.getContract("BasketManagerV3"); // as BasketManagerV3;
    console.log("result: ", await basketManager.checkBasketBalanceForDeposit(basset, bassetQuantity));
});
(0, config_1.task)("basketManager:checkBasketBalanceForWithdrawal", "Checks if ratio of bAssets in basket is within limits to make a withdrawal of specific asset")
    .addParam("basset", "Basset address to redeem", undefined, config_1.types.string, false)
    .addParam("bassetQuantity", "Amount of bAssets to redeem", undefined, config_1.types.string, false)
    .setAction(async ({ basset, bassetQuantity }, hre) => {
    const { ethers } = hre;
    const basketManager = await ethers.getContract("BasketManagerV3"); // as BasketManagerV3;
    console.log("result: ", await basketManager.checkBasketBalanceForWithdrawal(basset, bassetQuantity));
});
(0, config_1.task)("basketManager:convertBassetToMassetQuantity", "Converts bAsset to mAsset quantity")
    .addParam("basset", "Basset address", undefined, config_1.types.string, false)
    .addParam("bassetQuantity", "Amount of bAssets to check", undefined, config_1.types.string, false)
    .setAction(async ({ basset, bassetQuantity }, hre) => {
    const { ethers } = hre;
    const basketManager = await ethers.getContract("BasketManagerV3"); // as BasketManagerV3;
    console.log("result: ", await basketManager.convertBassetToMassetQuantity(basset, bassetQuantity));
});
(0, config_1.task)("basketManager:convertMassetToBassetQuantity", "Converts mAsset to bAsset quantity")
    .addParam("basset", "Basset address", undefined, config_1.types.string, false)
    .addParam("massetQuantity", "Amount of mAssets to check", undefined, config_1.types.string, false)
    .setAction(async ({ basset, massetQuantity }, hre) => {
    const { ethers } = hre;
    const basketManager = await ethers.getContract("BasketManagerV3"); // as BasketManagerV3;
    console.log("result: ", await basketManager.convertMassetToBassetQuantity(basset, massetQuantity));
});
(0, config_1.task)("basketManager:getTotalMassetBalance", "Calculates total mAsset balance").setAction(async ({}, hre) => {
    const { ethers } = hre;
    const basketManager = await ethers.getContract("BasketManagerV3"); // as BasketManagerV3;
    console.log("result: ", (await basketManager.getTotalMassetBalance()).toString());
});
(0, config_1.task)("basketManager:getBassetBalance", "Calculates total bAsset balance")
    .addParam("basset", "Basset address", undefined, config_1.types.string, false)
    .setAction(async ({ basset }, hre) => {
    const { ethers } = hre;
    const basketManager = await ethers.getContract("BasketManagerV3"); // as BasketManagerV3;
    console.log("result: ", (await basketManager.getBassetBalance(basset)).toString());
});
(0, config_1.task)("basketManager:getVersion", "Get version of basket manager").setAction(async ({}, hre) => {
    const { ethers } = hre;
    const basketManager = await ethers.getContract("BasketManagerV3"); // as BasketManagerV3;
    console.log("result: ", await basketManager.getVersion());
});
(0, config_1.task)("basketManager:getBassets", "Get list of bAssets").setAction(async ({}, hre) => {
    const { ethers } = hre;
    const basketManager = await ethers.getContract("BasketManagerV3"); // as BasketManagerV3;
    console.log(await basketManager.getBassets());
});
(0, config_1.task)("basketManager:getFactor", "Get factor")
    .addParam("basset", "Basset address", undefined, config_1.types.string, false)
    .setAction(async ({ basset }, hre) => {
    const { ethers } = hre;
    const basketManager = await ethers.getContract("BasketManagerV3"); // as BasketManagerV3;
    console.log("result: ", (await basketManager.getFactor(basset)).toString());
});
(0, config_1.task)("basketManager:getRange", "Get range(min,max)")
    .addParam("basset", "Basset address", undefined, config_1.types.string, false)
    .setAction(async ({ basset }, hre) => {
    const { ethers } = hre;
    const basketManager = await ethers.getContract("BasketManagerV3"); // as BasketManagerV3;
    console.log("result: ", await basketManager.getRange(basset));
});
(0, config_1.task)("basketManager:getPaused", "Get paused status of basset")
    .addParam("basset", "Basset address", undefined, config_1.types.string, false)
    .setAction(async ({ basset }, hre) => {
    const { ethers } = hre;
    const basketManager = await ethers.getContract("BasketManagerV3"); // as BasketManagerV3;
    console.log("result: ", await basketManager.getPaused(basset));
});
(0, config_1.task)("basketManager:getProxyImplementation", "Get proxy implementation of basket manager").setAction(async ({}, hre) => {
    const { ethers } = hre;
    const basketManager = await ethers.getContract("BasketManagerV3"); // as BasketManagerV3;
    console.log("result: ", await basketManager.getProxyImplementation());
});
//# sourceMappingURL=metaAssetTokenInteraction.js.map