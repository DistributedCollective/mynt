"use strict";
/// <reference path="../types/interfaces.d.ts" />
/// <reference path="../types/chai.d.ts" />
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai = __importStar(require("chai"));
const chai_bn_1 = __importDefault(require("chai-bn"));
const tools_1 = require("./tools");
/**
 * @notice This file configures the environment for testing
 */
class TestEnvironmentSetup {
    constructor() {
        this.isConfigured = false;
    }
    configure() {
        require("chai-core");
        if (this.isConfigured) {
            return chai;
        }
        chai.use((0, chai_bn_1.default)(tools_1.BN));
        chai.should();
        this.isConfigured = true;
        return chai;
    }
}
exports.default = new TestEnvironmentSetup();
//# sourceMappingURL=env_setup.js.map