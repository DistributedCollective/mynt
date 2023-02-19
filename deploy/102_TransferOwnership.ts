import { deployments, ethers } from "hardhat";
import { DeployFunction } from "hardhat-deploy/types";
import { addresses } from "../configs/addresses";

const func: DeployFunction = async ({
  deployments: { deploy },
  getNamedAccounts,
}) => {
  const networkName = deployments.getNetworkName();
  const { log } = deployments;
  let configAddresses;
  // const { owner } = 
  if (["rskTestnet", "rskForkedTestnet"].includes(networkName)) {
    configAddresses = addresses.testnet
  } else if (["rskMainnet", "rskForkedMainnet"].includes(networkName)) {
    configAddresses = addresses.mainnet
  } else if (["development", "hardhat"].includes(networkName)) {
    // Not necessary to transfer the ownership to other account
    configAddresses = {
      owner: "0x95a1CA72Df913f14Dc554a5D14E826B64Bd049FD" // dummy address -- need to be change
    }
  }

  if(!configAddresses.owner) return;

  /** Transferring non proxy contract ownership */
  // DLLR
  log(`=== Transferring DLLR ownership to: ${configAddresses.owner} ===`);
  const DLLR = await ethers.getContract("DLLR");
  await DLLR.transferOwnership(configAddresses.owner);
  log(`DLLR ownership is transferred to: ${await DLLR.owner()}`)

  /** Transferring proxy contract ownership */
  // Masset Manager
  log(`=== Transferring MassetManager ownership to: ${configAddresses.owner} ===`);
  const MassetManager = await ethers.getContract("MassetManager");
  await MassetManager.transferOwnership(configAddresses.owner);
  log(`MassetManager ownership is transferred to: ${await MassetManager.owner()}`)

  // Fees Vault
  log(`=== Transferring FeesVault ownership to: ${configAddresses.owner} ===`);
  const FeesVault = await ethers.getContract("FeesVault");
  await FeesVault.transferOwnership(configAddresses.owner);
  log(`FeesVault ownership is transferred to: ${await FeesVault.owner()}`)

  // Fees Manager
  log(`=== Transferring FeesManager ownership to: ${configAddresses.owner} ===`);
  const FeesManager = await ethers.getContract("FeesManager");
  await FeesManager.transferOwnership(configAddresses.owner);
  log(`FeesManager ownership is transferred to: ${await FeesManager.owner()}`)

  // Fees Manager
  log(`=== Transferring BasketManagerV3 ownership to: ${configAddresses.owner} ===`);
  const BasketManagerV3 = await ethers.getContract("BasketManagerV3");
  await BasketManagerV3.transferOwnership(configAddresses.owner);
  log(`BasketManagerV3 ownership is transferred to: ${await BasketManagerV3.owner()}`)

  // Moc Integration
  log(`=== Transferring MocIntegration ownership to: ${configAddresses.owner} ===`);
  const MocIntegration = await ethers.getContract("MocIntegration");
  await MocIntegration.transferOwnership(configAddresses.owner);
  log(`MocIntegration ownership is transferred to: ${await MocIntegration.owner()}`)

  /** Transferring MyntAdminProxy ownership */
  log(`=== Transferring MyntAdminProxy ownership to: ${configAddresses.owner} ===`);
  const MyntAdminProxy = await ethers.getContract("MyntAdminProxy");
  await MyntAdminProxy.transferOwnership(configAddresses.owner);
  log(`MyntAdminProxy ownership is transferred to: ${await MyntAdminProxy.owner()}`)
};

func.tags = ["TransferOwnership"];

export default func;
