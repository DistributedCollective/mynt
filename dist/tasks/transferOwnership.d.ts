import { HardhatRuntimeEnvironment } from "hardhat/types";
export declare const transferOwnership: (hre: HardhatRuntimeEnvironment, contractAddress: string, newOwner: string, isMultisig?: boolean) => Promise<void>;
