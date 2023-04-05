"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StandardAccounts = void 0;
/**
 * @dev Standard accounts
 */
class StandardAccounts {
    constructor(accounts) {
        this.all = accounts;
        [
            this.default,
            this.governor,
            this.other,
            this.dummy1,
            this.dummy2,
            this.dummy3,
            this.dummy4,
            this.fundManager,
            this.fundManager2,
        ] = accounts;
    }
}
exports.StandardAccounts = StandardAccounts;
exports.default = StandardAccounts;
//# sourceMappingURL=standardAccounts.js.map