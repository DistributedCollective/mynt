import Logs from "node-logs";
import { DeployFunction } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { BasketManagerContract, TokenContract } from "types/generated";
import addresses, { BassetInstanceDetails, Instances, isDevelopmentNetwork, Networks } from './utils/addresses';
import { DeploymentTags } from "./utils/DeploymentTags";

import { conditionalDeploy, conditionalInitialize, contractConstructorArgs, printState, setNetwork } from "./utils/state";

const cToken = artifacts.require("Token");
const cBasketManager = artifacts.require("BasketManager");
const cMasset = artifacts.require("Masset");
const cMassetProxy = artifacts.require("MassetProxy");

const logger = new Logs().showInConsole(true);

const deployFunc: DeployFunction = async ({ network, deployments, getUnnamedAccounts }: HardhatRuntimeEnvironment) => {
    logger.info("Starting system migration");

    const [default_, _admin] = await getUnnamedAccounts();
    const { deploy } = deployments;

    const addressesForNetwork = addresses[network.name as Networks];
    setNetwork(network.name);

    async function deployInstance(symbol: Instances, massetName: string, tokenSymbol: string, addressesForInstance: Partial<BassetInstanceDetails>) {
        const dTokenArgs = contractConstructorArgs<TokenContract>(massetName, tokenSymbol, 18);

        const dToken = await conditionalDeploy({
            contract: cToken,
            key: `${symbol}_Token`,
            deployfunc: deploy,
            deployOptions: { from: default_, args: dTokenArgs }
        });

        const dMasset = await conditionalDeploy({
            contract: cMasset,
            key: `${symbol}_Masset`,
            deployfunc: deploy,
            deployOptions: { from: default_ }
        });
        const dMassetProxy = await conditionalDeploy({
            contract: cMassetProxy,
            key: `${symbol}_MassetProxy`,
            deployfunc: deploy,
            deployOptions: { from: default_ }
        });

        if (await dToken.owner() !== dMassetProxy.address) {
            await dToken.transferOwnership(dMassetProxy.address);
        }
        if (isDevelopmentNetwork(network.name)) {
            const { address: mockTokenAddress } = await deploy("Token", {
                from: default_,
                args: ['MOCK', 'MOCK', 18]
            });

            await cToken.at(mockTokenAddress);
            addressesForInstance.bassets = [mockTokenAddress];
            addressesForInstance.factors = [1];
            addressesForInstance.bridges = ['0x0000000000000000000000000000000000000000'];
        }

        const dBasketManagerArgs = contractConstructorArgs<BasketManagerContract>(addressesForInstance.bassets, addressesForInstance.factors, addressesForInstance.bridges);
        const dBasketManager = await conditionalDeploy({
            contract: cBasketManager,
            key: `${symbol}_BasketManager`,
            deployfunc: deploy,
            deployOptions: { from: default_, args: dBasketManagerArgs }
        });

        const initdata: string = dMasset.contract.methods
            .initialize(
                dBasketManager.address,
                dToken.address,
                addressesForNetwork.registerAsERC777Recipient
            ).encodeABI();

        await conditionalInitialize(`${symbol}_MassetProxy`, async () => {
            await dMassetProxy.methods["initialize(address,address,bytes)"](
                dMasset.address,
                addressesForInstance.multisig || _admin,
                initdata,
            );
        });
    }
    await deployInstance('MYNT', 'Nuestro', 'NUE', addressesForNetwork.MYNT);
    // await deployInstance('ETHs', 'ETHs', 'ETHs', addressesForNetwork.ETHs);
    // await deployInstance('XUSD', 'XUSD', 'XUSD', addressesForNetwork.XUSD);
    // await deployInstance('BNBs', 'BNBs', 'BNBs', addressesForNetwork.BNBs);

    logger.success("Migration completed");
    printState();
};

deployFunc.tags = [
    DeploymentTags.V2,
    DeploymentTags.Migration
];

export default deployFunc;
