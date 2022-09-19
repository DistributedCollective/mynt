import Logs from 'node-logs';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import {
    TimelockContract,
    StakingProxyContract,
    GovernorAlphaContract,
    VestingFactoryContract,
    VestingRegistry3Contract,
    FeeSharingProxyContract
} from "types/generated";
import { ZERO_ADDRESS } from '@utils/constants';
import {
    setInfo,
    printState,
    setNetwork,
    conditionalDeploy,
    conditionalInitialize,
    contractConstructorArgs,
    getDeployed,
    getInfo
} from "./utils/state";
import { Instances, isDevelopmentNetwork } from './utils/addresses';
import { DeploymentTags } from './utils/DeploymentTags';

const MyntToken = artifacts.require("MyntToken");
const FishToken = artifacts.require("Fish");
const Staking = artifacts.require("Staking");
const StakingProxy = artifacts.require("StakingProxy");
const VestingLogic = artifacts.require("VestingLogic");
const VestingFactory = artifacts.require("VestingFactory");
const VestingRegistry3 = artifacts.require("VestingRegistry3");
const Timelock = artifacts.require("Timelock");
const TimelockMock = artifacts.require("TimelockMock");
const GovernorAlpha = artifacts.require("GovernorAlpha");
const GovernorAlphaMock = artifacts.require("GovernorAlphaMock");
const FeeSharingProxy = artifacts.require("FeeSharingProxy");

const logger = new Logs().showInConsole(true);

const deployFunc = async ({ network, deployments, getUnnamedAccounts, web3 }: HardhatRuntimeEnvironment) => {
    logger.info("Starting governance migration");
    setNetwork(network.name);

    const { deploy } = deployments;
    const [default_] = await getUnnamedAccounts();

    async function deployInstance(
        symbol: Instances,
        tokenAddress: string,
        multisigAddress: string,
        quorumPercentageVotes: number,
        majorityPercentageVotes: number
    ) {
        const stakingLogic = await conditionalDeploy({
            contract: Staking,
            key: `${symbol}_StakingLogic`,
            deployfunc: deploy,
            deployOptions: { from: default_ }
        });

        const stakingProxyArgs = contractConstructorArgs<StakingProxyContract>(tokenAddress);
        const stakingProxy = await conditionalDeploy({
            contract: StakingProxy,
            key: `${symbol}_StakingProxy`,
            deployfunc: deploy,
            deployOptions: { from: default_, args: stakingProxyArgs }
        });

        await conditionalInitialize(`${symbol}_StakingProxy`,
            async () => { await stakingProxy.setImplementation(stakingLogic.address); }
        );

        const staking = await Staking.at(stakingProxy.address);

        const feeSharingProxyArgs = contractConstructorArgs<FeeSharingProxyContract>(ZERO_ADDRESS, staking.address);
        const feeSharingProxy = await conditionalDeploy({
            key: `${symbol}_FeeSharingProxy`,
            contract: FeeSharingProxy,
            deployOptions: { from: default_, args: feeSharingProxyArgs },
            deployfunc: deploy
        });

        await conditionalInitialize(`${symbol}_Staking`,
            async () => { await staking.setFeeSharing(feeSharingProxy.address); }
        );

        const vestingLogic = await conditionalDeploy({
            contract: VestingLogic,
            key: `${symbol}_VestingLogic`,
            deployfunc: deploy,
            deployOptions: { from: default_ }
        });

        const vestingFactoryArgs = contractConstructorArgs<VestingFactoryContract>(vestingLogic.address);
        const vestingFactory = await conditionalDeploy({
            contract: VestingFactory,
            key: `${symbol}_VestingFactory`,
            deployfunc: deploy,
            deployOptions: { from: default_, args: vestingFactoryArgs }
        });

        const vestingRegistryArgs = contractConstructorArgs<VestingRegistry3Contract>(
            vestingFactory.address,
            tokenAddress,
            staking.address,
            feeSharingProxy.address,
            multisigAddress
        );
        await conditionalDeploy({
            contract: VestingRegistry3,
            key: `${symbol}_VestingRegistry3`,
            deployfunc: deploy,
            deployOptions: { from: default_, args: vestingRegistryArgs }
        });

        let timelockContract: TimelockContract;

        let timelockDelay: number;
        if (isDevelopmentNetwork(network.name)) {
            timelockContract = TimelockMock;
            timelockDelay = 50;
        } else {
            timelockContract = Timelock;
            timelockDelay = 3 * 60 * 60;
        }

        const timelockArgs = contractConstructorArgs<TimelockContract>(default_, timelockDelay);
        const timelock = await conditionalDeploy({
            contract: timelockContract,
            key: `${symbol}_Timelock`,
            deployfunc: deploy,
            deployOptions: { from: default_, args: timelockArgs }
        });

        let governorAlphaContract: GovernorAlphaContract;

        if (isDevelopmentNetwork(network.name)) {
            governorAlphaContract = GovernorAlphaMock;
        } else {
            governorAlphaContract = GovernorAlpha;
        }

        const governorAlphaArgs = contractConstructorArgs<GovernorAlphaContract>(
            timelock.address,
            staking.address,
            default_,
            quorumPercentageVotes,
            majorityPercentageVotes
        );
        const governorAlpha = await conditionalDeploy({
            contract: governorAlphaContract,
            key: `${symbol}_GovernorAlpha`,
            deployfunc: deploy,
            deployOptions: { from: default_, args: governorAlphaArgs }
        });

        await conditionalInitialize(`${symbol}_GovernorAlpha`,
            async () => {
                const recentBlock = await web3.eth.getBlock("latest");
                const blockTimestamp = Number(recentBlock.timestamp) + timelockDelay + 30;

                const signature = "setPendingAdmin(address)";
                const abiParameters = web3.eth.abi.encodeParameter("address", governorAlpha.address);

                await timelock.queueTransaction(timelock.address, 0, signature, abiParameters, blockTimestamp);

                await setInfo(`${symbol}_Timelock`, "setAdminEta", blockTimestamp);
                const etaTime = new Date(blockTimestamp * 1000).toString();

                logger.warn(`Eta for admin: ${etaTime}`);
            }
        );
    }

    const fishToken = await getDeployed(FishToken, "FishToken");
    const fishTokenMultiSigWallet = await getInfo('FishTokenMultiSigWallet', 'address');

    const myntToken = await getDeployed(MyntToken, 'MyntToken');
    const myntTokenOwner = await myntToken.owner();

    await deployInstance('MYNT', myntToken.address, myntTokenOwner, 1, 20);
    // await deployInstance('ETHs', fishToken.address, fishTokenMultiSigWallet, 1, 20);
    // await deployInstance('XUSD', fishToken.address, fishTokenMultiSigWallet, 1, 20);
    // await deployInstance('BNBs', fishToken.address, fishTokenMultiSigWallet, 1, 20);

    logger.success("Migration completed");
    printState();
};

deployFunc.tags = [
    DeploymentTags.Governance
];

export default deployFunc;
