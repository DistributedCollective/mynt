"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const func = async ({ deployments: { deploy }, getNamedAccounts, }) => {
    const { deployer } = await getNamedAccounts();
    await deploy("Permit2", {
        from: deployer,
        contract: "Permit2",
        log: true,
        skipIfAlreadyDeployed: true,
    });
};
func.tags = ["Permit2"];
exports.default = func;
//# sourceMappingURL=103_Permit2.js.map