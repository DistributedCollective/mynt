import { deployments, ethers, network } from "hardhat";
import { DeployFunction } from "hardhat-deploy/types";
import { _transferOwnership } from "../tasks/transferOwnership";

// import hardhat from "hardhat";

const func: DeployFunction = async (hre) => {
  const {
    deployments: { deploy, log, get },
    getNamedAccounts,
  } = hre;
  let targetOwner = "";

  if (network.tags.testnet) {
    targetOwner = (await get("MultisigWallet")).address;
  } else if (network.tags.mainnet) {
    targetOwner = (await get("TimelockOwner")).address;
  } else {
    // For local network, not necessary to transfer the ownership to other account
    // targetOwner =  "0x95a1CA72Df913f14Dc554a5D14E826B64Bd049FD"; // dummy address -- need to be changed
  }

  if (!targetOwner) return;

  /** Transferring non proxy contract ownership */
  // DLLR
  log(`=== Transferring DLLR ownership to: ${targetOwner} ===`);
  const DLLR = await ethers.getContract("DLLR");
  _transferOwnership(hre, DLLR.address, targetOwner);
  log(`DLLR ownership is transferred to: ${await DLLR.owner()}`);

  /** Transferring proxy contract ownership */
  // Masset Manager
  log(`=== Transferring MassetManager ownership to: ${targetOwner} ===`);
  const MassetManager = await ethers.getContract("MassetManager");
  _transferOwnership(hre, MassetManager.address, targetOwner);
  log(
    `MassetManager ownership is transferred to: ${await MassetManager.owner()}`
  );

  // Fees Vault
  log(`=== Transferring FeesVault ownership to: ${targetOwner} ===`);
  const FeesVault = await ethers.getContract("FeesVault");
  _transferOwnership(hre, FeesVault.address, targetOwner);
  log(`FeesVault ownership is transferred to: ${await FeesVault.owner()}`);

  // Fees Manager
  log(`=== Transferring FeesManager ownership to: ${targetOwner} ===`);
  const FeesManager = await ethers.getContract("FeesManager");
  _transferOwnership(hre, FeesManager.address, targetOwner);
  log(`FeesManager ownership is transferred to: ${await FeesManager.owner()}`);

  // Fees Manager
  log(`=== Transferring BasketManagerV3 ownership to: ${targetOwner} ===`);
  const BasketManagerV3 = await ethers.getContract("BasketManagerV3");
  _transferOwnership(hre, BasketManagerV3.address, targetOwner);
  log(
    `BasketManagerV3 ownership is transferred to: ${await BasketManagerV3.owner()}`
  );

  // Moc Integration
  log(`=== Transferring MocIntegration ownership to: ${targetOwner} ===`);
  const MocIntegration = await ethers.getContract("MocIntegration");
  _transferOwnership(hre, MocIntegration.address, targetOwner);
  log(
    `MocIntegration ownership is transferred to: ${await MocIntegration.owner()}`
  );

  /** Transferring MyntAdminProxy ownership */
  log(`=== Transferring MyntAdminProxy ownership to: ${targetOwner} ===`);
  const MyntAdminProxy = await ethers.getContract("MyntAdminProxy");
  _transferOwnership(hre, MyntAdminProxy.address, targetOwner);
  log(
    `MyntAdminProxy ownership is transferred to: ${await MyntAdminProxy.owner()}`
  );
};

func.tags = ["TransferOwnership"];
func.skip = async (hre) => {
  return true;
};

export default func;
