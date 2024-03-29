"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockBasketManager__factory = void 0;
/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
const ethers_1 = require("ethers");
const _abi = [
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "address",
                name: "previousAdmin",
                type: "address",
            },
            {
                indexed: false,
                internalType: "address",
                name: "newAdmin",
                type: "address",
            },
        ],
        name: "AdminChanged",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "address",
                name: "basset",
                type: "address",
            },
        ],
        name: "BassetAdded",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "address",
                name: "basset",
                type: "address",
            },
        ],
        name: "BassetRemoved",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "beacon",
                type: "address",
            },
        ],
        name: "BeaconUpgraded",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "address",
                name: "basset",
                type: "address",
            },
            {
                indexed: false,
                internalType: "int256",
                name: "factor",
                type: "int256",
            },
        ],
        name: "FactorChanged",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "uint8",
                name: "version",
                type: "uint8",
            },
        ],
        name: "Initialized",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "previousOwner",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "newOwner",
                type: "address",
            },
        ],
        name: "OwnershipTransferred",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "address",
                name: "basset",
                type: "address",
            },
            {
                indexed: false,
                internalType: "bool",
                name: "paused",
                type: "bool",
            },
        ],
        name: "PausedChanged",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "address",
                name: "basset",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "min",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "max",
                type: "uint256",
            },
        ],
        name: "RangeChanged",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "implementation",
                type: "address",
            },
        ],
        name: "Upgraded",
        type: "event",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_basset",
                type: "address",
            },
            {
                internalType: "int256",
                name: "_factor",
                type: "int256",
            },
            {
                internalType: "uint256",
                name: "_min",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "_max",
                type: "uint256",
            },
            {
                internalType: "bool",
                name: "_paused",
                type: "bool",
            },
        ],
        name: "addBasset",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address[]",
                name: "_bassets",
                type: "address[]",
            },
            {
                internalType: "int256[]",
                name: "_factors",
                type: "int256[]",
            },
            {
                internalType: "uint256[]",
                name: "_mins",
                type: "uint256[]",
            },
            {
                internalType: "uint256[]",
                name: "_maxs",
                type: "uint256[]",
            },
            {
                internalType: "bool[]",
                name: "_pausedFlags",
                type: "bool[]",
            },
        ],
        name: "addBassets",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_basset",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "_bassetQuantity",
                type: "uint256",
            },
        ],
        name: "checkBasketBalanceForDeposit",
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
    {
        inputs: [
            {
                internalType: "address",
                name: "_basset",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "_bassetQuantity",
                type: "uint256",
            },
        ],
        name: "checkBasketBalanceForWithdrawal",
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
    {
        inputs: [
            {
                internalType: "address",
                name: "_basset",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "_bassetQuantity",
                type: "uint256",
            },
        ],
        name: "convertBassetToMassetQuantity",
        outputs: [
            {
                internalType: "uint256",
                name: "massetQuantity",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "bassetQuantity",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_basset",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "_massetQuantity",
                type: "uint256",
            },
        ],
        name: "convertMassetToBassetQuantity",
        outputs: [
            {
                internalType: "uint256",
                name: "bassetQuantity",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "massetQuantity",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_basset",
                type: "address",
            },
        ],
        name: "getBassetBalance",
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
        name: "getBassets",
        outputs: [
            {
                internalType: "address[]",
                name: "",
                type: "address[]",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_basset",
                type: "address",
            },
        ],
        name: "getFactor",
        outputs: [
            {
                internalType: "int256",
                name: "",
                type: "int256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_basset",
                type: "address",
            },
        ],
        name: "getPaused",
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
    {
        inputs: [],
        name: "getProxyImplementation",
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
        inputs: [
            {
                internalType: "address",
                name: "_basset",
                type: "address",
            },
        ],
        name: "getRange",
        outputs: [
            {
                internalType: "uint256",
                name: "min",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "max",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getTotalMassetBalance",
        outputs: [
            {
                internalType: "uint256",
                name: "total",
                type: "uint256",
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
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_massetManager",
                type: "address",
            },
        ],
        name: "initialize",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "int256",
                name: "x",
                type: "int256",
            },
        ],
        name: "isPowerOfTen",
        outputs: [
            {
                internalType: "bool",
                name: "result",
                type: "bool",
            },
        ],
        stateMutability: "pure",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_basset",
                type: "address",
            },
        ],
        name: "isValidBasset",
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
    {
        inputs: [],
        name: "owner",
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
        inputs: [
            {
                internalType: "address",
                name: "_basset",
                type: "address",
            },
        ],
        name: "removeBasset",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "renounceOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_basset",
                type: "address",
            },
            {
                internalType: "int256",
                name: "_factor",
                type: "int256",
            },
        ],
        name: "setFactor",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_basset",
                type: "address",
            },
            {
                internalType: "bool",
                name: "_flag",
                type: "bool",
            },
        ],
        name: "setPaused",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_basset",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "_min",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "_max",
                type: "uint256",
            },
        ],
        name: "setRange",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "newOwner",
                type: "address",
            },
        ],
        name: "transferOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
];
const _bytecode = "0x608060405234801561001057600080fd5b50611c80806100206000396000f3fe608060405234801561001057600080fd5b50600436106101585760003560e01c80638da5cb5b116100c3578063c4d66de81161007c578063c4d66de8146102f1578063c7bbc86514610304578063d80f5a8714610317578063eb72ccd514610342578063f2fde38b1461034a578063f5bffc351461035d57600080fd5b80638da5cb5b146102785780638ee8ffd11461029d57806390e4b720146102b05780639bf761b7146102b8578063a9f02efe146102cb578063b55d9904146102de57600080fd5b80635ac99461116101155780635ac99461146101f3578063620611c314610206578063623a564b14610229578063689418691461023c578063715018a61461025d57806389eba0d21461026557600080fd5b806309f2a9831461015d5780630d8e6e2c146101725780631af327bd146101905780631d3ce398146101b857806329820c5b146101cd5780635521c653146101e0575b600080fd5b61017061016b3660046115d1565b610370565b005b61017a610547565b60405161018791906115ec565b60405180910390f35b6101a361019e36600461163a565b6105d9565b60408051928352602083019190915201610187565b6101c0610647565b6040516101879190611664565b6101706101db36600461185b565b6106a8565b6101a36101ee3660046115d1565b6107c8565b6101a361020136600461163a565b610800565b61021961021436600461192d565b610877565b6040519015158152602001610187565b610170610237366004611946565b6108c8565b61024f61024a3660046115d1565b610a0d565b604051908152602001610187565b610170610a3b565b610170610273366004611979565b610a4f565b6033546001600160a01b03165b6040516001600160a01b039091168152602001610187565b6101706102ab3660046119ac565b610abd565b610285610c60565b6101706102c636600461163a565b610c98565b6102196102d936600461163a565b610d99565b6102196102ec3660046115d1565b610ea9565b6101706102ff3660046115d1565b610ed5565b61021961031236600461163a565b611075565b6102196103253660046115d1565b6001600160a01b03166000908152609a6020526040902054151590565b61024f6111e6565b6101706103583660046115d1565b6112bb565b61024f61036b3660046115d1565b611334565b8061037a816113aa565b610382611402565b61038b82611334565b156103d05760405162461bcd60e51b815260206004820152601060248201526f62616c616e6365206e6f74207a65726f60801b60448201526064015b60405180910390fd5b6001600160a01b0382166000908152609a60205260408120819055805b6099546103fc90600190611a12565b81101561045457836001600160a01b03166099828154811061042057610420611a25565b6000918252602090912001546001600160a01b03160361044257809150610454565b8061044c81611a3b565b9150506103ed565b506099805461046590600190611a12565b8154811061047557610475611a25565b600091825260209091200154609980546001600160a01b0390921691839081106104a1576104a1611a25565b9060005260206000200160006101000a8154816001600160a01b0302191690836001600160a01b0316021790555060998054806104e0576104e0611a54565b6000828152602090819020600019908301810180546001600160a01b03191690559091019091556040516001600160a01b03851681527f1e5281bbecf5c15104f9e35265dbe738c1cd2597613cbf4a0a51713448bc13b991015b60405180910390a1505050565b60606097805461055690611a6a565b80601f016020809104026020016040519081016040528092919081815260200182805461058290611a6a565b80156105cf5780601f106105a4576101008083540402835291602001916105cf565b820191906000526020600020905b8154815290600101906020018083116105b257829003601f168201915b5050505050905090565b600080836105e6816113aa565b6001600160a01b0385166000908152609a60205260408120549081131561062557610611858261145c565b935061061d848261146f565b92505061063f565b61063861063182611a9e565b869061146f565b9350849250505b509250929050565b606060998054806020026020016040519081016040528092919081815260200182805480156105cf57602002820191906000526020600020905b81546001600160a01b03168152600190910190602001808311610681575050505050905090565b6106b0611402565b84518451811480156106c25750808451145b80156106ce5750808351145b80156106da5750808251145b6107185760405162461bcd60e51b815260206004820152600f60248201526e696e76616c6964206c656e6774687360881b60448201526064016103c7565b60005b818110156107bf576107ad87828151811061073857610738611a25565b602002602001015187838151811061075257610752611a25565b602002602001015187848151811061076c5761076c611a25565b602002602001015187858151811061078657610786611a25565b60200260200101518786815181106107a0576107a0611a25565b6020026020010151610abd565b806107b781611a3b565b91505061071b565b50505050505050565b600080826107d5816113aa565b5050506001600160a01b03166000908152609c6020908152604080832054609d909252909120549091565b6000808361080d816113aa565b6001600160a01b0385166000908152609a60205260408120549081131561084457610838858261146f565b935084925061063f9050565b61085761085082611a9e565b869061145c565b935061086c61086582611a9e565b859061146f565b925050509250929050565b60008060008312156108935761088c83611a9e565b9050610896565b50815b600a81101580156108af57506108ad600a82611ad0565b155b156108bf5761088c600a82611ae4565b60011492915050565b826108d2816113aa565b6108da611402565b6103e883111561091e5760405162461bcd60e51b815260206004820152600f60248201526e696e76616c6964206d696e696d756d60881b60448201526064016103c7565b6103e88211156109625760405162461bcd60e51b815260206004820152600f60248201526e696e76616c6964206d6178696d756d60881b60448201526064016103c7565b828210156109a25760405162461bcd60e51b815260206004820152600d60248201526c696e76616c69642072616e676560981b60448201526064016103c7565b6001600160a01b0384166000818152609c60209081526040808320879055609d8252918290208590558151928352820185905281018390527fe3b935f735d8a72a31934e03fd96d995c5b3096c7362bc7e8796ab9e1ffe668c9060600160405180910390a150505050565b600081610a19816113aa565b6001600160a01b0383166000908152609a602052604090205491505b50919050565b610a43611402565b610a4d600061147b565b565b81610a59816113aa565b610a61611402565b6001600160a01b0383166000818152609e6020908152604091829020805460ff19168615159081179091558251938452908301527f6567e54649bc4d1136cad0f12cfc472ef5c8255ad12c3e46ecf4ef245f06c6cc910161053a565b610ac5611402565b6001600160a01b038516610b145760405162461bcd60e51b8152602060048201526016602482015275696e76616c696420626173736574206164647265737360501b60448201526064016103c7565b6001600160a01b0385166000908152609a602052604090205415610b725760405162461bcd60e51b815260206004820152601560248201527462617373657420616c72656164792065786973747360581b60448201526064016103c7565b83600003610bb35760405162461bcd60e51b815260206004820152600e60248201526d34b73b30b634b2103330b1ba37b960911b60448201526064016103c7565b609980546001810182556000919091527f72a152ddfb8e864297c917af52ea6c1c68aead0fee1a62673fcc7e0c94979d000180546001600160a01b0319166001600160a01b038716179055610c088585610c98565b610c138584846108c8565b610c1d8582610a4f565b6040516001600160a01b03861681527fa83f9302fa4684335dd26b1bdd925929618565fa0f22bd9e91ab01753d8bf13c9060200160405180910390a15050505050565b6000610c937f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc546001600160a01b031690565b905090565b610ca0611402565b80600003610ce15760405162461bcd60e51b815260206004820152600e60248201526d34b73b30b634b2103330b1ba37b960911b60448201526064016103c7565b8060011480610cf45750610cf481610877565b610d405760405162461bcd60e51b815260206004820152601a60248201527f666163746f72206d75737420626520706f776572206f6620313000000000000060448201526064016103c7565b6001600160a01b0382166000818152609a6020908152604091829020849055815192835282018390527fbd9d78e6bf6327f299e2cc40ef087c54546ef9ac6bea857cdc90b57270bbb58991015b60405180910390a15050565b600082610da5816113aa565b83610daf816114cd565b6000610dbb86866105d9565b506098546040516370a0823160e01b81526001600160a01b039182166004820152919250600091908816906370a0823190602401602060405180830381865afa158015610e0c573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610e309190611af8565b90506000610e3e88836105d9565b5090506000610e4d8285611529565b90506000610e6385610e5d6111e6565b90611529565b90506000610e7d82610e77856103e861146f565b9061145c565b6001600160a01b038c166000908152609d6020526040902054101598505050505050505b505092915050565b600081610eb5816113aa565b50506001600160a01b03166000908152609e602052604090205460ff1690565b600054610100900460ff1615808015610ef55750600054600160ff909116105b80610f0f5750303b158015610f0f575060005460ff166001145b610f725760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b60648201526084016103c7565b6000805460ff191660011790558015610f95576000805461ff0019166101001790555b6098546001600160a01b031615610fe45760405162461bcd60e51b8152602060048201526013602482015272185b1c9958591e481a5b9a5d1a585b1a5e9959606a1b60448201526064016103c7565b609880546001600160a01b0319166001600160a01b0384161790556040805180820190915260038152620332e360ec1b60208201526097906110269082611b60565b5061102f611535565b8015611071576000805461ff0019169055604051600181527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb384740249890602001610d8d565b5050565b600082611081816113aa565b8361108b816114cd565b600061109786866105d9565b506098546040516370a0823160e01b81526001600160a01b039182166004820152919250600091908816906370a0823190602401602060405180830381865afa1580156110e8573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061110c9190611af8565b9050600061111a88836105d9565b5090508281101561116d5760405162461bcd60e51b815260206004820181905260248201527f6261737365742062616c616e6365206973206e6f742073756666696369656e7460448201526064016103c7565b600061117982856115a9565b9050600061118f856111896111e6565b906115a9565b6001600160a01b038b166000908152609c60205260408120549192508290036111c057159750610ea1945050505050565b60006111d283610e77866103e861146f565b91909110159b9a5050505050505050505050565b6000805b6099548110156112b75760006099828154811061120957611209611a25565b60009182526020822001546098546040516370a0823160e01b81526001600160a01b0391821660048201529116925082906370a0823190602401602060405180830381865afa158015611260573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906112849190611af8565b9050600061129283836105d9565b50905061129f8186611c20565b945050505080806112af90611a3b565b9150506111ea565b5090565b6112c3611402565b6001600160a01b0381166113285760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b60648201526084016103c7565b6113318161147b565b50565b6098546040516370a0823160e01b81526001600160a01b0391821660048201526000918316906370a0823190602401602060405180830381865afa158015611380573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906113a49190611af8565b92915050565b6001600160a01b0381166000908152609a602052604081205490036113315760405162461bcd60e51b815260206004820152600e60248201526d1a5b9d985b1a590818985cdcd95d60921b60448201526064016103c7565b6033546001600160a01b03163314610a4d5760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657260448201526064016103c7565b60006114688284611ae4565b9392505050565b60006114688284611c33565b603380546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b6001600160a01b0381166000908152609e602052604090205460ff16156113315760405162461bcd60e51b815260206004820152601060248201526f18985cdcd95d081a5cc81c185d5cd95960821b60448201526064016103c7565b60006114688284611c20565b600054610100900460ff166115a05760405162461bcd60e51b815260206004820152602b60248201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960448201526a6e697469616c697a696e6760a81b60648201526084016103c7565b610a4d3361147b565b60006114688284611a12565b80356001600160a01b03811681146115cc57600080fd5b919050565b6000602082840312156115e357600080fd5b611468826115b5565b600060208083528351808285015260005b81811015611619578581018301518582016040015282016115fd565b506000604082860101526040601f19601f8301168501019250505092915050565b6000806040838503121561164d57600080fd5b611656836115b5565b946020939093013593505050565b6020808252825182820181905260009190848201906040850190845b818110156116a55783516001600160a01b031683529284019291840191600101611680565b50909695505050505050565b634e487b7160e01b600052604160045260246000fd5b604051601f8201601f1916810167ffffffffffffffff811182821017156116f0576116f06116b1565b604052919050565b600067ffffffffffffffff821115611712576117126116b1565b5060051b60200190565b600082601f83011261172d57600080fd5b8135602061174261173d836116f8565b6116c7565b82815260059290921b8401810191818101908684111561176157600080fd5b8286015b8481101561178357611776816115b5565b8352918301918301611765565b509695505050505050565b600082601f83011261179f57600080fd5b813560206117af61173d836116f8565b82815260059290921b840181019181810190868411156117ce57600080fd5b8286015b8481101561178357803583529183019183016117d2565b803580151581146115cc57600080fd5b600082601f83011261180a57600080fd5b8135602061181a61173d836116f8565b82815260059290921b8401810191818101908684111561183957600080fd5b8286015b848110156117835761184e816117e9565b835291830191830161183d565b600080600080600060a0868803121561187357600080fd5b853567ffffffffffffffff8082111561188b57600080fd5b61189789838a0161171c565b965060208801359150808211156118ad57600080fd5b6118b989838a0161178e565b955060408801359150808211156118cf57600080fd5b6118db89838a0161178e565b945060608801359150808211156118f157600080fd5b6118fd89838a0161178e565b9350608088013591508082111561191357600080fd5b50611920888289016117f9565b9150509295509295909350565b60006020828403121561193f57600080fd5b5035919050565b60008060006060848603121561195b57600080fd5b611964846115b5565b95602085013595506040909401359392505050565b6000806040838503121561198c57600080fd5b611995836115b5565b91506119a3602084016117e9565b90509250929050565b600080600080600060a086880312156119c457600080fd5b6119cd866115b5565b94506020860135935060408601359250606086013591506119f0608087016117e9565b90509295509295909350565b634e487b7160e01b600052601160045260246000fd5b818103818111156113a4576113a46119fc565b634e487b7160e01b600052603260045260246000fd5b600060018201611a4d57611a4d6119fc565b5060010190565b634e487b7160e01b600052603160045260246000fd5b600181811c90821680611a7e57607f821691505b602082108103610a3557634e487b7160e01b600052602260045260246000fd5b6000600160ff1b8201611ab357611ab36119fc565b5060000390565b634e487b7160e01b600052601260045260246000fd5b600082611adf57611adf611aba565b500690565b600082611af357611af3611aba565b500490565b600060208284031215611b0a57600080fd5b5051919050565b601f821115611b5b57600081815260208120601f850160051c81016020861015611b385750805b601f850160051c820191505b81811015611b5757828155600101611b44565b5050505b505050565b815167ffffffffffffffff811115611b7a57611b7a6116b1565b611b8e81611b888454611a6a565b84611b11565b602080601f831160018114611bc35760008415611bab5750858301515b600019600386901b1c1916600185901b178555611b57565b600085815260208120601f198616915b82811015611bf257888601518255948401946001909101908401611bd3565b5085821015611c105787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b808201808211156113a4576113a46119fc565b80820281158282048414176113a4576113a46119fc56fea264697066735822122098b318e623cf663e9329198b0052d1c1bc57f3263d3a54330acc75bfff68fca964736f6c63430008110033";
const isSuperArgs = (xs) => xs.length > 1;
class MockBasketManager__factory extends ethers_1.ContractFactory {
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
exports.MockBasketManager__factory = MockBasketManager__factory;
MockBasketManager__factory.bytecode = _bytecode;
MockBasketManager__factory.abi = _abi;
//# sourceMappingURL=MockBasketManager__factory.js.map