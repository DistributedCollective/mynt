"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hardhat_1 = require("hardhat");
const func = async ({ deployments, getNamedAccounts }) => {
    const { deploy, get, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const networkName = deployments.getNetworkName();
    let mocAddress;
    let docAddress;
    let zusdAddress;
    if (["development", "hardhat"].includes(networkName)) {
        docAddress = (await deploy("DoC", {
            contract: "MockERC20",
            args: [
                "DoC Token",
                "DoC",
                18,
                deployer,
                hardhat_1.ethers.utils.parseEther("100000000"),
            ],
            from: deployer,
            log: true,
        })).address;
        zusdAddress = (await deploy("ZUSD", {
            contract: "MockERC20",
            args: [
                "ZUSD Token",
                "ZUSD",
                18,
                deployer,
                hardhat_1.ethers.constants.Zero, //  utils.parseEther("100000000"),
            ],
            from: deployer,
            log: true,
        })).address;
        log(`using Money On Chain addresses on the '${networkName}'
    MoC main contract address: ${mocAddress}
    DoC address: ${docAddress}`);
        log(`Zero ZUSD address: ${zusdAddress}`);
    }
};
func.tags = ["DeployMockBAssets"];
exports.default = func;
//# sourceMappingURL=101_DeployMockBAssets.js.map