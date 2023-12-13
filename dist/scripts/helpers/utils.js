"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.delay = exports.logTimer = exports.encodeParameters = exports.arrayToUnique = exports.getContractNameFromScriptFileName = void 0;
// e.g. 1-deploy-PerpetualDepositManager.ts -> PerpetualDepositManager
let hre;
let ethers;
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
exports.delay = delay;
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
const logTimer = (time, passedTime) => {
    const delaySeconds = time / 1000;
    let timer = delaySeconds - passedTime;
    const hours = Math.round(timer / 3600);
    const minutes = Math.round((timer % 3600) / 60);
    const seconds = Math.round(timer % 60);
    const hoursStr = hours < 10 ? "0" + hours : hours;
    const minutesStr = minutes < 10 ? "0" + minutes : minutes;
    const secondsStr = seconds < 10 ? "0" + seconds : seconds;
    process.stdout.write("");
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    process.stdout.write(hoursStr + ":" + minutesStr + ":" + secondsStr);
};
exports.logTimer = logTimer;
//# sourceMappingURL=utils.js.map