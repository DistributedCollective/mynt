"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockDependency__factory = void 0;
/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
const ethers_1 = require("ethers");
const _abi = [
    {
        inputs: [],
        name: "desc",
        outputs: [
            {
                internalType: "string",
                name: "",
                type: "string",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
];
const _bytecode = "0x60c0604052601860809081527f6d6f636b20646570656e64656e637920636f6e7472616374000000000000000060a05260009061003c90826100ee565b5034801561004957600080fd5b506101ad565b634e487b7160e01b600052604160045260246000fd5b600181811c9082168061007957607f821691505b60208210810361009957634e487b7160e01b600052602260045260246000fd5b50919050565b601f8211156100e957600081815260208120601f850160051c810160208610156100c65750805b601f850160051c820191505b818110156100e5578281556001016100d2565b5050505b505050565b81516001600160401b038111156101075761010761004f565b61011b816101158454610065565b8461009f565b602080601f83116001811461015057600084156101385750858301515b600019600386901b1c1916600185901b1785556100e5565b600085815260208120601f198616915b8281101561017f57888601518255948401946001909101908401610160565b508582101561019d5787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b61019a806101bc6000396000f3fe608060405234801561001057600080fd5b506004361061002b5760003560e01c806355f150f114610030575b600080fd5b61003861004e565b60405161004591906100dc565b60405180910390f35b6000805461005b9061012a565b80601f01602080910402602001604051908101604052809291908181526020018280546100879061012a565b80156100d45780601f106100a9576101008083540402835291602001916100d4565b820191906000526020600020905b8154815290600101906020018083116100b757829003601f168201915b505050505081565b600060208083528351808285015260005b81811015610109578581018301518582016040015282016100ed565b506000604082860101526040601f19601f8301168501019250505092915050565b600181811c9082168061013e57607f821691505b60208210810361015e57634e487b7160e01b600052602260045260246000fd5b5091905056fea2646970667358221220aa388d50e428741820fab3b615b8bade6a197b39558cc9ebcaf02002ca8d6eee64736f6c63430008110033";
const isSuperArgs = (xs) => xs.length > 1;
class MockDependency__factory extends ethers_1.ContractFactory {
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
exports.MockDependency__factory = MockDependency__factory;
MockDependency__factory.bytecode = _bytecode;
MockDependency__factory.abi = _abi;
//# sourceMappingURL=MockDependency__factory.js.map