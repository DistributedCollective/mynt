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

  await deploy('DLLR', {
    from: deployer,
    contract: "MetaAssetToken",
    args: ["Sovryn Dollar", "DLLR"],
    log: true,
  });

  await deployments.execute("DLLR", {from: deployer}, "setAssetProxy",
    deployedMasset.address
  );

  await deployments.execute("DLLR", {from: deployer}, "setBasketManagerProxy",
    deployedBasketManager.address
  );
}

func.tags = ["DLLR"];

export default func;
