import { Signer } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type { IApproveAndCall, IApproveAndCallInterface } from "../../../../artifacts/contracts/interfaces/IApproveAndCall";
export declare class IApproveAndCall__factory {
    static readonly abi: readonly [{
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "_sender";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "_amount";
            readonly type: "uint256";
        }, {
            readonly internalType: "address";
            readonly name: "_token";
            readonly type: "address";
        }, {
            readonly internalType: "bytes";
            readonly name: "_data";
            readonly type: "bytes";
        }];
        readonly name: "receiveApproval";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }];
    static createInterface(): IApproveAndCallInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): IApproveAndCall;
}
