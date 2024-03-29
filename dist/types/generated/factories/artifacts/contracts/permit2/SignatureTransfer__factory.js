"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignatureTransfer__factory = void 0;
/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
const ethers_1 = require("ethers");
const _abi = [
    {
        inputs: [
            {
                internalType: "uint256",
                name: "maxAmount",
                type: "uint256",
            },
        ],
        name: "InvalidAmount",
        type: "error",
    },
    {
        inputs: [],
        name: "InvalidContractSignature",
        type: "error",
    },
    {
        inputs: [],
        name: "InvalidNonce",
        type: "error",
    },
    {
        inputs: [],
        name: "InvalidSignature",
        type: "error",
    },
    {
        inputs: [],
        name: "InvalidSignatureLength",
        type: "error",
    },
    {
        inputs: [],
        name: "InvalidSigner",
        type: "error",
    },
    {
        inputs: [],
        name: "LengthMismatch",
        type: "error",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "signatureDeadline",
                type: "uint256",
            },
        ],
        name: "SignatureExpired",
        type: "error",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "owner",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "word",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "mask",
                type: "uint256",
            },
        ],
        name: "UnorderedNonceInvalidation",
        type: "event",
    },
    {
        inputs: [],
        name: "DOMAIN_SEPARATOR",
        outputs: [
            {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "wordPos",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "mask",
                type: "uint256",
            },
        ],
        name: "invalidateUnorderedNonces",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        name: "nonceBitmap",
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
        inputs: [
            {
                components: [
                    {
                        components: [
                            {
                                internalType: "address",
                                name: "token",
                                type: "address",
                            },
                            {
                                internalType: "uint256",
                                name: "amount",
                                type: "uint256",
                            },
                        ],
                        internalType: "struct ISignatureTransfer.TokenPermissions",
                        name: "permitted",
                        type: "tuple",
                    },
                    {
                        internalType: "uint256",
                        name: "nonce",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "deadline",
                        type: "uint256",
                    },
                ],
                internalType: "struct ISignatureTransfer.PermitTransferFrom",
                name: "permit",
                type: "tuple",
            },
            {
                components: [
                    {
                        internalType: "address",
                        name: "to",
                        type: "address",
                    },
                    {
                        internalType: "uint256",
                        name: "requestedAmount",
                        type: "uint256",
                    },
                ],
                internalType: "struct ISignatureTransfer.SignatureTransferDetails",
                name: "transferDetails",
                type: "tuple",
            },
            {
                internalType: "address",
                name: "owner",
                type: "address",
            },
            {
                internalType: "bytes",
                name: "signature",
                type: "bytes",
            },
        ],
        name: "permitTransferFrom",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    {
                        components: [
                            {
                                internalType: "address",
                                name: "token",
                                type: "address",
                            },
                            {
                                internalType: "uint256",
                                name: "amount",
                                type: "uint256",
                            },
                        ],
                        internalType: "struct ISignatureTransfer.TokenPermissions[]",
                        name: "permitted",
                        type: "tuple[]",
                    },
                    {
                        internalType: "uint256",
                        name: "nonce",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "deadline",
                        type: "uint256",
                    },
                ],
                internalType: "struct ISignatureTransfer.PermitBatchTransferFrom",
                name: "permit",
                type: "tuple",
            },
            {
                components: [
                    {
                        internalType: "address",
                        name: "to",
                        type: "address",
                    },
                    {
                        internalType: "uint256",
                        name: "requestedAmount",
                        type: "uint256",
                    },
                ],
                internalType: "struct ISignatureTransfer.SignatureTransferDetails[]",
                name: "transferDetails",
                type: "tuple[]",
            },
            {
                internalType: "address",
                name: "owner",
                type: "address",
            },
            {
                internalType: "bytes",
                name: "signature",
                type: "bytes",
            },
        ],
        name: "permitTransferFrom",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
];
const _bytecode = "0x60c060405234801561001057600080fd5b504660a0818152604080517f8cad95687ba82c2ce50e74f7b754645e5117c3a5bec8151c0726d5857980a8666020808301919091527f9ac997416e8ff9d2ff6bebeb7149f65cdae5e32e2b90440b566bb3044041d36a828401526060820194909452306080808301919091528251808303909101815292019052805191012060805260805160a051610ec56100b6600039600060fa015260006101710152610ec56000f3fe608060405234801561001057600080fd5b50600436106100575760003560e01c806330f28b7a1461005c5780633644e515146100715780633ff9dcb11461008b5780634fe02b441461009e578063edd9444b146100c6575b600080fd5b61006f61006a366004610add565b6100d9565b005b6100796100f6565b60405190815260200160405180910390f35b61006f610099366004610b8c565b610193565b6100796100ac366004610bae565b600060208181529281526040808220909352908152205481565b61006f6100d4366004610c1d565b6101ec565b6100ef8585856100e88961020b565b868661028e565b5050505050565b60007f0000000000000000000000000000000000000000000000000000000000000000461461016e576101697f8cad95687ba82c2ce50e74f7b754645e5117c3a5bec8151c0726d5857980a8667f9ac997416e8ff9d2ff6bebeb7149f65cdae5e32e2b90440b566bb3044041d36a61034c565b905090565b507f000000000000000000000000000000000000000000000000000000000000000090565b3360008181526020818152604080832086845282529182902080548517905581518581529081018490527f3704902f963766a4e561bbaab6e6cdc1b1dd12f6e9e99648da8843b3f46b918d910160405180910390a25050565b610203868686866101fc8b61038e565b87876104d1565b505050505050565b60008061021b8360000151610612565b60208085015160408087015181517f939c21a48a8dbe3a9a2404a1d46691e4d39f6583d6ec6b35714604c986d8010694810194909452908301849052336060840152608083019190915260a082015290915060c00160405160208183030381529060405280519060200120915050919050565b60408601516020860135904211156102ca57866040015160405163cd21db4f60e01b81526004016102c191815260200190565b60405180910390fd5b8651602001518111156102fa57865160200151604051633728b83d60e01b815260048101919091526024016102c1565b610308858860200151610683565b61031e610314856106e1565b8490849088610710565b6103438561032f6020890189610d79565b8951516001600160a01b031691908461092e565b50505050505050565b604080516020810184905290810182905246606082015230608082015260009060a0016040516020818303038152906040528051906020012090505b92915050565b805151600090818167ffffffffffffffff8111156103ae576103ae6109b1565b6040519080825280602002602001820160405280156103d7578160200160208202803683370190505b50905060005b828110156104385761040b856000015182815181106103fe576103fe610d9b565b6020026020010151610612565b82828151811061041d5761041d610d9b565b602090810291909101015261043181610dc7565b90506103dd565b507ffcf35f5ac6a2c28868dc44c302166470266239195f02b0ee408334829333b7668160405160200161046b9190610de0565b60408051601f19818403018152828252805160209182012088820151898401519285019590955291830191909152336060830152608082019290925260a081019190915260c0016040516020818303038152906040528051906020012092505050919050565b865151604088015142111561050157876040015160405163cd21db4f60e01b81526004016102c191815260200190565b808614610524576040516001621398b960e31b0319815260040160405180910390fd5b610532858960200151610683565b61053e610314856106e1565b60005b818110156106075760008960000151828151811061056157610561610d9b565b60200260200101519050600089898481811061057f5761057f610d9b565b90506040020160200135905081602001518111156105b8578160200151604051633728b83d60e01b81526004016102c191815260200190565b80156105fd576105fd888b8b868181106105d4576105d4610d9b565b6105ea9260206040909202019081019150610d79565b84516001600160a01b031691908461092e565b5050600101610541565b505050505050505050565b60007f618358ac3db8dc274f0cd8829da7e234bd48cd73c4a740aede1adec9846d06a18260405160200161066692919091825280516001600160a01b03166020808401919091520151604082015260600190565b604051602081830303815290604052805190602001209050919050565b6001600160a01b038216600090815260208181526040808320600885901c808552925282208054600160ff861690811b918218928390559293909190818316900361020357604051633ab3447f60e11b815260040160405180910390fd5b60006106eb6100f6565b60405161190160f01b6020820152602281019190915260428101839052606201610666565b6000806000836001600160a01b03163b60000361087d5760418690036107655761073c86880188610b8c565b90935091508686604081811061075457610754610d9b565b919091013560f81c91506107bd9050565b60408690036107a457600061077c87890189610b8c565b9094506001600160ff1b0381169350905061079c60ff82901c601b610e16565b9150506107bd565b604051634be6321b60e01b815260040160405180910390fd5b6040805160008082526020820180845288905260ff841692820192909252606081018590526080810184905260019060a0016020604051602081039080840390855afa158015610811573d6000803e3d6000fd5b5050604051601f1901519150506001600160a01b03811661084557604051638baa579f60e01b815260040160405180910390fd5b846001600160a01b0316816001600160a01b03161461087757604051632057875960e21b815260040160405180910390fd5b50610343565b604051630b135d3f60e11b81526000906001600160a01b03861690631626ba7e906108b09089908c908c90600401610e2f565b602060405180830381865afa1580156108cd573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906108f19190610e65565b90506001600160e01b03198116630b135d3f60e11b1461092457604051632c19a72f60e21b815260040160405180910390fd5b5050505050505050565b60006040516323b872dd60e01b81528460048201528360248201528260448201526020600060648360008a5af13d15601f3d11600160005114161716915050806100ef5760405162461bcd60e51b81526020600482015260146024820152731514905394d1915497d19493d357d1905253115160621b60448201526064016102c1565b634e487b7160e01b600052604160045260246000fd5b6040516060810167ffffffffffffffff811182821017156109ea576109ea6109b1565b60405290565b604051601f8201601f1916810167ffffffffffffffff81118282101715610a1957610a196109b1565b604052919050565b80356001600160a01b0381168114610a3857600080fd5b919050565b600060408284031215610a4f57600080fd5b6040516040810181811067ffffffffffffffff82111715610a7257610a726109b1565b604052905080610a8183610a21565b8152602083013560208201525092915050565b60008083601f840112610aa657600080fd5b50813567ffffffffffffffff811115610abe57600080fd5b602083019150836020828501011115610ad657600080fd5b9250929050565b6000806000806000858703610100811215610af757600080fd5b6080811215610b0557600080fd5b610b0d6109c7565b610b178989610a3d565b81526040888101356020830152606089013581830152909650607f1982011215610b4057600080fd5b50608086019350610b5360c08701610a21565b925060e086013567ffffffffffffffff811115610b6f57600080fd5b610b7b88828901610a94565b969995985093965092949392505050565b60008060408385031215610b9f57600080fd5b50508035926020909101359150565b60008060408385031215610bc157600080fd5b610bca83610a21565b946020939093013593505050565b60008083601f840112610bea57600080fd5b50813567ffffffffffffffff811115610c0257600080fd5b6020830191508360208260061b8501011115610ad657600080fd5b60008060008060008060808789031215610c3657600080fd5b67ffffffffffffffff8088351115610c4d57600080fd5b873588016060818b031215610c6157600080fd5b610c696109c7565b8282351115610c7757600080fd5b813582018b601f820112610c8a57600080fd5b803584811115610c9c57610c9c6109b1565b610cab60208260051b016109f0565b8082825260208201915060208360061b85010192508e831115610ccd57600080fd5b6020840193505b82841015610cf957610ce68f85610a3d565b8252602082019150604084019350610cd4565b84525050506020828101358183015260409283013592820192909252975088013581811115610d2757600080fd5b610d338a828b01610bd8565b9097509550610d46905060408901610a21565b9350606088013581811115610d5a57600080fd5b610d668a828b01610a94565b989b979a50959850939694959350505050565b600060208284031215610d8b57600080fd5b610d9482610a21565b9392505050565b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052601160045260246000fd5b600060018201610dd957610dd9610db1565b5060010190565b815160009082906020808601845b83811015610e0a57815185529382019390820190600101610dee565b50929695505050505050565b60ff818116838216019081111561038857610388610db1565b83815260406020820152816040820152818360608301376000818301606090810191909152601f909201601f1916010192915050565b600060208284031215610e7757600080fd5b81516001600160e01b031981168114610d9457600080fdfea26469706673582212208757281c6370ec54ce43c7c69a368b87be0210c3bb084cdb95523cfd29a8ffdf64736f6c63430008110033";
const isSuperArgs = (xs) => xs.length > 1;
class SignatureTransfer__factory extends ethers_1.ContractFactory {
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
exports.SignatureTransfer__factory = SignatureTransfer__factory;
SignatureTransfer__factory.bytecode = _bytecode;
SignatureTransfer__factory.abi = _abi;
//# sourceMappingURL=SignatureTransfer__factory.js.map