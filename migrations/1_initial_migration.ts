import { DeployFunction } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeploymentTags } from "./utils/DeploymentTags";
import { setNetwork, conditionalDeploy } from "./utils/state";

const cMigrations = artifacts.require("Migrations");

const deployFunc: DeployFunction = async ({ network, deployments, getUnnamedAccounts, }: HardhatRuntimeEnvironment) => {
    const { deploy } = deployments;
    const [deployer] = await getUnnamedAccounts();

    process.env.NETWORK = network.name;
    setNetwork(network.name);

    await conditionalDeploy({
        contract: cMigrations,
        key: "Migrations",
        deployfunc: deploy,
        deployOptions: { from: deployer }
    });
};

deployFunc.tags = [
    DeploymentTags.Migration
];

export default deployFunc;
