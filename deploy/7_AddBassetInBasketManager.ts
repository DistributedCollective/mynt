import { constants } from "ethers";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async ({
  ethers,
  deployments,
  getNamedAccounts,
}) => {
  const networkName = deployments.getNetworkName();
  const { log, get, getOrNull } = deployments;
  const { deployer } = await getNamedAccounts();
  let bAssets;
  const factors = [1, 1];
  const bridges = [constants.AddressZero, constants.AddressZero];
  const mins = [0, 0];
  const maxs = [1000, 1000]; // need to set to what MAX_VALUE defined in BasketManager contract
  const pausedFlags = [false, false];

  if (["rskTestnet", "rskForkedTestnet"].includes(networkName)) {
    // @todo add forked nets to hh config
    bAssets = [
      "0x6b41566353d6c7b8c2a7931d498f11489dacac29", // ZUSD Testnet
      "0xcb46c0ddc60d18efeb0e586c17af6ea36452dae0", // DOC Tesnet
    ];
  } else if (["rskMainnet", "rskForkedMainnet"].includes(networkName)) {
    bAssets = [
      "0xdb107fa69e33f05180a4c2ce9c2e7cb481645c2d", // ZUSD Mainnet
      "0xe700691da7b9851f2f35f8b8182c69c53ccad9db", // DOC Mainnet
    ];
  } else if (["development", "hardhat"].includes(networkName)) {
    // @todo for local node (hardhat node), need to deploy MOCK ERC20 for the bAssets
    //       add deploy bAsset as a separate hh script returning bAsset addresses
    //       because it is used here and in MocIntegration too - use the same deployment
    bAssets = [(await get("ZUSD")).address, (await get("DoC")).address];
  }

  const bAssetsNames = ["ZUSD", "DoC"];
  log(
    "bAssets for the BasketManager: ",
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

  const basketManager = await ethers.getContract("BasketManagerV3");
  const existingBAssets = (await basketManager.getBassets()).map((el) =>
    el.toLowerCase()
  );

  const bassetsToAdd = bAssets
    .map((el) => el.toLowerCase())
    .filter(
      (basset) =>
        existingBAssets.find((basset2) => basset === basset2) === undefined
    );

  if (bassetsToAdd.length > 0) log("Adding bAssets:", bassetsToAdd);
  await deployments.execute(
    "BasketManagerV3",
    { from: deployer },
    "addBassets",
    bassetsToAdd,
    factors,
    bridges,
    mins,
    maxs,
    pausedFlags
  );

  log(`Done`);
};

func.tags = ["AddBassetsInBasketManager"];
func.dependencies = ["DeployMockBAssets"];
func.runAtTheEnd = true;

export default func;
