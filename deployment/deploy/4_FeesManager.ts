import { DeployFunction } from "hardhat-deploy/types";
import { upgradeWithTransparentUpgradableProxy } from "../helpers/deployment";

const func: DeployFunction = async ({
  deployments: { deploy, getOrNull },
  getNamedAccounts,
}) => {
  const { deployer } = await getNamedAccounts();

  const depositFee = 0;
  const withdrawalFee = 0;

  const deploymentName = "FeesManager";
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
            args: [depositFee, withdrawalFee],
          },
        },
      },
      from: deployer,
      log: true,
    });
  }
};

func.tags = ["FeesManager"];
func.dependencies = ["MyntAdminProxy"];

export default func;
