import { DeployFunction } from "hardhat-deploy/types";
import { upgradeWithTransparentUpgradableProxy } from "../helpers/deployment";

const func: DeployFunction = async (hre) => {
  const {
    deployments: { deploy, getOrNull },
    getNamedAccounts,
  } = hre;
  const { deployer } = await getNamedAccounts();
  const deploymentName = "FeesVault";
  const deployment = await getOrNull(deploymentName);
  if (deployment) {
    await upgradeWithTransparentUpgradableProxy(
      deployer,
      deploymentName,
      "TransparentUpgradeableProxy",
      undefined,
      `${deploymentName}_Proxy`
    );
  } else {
    await deploy(deploymentName, {
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
  }
};

func.tags = ["FeesVault"];
func.dependencies = ["MyntAdminProxy"];

export default func;
