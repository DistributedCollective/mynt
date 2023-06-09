"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const deployment_1 = require("../helpers/deployment");
const helpers = __importStar(require("../../scripts/helpers/helpers"));
const { injectHre } = helpers;
const func = async (hre) => {
    const { deployments: { deploy, getOrNull }, getNamedAccounts, } = hre;
    const { deployer } = await getNamedAccounts();
    const deploymentName = "FeesVault";
    const deployment = await getOrNull(deploymentName);
    if (deployment) {
        injectHre(hre);
        await (0, deployment_1.upgradeWithTransparentUpgradableProxy)(deployer, deploymentName, "TransparentUpgradeableProxy", undefined, `${deploymentName}_Proxy`);
    }
    else {
        await deploy(deploymentName, {
            proxy: {
                owner: deployer,
                proxyContract: "OpenZeppelinTransparentProxy",
                viaAdminContract: {
                    name: "MyntAdminProxy",
                    artifact: "MyntAdminProxy",
                },
                execute: {
                    init: {
                        methodName: "initialize",
                        args: [],
                    },
                },
            },
            from: deployer,
            log: true,
        });
    }
};
func.tags = ["FeesVault"];
func.dependencies = ["MyntAdminProxy"];
exports.default = func;
//# sourceMappingURL=3_FeesVault.js.map