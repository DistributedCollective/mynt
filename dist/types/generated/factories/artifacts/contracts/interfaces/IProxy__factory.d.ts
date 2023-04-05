import { Signer } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type { IProxy, IProxyInterface } from "../../../../artifacts/contracts/interfaces/IProxy";
export declare class IProxy__factory {
    static readonly abi: readonly [{
        readonly inputs: readonly [];
        readonly name: "getProxyImplementation";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }];
    static createInterface(): IProxyInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): IProxy;
}
