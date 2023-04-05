import { Signer, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../../../common";
import type { NonReentrantMock, NonReentrantMockInterface } from "../../../../../../artifacts/contracts/mocks/helpers/InitializableReentrancyGuardMock.sol/NonReentrantMock";
type NonReentrantMockConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class NonReentrantMock__factory extends ContractFactory {
    constructor(...args: NonReentrantMockConstructorParams);
    deploy(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<NonReentrantMock>;
    getDeployTransaction(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): TransactionRequest;
    attach(address: string): NonReentrantMock;
    connect(signer: Signer): NonReentrantMock__factory;
    static readonly bytecode = "0x6080604052348015600f57600080fd5b50607780601d6000396000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c8063848d0bd414602d575b600080fd5b604080516001815290519081900360200190f3fea2646970667358221220cb71331273af9d9d15a9825d6c5682d649d47040c93524b8e4e03b74937712a364736f6c63430008110033";
    static readonly abi: readonly [{
        readonly inputs: readonly [];
        readonly name: "clientMethod";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "pure";
        readonly type: "function";
    }];
    static createInterface(): NonReentrantMockInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): NonReentrantMock;
}
export {};
