import { Signer, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../../common";
import type { MockApprovalReceiver, MockApprovalReceiverInterface } from "../../../../../artifacts/contracts/mocks/mynt/MockApprovalReceiver";
type MockApprovalReceiverConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class MockApprovalReceiver__factory extends ContractFactory {
    constructor(...args: MockApprovalReceiverConstructorParams);
    deploy(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<MockApprovalReceiver>;
    getDeployTransaction(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): TransactionRequest;
    attach(address: string): MockApprovalReceiver;
    connect(signer: Signer): MockApprovalReceiver__factory;
    static readonly bytecode = "0x608060405234801561001057600080fd5b5061044f806100206000396000f3fe608060405234801561001057600080fd5b50600436106100575760003560e01c806367e404ce1461005c57806373d4a13a1461008c5780638f4ffcb1146100a1578063aa8c217c146100b6578063fc0c546a146100cd575b600080fd5b60005461006f906001600160a01b031681565b6040516001600160a01b0390911681526020015b60405180910390f35b6100946100e0565b60405161008391906101b8565b6100b46100af366004610222565b61016e565b005b6100bf60015481565b604051908152602001610083565b60025461006f906001600160a01b031681565b600380546100ed906102bd565b80601f0160208091040260200160405190810160405280929190818152602001828054610119906102bd565b80156101665780601f1061013b57610100808354040283529160200191610166565b820191906000526020600020905b81548152906001019060200180831161014957829003601f168201915b505050505081565b600080546001600160a01b038088166001600160a01b0319928316179092556001869055600280549286169290911691909117905560036101b0828483610358565b505050505050565b600060208083528351808285015260005b818110156101e5578581018301518582016040015282016101c9565b506000604082860101526040601f19601f8301168501019250505092915050565b80356001600160a01b038116811461021d57600080fd5b919050565b60008060008060006080868803121561023a57600080fd5b61024386610206565b94506020860135935061025860408701610206565b9250606086013567ffffffffffffffff8082111561027557600080fd5b818801915088601f83011261028957600080fd5b81358181111561029857600080fd5b8960208285010111156102aa57600080fd5b9699959850939650602001949392505050565b600181811c908216806102d157607f821691505b6020821081036102f157634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052604160045260246000fd5b601f82111561035357600081815260208120601f850160051c810160208610156103345750805b601f850160051c820191505b818110156101b057828155600101610340565b505050565b67ffffffffffffffff831115610370576103706102f7565b6103848361037e83546102bd565b8361030d565b6000601f8411600181146103b857600085156103a05750838201355b600019600387901b1c1916600186901b178355610412565b600083815260209020601f19861690835b828110156103e957868501358255602094850194600190920191016103c9565b50868210156104065760001960f88860031b161c19848701351681555b505060018560011b0183555b505050505056fea2646970667358221220e151bd510ecb87f24a7c5b3525afbefb3d4c83e21122cfc9f453dcb0f28256b564736f6c63430008110033";
    static readonly abi: readonly [{
        readonly inputs: readonly [];
        readonly name: "amount";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "data";
        readonly outputs: readonly [{
            readonly internalType: "bytes";
            readonly name: "";
            readonly type: "bytes";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
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
    }, {
        readonly inputs: readonly [];
        readonly name: "sender";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "token";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }];
    static createInterface(): MockApprovalReceiverInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): MockApprovalReceiver;
}
export {};
