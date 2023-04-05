import { Signer, ContractFactory, BigNumberish, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../common";
import type { Token, TokenInterface } from "../../../../artifacts/contracts/masset/Token";
type TokenConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class Token__factory extends ContractFactory {
    constructor(...args: TokenConstructorParams);
    deploy(_name: PromiseOrValue<string>, _symbol: PromiseOrValue<string>, _decimalsValue: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<Token>;
    getDeployTransaction(_name: PromiseOrValue<string>, _symbol: PromiseOrValue<string>, _decimalsValue: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): TransactionRequest;
    attach(address: string): Token;
    connect(signer: Signer): Token__factory;
    static readonly bytecode = "0x60806040523480156200001157600080fd5b5060405162001004380380620010048339810160408190526200003491620001b2565b82826003620000448382620002c6565b506004620000538282620002c6565b505050620000706200006a6200009760201b60201c565b6200009b565b6005805460ff909216600160a01b0260ff60a01b1990921691909117905550620003929050565b3390565b600580546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b634e487b7160e01b600052604160045260246000fd5b600082601f8301126200011557600080fd5b81516001600160401b0380821115620001325762000132620000ed565b604051601f8301601f19908116603f011681019082821181831017156200015d576200015d620000ed565b816040528381526020925086838588010111156200017a57600080fd5b600091505b838210156200019e57858201830151818301840152908201906200017f565b600093810190920192909252949350505050565b600080600060608486031215620001c857600080fd5b83516001600160401b0380821115620001e057600080fd5b620001ee8783880162000103565b945060208601519150808211156200020557600080fd5b50620002148682870162000103565b925050604084015160ff811681146200022c57600080fd5b809150509250925092565b600181811c908216806200024c57607f821691505b6020821081036200026d57634e487b7160e01b600052602260045260246000fd5b50919050565b601f821115620002c157600081815260208120601f850160051c810160208610156200029c5750805b601f850160051c820191505b81811015620002bd57828155600101620002a8565b5050505b505050565b81516001600160401b03811115620002e257620002e2620000ed565b620002fa81620002f3845462000237565b8462000273565b602080601f831160018114620003325760008415620003195750858301515b600019600386901b1c1916600185901b178555620002bd565b600085815260208120601f198616915b82811015620003635788860151825594840194600190910190840162000342565b5085821015620003825787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b610c6280620003a26000396000f3fe608060405234801561001057600080fd5b50600436106101005760003560e01c8063715018a611610097578063a457c2d711610066578063a457c2d714610219578063a9059cbb1461022c578063dd62ed3e1461023f578063f2fde38b1461025257600080fd5b8063715018a6146101db5780638da5cb5b146101e357806395d89b41146101fe5780639dc29fac1461020657600080fd5b8063313ce567116100d3578063313ce5671461016b578063395093511461018a57806340c10f191461019d57806370a08231146101b257600080fd5b806306fdde0314610105578063095ea7b31461012357806318160ddd1461014657806323b872dd14610158575b600080fd5b61010d610265565b60405161011a9190610aac565b60405180910390f35b610136610131366004610b16565b6102f7565b604051901515815260200161011a565b6002545b60405190815260200161011a565b610136610166366004610b40565b610311565b600554600160a01b900460ff1660405160ff909116815260200161011a565b610136610198366004610b16565b610335565b6101b06101ab366004610b16565b610357565b005b61014a6101c0366004610b7c565b6001600160a01b031660009081526020819052604090205490565b6101b061036d565b6005546040516001600160a01b03909116815260200161011a565b61010d610381565b6101b0610214366004610b16565b610390565b610136610227366004610b16565b6103a2565b61013661023a366004610b16565b610422565b61014a61024d366004610b9e565b610430565b6101b0610260366004610b7c565b61045b565b60606003805461027490610bd1565b80601f01602080910402602001604051908101604052809291908181526020018280546102a090610bd1565b80156102ed5780601f106102c2576101008083540402835291602001916102ed565b820191906000526020600020905b8154815290600101906020018083116102d057829003601f168201915b5050505050905090565b6000336103058185856104d4565b60019150505b92915050565b60003361031f8582856105f9565b61032a858585610673565b506001949350505050565b6000336103058185856103488383610430565b6103529190610c0b565b6104d4565b61035f610817565b6103698282610871565b5050565b610375610817565b61037f6000610930565b565b60606004805461027490610bd1565b610398610817565b6103698282610982565b600033816103b08286610430565b9050838110156104155760405162461bcd60e51b815260206004820152602560248201527f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f77604482015264207a65726f60d81b60648201526084015b60405180910390fd5b61032a82868684036104d4565b600033610305818585610673565b6001600160a01b03918216600090815260016020908152604080832093909416825291909152205490565b610463610817565b6001600160a01b0381166104c85760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b606482015260840161040c565b6104d181610930565b50565b6001600160a01b0383166105365760405162461bcd60e51b8152602060048201526024808201527f45524332303a20617070726f76652066726f6d20746865207a65726f206164646044820152637265737360e01b606482015260840161040c565b6001600160a01b0382166105975760405162461bcd60e51b815260206004820152602260248201527f45524332303a20617070726f766520746f20746865207a65726f206164647265604482015261737360f01b606482015260840161040c565b6001600160a01b0383811660008181526001602090815260408083209487168084529482529182902085905590518481527f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92591015b60405180910390a3505050565b60006106058484610430565b9050600019811461066d57818110156106605760405162461bcd60e51b815260206004820152601d60248201527f45524332303a20696e73756666696369656e7420616c6c6f77616e6365000000604482015260640161040c565b61066d84848484036104d4565b50505050565b6001600160a01b0383166106d75760405162461bcd60e51b815260206004820152602560248201527f45524332303a207472616e736665722066726f6d20746865207a65726f206164604482015264647265737360d81b606482015260840161040c565b6001600160a01b0382166107395760405162461bcd60e51b815260206004820152602360248201527f45524332303a207472616e7366657220746f20746865207a65726f206164647260448201526265737360e81b606482015260840161040c565b6001600160a01b038316600090815260208190526040902054818110156107b15760405162461bcd60e51b815260206004820152602660248201527f45524332303a207472616e7366657220616d6f756e7420657863656564732062604482015265616c616e636560d01b606482015260840161040c565b6001600160a01b03848116600081815260208181526040808320878703905593871680835291849020805487019055925185815290927fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef910160405180910390a361066d565b6005546001600160a01b0316331461037f5760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604482015260640161040c565b6001600160a01b0382166108c75760405162461bcd60e51b815260206004820152601f60248201527f45524332303a206d696e7420746f20746865207a65726f206164647265737300604482015260640161040c565b80600260008282546108d99190610c0b565b90915550506001600160a01b038216600081815260208181526040808320805486019055518481527fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef910160405180910390a35050565b600580546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b6001600160a01b0382166109e25760405162461bcd60e51b815260206004820152602160248201527f45524332303a206275726e2066726f6d20746865207a65726f206164647265736044820152607360f81b606482015260840161040c565b6001600160a01b03821660009081526020819052604090205481811015610a565760405162461bcd60e51b815260206004820152602260248201527f45524332303a206275726e20616d6f756e7420657863656564732062616c616e604482015261636560f01b606482015260840161040c565b6001600160a01b0383166000818152602081815260408083208686039055600280548790039055518581529192917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef91016105ec565b600060208083528351808285015260005b81811015610ad957858101830151858201604001528201610abd565b506000604082860101526040601f19601f8301168501019250505092915050565b80356001600160a01b0381168114610b1157600080fd5b919050565b60008060408385031215610b2957600080fd5b610b3283610afa565b946020939093013593505050565b600080600060608486031215610b5557600080fd5b610b5e84610afa565b9250610b6c60208501610afa565b9150604084013590509250925092565b600060208284031215610b8e57600080fd5b610b9782610afa565b9392505050565b60008060408385031215610bb157600080fd5b610bba83610afa565b9150610bc860208401610afa565b90509250929050565b600181811c90821680610be557607f821691505b602082108103610c0557634e487b7160e01b600052602260045260246000fd5b50919050565b8082018082111561030b57634e487b7160e01b600052601160045260246000fdfea26469706673582212204917b38401778d9d43b2f54355f3bce840ea2f480320d00f710f23f0aa71516564736f6c63430008110033";
    static readonly abi: readonly [{
        readonly inputs: readonly [{
            readonly internalType: "string";
            readonly name: "_name";
            readonly type: "string";
        }, {
            readonly internalType: "string";
            readonly name: "_symbol";
            readonly type: "string";
        }, {
            readonly internalType: "uint8";
            readonly name: "_decimalsValue";
            readonly type: "uint8";
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
            readonly name: "previousOwner";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "newOwner";
            readonly type: "address";
        }];
        readonly name: "OwnershipTransferred";
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
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "_account";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "_amount";
            readonly type: "uint256";
        }];
        readonly name: "burn";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
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
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "_account";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "_amount";
            readonly type: "uint256";
        }];
        readonly name: "mint";
        readonly outputs: readonly [];
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
        readonly inputs: readonly [];
        readonly name: "owner";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "renounceOwnership";
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
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "newOwner";
            readonly type: "address";
        }];
        readonly name: "transferOwnership";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }];
    static createInterface(): TokenInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): Token;
}
export {};
