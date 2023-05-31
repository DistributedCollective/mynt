"use strict";
// extracts the contract name from the script file name:
// prefix_ContractName.ts -> returns ContractName
Object.defineProperty(exports, "__esModule", { value: true });
exports.injectHre = exports.encodeParameters = exports.arrayToUnique = exports.getContractNameFromScriptFileName = void 0;
// e.g. 1-deploy-PerpetualDepositManager.ts -> PerpetualDepositManager
let hre;
let ethers;
const injectHre = (_hre) => {
    hre = _hre;
    ethers = hre.ethers;
};
exports.injectHre = injectHre;
const getContractNameFromScriptFileName = (filename) => {
    return filename.substring(filename.lastIndexOf("-") + 1, filename.lastIndexOf("."));
};
exports.getContractNameFromScriptFileName = getContractNameFromScriptFileName;
const arrayToUnique = (value, index, self) => {
    return self.indexOf(value) === index;
};
exports.arrayToUnique = arrayToUnique;
const encodeParameters = (types, values) => {
    const abi = new ethers.utils.AbiCoder();
    return abi.encode(types, values);
};
exports.encodeParameters = encodeParameters;
//# sourceMappingURL=utils.js.map