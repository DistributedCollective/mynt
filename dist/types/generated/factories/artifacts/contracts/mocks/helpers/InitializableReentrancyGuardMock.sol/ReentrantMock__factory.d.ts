import { Signer, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../../../common";
import type { ReentrantMock, ReentrantMockInterface } from "../../../../../../artifacts/contracts/mocks/helpers/InitializableReentrancyGuardMock.sol/ReentrantMock";
type ReentrantMockConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class ReentrantMock__factory extends ContractFactory {
    constructor(...args: ReentrantMockConstructorParams);
    deploy(_contractAddress: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ReentrantMock>;
    getDeployTransaction(_contractAddress: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): TransactionRequest;
    attach(address: string): ReentrantMock;
    connect(signer: Signer): ReentrantMock__factory;
    static readonly bytecode = "0x608060405234801561001057600080fd5b5060405161017538038061017583398101604081905261002f91610054565b600080546001600160a01b0319166001600160a01b0392909216919091179055610084565b60006020828403121561006657600080fd5b81516001600160a01b038116811461007d57600080fd5b9392505050565b60e3806100926000396000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c8063848d0bd414602d575b600080fd5b60336047565b604051901515815260200160405180910390f35b60008054604051635594bcfb60e01b81523060048201526001600160a01b03909116908190635594bcfb90602401600060405180830381600087803b158015608e57600080fd5b505af115801560a1573d6000803e3d6000fd5b5050505060019150509056fea264697066735822122032d4617a869b60b14b6a43b1f4eedc350606f3c1ae02ef5a9362d88e09df893564736f6c63430008110033";
    static readonly abi: readonly [{
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "_contractAddress";
            readonly type: "address";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "constructor";
    }, {
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
    static createInterface(): ReentrantMockInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): ReentrantMock;
}
export {};
