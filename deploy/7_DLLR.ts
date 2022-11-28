import { DeployFunction } from "hardhat-deploy/types";
const {deployments} = require('hardhat');

const func: DeployFunction = async ({
  deployments: { deploy },
  getNamedAccounts,
  network,
}) => {
  const {deployer} = await getNamedAccounts();
  const deployedMasset = await deployments.get("MassetV3")
  const deployedBasketManager = await deployments.get("BasketManagerV3")

  await deploy('MetaAssetToken', {
    from: deployer,
    args: ["Sovryn Dollar", "DLLR"],
    log: true,
  });
}

func.tags = ["DLLR"];

export default func;
