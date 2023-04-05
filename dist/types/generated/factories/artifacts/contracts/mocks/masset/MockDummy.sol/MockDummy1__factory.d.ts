import { Signer, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../../../common";
import type { MockDummy1, MockDummy1Interface } from "../../../../../../artifacts/contracts/mocks/masset/MockDummy.sol/MockDummy1";
type MockDummy1ConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class MockDummy1__factory extends ContractFactory {
    constructor(...args: MockDummy1ConstructorParams);
    deploy(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<MockDummy1>;
    getDeployTransaction(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): TransactionRequest;
    attach(address: string): MockDummy1;
    connect(signer: Signer): MockDummy1__factory;
    static readonly bytecode = "0x608060405234801561001057600080fd5b5060d98061001f6000396000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c80630d8e6e2c14602d575b600080fd5b60408051808201825260018152603160f81b60208201529051604e91906057565b60405180910390f35b600060208083528351808285015260005b818110156082578581018301518582016040015282016068565b506000604082860101526040601f19601f830116850101925050509291505056fea2646970667358221220ba9f1bd229ec8c051a8b1ba38c69f67aad68b9583d0b8b4f47ad618ca49adbe764736f6c63430008110033";
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
    static createInterface(): MockDummy1Interface;
    static connect(address: string, signerOrProvider: Signer | Provider): MockDummy1;
}
export {};
