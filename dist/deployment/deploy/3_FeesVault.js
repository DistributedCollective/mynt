"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const deployment_1 = require("../helpers/deployment");
const func = async (hre) => {
    const { deployments: { deploy, getOrNull }, getNamedAccounts, } = hre;
    const { deployer } = await getNamedAccounts();
    const deploymentName = "FeesVault";
    const deployment = await getOrNull(deploymentName);
    if (deployment) {
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