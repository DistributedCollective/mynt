import { task, types } from "hardhat/config";
import * as helpers from "../scripts/utils/helpers";
import { _createSIP } from "./sips/createSIP";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import Logs from "node-logs";

const logger = new Logs().showInConsole(true);

task("ownership:transfer", "Upgrade implementation of feesManager contract")
.addParam("newOwner", "New address of the owner", undefined, types.string, false)
.addVariadicPositionalParam("contractAddresses", "Array of contract address which ownership will be transferred")
.addOptionalParam("isMultisig", "flag if transaction needs to be intiated from the multisig contract")
.setAction(async ({ contractAddresses, newOwner, isMultisig }, hre) => {
  await Promise.all(
    contractAddresses.map(async contractAddress => {
      await _transferOwnership(hre, contractAddress, newOwner, isMultisig)
    })
  )
})

export const _transferOwnership = async (hre: HardhatRuntimeEnvironment, contractAddress: string, newOwner: string, isMultisig: boolean = false) => {
  const { ethers, getNamedAccounts, deployments: { get } } = hre;
  const ownableABI = [
    "function transferOwnership(address newOwner)",
    "function owner() view returns(address)",
  ];
  const ownable = await ethers.getContractAt(ownableABI, contractAddress);

  if(isMultisig) {
    const { deployer } = await getNamedAccounts();
    const multisigAddress = (await get("MultiSigWallet")).address;
    const data = ownable.interface.encodeFunctionData("transferOwnership", [
      newOwner,
    ]);

    await helpers.sendWithMultisig(
      multisigAddress,
      contractAddress,
      data,
      deployer
    );
  } else {
    await ownable.transferOwnership(newOwner);
    logger.success(`Contract ${contractAddress} ownership has been transferred to: ${await ownable.owner()}`);
  }
}