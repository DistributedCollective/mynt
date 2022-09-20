export type Address = string;
export type Bytes32 = string;

export type Fees = Record<"deposit" | "depositBridge" | "withdrawal" | "withdrawalBridge", BN>;
