"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBasketManagerV3 = exports.RATIO_PRECISION = exports.createToken = void 0;
const Token = artifacts.require("MetaAssetToken");
const BasketManagerV3 = artifacts.require("BasketManagerV3");
const createToken = async (massetAddress) => {
    const token = await Token.new("Mock1", "MK1");
    token.transferOwnership(massetAddress);
    return token;
    // TODO: add MetaAssetToken MassetManager and BasketManager proxies instantiations
};
exports.createToken = createToken;
exports.RATIO_PRECISION = 1000;
const createBasketManagerV3 = async (config) => {
    const { massetAddress, txDetails } = config;
    const basketManagerV3 = await BasketManagerV3.new(txDetails);
    await basketManagerV3.initialize(massetAddress);
    return basketManagerV3;
};
exports.createBasketManagerV3 = createBasketManagerV3;
//# sourceMappingURL=utils.js.map