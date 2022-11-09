import Logs from "node-logs";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { conditionalDeploy, conditionalInitialize, contractConstructorArgs, printState, setNetwork } from "./utils/state";
import { DeploymentTags } from "./utils/DeploymentTags";
import { isDevelopmentNetwork } from "./utils/addresses";
import { MetaAssetTokenContract } from "../types/generated";

const MetaAssetToken = artifacts.require("MetaAssetToken");

const logger = new Logs().showInConsole(true);

const deployFunc = async ({ network, deployments, getUnnamedAccounts }: HardhatRuntimeEnvironment) => {
    logger.info("Deploying Meta asset token...");
    setNetwork(network.name);

    const { deploy } = deployments;
    const [default_] = await getUnnamedAccounts();

    /// @todo update the value for mainnet deployment
    let assetProxy = "";
    let basketManagerProxy = "";

    if(isDevelopmentNetwork(network.name)) {
      assetProxy = default_;
      basketManagerProxy = default_;
    }

    const metaAssetTokenArgs = contractConstructorArgs<MetaAssetTokenContract>("MetaAsset", "MAT");
    const metaAssetToken = await conditionalDeploy({
        contract: MetaAssetToken,
        key: "MetaAssetToken",
        deployfunc: deploy,
        deployOptions: { from: default_, args: metaAssetTokenArgs }
    });

    logger.info(`Deployed at: ${metaAssetToken.address}`);

    await conditionalInitialize("MetaAssetToken", async () => {
        logger.info(`Setting asset proxy to: ${assetProxy}`);
        await metaAssetToken.setAssetProxy(assetProxy);

        logger.info(`Setting basket manager proxy to: ${basketManagerProxy}`);
        await metaAssetToken.setBasketManagerProxy(basketManagerProxy);
    });

    logger.success("Migration completed");
    printState();
};

deployFunc.tags = [
    DeploymentTags.MetaAssetToken
];

export default deployFunc;
