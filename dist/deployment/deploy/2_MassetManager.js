"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const func = async ({ deployments: { deploy }, getNamedAccounts, }) => {
    const { deployer } = await getNamedAccounts();
    await deploy("MassetManager", {
        proxy: {
            owner: deployer,
            proxyContract: "OpenZeppelinTransparentProxy",
            viaAdminContract: {
                name: "MyntAdminProxy",
                artifact: "MyntAdminProxy",
            },
        },
        from: deployer,
        log: true,
    });
};
func.tags = ["MassetManager"];
func.dependencies = ["MyntAdminProxy"];
exports.default = func;
//# sourceMappingURL=2_MassetManager.js.map