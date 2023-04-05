"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const func = async ({ deployments: { deploy }, getNamedAccounts, }) => {
    const { deployer } = await getNamedAccounts();
    await deploy("FeesVault", {
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
};
func.tags = ["FeesVault"];
func.dependencies = ["MyntAdminProxy"];
exports.default = func;
//# sourceMappingURL=3_FeesVault.js.map