"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hardhat_1 = require("hardhat");
const helpers_1 = require("../../scripts/helpers/helpers");
// import hardhat from "hardhat";
const func = async (hre) => {
    const { deployments: { deploy, log, get }, getNamedAccounts, } = hre;
    let targetOwner = "";
    if (hardhat_1.network.tags.testnet) {
        targetOwner = (await get("MultiSigWallet")).address;
    }
    else if (hardhat_1.network.tags.mainnet) {
        targetOwner = (await get("TimelockOwner")).address;
    }
    else {
        // For local network, not necessary to transfer the ownership to other account
        // targetOwner =  "0x95a1CA72Df913f14Dc554a5D14E826B64Bd049FD"; // dummy address -- need to be changed
    }
    if (!targetOwner)
        return;
    /** Transferring non proxy contract ownership */
    // DLLR
    log(`=== Transferring DLLR ownership to: ${targetOwner} ===`);
    const DLLR = await hardhat_1.ethers.getContract("DLLR");
    await (0, helpers_1.transferOwnership)(hre, DLLR.address, targetOwner);
    log(`DLLR ownership is transferred to: ${await DLLR.owner()}`);
    /** Transferring proxy contract ownership */
    // Masset Manager
    log(`=== Transferring MassetManager ownership to: ${targetOwner} ===`);
    const MassetManager = await hardhat_1.ethers.getContract("MassetManager");
    await (0, helpers_1.transferOwnership)(hre, MassetManager.address, targetOwner);
    log(`MassetManager ownership is transferred to: ${await MassetManager.owner()}`);
    // Fees Vault
    log(`=== Transferring FeesVault ownership to: ${targetOwner} ===`);
    const FeesVault = await hardhat_1.ethers.getContract("FeesVault");
    await (0, helpers_1.transferOwnership)(hre, FeesVault.address, targetOwner);
    log(`FeesVault ownership is transferred to: ${await FeesVault.owner()}`);
    // Fees Manager
    log(`=== Transferring FeesManager ownership to: ${targetOwner} ===`);
    const FeesManager = await hardhat_1.ethers.getContract("FeesManager");
    await (0, helpers_1.transferOwnership)(hre, FeesManager.address, targetOwner);
    log(`FeesManager ownership is transferred to: ${await FeesManager.owner()}`);
    // Fees Manager
    log(`=== Transferring BasketManagerV3 ownership to: ${targetOwner} ===`);
    const BasketManagerV3 = await hardhat_1.ethers.getContract("BasketManagerV3");
    await (0, helpers_1.transferOwnership)(hre, BasketManagerV3.address, targetOwner);
    log(`BasketManagerV3 ownership is transferred to: ${await BasketManagerV3.owner()}`);
    // Moc Integration
    log(`=== Transferring MocIntegration ownership to: ${targetOwner} ===`);
    const MocIntegration = await hardhat_1.ethers.getContract("MocIntegration");
    await (0, helpers_1.transferOwnership)(hre, MocIntegration.address, targetOwner);
    log(`MocIntegration ownership is transferred to: ${await MocIntegration.owner()}`);
    /** Transferring MyntAdminProxy ownership */
    log(`=== Transferring MyntAdminProxy ownership to: ${targetOwner} ===`);
    const MyntAdminProxy = await hardhat_1.ethers.getContract("MyntAdminProxy");
    await (0, helpers_1.transferOwnership)(hre, MyntAdminProxy.address, targetOwner);
    log(`MyntAdminProxy ownership is transferred to: ${await MyntAdminProxy.owner()}`);
};
func.tags = ["TransferOwnership"];
func.skip = async (hre) => {
    return true;
};
func.id = "1";
exports.default = func;
//# sourceMappingURL=102_TransferOwnership.js.map