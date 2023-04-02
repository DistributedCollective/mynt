import { Signer, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../common";
import type { DLLR, DLLRInterface } from "../../../../artifacts/contracts/meta-asset-token/DLLR";
type DLLRConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class DLLR__factory extends ContractFactory {
    constructor(...args: DLLRConstructorParams);
    deploy(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<DLLR>;
    getDeployTransaction(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): TransactionRequest;
    attach(address: string): DLLR;
    connect(signer: Signer): DLLR__factory;
    static readonly bytecode = "0x6101406040523480156200001257600080fd5b506040518060400160405280600d81526020016c29b7bb393cb7102237b63630b960991b815250604051806040016040528060048152602001632226262960e11b8152508180604051806040016040528060018152602001603160f81b8152508484816003908162000085919062000232565b50600462000094828262000232565b5050825160209384012082519284019290922060e08390526101008190524660a0818152604080517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f818901819052818301979097526060810194909452608080850193909352308483018190528151808603909301835260c0948501909152815191909601209052929092526101205250620001339050336200013b565b5050620002fe565b600780546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b634e487b7160e01b600052604160045260246000fd5b600181811c90821680620001b857607f821691505b602082108103620001d957634e487b7160e01b600052602260045260246000fd5b50919050565b601f8211156200022d57600081815260208120601f850160051c81016020861015620002085750805b601f850160051c820191505b81811015620002295782815560010162000214565b5050505b505050565b81516001600160401b038111156200024e576200024e6200018d565b62000266816200025f8454620001a3565b84620001df565b602080601f8311600181146200029e5760008415620002855750858301515b600019600386901b1c1916600185901b17855562000229565b600085815260208120601f198616915b82811015620002cf57888601518255948401946001909101908401620002ae565b5085821015620002ee5787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b60805160a05160c05160e051610100516101205161196f6200034e6000396000610f9401526000610fe301526000610fbe01526000610f1701526000610f4101526000610f6b015261196f6000f3fe608060405234801561001057600080fd5b50600436106101c45760003560e01c80637ecebe00116100f9578063cae9ca5111610097578063e5d61a5611610071578063e5d61a5614610391578063f2fde38b146103a4578063f8b204ec146103b7578063fa38b22e146103ca57600080fd5b8063cae9ca5114610358578063d505accf1461036b578063dd62ed3e1461037e57600080fd5b80639dc29fac116100d35780639dc29fac14610317578063a457c2d71461032a578063a9059cbb1461033d578063c0d15b9c1461035057600080fd5b80637ecebe00146102eb5780638da5cb5b146102fe57806395d89b411461030f57600080fd5b80633644e515116101665780635259889611610140578063525988961461029f578063605629d6146102a757806370a08231146102ba578063715018a6146102e357600080fd5b80633644e5151461026f578063395093511461027757806340c10f191461028a57600080fd5b806323b872dd116101a257806323b872dd1461021c57806329f3c4a11461022f578063313ce5671461025a5780633408e4701461026957600080fd5b806306fdde03146101c9578063095ea7b3146101e757806318160ddd1461020a575b600080fd5b6101d16103dd565b6040516101de9190611572565b60405180910390f35b6101fa6101f53660046115d5565b61046f565b60405190151581526020016101de565b6002545b6040519081526020016101de565b6101fa61022a366004611601565b610489565b600954610242906001600160a01b031681565b6040516001600160a01b0390911681526020016101de565b604051601281526020016101de565b4661020e565b61020e610507565b6101fa6102853660046115d5565b610516565b61029d6102983660046115d5565b610533565b005b61024261056b565b61029d6102b5366004611642565b6105d9565b61020e6102c83660046116b9565b6001600160a01b031660009081526020819052604090205490565b61029d6106ee565b61020e6102f93660046116b9565b610702565b6007546001600160a01b0316610242565b6101d1610720565b61029d6103253660046115d5565b61072f565b6101fa6103383660046115d5565b610763565b6101fa61034b3660046115d5565b6107de565b610242610829565b61029d6103663660046116dd565b610873565b61029d610379366004611642565b6108ea565b61020e61038c366004611766565b610a4e565b61029d61039f3660046116b9565b610a79565b61029d6103b23660046116b9565b610b2d565b600854610242906001600160a01b031681565b61029d6103d83660046116b9565b610ba6565b6060600380546103ec9061179f565b80601f01602080910402602001604051908101604052809291908181526020018280546104189061179f565b80156104655780601f1061043a57610100808354040283529160200191610465565b820191906000526020600020905b81548152906001019060200180831161044857829003601f168201915b5050505050905090565b60003361047d818585610c40565b60019150505b92915050565b6000826001600160a01b038116158015906104ad57506001600160a01b0381163014155b6104d25760405162461bcd60e51b81526004016104c9906117d3565b60405180910390fd5b6104f18533856104e28933610a4e565b6104ec9190611847565b610c40565b6104fc858585610d65565b506001949350505050565b6000610511610f0a565b905090565b60003361047d8185856105298383610a4e565b6104ec919061185a565b6008546001600160a01b0316331461055d5760405162461bcd60e51b81526004016104c99061186d565b6105678282611031565b5050565b6008546040805163048725b960e51b815290516000926001600160a01b0316916390e4b7209160048083019260209291908290030181865afa1580156105b5573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061051191906118b2565b856001600160a01b038116158015906105fb57506001600160a01b0381163014155b6106175760405162461bcd60e51b81526004016104c9906117d3565b610626883388888888886108ea565b610631888888610489565b6106995760405162461bcd60e51b815260206004820152603360248201527f4d6574614173736574546f6b656e3a3a7472616e73666572576974685065726d6044820152721a5d0e881d1c985b9cd9995c8819985a5b1959606a1b60648201526084016104c9565b604080516001600160a01b03808b168252891660208201529081018790527f248045bd8dd43ca5645e66af7003ebfb1579f27be326e439f761ba6e5561431b9060600160405180910390a15050505050505050565b6106f66110f0565b610700600061114a565b565b6001600160a01b038116600090815260056020526040812054610483565b6060600480546103ec9061179f565b6008546001600160a01b031633146107595760405162461bcd60e51b81526004016104c99061186d565b610567828261119c565b600033816107718286610a4e565b9050838110156107d15760405162461bcd60e51b815260206004820152602560248201527f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f77604482015264207a65726f60d81b60648201526084016104c9565b6104fc8286868403610c40565b6000826001600160a01b0381161580159061080257506001600160a01b0381163014155b61081e5760405162461bcd60e51b81526004016104c9906117d3565b61047d338585610d65565b6009546040805163048725b960e51b815290516000926001600160a01b0316916390e4b7209160048083019260209291908290030181865afa1580156105b5573d6000803e3d6000fd5b61087d848461046f565b50604051638f4ffcb160e01b81526001600160a01b03851690638f4ffcb1906108b290339087903090889088906004016118cf565b600060405180830381600087803b1580156108cc57600080fd5b505af11580156108e0573d6000803e3d6000fd5b5050505050505050565b8342111561093a5760405162461bcd60e51b815260206004820152601d60248201527f45524332305065726d69743a206578706972656420646561646c696e6500000060448201526064016104c9565b60007f6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c98888886109698c6112c6565b6040805160208101969096526001600160a01b0394851690860152929091166060840152608083015260a082015260c0810186905260e00160405160208183030381529060405280519060200120905060006109c4826112ee565b905060006109d48287878761133c565b9050896001600160a01b0316816001600160a01b031614610a375760405162461bcd60e51b815260206004820152601e60248201527f45524332305065726d69743a20696e76616c6964207369676e6174757265000060448201526064016104c9565b610a428a8a8a610c40565b50505050505050505050565b6001600160a01b03918216600090815260016020908152604080832093909416825291909152205490565b610a816110f0565b6001600160a01b038116610ae35760405162461bcd60e51b815260206004820152602360248201527f696e76616c6964204d61737365744d616e616765722070726f7879206164647260448201526265737360e81b60648201526084016104c9565b600880546001600160a01b0319166001600160a01b0383169081179091556040517f0cc6b830b24ab95e101cf469a14b35ae55ee47b9b50650226ab1510d1441b3a190600090a250565b610b356110f0565b6001600160a01b038116610b9a5760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b60648201526084016104c9565b610ba38161114a565b50565b610bae6110f0565b6001600160a01b038116610bf65760405162461bcd60e51b815260206004820152600f60248201526e696e76616c6964206164647265737360881b60448201526064016104c9565b600980546001600160a01b0319166001600160a01b0383169081179091556040517f5554b3bffdd2afa299cf961d2a6038c24170eea54aa1e62ff09eb7f471a0e7bc90600090a250565b6001600160a01b038316610ca25760405162461bcd60e51b8152602060048201526024808201527f45524332303a20617070726f76652066726f6d20746865207a65726f206164646044820152637265737360e01b60648201526084016104c9565b6001600160a01b038216610d035760405162461bcd60e51b815260206004820152602260248201527f45524332303a20617070726f766520746f20746865207a65726f206164647265604482015261737360f01b60648201526084016104c9565b6001600160a01b0383811660008181526001602090815260408083209487168084529482529182902085905590518481527f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92591015b60405180910390a3505050565b6001600160a01b038316610dc95760405162461bcd60e51b815260206004820152602560248201527f45524332303a207472616e736665722066726f6d20746865207a65726f206164604482015264647265737360d81b60648201526084016104c9565b6001600160a01b038216610e2b5760405162461bcd60e51b815260206004820152602360248201527f45524332303a207472616e7366657220746f20746865207a65726f206164647260448201526265737360e81b60648201526084016104c9565b6001600160a01b03831660009081526020819052604090205481811015610ea35760405162461bcd60e51b815260206004820152602660248201527f45524332303a207472616e7366657220616d6f756e7420657863656564732062604482015265616c616e636560d01b60648201526084016104c9565b6001600160a01b03848116600081815260208181526040808320878703905593871680835291849020805487019055925185815290927fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef910160405180910390a350505050565b6000306001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016148015610f6357507f000000000000000000000000000000000000000000000000000000000000000046145b15610f8d57507f000000000000000000000000000000000000000000000000000000000000000090565b50604080517f00000000000000000000000000000000000000000000000000000000000000006020808301919091527f0000000000000000000000000000000000000000000000000000000000000000828401527f000000000000000000000000000000000000000000000000000000000000000060608301524660808301523060a0808401919091528351808403909101815260c0909201909252805191012090565b6001600160a01b0382166110875760405162461bcd60e51b815260206004820152601f60248201527f45524332303a206d696e7420746f20746865207a65726f20616464726573730060448201526064016104c9565b8060026000828254611099919061185a565b90915550506001600160a01b038216600081815260208181526040808320805486019055518481527fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef910160405180910390a35050565b6007546001600160a01b031633146107005760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657260448201526064016104c9565b600780546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b6001600160a01b0382166111fc5760405162461bcd60e51b815260206004820152602160248201527f45524332303a206275726e2066726f6d20746865207a65726f206164647265736044820152607360f81b60648201526084016104c9565b6001600160a01b038216600090815260208190526040902054818110156112705760405162461bcd60e51b815260206004820152602260248201527f45524332303a206275726e20616d6f756e7420657863656564732062616c616e604482015261636560f01b60648201526084016104c9565b6001600160a01b0383166000818152602081815260408083208686039055600280548790039055518581529192917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9101610d58565b6001600160a01b03811660009081526005602052604090208054600181018255905b50919050565b60006104836112fb610f0a565b8360405161190160f01b6020820152602281018390526042810182905260009060620160405160208183030381529060405280519060200120905092915050565b600080600061134d87878787611364565b9150915061135a81611428565b5095945050505050565b6000807f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a083111561139b575060009050600361141f565b6040805160008082526020820180845289905260ff881692820192909252606081018690526080810185905260019060a0016020604051602081039080840390855afa1580156113ef573d6000803e3d6000fd5b5050604051601f1901519150506001600160a01b0381166114185760006001925092505061141f565b9150600090505b94509492505050565b600081600481111561143c5761143c611923565b036114445750565b600181600481111561145857611458611923565b036114a55760405162461bcd60e51b815260206004820152601860248201527f45434453413a20696e76616c6964207369676e6174757265000000000000000060448201526064016104c9565b60028160048111156114b9576114b9611923565b036115065760405162461bcd60e51b815260206004820152601f60248201527f45434453413a20696e76616c6964207369676e6174757265206c656e6774680060448201526064016104c9565b600381600481111561151a5761151a611923565b03610ba35760405162461bcd60e51b815260206004820152602260248201527f45434453413a20696e76616c6964207369676e6174757265202773272076616c604482015261756560f01b60648201526084016104c9565b600060208083528351808285015260005b8181101561159f57858101830151858201604001528201611583565b506000604082860101526040601f19601f8301168501019250505092915050565b6001600160a01b0381168114610ba357600080fd5b600080604083850312156115e857600080fd5b82356115f3816115c0565b946020939093013593505050565b60008060006060848603121561161657600080fd5b8335611621816115c0565b92506020840135611631816115c0565b929592945050506040919091013590565b600080600080600080600060e0888a03121561165d57600080fd5b8735611668816115c0565b96506020880135611678816115c0565b95506040880135945060608801359350608088013560ff8116811461169c57600080fd5b9699959850939692959460a0840135945060c09093013592915050565b6000602082840312156116cb57600080fd5b81356116d6816115c0565b9392505050565b600080600080606085870312156116f357600080fd5b84356116fe816115c0565b935060208501359250604085013567ffffffffffffffff8082111561172257600080fd5b818701915087601f83011261173657600080fd5b81358181111561174557600080fd5b88602082850101111561175757600080fd5b95989497505060200194505050565b6000806040838503121561177957600080fd5b8235611784816115c0565b91506020830135611794816115c0565b809150509250929050565b600181811c908216806117b357607f821691505b6020821081036112e857634e487b7160e01b600052602260045260246000fd5b602080825260409082018190527f444c4c523a20496e76616c696420616464726573732e2043616e6e6f74207472908201527f616e7366657220444c4c5220746f20746865206e756c6c20616464726573732e606082015260800190565b634e487b7160e01b600052601160045260246000fd5b8181038181111561048357610483611831565b8082018082111561048357610483611831565b60208082526025908201527f444c4c523a756e617574686f72697a6564204d61737365744d616e616765722060408201526470726f787960d81b606082015260800190565b6000602082840312156118c457600080fd5b81516116d6816115c0565b6001600160a01b038681168252602082018690528416604082015260806060820181905281018290526000828460a0840137600060a0848401015260a0601f19601f85011683010190509695505050505050565b634e487b7160e01b600052602160045260246000fdfea26469706673582212207865e5a85371cf444908806e93d226e14f24b63a853eb29c09f3b2f17604e14664736f6c63430008110033";
    static readonly abi: readonly [{
        readonly inputs: readonly [];
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
            readonly name: "_newBasketManagerProxy";
            readonly type: "address";
        }];
        readonly name: "BasketManagerProxyChanged";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "_newMassetManagerProxy";
            readonly type: "address";
        }];
        readonly name: "MassetManagerProxyChanged";
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
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: false;
            readonly internalType: "address";
            readonly name: "_from";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "address";
            readonly name: "_to";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "_amount";
            readonly type: "uint256";
        }];
        readonly name: "TransferWithPermit";
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
            readonly name: "_spender";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "_amount";
            readonly type: "uint256";
        }, {
            readonly internalType: "bytes";
            readonly name: "_data";
            readonly type: "bytes";
        }];
        readonly name: "approveAndCall";
        readonly outputs: readonly [];
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
        readonly name: "basketManagerImplementation";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "basketManagerProxy";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
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
        readonly name: "massetManagerImplementation";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "massetManagerProxy";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
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
        readonly name: "renounceOwnership";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "_basketManagerProxy";
            readonly type: "address";
        }];
        readonly name: "setBasketManagerProxy";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "_massetManagerProxy";
            readonly type: "address";
        }];
        readonly name: "setMassetManagerProxy";
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
            readonly name: "_recipient";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "_amount";
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
            readonly name: "_from";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "_to";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "_amount";
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
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "_from";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "_to";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "_amount";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "_deadline";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint8";
            readonly name: "_v";
            readonly type: "uint8";
        }, {
            readonly internalType: "bytes32";
            readonly name: "_r";
            readonly type: "bytes32";
        }, {
            readonly internalType: "bytes32";
            readonly name: "_s";
            readonly type: "bytes32";
        }];
        readonly name: "transferWithPermit";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }];
    static createInterface(): DLLRInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): DLLR;
}
export {};
