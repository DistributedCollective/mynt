"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const func = async ({ deployments: { deploy }, getNamedAccounts, }) => {
    const { deployer } = await getNamedAccounts();
    await deploy("DLLR", {
        from: deployer,
        contract: "DLLR",
        log: true,
    });
};
func.tags = ["DLLR"];
exports.default = func;
//# sourceMappingURL=1_DLLR.js.map