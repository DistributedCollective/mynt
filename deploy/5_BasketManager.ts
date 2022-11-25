import { DeployFunction } from "hardhat-deploy/types";
const { ZERO_ADDRESS } = require("@openzeppelin/test-helpers/src/constants");
const {deployments} = require('hardhat');

const func: DeployFunction = async ({
  deployments: {deploy},
  getNamedAccounts,
  network,
}) => {
  const { deployer } = await getNamedAccounts();
  const deployedMasset = await deployments.get("MassetV3")
  const deployedToken = await deployments.get("Token")
  const deployedFeesVault = await deployments.get("FeesVault")
  const deployedFeesManager = await deployments.get("FeesManager")

  await deploy("BasketManagerV3", {
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
          args: [
            deployedMasset.address
          ],
        },
      },
    },
    from: deployer,
    log: true,
  });

  // Initialize Masset
  const deployedBasketManager = await deployments.get("BasketManagerV3")
  console.log(deployedBasketManager.address)
  console.log(deployedToken.address)
  await deployments.execute("MassetV3", {from: deployer}, "initialize",
    deployedBasketManager.address,
    deployedToken.address,
    false
  );

  // Upgrade Masset To V3
  await deployments.execute("MassetV3", {from: deployer}, "upgradeToV3",
    deployedBasketManager.address,
    deployedToken.address,
    deployedFeesVault.address,
    deployedFeesManager.address
  );

  const mAssetVersion = await deployments.read("MassetV3", "getVersion")
  console.log("Masset Version :", mAssetVersion)
};

func.tags = ["BasketManager"];

export default func;
