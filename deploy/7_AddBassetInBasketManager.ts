import { constants } from "ethers";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async ({
  deployments,
  getNamedAccounts,
}) => {
  const network = deployments.getNetworkName();
  const log = deployments.log;
  const {deployer} = await getNamedAccounts();
  let bAssets;
  let factors = [1,1];
  let bridges = [constants.AddressZero, constants.AddressZero];
  let mins = [0,0];
  let maxs = [0,0];
  let pausedFlags = [false, false];

  if(network === 'development') {
    // @todo for local node (hardhat node), need to deploy MOCK ERC20 for the bAssets
    // @todo for forked testnet no need to change the bAssets addresses below since it's already using the testnet addresses.
    // @todo for forked mainnet, need to change the below addresses with the mainnet addresses.
    // for now we will just update it manually.
    bAssets = [
      "0x6b41566353d6c7b8c2a7931d498f11489dacac29", // ZUSD Testnet
      "0xcb46c0ddc60d18efeb0e586c17af6ea36452dae0", // DOC Tesnet
    ];
  } else if(network === 'rskTestnet') {
    bAssets = [
      "0x6b41566353d6c7b8c2a7931d498f11489dacac29", // ZUSD Testnet
      "0xcb46c0ddc60d18efeb0e586c17af6ea36452dae0", // DOC Tesnet
    ];
  } else if(network === 'rskMainnet') {
    bAssets = [
      "0xdb107fa69e33f05180a4c2ce9c2e7cb481645c2d", // ZUSD Mainnet
      "0xe700691da7b9851f2f35f8b8182c69c53ccad9db" // DOC Mainnet
    ];
  }

  log("adding bAssets with details: ", JSON.stringify({
    bAssets,
    factors,
    bridges,
    mins,
    maxs,
    pausedFlags
  }));

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

  log("done");
};

func.tags = ["AddBassetsInBasketManager"];

export default func;