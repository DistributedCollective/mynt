import { Signer, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../../common";
import type { MockBridge, MockBridgeInterface } from "../../../../../artifacts/contracts/mocks/masset/MockBridge";
type MockBridgeConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class MockBridge__factory extends ContractFactory {
    constructor(...args: MockBridgeConstructorParams);
    deploy(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<MockBridge>;
    getDeployTransaction(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): TransactionRequest;
    attach(address: string): MockBridge;
    connect(signer: Signer): MockBridge__factory;
    static readonly bytecode = "0x608060405234801561001057600080fd5b5061049e806100206000396000f3fe608060405234801561001057600080fd5b50600436106100415760003560e01c806319b656f9146100465780636dab27c01461006c5780637e5d362014610081575b600080fd5b610059610054366004610297565b6100a4565b6040519081526020015b60405180910390f35b61007f61007a3660046102e4565b61012c565b005b61009461008f366004610326565b6101b3565b6040519015158152602001610063565b6040516316e76cd160e31b81526001600160a01b0384811660048301526024820184905282811660448301526000919086169063b73b6688906064016020604051808303816000875af11580156100ff573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061012391906103c1565b95945050505050565b604080516001600160a01b03838116602083015286169163c4a586379186918691016040516020818303038152906040526040518463ffffffff1660e01b815260040161017b939291906103da565b600060405180830381600087803b15801561019557600080fd5b505af11580156101a9573d6000803e3d6000fd5b5050505050505050565b6040516323b872dd60e01b8152336004820152306024820152604481018590526000906001600160a01b038716906323b872dd906064016020604051808303816000875af1158015610209573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061022d919061043f565b61026f5760405162461bcd60e51b815260206004820152600f60248201526e1d1c985b9cd9995c8819985a5b1959608a1b604482015260640160405180910390fd5b50600195945050505050565b80356001600160a01b038116811461029257600080fd5b919050565b600080600080608085870312156102ad57600080fd5b6102b68561027b565b93506102c46020860161027b565b9250604085013591506102d96060860161027b565b905092959194509250565b600080600080608085870312156102fa57600080fd5b6103038561027b565b9350602085013592506103186040860161027b565b91506102d96060860161027b565b60008060008060006080868803121561033e57600080fd5b6103478661027b565b94506020860135935061035c6040870161027b565b9250606086013567ffffffffffffffff8082111561037957600080fd5b818801915088601f83011261038d57600080fd5b81358181111561039c57600080fd5b8960208285010111156103ae57600080fd5b9699959850939650602001949392505050565b6000602082840312156103d357600080fd5b5051919050565b8381526000602060018060a01b0385168184015260606040840152835180606085015260005b8181101561041c57858101830151858201608001528201610400565b506000608082860101526080601f19601f83011685010192505050949350505050565b60006020828403121561045157600080fd5b8151801515811461046157600080fd5b939250505056fea2646970667358221220387ffbc3d64fa1a0ce597527eefbfe3b051e0061e7cc53a621a1b9517afef1b764736f6c63430008110033";
    static readonly abi: readonly [{
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "massetManager";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "_orderAmount";
            readonly type: "uint256";
        }, {
            readonly internalType: "address";
            readonly name: "_tokenAddress";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "_userData";
            readonly type: "address";
        }];
        readonly name: "callOnTokensMinted";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "massetManager";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "_basset";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "_massetQuantity";
            readonly type: "uint256";
        }, {
            readonly internalType: "address";
            readonly name: "_recipient";
            readonly type: "address";
        }];
        readonly name: "callRedeemByBridge";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "massetRedeemed";
            readonly type: "uint256";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "tokenToUse";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "amount";
            readonly type: "uint256";
        }, {
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }, {
            readonly internalType: "bytes";
            readonly name: "";
            readonly type: "bytes";
        }];
        readonly name: "receiveTokensAt";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }];
    static createInterface(): MockBridgeInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): MockBridge;
}
export {};
