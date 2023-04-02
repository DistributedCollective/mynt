import { Signer, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../../../common";
import type { MockProxyImplementation2, MockProxyImplementation2Interface } from "../../../../../../artifacts/contracts/mocks/upgradability/MockProxyImplementation.sol/MockProxyImplementation2";
type MockProxyImplementation2ConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class MockProxyImplementation2__factory extends ContractFactory {
    constructor(...args: MockProxyImplementation2ConstructorParams);
    deploy(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<MockProxyImplementation2>;
    getDeployTransaction(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): TransactionRequest;
    attach(address: string): MockProxyImplementation2;
    connect(signer: Signer): MockProxyImplementation2__factory;
    static readonly bytecode = "0x608060405234801561001057600080fd5b5061012a806100206000396000f3fe6080604052348015600f57600080fd5b5060043610603c5760003560e01c80630d8e6e2c146041578063392e53cd14606b578063faf26b48146080575b600080fd5b60408051808201825260018152601960f91b602082015290516062919060a8565b60405180910390f35b60005460ff1660405190151581526020016062565b60005461010090046001600160a01b03166040516001600160a01b0390911681526020016062565b600060208083528351808285015260005b8181101560d35785810183015185820160400152820160b9565b506000604082860101526040601f19601f830116850101925050509291505056fea264697066735822122090ea5acc3a9a818c1af206af0c339a2f909a36abcd77134872834042714b3d0164736f6c63430008110033";
    static readonly abi: readonly [{
        readonly inputs: readonly [];
        readonly name: "getDep";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
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
    static createInterface(): MockProxyImplementation2Interface;
    static connect(address: string, signerOrProvider: Signer | Provider): MockProxyImplementation2;
}
export {};
