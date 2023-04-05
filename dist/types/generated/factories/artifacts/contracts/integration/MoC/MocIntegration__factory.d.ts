import { Signer, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../../common";
import type { MocIntegration, MocIntegrationInterface } from "../../../../../artifacts/contracts/integration/MoC/MocIntegration";
type MocIntegrationConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class MocIntegration__factory extends ContractFactory {
    constructor(...args: MocIntegrationConstructorParams);
    deploy(_moc: PromiseOrValue<string>, _doc: PromiseOrValue<string>, _dllr: PromiseOrValue<string>, _massetManager: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<MocIntegration>;
    getDeployTransaction(_moc: PromiseOrValue<string>, _doc: PromiseOrValue<string>, _dllr: PromiseOrValue<string>, _massetManager: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): TransactionRequest;
    attach(address: string): MocIntegration;
    connect(signer: Signer): MocIntegration__factory;
    static readonly bytecode = "0x61010060405234801561001157600080fd5b50604051610c80380380610c8083398101604081905261003091610119565b6001600160a01b0384161580159061005057506001600160a01b03831615155b801561006457506001600160a01b03821615155b801561007857506001600160a01b03811615155b6100db5760405162461bcd60e51b815260206004820152602a60248201527f4d6f63496e746567726174696f6e3a3a206e6f206e756c6c2061646472657373604482015269195cc8185b1b1bddd95960b21b606482015260840160405180910390fd5b6001600160a01b0393841660805291831660a052821660c0521660e05261016d565b80516001600160a01b038116811461011457600080fd5b919050565b6000806000806080858703121561012f57600080fd5b610138856100fd565b9350610146602086016100fd565b9250610154604086016100fd565b9150610162606086016100fd565b905092959194509250565b60805160a05160c05160e051610abf6101c1600039600081816101eb01526103ab01526000818160c90152610298015260008181610184015261037101526000818161013b01526104b00152610abf6000f3fe6080604052600436106100ab5760003560e01c806390e4b7201161006457806390e4b720146101c4578063b5c89bab146101d9578063c4d66de81461020d578063e50855171461022d578063f2fde38b1461024d578063fc1768191461026d57600080fd5b806333c507ae146100b7578063460f2de1146101075780635342825314610129578063715018a61461015d5780637a0a3ac5146101725780638da5cb5b146101a657600080fd5b366100b257005b600080fd5b3480156100c357600080fd5b506100eb7f000000000000000000000000000000000000000000000000000000000000000081565b6040516001600160a01b03909116815260200160405180910390f35b34801561011357600080fd5b5061012761012236600461096a565b61028d565b005b34801561013557600080fd5b506100eb7f000000000000000000000000000000000000000000000000000000000000000081565b34801561016957600080fd5b5061012761061a565b34801561017e57600080fd5b506100eb7f000000000000000000000000000000000000000000000000000000000000000081565b3480156101b257600080fd5b506033546001600160a01b03166100eb565b3480156101d057600080fd5b506100eb61062e565b3480156101e557600080fd5b506100eb7f000000000000000000000000000000000000000000000000000000000000000081565b34801561021957600080fd5b506101276102283660046109b7565b610666565b34801561023957600080fd5b506101276102483660046109b7565b610781565b34801561025957600080fd5b506101276102683660046109b7565b610795565b34801561027957600080fd5b506097546100eb906001600160a01b031681565b306001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001663605629d633838686356102d26040890160208a016109db565b604080516001600160e01b031960e089901b1681526001600160a01b0396871660048201529590941660248601526044850192909252606484015260ff16608483015285013560a4820152606085013560c482015260e401600060405180830381600087803b15801561034457600080fd5b505af1158015610358573d6000803e3d6000fd5b505060405163fb2c922360e01b81526001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000811660048301526024820187905284811660448301528693507f000000000000000000000000000000000000000000000000000000000000000016915063fb2c9223906064016020604051808303816000875af11580156103f5573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061041991906109fe565b146104825760405162461bcd60e51b815260206004820152602e60248201527f4d6f63496e746567726174696f6e3a3a2072656465656d656420696e636f727260448201526d1958dd08111bd0c8185b5bdd5b9d60921b60648201526084015b60405180910390fd5b60975460405163b7aa53e760e01b8152600481018590526001600160a01b03918216602482015282821631917f0000000000000000000000000000000000000000000000000000000000000000169063b7aa53e790604401600060405180830381600087803b1580156104f457600080fd5b505af1158015610508573d6000803e3d6000fd5b50505050600081836001600160a01b0316316105249190610a17565b604051909150600090339083908381818185875af1925050503d8060008114610569576040519150601f19603f3d011682016040523d82523d6000602084013e61056e565b606091505b50509050806105d95760405162461bcd60e51b815260206004820152603160248201527f4d6f63496e746567726174696f6e3a3a206572726f72207472616e7366657272604482015270696e672072656465656d6564205242544360781b6064820152608401610479565b60408051878152602081018490527f9d8e423b23af97e1b68e81e339269059cbacc1c8754155bf6f0fd3e5adf8abe8910160405180910390a1505050505050565b61062261080b565b61062c6000610865565b565b60006106617f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc546001600160a01b031690565b905090565b600054610100900460ff16158080156106865750600054600160ff909116105b806106a05750303b1580156106a0575060005460ff166001145b6107035760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b6064820152608401610479565b6000805460ff191660011790558015610726576000805461ff0019166101001790555b61072e6108b7565b610737826108e6565b801561077d576000805461ff0019169055604051600181527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989060200160405180910390a15b5050565b61078961080b565b610792816108e6565b50565b61079d61080b565b6001600160a01b0381166108025760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b6064820152608401610479565b61079281610865565b6033546001600160a01b0316331461062c5760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152606401610479565b603380546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b600054610100900460ff166108de5760405162461bcd60e51b815260040161047990610a3e565b61062c61093a565b609780546001600160a01b0319166001600160a01b0383169081179091556040519081527fc2a1feb9d65ecb31b0e93a520a66d19319929a2bf58046d92d762c04e7dd06c99060200160405180910390a150565b600054610100900460ff166109615760405162461bcd60e51b815260040161047990610a3e565b61062c33610865565b60008082840360a081121561097e57600080fd5b833592506080601f198201121561099457600080fd5b506020830190509250929050565b6001600160a01b038116811461079257600080fd5b6000602082840312156109c957600080fd5b81356109d4816109a2565b9392505050565b6000602082840312156109ed57600080fd5b813560ff811681146109d457600080fd5b600060208284031215610a1057600080fd5b5051919050565b81810381811115610a3857634e487b7160e01b600052601160045260246000fd5b92915050565b6020808252602b908201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960408201526a6e697469616c697a696e6760a81b60608201526080019056fea2646970667358221220037d712c9dcf3615ac8d254729c41393e1e10a7ba7ff53232bf580ad8929792064736f6c63430008110033";
    static readonly abi: readonly [{
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "_moc";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "_doc";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "_dllr";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "_massetManager";
            readonly type: "address";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "constructor";
    }, {
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
            readonly internalType: "uint256";
            readonly name: "fromDLLR";
            readonly type: "uint256";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "toRBTC";
            readonly type: "uint256";
        }];
        readonly name: "GetDocFromDllrAndRedeemRBTC";
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
            readonly indexed: false;
            readonly internalType: "address";
            readonly name: "newMocVendorAccount";
            readonly type: "address";
        }];
        readonly name: "MocVendorAccountSet";
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
            readonly name: "implementation";
            readonly type: "address";
        }];
        readonly name: "Upgraded";
        readonly type: "event";
    }, {
        readonly inputs: readonly [];
        readonly name: "dllr";
        readonly outputs: readonly [{
            readonly internalType: "contract IDLLR";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "doc";
        readonly outputs: readonly [{
            readonly internalType: "contract IERC20";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "_dllrAmount";
            readonly type: "uint256";
        }, {
            readonly components: readonly [{
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
            readonly internalType: "struct PermitParams";
            readonly name: "_permitParams";
            readonly type: "tuple";
        }];
        readonly name: "getDocFromDllrAndRedeemRBTC";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
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
        readonly inputs: readonly [{
            readonly internalType: "address payable";
            readonly name: "_mocVendorAccount";
            readonly type: "address";
        }];
        readonly name: "initialize";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "massetManager";
        readonly outputs: readonly [{
            readonly internalType: "contract IMassetManager";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "moc";
        readonly outputs: readonly [{
            readonly internalType: "contract IMocMintRedeemDoc";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "mocVendorAccount";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
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
        readonly inputs: readonly [{
            readonly internalType: "address payable";
            readonly name: "newMocVedorAccount";
            readonly type: "address";
        }];
        readonly name: "setMocVendorAccount";
        readonly outputs: readonly [];
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
        readonly stateMutability: "payable";
        readonly type: "receive";
    }];
    static createInterface(): MocIntegrationInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): MocIntegration;
}
export {};
