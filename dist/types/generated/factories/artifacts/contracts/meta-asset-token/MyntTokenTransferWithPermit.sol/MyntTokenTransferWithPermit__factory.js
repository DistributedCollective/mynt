"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyntTokenTransferWithPermit__factory = void 0;
/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
const ethers_1 = require("ethers");
const _abi = [
    {
        inputs: [
            {
                internalType: "address payable",
                name: "_myntTokenAddress",
                type: "address",
            },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
    },
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
                name: "_from",
                type: "address",
            },
            {
                indexed: false,
                internalType: "address",
                name: "_to",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_amount",
                type: "uint256",
            },
        ],
        name: "TransferWithPermit",
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
                name: "account",
                type: "address",
            },
        ],
        name: "balanceOf",
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
        name: "getChainId",
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
        name: "initialize",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "myntToken",
        outputs: [
            {
                internalType: "contract IERC20PermitWithTransfer",
                name: "",
                type: "address",
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
                name: "newOwner",
                type: "address",
            },
        ],
        name: "transferOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_from",
                type: "address",
            },
            {
                internalType: "address",
                name: "_to",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "_amount",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "_deadline",
                type: "uint256",
            },
            {
                internalType: "uint8",
                name: "_v",
                type: "uint8",
            },
            {
                internalType: "bytes32",
                name: "_r",
                type: "bytes32",
            },
            {
                internalType: "bytes32",
                name: "_s",
                type: "bytes32",
            },
        ],
        name: "transferWithPermit",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
];
const _bytecode = "0x60a03461008157601f6109d638819003918201601f19168301916001600160401b038311848410176100865780849260209460405283398101031261008157516001600160a01b0381169081900361008157608052604051610939908161009d8239608051818181610124015281816103580152818161044a015261075f0152f35b600080fd5b634e487b7160e01b600052604160045260246000fdfe6080604081815260048036101561001557600080fd5b600092833560e01c9081633408e4701461079a57508063605629d6146103cd57806370a0823114610312578063715018a6146102b15780638129fc1c146101805780638da5cb5b1461015757806398ebfd811461010f5763f2fde38b1461007b57600080fd5b3461010b57602036600319011261010b576100946107b4565b9161009d6107ca565b6001600160a01b038316156100b957836100b684610822565b80f35b906020608492519162461bcd60e51b8352820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b6064820152fd5b8280fd5b505034610153578160031936011261015357517f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03168152602090f35b5080fd5b50503461015357816003193601126101535760335490516001600160a01b039091168152602090f35b503461010b578260031936011261010b57825460ff8160081c1615918280936102a4575b801561028d575b15610233575060ff198116600117845581610222575b506101db60ff845460081c166101d68161086b565b61086b565b6101e433610822565b6101ec575080f35b60207f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989161ff001984541684555160018152a180f35b61ffff1916610101178355386101c1565b608490602085519162461bcd60e51b8352820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b6064820152fd5b50303b1580156101ab5750600160ff8316146101ab565b50600160ff8316106101a4565b833461030f578060031936011261030f576102ca6107ca565b603380546001600160a01b031981169091556000906001600160a01b03167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e08280a380f35b80fd5b50919034610153576020928360031936011261010b57836103316107b4565b83516370a0823160e01b81526001600160a01b0391821693810193909352829060249082907f0000000000000000000000000000000000000000000000000000000000000000165afa9283156103c2579261038e575b5051908152f35b9091508281813d83116103bb575b6103a681836108cb565b810103126103b657519038610387565b600080fd5b503d61039c565b8251903d90823e3d90fd5b508290346101535760e0366003190112610153576103e96107b4565b60248035926001600160a01b03808516929083860361079657604435936084359060ff8216809203610792578015159081610787575b8161075a575b50156106d8578851636eb1769f60e11b815286831685820181905230858301526020937f0000000000000000000000000000000000000000000000000000000000000000169290918481604481875afa9081156106ce578b8a87958f9794958c968f958591610689575b5087116105d3575b505095516323b872dd60e01b81526001600160a01b039687168a8201908152929096166020830152604082019390935284928391829060600103925af19081156105c957889161058f575b501561053357505094516001600160a01b03928316815292909116602083015260408201529091507f248045bd8dd43ca5645e66af7003ebfb1579f27be326e439f761ba6e5561431b90606090a180f35b875162461bcd60e51b8152928301526033908201527f4d6574614173736574546f6b656e3a3a7472616e73666572576974685065726d6044820152721a5d0e881d1c985b9cd9995c8819985a5b1959606a1b6064820152608490fd5b90508181813d83116105c2575b6105a681836108cb565b810103126105be575180151581036105be57896104e2565b8780fd5b503d61059c565b89513d8a823e3d90fd5b955095505050508093503b15610685578a519163d505accf60e01b83528683015230858301528660448301526064356064830152608482015260a43560a482015260c43560c4820152888160e48183865af1801561067b57908a91610641575b839192898b8a848b95610497565b905067ffffffffffffffff819992939495969799116106695789529694939291908885610633565b634e487b7160e01b8252604186528482fd5b8a513d8b823e3d90fd5b8980fd5b969950509550959250505081813d83116106c7575b6106a881836108cb565b810103126106c35792898b8a87958f97958c8097519061048f565b8a80fd5b503d61069e565b8c513d8d823e3d90fd5b885162461bcd60e51b81526020818601526051818501527f496e76616c696420616464726573732e2043616e6e6f74207472616e7366657260448201527f20746f20746865206e756c6c20616464726573732c206d796e74546f6b656e2060648201527037b9103a3434b99031b7b73a3930b1ba1760791b608482015260a490fd5b9050827f00000000000000000000000000000000000000000000000000000000000000001614158a610425565b30811415915061041f565b8880fd5b8680fd5b849034610153578160031936011261015357602090468152f35b600435906001600160a01b03821682036103b657565b6033546001600160a01b031633036107de57565b606460405162461bcd60e51b815260206004820152602060248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152fd5b603380546001600160a01b039283166001600160a01b0319821681179092559091167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0600080a3565b1561087257565b60405162461bcd60e51b815260206004820152602b60248201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960448201526a6e697469616c697a696e6760a81b6064820152608490fd5b90601f8019910116810190811067ffffffffffffffff8211176108ed57604052565b634e487b7160e01b600052604160045260246000fdfea2646970667358221220b4940cf2a28b6a8c84f41f6e97ee036939d3b12536fcf85648bdfdd85d011e4864736f6c63430008110033";
const isSuperArgs = (xs) => xs.length > 1;
class MyntTokenTransferWithPermit__factory extends ethers_1.ContractFactory {
    constructor(...args) {
        if (isSuperArgs(args)) {
            super(...args);
        }
        else {
            super(_abi, _bytecode, args[0]);
        }
    }
    deploy(_myntTokenAddress, overrides) {
        return super.deploy(_myntTokenAddress, overrides || {});
    }
    getDeployTransaction(_myntTokenAddress, overrides) {
        return super.getDeployTransaction(_myntTokenAddress, overrides || {});
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
exports.MyntTokenTransferWithPermit__factory = MyntTokenTransferWithPermit__factory;
MyntTokenTransferWithPermit__factory.bytecode = _bytecode;
MyntTokenTransferWithPermit__factory.abi = _abi;
//# sourceMappingURL=MyntTokenTransferWithPermit__factory.js.map