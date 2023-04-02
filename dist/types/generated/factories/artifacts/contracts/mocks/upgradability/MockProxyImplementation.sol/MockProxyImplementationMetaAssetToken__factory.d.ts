import { Signer, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../../../common";
import type { MockProxyImplementationMetaAssetToken, MockProxyImplementationMetaAssetTokenInterface } from "../../../../../../artifacts/contracts/mocks/upgradability/MockProxyImplementation.sol/MockProxyImplementationMetaAssetToken";
type MockProxyImplementationMetaAssetTokenConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class MockProxyImplementationMetaAssetToken__factory extends ContractFactory {
    constructor(...args: MockProxyImplementationMetaAssetTokenConstructorParams);
    deploy(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<MockProxyImplementationMetaAssetToken>;
    getDeployTransaction(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): TransactionRequest;
    attach(address: string): MockProxyImplementationMetaAssetToken;
    connect(signer: Signer): MockProxyImplementationMetaAssetToken__factory;
    static readonly bytecode = "0x608060405234801561001057600080fd5b50610239806100206000396000f3fe60806040526004361061004e5760003560e01c80630d8e6e2c1461005a578063392e53cd1461009357806390e4b720146100b6578063c4d66de8146100e3578063faf26b481461012f57600080fd5b3661005557005b600080fd5b34801561006657600080fd5b5060408051808201825260018152603160f81b6020820152905161008a9190610185565b60405180910390f35b34801561009f57600080fd5b5060005460ff16604051901515815260200161008a565b3480156100c257600080fd5b506100cb61014d565b6040516001600160a01b03909116815260200161008a565b3480156100ef57600080fd5b5061012d6100fe3660046101d3565b603380546001600160a01b0319166001600160a01b03929092169190911790556000805460ff19166001179055565b005b34801561013b57600080fd5b506033546001600160a01b03166100cb565b60006101807f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc546001600160a01b031690565b905090565b600060208083528351808285015260005b818110156101b257858101830151858201604001528201610196565b506000604082860101526040601f19601f8301168501019250505092915050565b6000602082840312156101e557600080fd5b81356001600160a01b03811681146101fc57600080fd5b939250505056fea26469706673582212203daf6e78945c5c208bd27ec642b8e14c2748da14603977dc2ee4796854e716da64736f6c63430008110033";
    static readonly abi: readonly [{
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: false;
            readonly internalType: "address";
            readonly name: "previousAdmin";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "address";
            readonly name: "newAdmin";
            readonly type: "address";
        }];
        readonly name: "AdminChanged";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "beacon";
            readonly type: "address";
        }];
        readonly name: "BeaconUpgraded";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: false;
            readonly internalType: "uint8";
            readonly name: "version";
            readonly type: "uint8";
        }];
        readonly name: "Initialized";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "implementation";
            readonly type: "address";
        }];
        readonly name: "Upgraded";
        readonly type: "event";
    }, {
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
        readonly name: "getProxyImplementation";
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
    }, {
        readonly stateMutability: "payable";
        readonly type: "receive";
    }];
    static createInterface(): MockProxyImplementationMetaAssetTokenInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): MockProxyImplementationMetaAssetToken;
}
export {};
