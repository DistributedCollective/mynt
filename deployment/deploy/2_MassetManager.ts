import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { upgradeWithTransparentUpgradableProxy } from "../helpers/deployment";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const {
    deployments: { deploy, getOrNull },
    getNamedAccounts,
  } = hre;
  const { deployer } = await getNamedAccounts();

  const deploymentName = "MassetManager";
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
      },
      from: deployer,
      log: true,
    });
  }
};

func.tags = ["MassetManager"];
func.dependencies = ["MyntAdminProxy"];

export default func;
