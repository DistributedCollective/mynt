import { constants } from "ethers";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async ({ deployments, getNamedAccounts }) => {
  const networkName = deployments.getNetworkName();
  const { log } = deployments;
  const { deployer } = await getNamedAccounts();
  let bAssets;
  const factors = [1, 1];
  const bridges = [constants.AddressZero, constants.AddressZero];
  const mins = [0, 0];
  const maxs = [1000, 1000]; // need to set to what MAX_VALUE defined in BasketManager contract
  const pausedFlags = [false, false];

  if (networkName === "development") {
    // @todo for local node (hardhat node), need to deploy MOCK ERC20 for the bAssets
    // @todo for forked testnet no need to change the bAssets addresses below since it's already using the testnet addresses.
    // @todo for forked mainnet, need to change the below addresses with the mainnet addresses.
    // for now we will just update it manually.
    bAssets = [
      "0x6b41566353d6c7b8c2a7931d498f11489dacac29", // ZUSD Testnet
      "0xcb46c0ddc60d18efeb0e586c17af6ea36452dae0", // DOC Tesnet
    ];
  } else if (networkName === "rskTestnet") {
    bAssets = [
      "0x6b41566353d6c7b8c2a7931d498f11489dacac29", // ZUSD Testnet
      "0xcb46c0ddc60d18efeb0e586c17af6ea36452dae0", // DOC Tesnet
    ];
  } else if (networkName === "rskMainnet") {
    bAssets = [
      "0xdb107fa69e33f05180a4c2ce9c2e7cb481645c2d", // ZUSD Mainnet
      "0xe700691da7b9851f2f35f8b8182c69c53ccad9db", // DOC Mainnet
    ];
  }

  const bAssetsNames = ["ZUSD", "DoC"];
  log(
    "adding bAssets to the BasketManager: ",
    JSON.stringify({
      bAssetsNames,
      bAssets,
      factors,
      bridges,
      mins,
      maxs,
      pausedFlags,
    })
  );

  await deployments.execute(
    "BasketManagerV3",
    { from: deployer },
    "addBassets",
    bAssets,
    factors,
    bridges,
    mins,
    maxs,
    pausedFlags
  );

  log(`Done`);
};

func.tags = ["AddBassetsInBasketManager"];

export default func;
