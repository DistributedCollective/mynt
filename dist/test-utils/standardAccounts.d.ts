export type Address = string;
export type Bytes32 = string;
/**
 * @dev Standard accounts
 */
export declare class StandardAccounts {
    /**
     * @dev Default accounts as per system Migrations
     */
    all: Address[];
    default: Address;
    governor: Address;
    other: Address;
    dummy1: Address;
    dummy2: Address;
    dummy3: Address;
    dummy4: Address;
    fundManager: Address;
    fundManager2: Address;
    constructor(accounts: Address[]);
}
export default StandardAccounts;
