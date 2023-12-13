"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const func = async ({ ethers, deployments, getNamedAccounts, network, }) => {
    const networkName = deployments.getNetworkName();
    const { log, get } = deployments;
    const { deployer } = await getNamedAccounts();
    let bAssets;
    let factors = [1, 1];
    let mins = [0, 0];
    let maxs = [1000, 1000]; // need to set to what MAX_VALUE defined in BasketManager contract
    let pausedFlags = [false, false];
    if (["rskTestnet", "rskSovrynTestnet", "rskForkedTestnet"].includes(networkName)) {
        // @todo add forked nets to hh config
        bAssets = [
            "0x6b41566353d6c7b8c2a7931d498f11489dacac29",
            "0xcb46c0ddc60d18efeb0e586c17af6ea36452dae0", // DOC Tesnet
        ];
    }
    else if (network.tags.mainnet) {
        bAssets = [
            "0xdb107fa69e33f05180a4c2ce9c2e7cb481645c2d",
            "0xe700691da7b9851f2f35f8b8182c69c53ccad9db", // DOC Mainnet
        ];
    }
    else if (["development", "hardhat"].includes(networkName)) {
        // @todo for local node (hardhat node), need to deploy MOCK ERC20 for the bAssets
        //       add deploy bAsset as a separate hh script returning bAsset addresses
        //       because it is used here and in MocIntegration too - use the same deployment
        bAssets = [(await get("ZUSD")).address, (await get("DoC")).address];
    }
    /*
      const bAssetsNames = ["ZUSD", "DoC"];
      log(
        "bAssets for the BasketManager: ",
        JSON.stringify({
          bAssetsNames,
          bAssets,
          factors,
          mins,
          maxs,
          pausedFlags,
        })
      );
    */
    const basketManager = await ethers.getContract("BasketManagerV3");
    const existingBAssets = (await basketManager.getBassets()).map((el) => el.toLowerCase());
    const bassetsToExclude = bAssets
        .map((el) => el.toLowerCase())
        .map((basset, index) => existingBAssets.includes(basset) ? index : undefined)
        .filter((el) => el !== undefined);
    if (bassetsToExclude.length !== 0) {
        [bAssets, factors, mins, maxs, pausedFlags] = [
            bAssets,
            factors,
            mins,
            maxs,
            pausedFlags,
        ].map((arg) => arg.filter((el, index) => !bassetsToExclude.includes(index)));
    }
    if (bAssets.length !== 0) {
        await deployments.execute("BasketManagerV3", { from: deployer }, "addBassets", bAssets, factors, mins, maxs, pausedFlags);
    }
    else {
        log("SKIPPING bAssets registration: all bAssets already registered");
    }
    log(`Done`);
};
func.tags = ["AddBassetsInBasketManager"];
func.dependencies = ["DeployMockBAssets"];
func.runAtTheEnd = true;
func.skip = async (hre) => {
    return true;
};
func.id = "1";
exports.default = func;
//# sourceMappingURL=7_AddBassetInBasketManager.js.map