import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async ({
  deployments: { deploy },
  getNamedAccounts,
}) => {
  const { deployer } = await getNamedAccounts();
  await deploy("MyntAdminProxy", {
    skipIfAlreadyDeployed: true,
    contract: "MyntAdminProxy",
    from: deployer,
    log: true,
  });
};

func.tags = ["MyntAdminProxy"];

export default func;
