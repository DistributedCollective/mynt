import { Signer } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type { IMockDummy, IMockDummyInterface } from "../../../../../../artifacts/contracts/mocks/masset/MockDummy.sol/IMockDummy";
export declare class IMockDummy__factory {
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
    }];
    static createInterface(): IMockDummyInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): IMockDummy;
}
