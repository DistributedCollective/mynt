"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const func = async ({ deployments: { deploy }, getNamedAccounts, }) => {
    const { deployer } = await getNamedAccounts();
    const depositFee = 0;
    const depositBridgeFee = 0;
    const withdrawalFee = 0;
    const withdrawalBridgeFee = 0;
    await deploy("FeesManager", {
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
                    args: [
                        depositFee,
                        depositBridgeFee,
                        withdrawalFee,
                        withdrawalBridgeFee,
                    ],
                },
            },
        },
        from: deployer,
        log: true,
    });
};
func.tags = ["FeesManager"];
func.dependencies = ["MyntAdminProxy"];
exports.default = func;
//# sourceMappingURL=4_FeesManager.js.map