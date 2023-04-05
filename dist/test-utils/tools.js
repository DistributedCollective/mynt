"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokens = exports.fromWei = exports.padRight = exports.BN = exports.aToH = void 0;
const web3_utils_1 = require("web3-utils");
Object.defineProperty(exports, "aToH", { enumerable: true, get: function () { return web3_utils_1.asciiToHex; } });
Object.defineProperty(exports, "padRight", { enumerable: true, get: function () { return web3_utils_1.padRight; } });
Object.defineProperty(exports, "fromWei", { enumerable: true, get: function () { return web3_utils_1.fromWei; } });
const bn_js_1 = __importDefault(require("bn.js"));
exports.BN = bn_js_1.default;
const tokens = (amount) => (0, web3_utils_1.toWei)(new bn_js_1.default(amount), 'ether');
exports.tokens = tokens;
//# sourceMappingURL=tools.js.map