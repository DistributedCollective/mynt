import { Signer, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../../../common";
import type { MockProxyImplementation1, MockProxyImplementation1Interface } from "../../../../../../artifacts/contracts/mocks/upgradability/MockProxyImplementation.sol/MockProxyImplementation1";
type MockProxyImplementation1ConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class MockProxyImplementation1__factory extends ContractFactory {
    constructor(...args: MockProxyImplementation1ConstructorParams);
    deploy(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<MockProxyImplementation1>;
    getDeployTransaction(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): TransactionRequest;
    attach(address: string): MockProxyImplementation1;
    connect(signer: Signer): MockProxyImplementation1__factory;
    static readonly bytecode = "0x608060405234801561001057600080fd5b506101b1806100206000396000f3fe608060405234801561001057600080fd5b506004361061004c5760003560e01c80630d8e6e2c14610051578063392e53cd1461007d578063c4d66de814610093578063faf26b48146100d4575b600080fd5b60408051808201825260018152603160f81b6020820152905161007491906100fd565b60405180910390f35b60005460ff166040519015158152602001610074565b6100d26100a136600461014b565b6000805460ff196001600160a01b0390931661010002929092166001600160a81b0319909216919091176001179055565b005b60005461010090046001600160a01b03166040516001600160a01b039091168152602001610074565b600060208083528351808285015260005b8181101561012a5785810183015185820160400152820161010e565b506000604082860101526040601f19601f8301168501019250505092915050565b60006020828403121561015d57600080fd5b81356001600160a01b038116811461017457600080fd5b939250505056fea2646970667358221220867f62eb8f26f3caab9ea752d9c2345749386db2941af804d55f8ffbed5994e764736f6c63430008110033";
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
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "_depAddress";
            readonly type: "address";
        }];
        readonly name: "initialize";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
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
    static createInterface(): MockProxyImplementation1Interface;
    static connect(address: string, signerOrProvider: Signer | Provider): MockProxyImplementation1;
}
export {};
