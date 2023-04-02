import { Signer, ContractFactory, BigNumberish, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../../common";
import type { MockERC20Permit, MockERC20PermitInterface } from "../../../../../artifacts/contracts/mocks/shared/MockERC20Permit";
type MockERC20PermitConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class MockERC20Permit__factory extends ContractFactory {
    constructor(...args: MockERC20PermitConstructorParams);
    deploy(_tokenName: PromiseOrValue<string>, _symbol: PromiseOrValue<string>, _initialHolder: PromiseOrValue<string>, _initialSupply: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<MockERC20Permit>;
    getDeployTransaction(_tokenName: PromiseOrValue<string>, _symbol: PromiseOrValue<string>, _initialHolder: PromiseOrValue<string>, _initialSupply: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): TransactionRequest;
    attach(address: string): MockERC20Permit;
    connect(signer: Signer): MockERC20Permit__factory;
    static readonly bytecode = "0x6101406040523480156200001257600080fd5b50604051620013cd380380620013cd8339810160408190526200003591620002aa565b6040805180820190915260018152603160f81b60208201528490819081866003620000618382620003cb565b506004620000708282620003cb565b5050825160209384012082519284019290922060e08390526101008190524660a0818152604080517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f818901819052818301979097526060810194909452608080850193909352308483018190528151808603909301835260c094850190915281519190960120905292909252610120525062000110905082826200011a565b50505050620004bf565b6001600160a01b038216620001755760405162461bcd60e51b815260206004820152601f60248201527f45524332303a206d696e7420746f20746865207a65726f206164647265737300604482015260640160405180910390fd5b806002600082825462000189919062000497565b90915550506001600160a01b038216600081815260208181526040808320805486019055518481527fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef910160405180910390a35050565b505050565b634e487b7160e01b600052604160045260246000fd5b600082601f8301126200020d57600080fd5b81516001600160401b03808211156200022a576200022a620001e5565b604051601f8301601f19908116603f01168101908282118183101715620002555762000255620001e5565b816040528381526020925086838588010111156200027257600080fd5b600091505b8382101562000296578582018301518183018401529082019062000277565b600093810190920192909252949350505050565b60008060008060808587031215620002c157600080fd5b84516001600160401b0380821115620002d957600080fd5b620002e788838901620001fb565b95506020870151915080821115620002fe57600080fd5b506200030d87828801620001fb565b604087015190945090506001600160a01b03811681146200032d57600080fd5b6060959095015193969295505050565b600181811c908216806200035257607f821691505b6020821081036200037357634e487b7160e01b600052602260045260246000fd5b50919050565b601f821115620001e057600081815260208120601f850160051c81016020861015620003a25750805b601f850160051c820191505b81811015620003c357828155600101620003ae565b505050505050565b81516001600160401b03811115620003e757620003e7620001e5565b620003ff81620003f884546200033d565b8462000379565b602080601f8311600181146200043757600084156200041e5750858301515b600019600386901b1c1916600185901b178555620003c3565b600085815260208120601f198616915b82811015620004685788860151825594840194600190910190840162000447565b5085821015620004875787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b80820180821115620004b957634e487b7160e01b600052601160045260246000fd5b92915050565b60805160a05160c05160e0516101005161012051610ebe6200050f60003960006109390152600061098801526000610963015260006108bc015260006108e6015260006109100152610ebe6000f3fe608060405234801561001057600080fd5b50600436106100f55760003560e01c80633950935111610097578063a457c2d711610066578063a457c2d7146101d4578063a9059cbb146101e7578063d505accf146101fa578063dd62ed3e1461020f57600080fd5b8063395093511461017d57806370a08231146101905780637ecebe00146101b957806395d89b41146101cc57600080fd5b806323b872dd116100d357806323b872dd1461014d578063313ce567146101605780633408e4701461016f5780633644e5151461017557600080fd5b806306fdde03146100fa578063095ea7b31461011857806318160ddd1461013b575b600080fd5b610102610222565b60405161010f9190610c85565b60405180910390f35b61012b610126366004610cef565b6102b4565b604051901515815260200161010f565b6002545b60405190815260200161010f565b61012b61015b366004610d19565b6102ce565b6040516012815260200161010f565b4661013f565b61013f6102f2565b61012b61018b366004610cef565b610301565b61013f61019e366004610d55565b6001600160a01b031660009081526020819052604090205490565b61013f6101c7366004610d55565b610323565b610102610341565b61012b6101e2366004610cef565b610350565b61012b6101f5366004610cef565b6103d0565b61020d610208366004610d77565b6103de565b005b61013f61021d366004610dea565b610542565b60606003805461023190610e1d565b80601f016020809104026020016040519081016040528092919081815260200182805461025d90610e1d565b80156102aa5780601f1061027f576101008083540402835291602001916102aa565b820191906000526020600020905b81548152906001019060200180831161028d57829003601f168201915b5050505050905090565b6000336102c281858561056d565b60019150505b92915050565b6000336102dc858285610691565b6102e785858561070b565b506001949350505050565b60006102fc6108af565b905090565b6000336102c28185856103148383610542565b61031e9190610e51565b61056d565b6001600160a01b0381166000908152600560205260408120546102c8565b60606004805461023190610e1d565b6000338161035e8286610542565b9050838110156103c35760405162461bcd60e51b815260206004820152602560248201527f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f77604482015264207a65726f60d81b60648201526084015b60405180910390fd5b6102e7828686840361056d565b6000336102c281858561070b565b8342111561042e5760405162461bcd60e51b815260206004820152601d60248201527f45524332305065726d69743a206578706972656420646561646c696e6500000060448201526064016103ba565b60007f6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c988888861045d8c6109d6565b6040805160208101969096526001600160a01b0394851690860152929091166060840152608083015260a082015260c0810186905260e00160405160208183030381529060405280519060200120905060006104b8826109fe565b905060006104c882878787610a4c565b9050896001600160a01b0316816001600160a01b03161461052b5760405162461bcd60e51b815260206004820152601e60248201527f45524332305065726d69743a20696e76616c6964207369676e6174757265000060448201526064016103ba565b6105368a8a8a61056d565b50505050505050505050565b6001600160a01b03918216600090815260016020908152604080832093909416825291909152205490565b6001600160a01b0383166105cf5760405162461bcd60e51b8152602060048201526024808201527f45524332303a20617070726f76652066726f6d20746865207a65726f206164646044820152637265737360e01b60648201526084016103ba565b6001600160a01b0382166106305760405162461bcd60e51b815260206004820152602260248201527f45524332303a20617070726f766520746f20746865207a65726f206164647265604482015261737360f01b60648201526084016103ba565b6001600160a01b0383811660008181526001602090815260408083209487168084529482529182902085905590518481527f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925910160405180910390a3505050565b600061069d8484610542565b9050600019811461070557818110156106f85760405162461bcd60e51b815260206004820152601d60248201527f45524332303a20696e73756666696369656e7420616c6c6f77616e636500000060448201526064016103ba565b610705848484840361056d565b50505050565b6001600160a01b03831661076f5760405162461bcd60e51b815260206004820152602560248201527f45524332303a207472616e736665722066726f6d20746865207a65726f206164604482015264647265737360d81b60648201526084016103ba565b6001600160a01b0382166107d15760405162461bcd60e51b815260206004820152602360248201527f45524332303a207472616e7366657220746f20746865207a65726f206164647260448201526265737360e81b60648201526084016103ba565b6001600160a01b038316600090815260208190526040902054818110156108495760405162461bcd60e51b815260206004820152602660248201527f45524332303a207472616e7366657220616d6f756e7420657863656564732062604482015265616c616e636560d01b60648201526084016103ba565b6001600160a01b03848116600081815260208181526040808320878703905593871680835291849020805487019055925185815290927fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef910160405180910390a3610705565b6000306001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614801561090857507f000000000000000000000000000000000000000000000000000000000000000046145b1561093257507f000000000000000000000000000000000000000000000000000000000000000090565b50604080517f00000000000000000000000000000000000000000000000000000000000000006020808301919091527f0000000000000000000000000000000000000000000000000000000000000000828401527f000000000000000000000000000000000000000000000000000000000000000060608301524660808301523060a0808401919091528351808403909101815260c0909201909252805191012090565b6001600160a01b03811660009081526005602052604090208054600181018255905b50919050565b60006102c8610a0b6108af565b8360405161190160f01b6020820152602281018390526042810182905260009060620160405160208183030381529060405280519060200120905092915050565b6000806000610a5d87878787610a74565b91509150610a6a81610b38565b5095945050505050565b6000807f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a0831115610aab5750600090506003610b2f565b6040805160008082526020820180845289905260ff881692820192909252606081018690526080810185905260019060a0016020604051602081039080840390855afa158015610aff573d6000803e3d6000fd5b5050604051601f1901519150506001600160a01b038116610b2857600060019250925050610b2f565b9150600090505b94509492505050565b6000816004811115610b4c57610b4c610e72565b03610b545750565b6001816004811115610b6857610b68610e72565b03610bb55760405162461bcd60e51b815260206004820152601860248201527f45434453413a20696e76616c6964207369676e6174757265000000000000000060448201526064016103ba565b6002816004811115610bc957610bc9610e72565b03610c165760405162461bcd60e51b815260206004820152601f60248201527f45434453413a20696e76616c6964207369676e6174757265206c656e6774680060448201526064016103ba565b6003816004811115610c2a57610c2a610e72565b03610c825760405162461bcd60e51b815260206004820152602260248201527f45434453413a20696e76616c6964207369676e6174757265202773272076616c604482015261756560f01b60648201526084016103ba565b50565b600060208083528351808285015260005b81811015610cb257858101830151858201604001528201610c96565b506000604082860101526040601f19601f8301168501019250505092915050565b80356001600160a01b0381168114610cea57600080fd5b919050565b60008060408385031215610d0257600080fd5b610d0b83610cd3565b946020939093013593505050565b600080600060608486031215610d2e57600080fd5b610d3784610cd3565b9250610d4560208501610cd3565b9150604084013590509250925092565b600060208284031215610d6757600080fd5b610d7082610cd3565b9392505050565b600080600080600080600060e0888a031215610d9257600080fd5b610d9b88610cd3565b9650610da960208901610cd3565b95506040880135945060608801359350608088013560ff81168114610dcd57600080fd5b9699959850939692959460a0840135945060c09093013592915050565b60008060408385031215610dfd57600080fd5b610e0683610cd3565b9150610e1460208401610cd3565b90509250929050565b600181811c90821680610e3157607f821691505b6020821081036109f857634e487b7160e01b600052602260045260246000fd5b808201808211156102c857634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052602160045260246000fdfea264697066735822122012ffdb1a6f741e9ef7e93956defce4449db1ba5a3163c90e402386dddc6e43a064736f6c63430008110033";
    static readonly abi: readonly [{
        readonly inputs: readonly [{
            readonly internalType: "string";
            readonly name: "_tokenName";
            readonly type: "string";
        }, {
            readonly internalType: "string";
            readonly name: "_symbol";
            readonly type: "string";
        }, {
            readonly internalType: "address";
            readonly name: "_initialHolder";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "_initialSupply";
            readonly type: "uint256";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "constructor";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "owner";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "spender";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "value";
            readonly type: "uint256";
        }];
        readonly name: "Approval";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "from";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "value";
            readonly type: "uint256";
        }];
        readonly name: "Transfer";
        readonly type: "event";
    }, {
        readonly inputs: readonly [];
        readonly name: "DOMAIN_SEPARATOR";
        readonly outputs: readonly [{
            readonly internalType: "bytes32";
            readonly name: "";
            readonly type: "bytes32";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "owner";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "spender";
            readonly type: "address";
        }];
        readonly name: "allowance";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "spender";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "amount";
            readonly type: "uint256";
        }];
        readonly name: "approve";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "account";
            readonly type: "address";
        }];
        readonly name: "balanceOf";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "decimals";
        readonly outputs: readonly [{
            readonly internalType: "uint8";
            readonly name: "";
            readonly type: "uint8";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "spender";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "subtractedValue";
            readonly type: "uint256";
        }];
        readonly name: "decreaseAllowance";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "getChainId";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "spender";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "addedValue";
            readonly type: "uint256";
        }];
        readonly name: "increaseAllowance";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "name";
        readonly outputs: readonly [{
            readonly internalType: "string";
            readonly name: "";
            readonly type: "string";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "owner";
            readonly type: "address";
        }];
        readonly name: "nonces";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "owner";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "spender";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "value";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "deadline";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint8";
            readonly name: "v";
            readonly type: "uint8";
        }, {
            readonly internalType: "bytes32";
            readonly name: "r";
            readonly type: "bytes32";
        }, {
            readonly internalType: "bytes32";
            readonly name: "s";
            readonly type: "bytes32";
        }];
        readonly name: "permit";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "symbol";
        readonly outputs: readonly [{
            readonly internalType: "string";
            readonly name: "";
            readonly type: "string";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "totalSupply";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "amount";
            readonly type: "uint256";
        }];
        readonly name: "transfer";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "from";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "amount";
            readonly type: "uint256";
        }];
        readonly name: "transferFrom";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }];
    static createInterface(): MockERC20PermitInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): MockERC20Permit;
}
export {};
