import { Signer } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type { IMockImplementation, IMockImplementationInterface } from "../../../../../../artifacts/contracts/mocks/upgradability/MockProxyImplementation.sol/IMockImplementation";
export declare class IMockImplementation__factory {
    static readonly abi: readonly [{
        readonly inputs: readonly [];
        readonly name: "getVersion";
        readonly outputs: readonly [{
            readonly internalType: "string";
            readonly name: "";
            readonly type: "string";
        }];
        readonly stateMutability: "pure";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "isInitialized";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }];
    static createInterface(): IMockImplementationInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): IMockImplementation;
}
