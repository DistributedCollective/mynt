import { Signer, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../../../common";
import type { MockDummy2, MockDummy2Interface } from "../../../../../../artifacts/contracts/mocks/masset/MockDummy.sol/MockDummy2";
type MockDummy2ConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class MockDummy2__factory extends ContractFactory {
    constructor(...args: MockDummy2ConstructorParams);
    deploy(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<MockDummy2>;
    getDeployTransaction(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): TransactionRequest;
    attach(address: string): MockDummy2;
    connect(signer: Signer): MockDummy2__factory;
    static readonly bytecode = "0x608060405234801561001057600080fd5b5060d98061001f6000396000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c80630d8e6e2c14602d575b600080fd5b60408051808201825260018152601960f91b60208201529051604e91906057565b60405180910390f35b600060208083528351808285015260005b818110156082578581018301518582016040015282016068565b506000604082860101526040601f19601f830116850101925050509291505056fea2646970667358221220648795451f000aa8fc9f24252b19a3a9fe5bc4831d34400514e09d2245f661e264736f6c63430008110033";
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
    static createInterface(): MockDummy2Interface;
    static connect(address: string, signerOrProvider: Signer | Provider): MockDummy2;
}
export {};
