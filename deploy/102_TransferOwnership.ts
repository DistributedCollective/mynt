import { deployments, ethers, network } from "hardhat";
import { DeployFunction } from "hardhat-deploy/types";
import { _transferOwnership } from "../tasks/transferOwnership";

const hardhat = require("hardhat");

const func: DeployFunction = async ({
  deployments: { deploy },
  getNamedAccounts,
}) => {
  const { log, get } = deployments;
  let targetOwner: string;

  if (network.tags["testnet"]) {
    targetOwner = (await get("MultisigWallet")).address;
  } else if(network.tags["mainnet"]) {
    targetOwner = (await get("TimelockOwner")).address;
  } else {
    // For local network, not necessary to transfer the ownership to other account
    targetOwner =  "0x95a1CA72Df913f14Dc554a5D14E826B64Bd049FD"; // dummy address -- need to be changed
  }

  if(!targetOwner) return;

  /** Transferring non proxy contract ownership */
  // DLLR
  log(`=== Transferring DLLR ownership to: ${targetOwner} ===`);
  const DLLR = await ethers.getContract("DLLR");
  _transferOwnership(hardhat, DLLR.address, targetOwner);
  log(`DLLR ownership is transferred to: ${await DLLR.owner()}`)

  /** Transferring proxy contract ownership */
  // Masset Manager
  log(`=== Transferring MassetManager ownership to: ${targetOwner} ===`);
  const MassetManager = await ethers.getContract("MassetManager");
  _transferOwnership(hardhat, MassetManager.address, targetOwner);
  log(`MassetManager ownership is transferred to: ${await MassetManager.owner()}`)

  // Fees Vault
  log(`=== Transferring FeesVault ownership to: ${targetOwner} ===`);
  const FeesVault = await ethers.getContract("FeesVault");
  _transferOwnership(hardhat, FeesVault.address, targetOwner);
  log(`FeesVault ownership is transferred to: ${await FeesVault.owner()}`)

  // Fees Manager
  log(`=== Transferring FeesManager ownership to: ${targetOwner} ===`);
  const FeesManager = await ethers.getContract("FeesManager");
  _transferOwnership(hardhat, FeesManager.address, targetOwner);
  log(`FeesManager ownership is transferred to: ${await FeesManager.owner()}`)

  // Fees Manager
  log(`=== Transferring BasketManagerV3 ownership to: ${targetOwner} ===`);
  const BasketManagerV3 = await ethers.getContract("BasketManagerV3");
  _transferOwnership(hardhat, BasketManagerV3.address, targetOwner);
  log(`BasketManagerV3 ownership is transferred to: ${await BasketManagerV3.owner()}`)

  // Moc Integration
  log(`=== Transferring MocIntegration ownership to: ${targetOwner} ===`);
  const MocIntegration = await ethers.getContract("MocIntegration");
  _transferOwnership(hardhat, MocIntegration.address, targetOwner);
  log(`MocIntegration ownership is transferred to: ${await MocIntegration.owner()}`)

  /** Transferring MyntAdminProxy ownership */
  log(`=== Transferring MyntAdminProxy ownership to: ${targetOwner} ===`);
  const MyntAdminProxy = await ethers.getContract("MyntAdminProxy");
  _transferOwnership(hardhat, MyntAdminProxy.address, targetOwner);
  log(`MyntAdminProxy ownership is transferred to: ${await MyntAdminProxy.owner()}`)
};

func.tags = ["TransferOwnership"];

export default func;
