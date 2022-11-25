import { DeployFunction } from "hardhat-deploy/types";

const { ZERO_ADDRESS } = require("@openzeppelin/test-helpers/src/constants");

const func: DeployFunction = async ({
  deployments: { deploy },
  getNamedAccounts,
  network,
}) => {
  const {deployer} = await getNamedAccounts();
  await deploy('Token', {
    from: deployer,
    args: ["MOCK_TOKEN", "MT", 18],
    log: true,
  });
}

func.tags = ["Token"];

export default func;
