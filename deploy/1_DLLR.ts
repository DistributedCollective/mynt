import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async ({
  deployments: { deploy },
  getNamedAccounts,
}) => {
  const { deployer } = await getNamedAccounts();

  await deploy("DLLR", {
    from: deployer,
    contract: "DLLR",
    log: true,
  });
};

func.tags = ["DLLR"];

export default func;
