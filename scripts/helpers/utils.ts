// extracts the contract name from the script file name:
// prefix_ContractName.ts -> returns ContractName

import { HardhatRuntimeEnvironment } from "hardhat/types";

// e.g. 1-deploy-PerpetualDepositManager.ts -> PerpetualDepositManager
let hre: HardhatRuntimeEnvironment;
let ethers: HardhatRuntimeEnvironment["ethers"];

const injectHre = (_hre: HardhatRuntimeEnvironment) => {
  hre = _hre;
  ethers = hre.ethers;
};

const getContractNameFromScriptFileName = (filename) => {
  return filename.substring(
    filename.lastIndexOf("-") + 1,
    filename.lastIndexOf(".")
  );
};

const arrayToUnique = (value, index, self) => {
  return self.indexOf(value) === index;
};

const encodeParameters = (types, values) => {
  const abi = new ethers.utils.AbiCoder();
  return abi.encode(types, values);
};

export {
  getContractNameFromScriptFileName,
  arrayToUnique,
  encodeParameters,
  injectHre,
};