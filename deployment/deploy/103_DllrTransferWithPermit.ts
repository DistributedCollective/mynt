import { DeployFunction } from "hardhat-deploy/types";
import { DLLR, MassetManager } from "types/generated";
import { masset } from "types/generated/artifacts/contracts";
import { ethers, network } from "hardhat";
import { transferOwnership } from "../../scripts/helpers/helpers";
import { upgradeWithTransparentUpgradableProxy } from "../helpers/deployment";

const func: DeployFunction = async (hre) => {
    const {
    deployments,
    getNamedAccounts,
    } = hre;

  const { deploy, get, log, getOrNull } = deployments;
  const { deployer } = await getNamedAccounts();
  const deployedDllr = await deployments.get("DLLR");
  let targetOwner = "";

  const deploymentName = "DllrTransferWithPermit";
  const deployment = await getOrNull(deploymentName);

  if (deployment) {
    await upgradeWithTransparentUpgradableProxy(
      deployer,
      deploymentName,
      "TransparentUpgradeableProxy",
      undefined,
      `${deploymentName}_Proxy`
    );
  } else{
    await deploy("DllrTransferWithPermit", {
      contract: "DllrTransferWithPermit",
      args: [deployedDllr.address],
      proxy: {
        owner: deployer,
        proxyContract: "OpenZeppelinTransparentProxy",
        viaAdminContract: {
          name: "MyntAdminProxy",
          artifact: "MyntAdminProxy",
        },
        execute: {
          init: {
            methodName: "initialize",
            args: [],
          },
        },
      },
      from: deployer,
      log: true,
    });

    if (network.tags.testnet) {
      targetOwner = (await get("MultisigWallet")).address;
    } else if (network.tags.mainnet) {
      targetOwner = (await get("TimelockOwner")).address;
    } else {
      // For local network, not necessary to transfer the ownership to other account
      // targetOwner =  ""; // dummy address -- need to be changed
    }
  
    if (!targetOwner) return;
  
    /** Transferring non proxy contract ownership */
    // DLLR
    log(`=== Transferring DllrTransferWithPermit ownership to: ${targetOwner} ===`);
    const DllrTransferWithPermit = await ethers.getContract("DllrTransferWithPermit");
    transferOwnership(hre, DllrTransferWithPermit.address, targetOwner);
    log(`DllrTransferWithPermit ownership is transferred to: ${await DllrTransferWithPermit.owner()}`);
  }
};

func.tags = ["DllrTransferWithPermit"];
func.dependencies = [
  "DLLR",
];

export default func;
