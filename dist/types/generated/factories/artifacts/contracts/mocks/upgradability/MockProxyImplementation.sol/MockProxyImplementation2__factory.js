"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockProxyImplementation2__factory = void 0;
/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
const ethers_1 = require("ethers");
const _abi = [
    {
        inputs: [],
        name: "getDep",
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
        name: "getVersion",
        outputs: [
            {
                internalType: "string",
                name: "",
                type: "string",
            },
        ],
        stateMutability: "pure",
        type: "function",
    },
    {
        inputs: [],
        name: "isInitialized",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
];
const _bytecode = "0x608060405234801561001057600080fd5b5061012a806100206000396000f3fe6080604052348015600f57600080fd5b5060043610603c5760003560e01c80630d8e6e2c146041578063392e53cd14606b578063faf26b48146080575b600080fd5b60408051808201825260018152601960f91b602082015290516062919060a8565b60405180910390f35b60005460ff1660405190151581526020016062565b60005461010090046001600160a01b03166040516001600160a01b0390911681526020016062565b600060208083528351808285015260005b8181101560d35785810183015185820160400152820160b9565b506000604082860101526040601f19601f830116850101925050509291505056fea2646970667358221220503667a5cf6d22aa891c4c092704a59f6c06b1a8f508b48d8c8c898c2d1427f964736f6c63430008110033";
const isSuperArgs = (xs) => xs.length > 1;
class MockProxyImplementation2__factory extends ethers_1.ContractFactory {
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
exports.MockProxyImplementation2__factory = MockProxyImplementation2__factory;
MockProxyImplementation2__factory.bytecode = _bytecode;
MockProxyImplementation2__factory.abi = _abi;
//# sourceMappingURL=MockProxyImplementation2__factory.js.map