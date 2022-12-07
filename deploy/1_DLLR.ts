import { DeployFunction } from "hardhat-deploy/types";
const {deployments} = require('hardhat');

const func: DeployFunction = async ({
  deployments: { deploy },
  getNamedAccounts,
  network,
}) => {
  const {deployer} = await getNamedAccounts();

  await deploy('DLLR', {
    from: deployer,
    contract: "DLLR",
    args: ["Sovryn Dollar", "DLLR"],
    log: true,
  });
}

func.tags = ["DLLR"];

export default func;
