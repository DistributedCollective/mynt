/* eslint-disable no-console */
import { task } from "hardhat/config";
import Logs from "node-logs";
import { getAddresses, IListAddresses } from "../../configs/addresses";
import SIPArgs, { ISipArgument } from "./args/SIPArgs";

const logger = new Logs().showInConsole(true);
     
task("createSIP", "Create SIP to Sovryn Governance")
.addParam("argsModuleName", "module name that is located in tasks/sips//args folder which and returning the sip arguments")
.setAction(async (taskArgs, hre) => {
  const { network, ethers } = hre;
  const argsModuleName = taskArgs.argsModuleName;
  const sipArgs: ISipArgument = await SIPArgs[argsModuleName](hre);
  const configAddresses: IListAddresses = getAddresses(network.name)
  const governor = await ethers.getContractAt("IGovernorAlpha", configAddresses.governorOwner);

  logger.info("=== Creating SIP ===")
  logger.info(`Governor Address:    ${governor.address}`)
  logger.info(`Target:              ${sipArgs.target}`)
  logger.info(`Values:              ${sipArgs.value}`)
  logger.info(`Signature:           ${sipArgs.signature}`)
  logger.info(`Data:                ${sipArgs.data}`)
  logger.info(`Description:         ${sipArgs.description}`)
  logger.info(`============================================================='`)

  await governor.propose(sipArgs.target, sipArgs.value, sipArgs.signature, sipArgs.data, sipArgs.description)

  logger.success("SIP has been created");
})
