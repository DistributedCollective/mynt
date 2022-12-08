import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async ({ deployments, getNamedAccounts }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const deployedMasset = await deployments.get("MassetV3");
  const deployedToken = await deployments.get("DLLR");
  const deployedFeesVault = await deployments.get("FeesVault");
  const deployedFeesManager = await deployments.get("FeesManager");

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
          args: [deployedMasset.address],
        },
      },
    },
    from: deployer,
    log: true,
  });

  // Initialize Masset
  const deployedBasketManager = await deployments.get("BasketManagerV3");
  console.log(deployedBasketManager.address);
  console.log(deployedToken.address);
  await deployments.execute(
    "MassetV3",
    { from: deployer },
    "initialize",
    deployedBasketManager.address,
    deployedToken.address,
    false
  );

  // Upgrade Masset To V3
  await deployments.execute(
    "MassetV3",
    { from: deployer },
    "upgradeToV3",
    deployedBasketManager.address,
    deployedToken.address,
    deployedFeesVault.address,
    deployedFeesManager.address
  );

  const mAssetVersion = await deployments.read("MassetV3", "getVersion");
  console.log("Masset Version :", mAssetVersion);

  // Set Masset & Basket Manager in DLLR contract
  await deployments.execute(
    "DLLR",
    { from: deployer },
    "setMassetProxy",
    deployedMasset.address
  );

  await deployments.execute(
    "DLLR",
    { from: deployer },
    "setBasketManagerProxy",
    deployedBasketManager.address
  );
};

func.tags = ["BasketManager"];

export default func;
