import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async ({
  deployments: { deploy, get },
  getNamedAccounts,
}) => {
  const { deployer } = await getNamedAccounts();

  await deploy("MassetManager", {
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
  const mm = await get("MassetManager");
};

func.tags = ["MassetManager"];
func.dependencies = ["MyntAdminProxy"];

export default func;
