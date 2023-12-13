"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const deployment_1 = require("../helpers/deployment");
const func = async ({ deployments: { deploy, getOrNull }, getNamedAccounts, }) => {
    const { deployer } = await getNamedAccounts();
    const depositFee = 0;
    const withdrawalFee = 0;
    const deploymentName = "FeesManager";
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
                        args: [depositFee, withdrawalFee],
                    },
                },
            },
            from: deployer,
            log: true,
        });
    }
};
func.tags = ["FeesManager"];
func.dependencies = ["MyntAdminProxy"];
exports.default = func;
//# sourceMappingURL=4_FeesManager.js.map