"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockApprovalReceiver__factory = void 0;
/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
const ethers_1 = require("ethers");
const _abi = [
    {
        inputs: [],
        name: "amount",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "data",
        outputs: [
            {
                internalType: "bytes",
                name: "",
                type: "bytes",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_sender",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "_amount",
                type: "uint256",
            },
            {
                internalType: "address",
                name: "_token",
                type: "address",
            },
            {
                internalType: "bytes",
                name: "_data",
                type: "bytes",
            },
        ],
        name: "receiveApproval",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "sender",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "token",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
];
const _bytecode = "0x608060405234801561001057600080fd5b5061044f806100206000396000f3fe608060405234801561001057600080fd5b50600436106100575760003560e01c806367e404ce1461005c57806373d4a13a1461008c5780638f4ffcb1146100a1578063aa8c217c146100b6578063fc0c546a146100cd575b600080fd5b60005461006f906001600160a01b031681565b6040516001600160a01b0390911681526020015b60405180910390f35b6100946100e0565b60405161008391906101b8565b6100b46100af366004610222565b61016e565b005b6100bf60015481565b604051908152602001610083565b60025461006f906001600160a01b031681565b600380546100ed906102bd565b80601f0160208091040260200160405190810160405280929190818152602001828054610119906102bd565b80156101665780601f1061013b57610100808354040283529160200191610166565b820191906000526020600020905b81548152906001019060200180831161014957829003601f168201915b505050505081565b600080546001600160a01b038088166001600160a01b0319928316179092556001869055600280549286169290911691909117905560036101b0828483610358565b505050505050565b600060208083528351808285015260005b818110156101e5578581018301518582016040015282016101c9565b506000604082860101526040601f19601f8301168501019250505092915050565b80356001600160a01b038116811461021d57600080fd5b919050565b60008060008060006080868803121561023a57600080fd5b61024386610206565b94506020860135935061025860408701610206565b9250606086013567ffffffffffffffff8082111561027557600080fd5b818801915088601f83011261028957600080fd5b81358181111561029857600080fd5b8960208285010111156102aa57600080fd5b9699959850939650602001949392505050565b600181811c908216806102d157607f821691505b6020821081036102f157634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052604160045260246000fd5b601f82111561035357600081815260208120601f850160051c810160208610156103345750805b601f850160051c820191505b818110156101b057828155600101610340565b505050565b67ffffffffffffffff831115610370576103706102f7565b6103848361037e83546102bd565b8361030d565b6000601f8411600181146103b857600085156103a05750838201355b600019600387901b1c1916600186901b178355610412565b600083815260209020601f19861690835b828110156103e957868501358255602094850194600190920191016103c9565b50868210156104065760001960f88860031b161c19848701351681555b505060018560011b0183555b505050505056fea2646970667358221220ef4cdd6d749746e19d8bb25c9d7a3a11ae8a37b4e441efbf908d0b754fd0a07c64736f6c63430008110033";
const isSuperArgs = (xs) => xs.length > 1;
class MockApprovalReceiver__factory extends ethers_1.ContractFactory {
    constructor(...args) {
        if (isSuperArgs(args)) {
            super(...args);
        }
        else {
            super(_abi, _bytecode, args[0]);
        }
    }
    deploy(overrides) {
        return super.deploy(overrides || {});
    }
    getDeployTransaction(overrides) {
        return super.getDeployTransaction(overrides || {});
    }
    attach(address) {
        return super.attach(address);
    }
    connect(signer) {
        return super.connect(signer);
    }
    static createInterface() {
        return new ethers_1.utils.Interface(_abi);
    }
    static connect(address, signerOrProvider) {
        return new ethers_1.Contract(address, _abi, signerOrProvider);
    }
}
exports.MockApprovalReceiver__factory = MockApprovalReceiver__factory;
MockApprovalReceiver__factory.bytecode = _bytecode;
MockApprovalReceiver__factory.abi = _abi;
//# sourceMappingURL=MockApprovalReceiver__factory.js.map