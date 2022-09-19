import Logs from "node-logs";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { conditionalDeploy, conditionalInitialize, printState, setNetwork } from "./utils/state";
import { DeploymentTags } from "./utils/DeploymentTags";
import { isDevelopmentNetwork } from "./utils/addresses";

const MyntToken = artifacts.require("MyntToken");

const logger = new Logs().showInConsole(true);

const deployFunc = async ({ network, deployments, getUnnamedAccounts }: HardhatRuntimeEnvironment) => {
    logger.info("Deploying MYNT token...");
    setNetwork(network.name);

    const { deploy } = deployments;
    const [default_] = await getUnnamedAccounts();

    let amm = '';
    let presale = '';
    let multisig = '';

    if(isDevelopmentNetwork(network.name)) {
        amm = default_;
        presale = default_;
        multisig = default_;
    }

    const myntToken = await conditionalDeploy({
        contract: MyntToken,
        key: "MyntToken",
        deployfunc: deploy,
        deployOptions: { from: default_ }
    });

    logger.info(`Deployed at: ${myntToken.address}`);

    await conditionalInitialize("MyntToken", async () => {
        logger.info(`Setting market maker address to: ${amm}`);
        await myntToken.setMarketMaker(amm);

        logger.info(`Setting presale address to: ${presale}`);
        await myntToken.setPresale(presale);

        logger.info(`Setting owner address to: ${multisig}`);
        await myntToken.transferOwnership(multisig);
    });

    logger.success("Migration completed");
    printState();
};

deployFunc.tags = [
    DeploymentTags.MyntToken
];

export default deployFunc;
