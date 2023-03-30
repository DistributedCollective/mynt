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
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("hardhat/config");
const helpers = __importStar(require("../scripts/utils/helpers"));
const createSIP_1 = require("./sips/createSIP");
(0, config_1.task)("upgrade:massetManager", "Upgrade implementation of massetManager contract")
    .addOptionalParam("isMultisig", "flag if transaction needs to be intiated from the multisig contract")
    .addOptionalParam("isSIP", "flag if transaction needs to be initiated from the SIP")
    .setAction(async ({ isMultisig, isSIP }, hre) => {
    helpers.injectHre(hre);
    const { ethers, deployments: { get }, getNamedAccounts } = hre;
    const { deployer } = await getNamedAccounts();
    const myntAdminProxy = await ethers.getContract("MyntAdminProxy");
    const massetManagerProxy = await ethers.getContract("MassetManager");
    const MassetManagerFactory = await ethers.getContractFactory("MassetManager");
    const newMassetManagerImpl = await MassetManagerFactory.deploy();
    console.log(`Upgrading massetManager implementation to ${newMassetManagerImpl.address}`);
    if (isMultisig) {
        const multisigAddress = (await get("MultisigWallet")).address;
        const dataUpgrade = myntAdminProxy.interface.encodeFunctionData("upgrade", [
            massetManagerProxy.address, newMassetManagerImpl.address
        ]);
        await helpers.sendWithMultisig(multisigAddress, myntAdminProxy.address, dataUpgrade, deployer);
    }
    else if (isSIP) {
        const signatureUpgrade = "upgrade(address,address)";
        const dataUpgrade = myntAdminProxy.interface.encodeFunctionData("upgrade", [
            massetManagerProxy.address, newMassetManagerImpl.address
        ]);
        const sipArgs = {
            targets: [massetManagerProxy.address],
            values: [0],
            signatures: [signatureUpgrade],
            data: [dataUpgrade],
            description: "Upgrade masset manager contract"
        };
        (0, createSIP_1._createSIP)(hre, sipArgs);
    }
});
(0, config_1.task)("upgrade:feesVault", "Upgrade implementation of feesVault contract")
    .addOptionalParam("isMultisig", "flag if transaction needs to be intiated from the multisig contract")
    .addOptionalParam("isSIP", "flag if transaction needs to be initiated from the SIP")
    .setAction(async ({ isMultisig, isSIP }, hre) => {
    helpers.injectHre(hre);
    const { ethers, deployments: { get }, getNamedAccounts } = hre;
    const { deployer } = await getNamedAccounts();
    const myntAdminProxy = await ethers.getContract("MyntAdminProxy");
    const feesVaultProxy = await ethers.getContract("FeesVault");
    const FeesVaultFactory = await ethers.getContractFactory("FeesVault");
    const newFeesVaultImpl = await FeesVaultFactory.deploy();
    console.log(`Upgrading feesVault implementation to ${newFeesVaultImpl.address}`);
    if (isMultisig) {
        const multisigAddress = (await get("MultisigWallet")).address;
        const dataUpgrade = myntAdminProxy.interface.encodeFunctionData("upgrade", [
            feesVaultProxy.address, newFeesVaultImpl.address
        ]);
        await helpers.sendWithMultisig(multisigAddress, myntAdminProxy.address, dataUpgrade, deployer);
    }
    else if (isSIP) {
        const signatureUpgrade = "upgrade(address,address)";
        const dataUpgrade = myntAdminProxy.interface.encodeFunctionData("upgrade", [
            feesVaultProxy.address, newFeesVaultImpl.address
        ]);
        const sipArgs = {
            targets: [feesVaultProxy.address],
            values: [0],
            signatures: [signatureUpgrade],
            data: [dataUpgrade],
            description: "Upgrade fees vault contract"
        };
        (0, createSIP_1._createSIP)(hre, sipArgs);
    }
});
(0, config_1.task)("upgrade:feesManager", "Upgrade implementation of feesManager contract")
    .addOptionalParam("isMultisig", "flag if transaction needs to be intiated from the multisig contract")
    .addOptionalParam("isSIP", "flag if transaction needs to be initiated from the SIP")
    .setAction(async ({ isMultisig, isSIP }, hre) => {
    helpers.injectHre(hre);
    const { ethers, deployments: { get }, getNamedAccounts } = hre;
    const { deployer } = await getNamedAccounts();
    const myntAdminProxy = await ethers.getContract("MyntAdminProxy");
    const feesManagerProxy = await ethers.getContract("FeesManager");
    const FeesManagerFactory = await ethers.getContractFactory("FeesManager");
    const newFeesManagerImpl = await FeesManagerFactory.deploy();
    console.log(`Upgrading feesManager implementation to ${newFeesManagerImpl.address}`);
    if (isMultisig) {
        const multisigAddress = (await get("MultisigWallet")).address;
        const dataUpgrade = myntAdminProxy.interface.encodeFunctionData("upgrade", [
            feesManagerProxy.address, newFeesManagerImpl.address
        ]);
        await helpers.sendWithMultisig(multisigAddress, myntAdminProxy.address, dataUpgrade, deployer);
    }
    else if (isSIP) {
        const signatureUpgrade = "upgrade(address,address)";
        const dataUpgrade = myntAdminProxy.interface.encodeFunctionData("upgrade", [
            feesManagerProxy.address, newFeesManagerImpl.address
        ]);
        const sipArgs = {
            targets: [feesManagerProxy.address],
            values: [0],
            signatures: [signatureUpgrade],
            data: [dataUpgrade],
            description: "Upgrade fees manager contract"
        };
        (0, createSIP_1._createSIP)(hre, sipArgs);
    }
});
(0, config_1.task)("upgrade:basketManager", "Upgrade implementation of basketManager contract")
    .addOptionalParam("isMultisig", "flag if transaction needs to be intiated from the multisig contract")
    .addOptionalParam("isSIP", "flag if transaction needs to be initiated from the SIP")
    .setAction(async ({ isMultisig, isSIP }, hre) => {
    helpers.injectHre(hre);
    const { ethers, deployments: { get }, getNamedAccounts } = hre;
    const { deployer } = await getNamedAccounts();
    const myntAdminProxy = await ethers.getContract("MyntAdminProxy");
    const basketManagerProxy = await ethers.getContract("BasketManagerV3"); // basketManagerV3
    const BasketManagerFactory = await ethers.getContractFactory("BasketManagerV3");
    const newBasketManagerImpl = await BasketManagerFactory.deploy();
    console.log(`Upgrading basket manager implementation to ${newBasketManagerImpl.address}`);
    if (isMultisig) {
        const multisigAddress = (await get("MultisigWallet")).address;
        const dataUpgrade = myntAdminProxy.interface.encodeFunctionData("upgrade", [
            basketManagerProxy.address, newBasketManagerImpl.address
        ]);
        await helpers.sendWithMultisig(multisigAddress, myntAdminProxy.address, dataUpgrade, deployer);
    }
    else if (isSIP) {
        const signatureUpgrade = "upgrade(address,address)";
        const dataUpgrade = myntAdminProxy.interface.encodeFunctionData("upgrade", [
            basketManagerProxy.address, newBasketManagerImpl.address
        ]);
        const sipArgs = {
            targets: [basketManagerProxy.address],
            values: [0],
            signatures: [signatureUpgrade],
            data: [dataUpgrade],
            description: "Upgrade fees vault contract"
        };
        (0, createSIP_1._createSIP)(hre, sipArgs);
    }
});
//# sourceMappingURL=upgradeContract.js.map