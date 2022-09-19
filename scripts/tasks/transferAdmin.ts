import Logs from "node-logs";
import { task } from "hardhat/config";
import { getDeployed, getInfo, setNetwork } from "migrations/utils/state";
import { GovernorAlphaContract, TimelockContract } from "types/generated";
import { blockTimestampSimple } from "scripts/utils/time";
import { Instances } from "migrations/utils/addresses";

const logger = new Logs().showInConsole(true);



task("transferAdmin", "transfers admin of governor alpha")
    .setAction(async (_, hre) => {
        const { network, web3, artifacts } = hre;
        setNetwork(network.name);

        const Timelock: TimelockContract = artifacts.require("Timelock");
        const GovernorAlpha: GovernorAlphaContract = artifacts.require("GovernorAlpha");

        const transferForInstance = async (instance: Instances) => {
            const timelock = await getDeployed(Timelock, `${instance}_Timelock`);
            const governorAlpha = await getDeployed(GovernorAlpha, `${instance}_GovernorAlpha`);
            const eta = await getInfo(`${instance}_Timelock`, "setAdminEta");
            const currentTime = await blockTimestampSimple(web3);
    
            if (eta > currentTime) {
                const etaTime = new Date(eta * 1000).toString();
                logger.error(`Invalid time for transfering admin. ETA FOR ADMIN TRANSFER: ${etaTime}`);
            }
    
            const signature = "setPendingAdmin(address)";
            const abiParameters = web3.eth.abi.encodeParameter("address", governorAlpha.address);
    
            await timelock.executeTransaction(timelock.address, 0, signature, abiParameters, eta);
    
            await timelock.pendingAdmin();
            // eslint-disable-next-line no-underscore-dangle
            await governorAlpha.__acceptAdmin();
    
            const admin = await timelock.admin();
            logger.info(`admin: ${admin}`);
        };

        // await transferForInstance('BNBs');
        // await transferForInstance('ETHs');
        // await transferForInstance('XUSD');
        await transferForInstance('MYNT');
    });
