"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const func = async ({ deployments: { deploy }, getNamedAccounts, }) => {
    const { deployer } = await getNamedAccounts();
    await deploy("MyntAdminProxy", {
        skipIfAlreadyDeployed: true,
        contract: "MyntAdminProxy",
        from: deployer,
        log: true,
    });
};
func.tags = ["MyntAdminProxy"];
exports.default = func;
//# sourceMappingURL=0_MyntAdminProxy.js.map