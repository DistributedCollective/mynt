/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { subtask } from "hardhat/config";
import { ArgumentType } from "hardhat/types";
import Logs from "node-logs";
import { getDeployed, getInfo, setNetwork } from "migrations/utils/state";
import { OwnableContract } from "types/generated";
import { Instances } from "migrations/utils/addresses";

const logger = new Logs().showInConsole(true);

export type TransferOwnershipParams = {
    contracts: string[];
    instance: Instances;
};

const stringArrayArgument: ArgumentType<string[]> = {
    name: 'StringArray',
    validate: (name, value) => {
        if (!Array.isArray(value)) {
            throw new Error(`Param: ${name} is not an array`);
        }

        value.forEach((item) => {
            if (typeof item !== 'string') {
                throw new Error(`Param: ${name} contains items with wrong type`);
            }
        });
    }
};

subtask("transferOwnership", "transfers ownership of selected contracts to Timelock to integrate them with governance system")
    .addParam<string[]>("contracts", "list of deployed contracts keys to perform action on", [], stringArrayArgument)
    .setAction(async (taskArgs: TransferOwnershipParams, hre) => {
        const { artifacts, network } = hre;
        setNetwork(network.name);

        const Ownable: OwnableContract = artifacts.require("Ownable");
        const timelockAddress: string = await getInfo(`${taskArgs.instance}_Timelock`, "address");

        for (const contractKey of taskArgs.contracts) {
            const contract = await getDeployed(Ownable, contractKey);
            logger.info(`Transfering ownership of ${contractKey}`);

            await contract.transferOwnership(timelockAddress);
        }
    });



