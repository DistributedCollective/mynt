/* eslint-disable no-console */
import hre from "hardhat";
import { task } from "hardhat/config";
import Logs from "node-logs";
import { addresses, IListAddresses } from "../../configs/addresses";
import SIPArgs from "./args/SIPArgs";

const logger = new Logs().showInConsole(true);
     
task("createSIP", "Create SIP to Sovryn Governance")
.addParam("argsModuleName", "module name that is located in tasks/sips//args folder which and returning the sip arguments")
.setAction(async (taskArgs, hre) => {
  let argsModuleName = taskArgs.argsModuleName;

  let sipArgs = await SIPArgs[argsModuleName](hre);
  
  let configAddresses: IListAddresses = {} as IListAddresses;
    const { network } = hre;
    const networkName = network.name;

    if (["rskTestnet", "rskForkedTestnet"].includes(networkName)) {
      configAddresses = addresses.testnet
    } else if (["rskMainnet", "rskForkedMainnet"].includes(networkName)) {
      configAddresses = addresses.mainnet
    }

    const governor = await hre.ethers.getContractAt("IGovernorAlpha", configAddresses.governorOwner);

    logger.info("=== Creating SIP ===")
    logger.info(`Governor Address:    ${governor.address}`)
    logger.info(`Target:              ${sipArgs.target}`)
    logger.info(`Values:              ${sipArgs.value}`)
    logger.info(`Signature:           ${sipArgs.signature}`)
    logger.info(`Data:                ${sipArgs.data}`)
    logger.info(`Description:         ${sipArgs.description}`)
    logger.info(`============================================================='`)

    logger.success("SIP has been created");
})
