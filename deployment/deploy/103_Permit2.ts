import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async ({
  deployments: { deploy },
  getNamedAccounts,
}) => {
  const { deployer } = await getNamedAccounts();
  await deploy("Permit2", {
    from: deployer,
    contract: "Permit2",
    log: true,
    skipIfAlreadyDeployed: true,
  });
};

func.tags = ["Permit2"];

export default func;
