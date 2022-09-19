import Logs from "node-logs";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { FishContract, MultiSigWalletContract } from "types/generated";
import { conditionalDeploy, conditionalInitialize, contractConstructorArgs, setNetwork } from "./utils/state";
import { DeploymentTags } from "./utils/DeploymentTags";
import { isDevelopmentNetwork } from "./utils/addresses";

const FishToken = artifacts.require("Fish");
const MultiSigWallet = artifacts.require("MultiSigWallet");

const logger = new Logs().showInConsole(true);

const deployFunc = async ({ network, deployments, getUnnamedAccounts }: HardhatRuntimeEnvironment) => {
    logger.info("Deploying Fish token...");
    setNetwork(network.name);

    const { deploy } = deployments;
    const [default_] = await getUnnamedAccounts();

    const initialAmount = "1000000000000000000000";
    const multiSigWalletOwners = [default_];
    const multiSigWalletRequiredConfirmations = 1;

    const fishArgs = contractConstructorArgs<FishContract>(initialAmount);
    const fishToken = await conditionalDeploy({
        contract: FishToken,
        key: "FishToken",
        deployfunc: deploy,
        deployOptions: { from: default_, args: fishArgs }
    });

    const multiSigArgs = contractConstructorArgs<MultiSigWalletContract>(multiSigWalletOwners, multiSigWalletRequiredConfirmations);
    const multiSigWallet = await conditionalDeploy({
        contract: MultiSigWallet,
        key: "FishTokenMultiSigWallet",
        deployfunc: deploy,
        deployOptions: { from: default_, args: multiSigArgs }
    });

    await conditionalInitialize("FishTokenMultiSigWallet",
        async () => {
            if (!isDevelopmentNetwork(network.name)) {
                await fishToken.transferOwnership(multiSigWallet.address);
            }
        }
    );
};

deployFunc.tags = [
    DeploymentTags.FishToken
];

export default deployFunc;
