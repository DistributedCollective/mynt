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
exports.MockMetaAssetToken__factory = exports.MockBridge__factory = exports.MockBasketManager__factory = exports.mockDummySol = void 0;
/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
exports.mockDummySol = __importStar(require("./MockDummy.sol"));
var MockBasketManager__factory_1 = require("./MockBasketManager__factory");
Object.defineProperty(exports, "MockBasketManager__factory", { enumerable: true, get: function () { return MockBasketManager__factory_1.MockBasketManager__factory; } });
var MockBridge__factory_1 = require("./MockBridge__factory");
Object.defineProperty(exports, "MockBridge__factory", { enumerable: true, get: function () { return MockBridge__factory_1.MockBridge__factory; } });
var MockMetaAssetToken__factory_1 = require("./MockMetaAssetToken__factory");
Object.defineProperty(exports, "MockMetaAssetToken__factory", { enumerable: true, get: function () { return MockMetaAssetToken__factory_1.MockMetaAssetToken__factory; } });
//# sourceMappingURL=index.js.map