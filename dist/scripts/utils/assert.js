"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_logs_1 = __importDefault(require("node-logs"));
const logger = new node_logs_1.default().showInConsole(true);
exports.default = (condition, message) => {
    if (!condition) {
        const errorMessage = message || "Assertion failed";
        logger.err(`err: ${errorMessage}`);
        throw new Error(errorMessage);
    }
};
//# sourceMappingURL=assert.js.map