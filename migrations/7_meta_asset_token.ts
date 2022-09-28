import Logs from "node-logs";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { conditionalDeploy, conditionalInitialize, contractConstructorArgs, printState, setNetwork } from "./utils/state";
import { DeploymentTags } from "./utils/DeploymentTags";
import { isDevelopmentNetwork } from "./utils/addresses";
import { MetaAssetTokenContract } from "../types/generated";

const MetaAssetToken = artifacts.require("MetaAssetToken");

const logger = new Logs().showInConsole(true);

const deployFunc = async ({ network, deployments, getUnnamedAccounts }: HardhatRuntimeEnvironment) => {
    logger.info("Deploying Meta asset (Sovryn Dollar) token...");
    setNetwork(network.name);

    const { deploy } = deployments;
    const [default_] = await getUnnamedAccounts();

    /// @todo update the value for mainnet deployment
    let myntAssetProxy = "";
    let myntAssetImpl = "";
    let myntBasketManagerProxy = "";
    let myntBasketManagerImpl = "";

    if(isDevelopmentNetwork(network.name)) {
      myntAssetProxy = default_;
      myntAssetImpl = default_;
      myntBasketManagerProxy = default_;
      myntBasketManagerImpl = default_;
    }

    const metaAssetTokenArgs = contractConstructorArgs<MetaAssetTokenContract>("Sovryn Dollar", "DLLR");
    const metaAssetToken = await conditionalDeploy({
        contract: MetaAssetToken,
        key: "MetaAssetToken",
        deployfunc: deploy,
        deployOptions: { from: default_, args: metaAssetTokenArgs }
    });

    logger.info(`Deployed at: ${metaAssetToken.address}`);

    await conditionalInitialize("MetaAssetToken", async () => {
        logger.info(`Setting mynt asset config to: proxy: ${myntAssetProxy}, impl: ${myntAssetImpl}`);
        await metaAssetToken.setMyntAssetConfig(myntAssetProxy, myntAssetImpl);

        logger.info(`Setting mynt basket manager config to: proxy: ${myntBasketManagerProxy}, impl: ${myntBasketManagerImpl}`);
        await metaAssetToken.setMyntBasketManagerConfig(myntBasketManagerProxy, myntBasketManagerImpl);
    });

    logger.success("Migration completed");
    printState();
};

deployFunc.tags = [
    DeploymentTags.MetaAssetToken
];

export default deployFunc;
