import { Signer } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type { IReentrantMock, IReentrantMockInterface } from "../../../../../../artifacts/contracts/mocks/helpers/InitializableReentrancyGuardMock.sol/IReentrantMock";
export declare class IReentrantMock__factory {
    static readonly abi: readonly [{
        readonly inputs: readonly [];
        readonly name: "clientMethod";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }];
    static createInterface(): IReentrantMockInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): IReentrantMock;
}
