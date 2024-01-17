"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Permit2__factory = void 0;
/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
const ethers_1 = require("ethers");
const _abi = [
    {
        inputs: [
            {
                internalType: "uint256",
                name: "deadline",
                type: "uint256",
            },
        ],
        name: "AllowanceExpired",
        type: "error",
    },
    {
        inputs: [],
        name: "ExcessiveInvalidation",
        type: "error",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "amount",
                type: "uint256",
            },
        ],
        name: "InsufficientAllowance",
        type: "error",
    },
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
                indexed: true,
                internalType: "address",
                name: "token",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "spender",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint160",
                name: "amount",
                type: "uint160",
            },
            {
                indexed: false,
                internalType: "uint48",
                name: "expiration",
                type: "uint48",
            },
        ],
        name: "Approval",
        type: "event",
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
                internalType: "address",
                name: "token",
                type: "address",
            },
            {
                indexed: false,
                internalType: "address",
                name: "spender",
                type: "address",
            },
        ],
        name: "Lockdown",
        type: "event",
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
                indexed: true,
                internalType: "address",
                name: "token",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "spender",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint48",
                name: "newNonce",
                type: "uint48",
            },
            {
                indexed: false,
                internalType: "uint48",
                name: "oldNonce",
                type: "uint48",
            },
        ],
        name: "NonceInvalidation",
        type: "event",
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
                indexed: true,
                internalType: "address",
                name: "token",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "spender",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint160",
                name: "amount",
                type: "uint160",
            },
            {
                indexed: false,
                internalType: "uint48",
                name: "expiration",
                type: "uint48",
            },
            {
                indexed: false,
                internalType: "uint48",
                name: "nonce",
                type: "uint48",
            },
        ],
        name: "Permit",
        type: "event",
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
                internalType: "address",
                name: "",
                type: "address",
            },
            {
                internalType: "address",
                name: "",
                type: "address",
            },
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        name: "allowance",
        outputs: [
            {
                internalType: "uint160",
                name: "amount",
                type: "uint160",
            },
            {
                internalType: "uint48",
                name: "expiration",
                type: "uint48",
            },
            {
                internalType: "uint48",
                name: "nonce",
                type: "uint48",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "token",
                type: "address",
            },
            {
                internalType: "address",
                name: "spender",
                type: "address",
            },
            {
                internalType: "uint160",
                name: "amount",
                type: "uint160",
            },
            {
                internalType: "uint48",
                name: "expiration",
                type: "uint48",
            },
        ],
        name: "approve",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "token",
                type: "address",
            },
            {
                internalType: "address",
                name: "spender",
                type: "address",
            },
            {
                internalType: "uint48",
                name: "newNonce",
                type: "uint48",
            },
        ],
        name: "invalidateNonces",
        outputs: [],
        stateMutability: "nonpayable",
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
                components: [
                    {
                        internalType: "address",
                        name: "token",
                        type: "address",
                    },
                    {
                        internalType: "address",
                        name: "spender",
                        type: "address",
                    },
                ],
                internalType: "struct IAllowanceTransfer.TokenSpenderPair[]",
                name: "approvals",
                type: "tuple[]",
            },
        ],
        name: "lockdown",
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
                internalType: "address",
                name: "owner",
                type: "address",
            },
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
                                internalType: "uint160",
                                name: "amount",
                                type: "uint160",
                            },
                            {
                                internalType: "uint48",
                                name: "expiration",
                                type: "uint48",
                            },
                            {
                                internalType: "uint48",
                                name: "nonce",
                                type: "uint48",
                            },
                        ],
                        internalType: "struct IAllowanceTransfer.PermitDetails[]",
                        name: "details",
                        type: "tuple[]",
                    },
                    {
                        internalType: "address",
                        name: "spender",
                        type: "address",
                    },
                    {
                        internalType: "uint256",
                        name: "sigDeadline",
                        type: "uint256",
                    },
                ],
                internalType: "struct IAllowanceTransfer.PermitBatch",
                name: "permitBatch",
                type: "tuple",
            },
            {
                internalType: "bytes",
                name: "signature",
                type: "bytes",
            },
        ],
        name: "permit",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "owner",
                type: "address",
            },
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
                                internalType: "uint160",
                                name: "amount",
                                type: "uint160",
                            },
                            {
                                internalType: "uint48",
                                name: "expiration",
                                type: "uint48",
                            },
                            {
                                internalType: "uint48",
                                name: "nonce",
                                type: "uint48",
                            },
                        ],
                        internalType: "struct IAllowanceTransfer.PermitDetails",
                        name: "details",
                        type: "tuple",
                    },
                    {
                        internalType: "address",
                        name: "spender",
                        type: "address",
                    },
                    {
                        internalType: "uint256",
                        name: "sigDeadline",
                        type: "uint256",
                    },
                ],
                internalType: "struct IAllowanceTransfer.PermitSingle",
                name: "permitSingle",
                type: "tuple",
            },
            {
                internalType: "bytes",
                name: "signature",
                type: "bytes",
            },
        ],
        name: "permit",
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
    {
        inputs: [
            {
                components: [
                    {
                        internalType: "address",
                        name: "from",
                        type: "address",
                    },
                    {
                        internalType: "address",
                        name: "to",
                        type: "address",
                    },
                    {
                        internalType: "uint160",
                        name: "amount",
                        type: "uint160",
                    },
                    {
                        internalType: "address",
                        name: "token",
                        type: "address",
                    },
                ],
                internalType: "struct IAllowanceTransfer.AllowanceTransferDetails[]",
                name: "transferDetails",
                type: "tuple[]",
            },
        ],
        name: "transferFrom",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "from",
                type: "address",
            },
            {
                internalType: "address",
                name: "to",
                type: "address",
            },
            {
                internalType: "uint160",
                name: "amount",
                type: "uint160",
            },
            {
                internalType: "address",
                name: "token",
                type: "address",
            },
        ],
        name: "transferFrom",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
];
const _bytecode = "0x60c060405234801561001057600080fd5b504660a0818152604080517f8cad95687ba82c2ce50e74f7b754645e5117c3a5bec8151c0726d5857980a8666020808301919091527f9ac997416e8ff9d2ff6bebeb7149f65cdae5e32e2b90440b566bb3044041d36a828401526060820194909452306080808301919091528251808303909101815292019052805191012060805260805160a051611de96100b760003960006103cd015260006104440152611de96000f3fe608060405234801561001057600080fd5b50600436106100cf5760003560e01c80633ff9dcb11161008c57806387517c451161006657806387517c451461019e578063927da105146101b1578063cc53287f14610234578063edd9444b1461024757600080fd5b80633ff9dcb1146101505780634fe02b441461016357806365d9723c1461018b57600080fd5b80630d58b1db146100d45780632a2d80d1146100e95780632b67b570146100fc57806330f28b7a1461010f5780633644e5151461012257806336c785161461013d575b600080fd5b6100e76100e23660046113e5565b61025a565b005b6100e76100f73660046115f3565b6102bd565b6100e761010a366004611719565b61035d565b6100e761011d366004611804565b6103ac565b61012a6103c9565b6040519081526020015b60405180910390f35b6100e761014b3660046118b4565b610466565b6100e761015e366004611910565b610472565b61012a610171366004611932565b600060208181529281526040808220909352908152205481565b6100e761019936600461195e565b6104cb565b6100e76101ac3660046119a5565b610603565b6102066101bf3660046119ff565b60016020908152600093845260408085208252928452828420905282529020546001600160a01b0381169065ffffffffffff600160a01b8204811691600160d01b90041683565b604080516001600160a01b03909416845265ffffffffffff9283166020850152911690820152606001610134565b6100e7610242366004611a8e565b610698565b6100e7610255366004611acf565b610785565b8060005b818110156102b757600084848381811061027a5761027a611c17565b9050608002018036038101906102909190611c2d565b90506102ae81600001518260200151836040015184606001516107a4565b5060010161025e565b50505050565b82604001514211156102f357826040015160405163cd21db4f60e01b81526004016102ea91815260200190565b60405180910390fd5b6103116103076103028561088c565b6109d9565b8390839087610a21565b602083015183515160005b818110156103545761034c8660000151828151811061033d5761033d611c17565b60200260200101518885610c3f565b60010161031c565b50505050505050565b826040015142111561038a57826040015160405163cd21db4f60e01b81526004016102ea91815260200190565b61039961030761030285610d45565b6102b78360000151858560200151610c3f565b6103c28585856103bb89610dcb565b8686610e35565b5050505050565b60007f000000000000000000000000000000000000000000000000000000000000000046146104415761043c7f8cad95687ba82c2ce50e74f7b754645e5117c3a5bec8151c0726d5857980a8667f9ac997416e8ff9d2ff6bebeb7149f65cdae5e32e2b90440b566bb3044041d36a610ee1565b905090565b507f000000000000000000000000000000000000000000000000000000000000000090565b6102b7848484846107a4565b3360008181526020818152604080832086845282529182902080548517905581518581529081018490527f3704902f963766a4e561bbaab6e6cdc1b1dd12f6e9e99648da8843b3f46b918d910160405180910390a25050565b3360009081526001602090815260408083206001600160a01b038781168552908352818420908616845290915290205465ffffffffffff600160d01b9091048116908216811061052e57604051633ab3447f60e11b815260040160405180910390fd5b80820361ffff65ffffffffffff8216111561055c57604051631269ad1360e11b815260040160405180910390fd5b503360008181526001602090815260408083206001600160a01b03898116808652918452828520908916808652935292819020805465ffffffffffff8816600160d01b026001600160d01b03909116179055519092907f55eb90d810e1700b35a8e7e25395ff7f2b2259abd7415ca2284dfb1c246418f3906105f5908790879065ffffffffffff92831681529116602082015260400190565b60405180910390a450505050565b3360009081526001602090815260408083206001600160a01b0388811685529083528184209087168452909152902061063d818484610f23565b604080516001600160a01b03858116825265ffffffffffff85166020830152808716929088169133917fda9fa7c1b00402c17d0161b249b1ab8bbec047c5a52207b9c112deffd817036b910160405180910390a45050505050565b338160005b818110156103c25760008585838181106106b9576106b9611c17565b6106cf9260206040909202019081019150611cb1565b905060008686848181106106e5576106e5611c17565b90506040020160200160208101906106fd9190611cb1565b6001600160a01b0386811660008181526001602090815260408083208886168085529083528184209587168085529583529281902080546001600160a01b0319169055805192835290820193909352929350917f89b1add15eff56b3dfe299ad94e01f2b52fbcb80ae1a3baea6ae8c04cb2b98a4910160405180910390a2505060010161069d565b61079c868686866107958b610f7a565b87876110a2565b505050505050565b6001600160a01b03848116600090815260016020908152604080832093851683529281528282203383529052208054600160a01b900465ffffffffffff16421115610815578054604051636c0d979760e11b8152600160a01b90910465ffffffffffff1660048201526024016102ea565b80546001600160a01b039081169081146108725780846001600160a01b031611156108565760405163f96fb07160e01b8152600481018290526024016102ea565b81546001600160a01b0319168482036001600160a01b03161782555b61079c6001600160a01b03848116908890889088166111e3565b80515160009081816001600160401b038111156108ab576108ab611481565b6040519080825280602002602001820160405280156108d4578160200160208202803683370190505b50905060005b8281101561093557610908856000015182815181106108fb576108fb611c17565b6020026020010151611266565b82828151811061091a5761091a611c17565b602090810291909101015261092e81611ceb565b90506108da565b507faf1b0d30d2cab0380e68f0689007e3254993c596f2fdd0aaa7f4d04f79440863816040516020016109689190611d04565b60405160208183030381529060405280519060200120856020015186604001516040516020016109ba949392919093845260208401929092526001600160a01b03166040830152606082015260800190565b6040516020818303038152906040528051906020012092505050919050565b60006109e36103c9565b60405161190160f01b60208201526022810191909152604281018390526062015b604051602081830303815290604052805190602001209050919050565b6000806000836001600160a01b03163b600003610b8e576041869003610a7657610a4d86880188611910565b909350915086866040818110610a6557610a65611c17565b919091013560f81c9150610ace9050565b6040869003610ab5576000610a8d87890189611910565b9094506001600160ff1b03811693509050610aad60ff82901c601b611d3a565b915050610ace565b604051634be6321b60e01b815260040160405180910390fd5b6040805160008082526020820180845288905260ff841692820192909252606081018590526080810184905260019060a0016020604051602081039080840390855afa158015610b22573d6000803e3d6000fd5b5050604051601f1901519150506001600160a01b038116610b5657604051638baa579f60e01b815260040160405180910390fd5b846001600160a01b0316816001600160a01b031614610b8857604051632057875960e21b815260040160405180910390fd5b50610354565b604051630b135d3f60e11b81526000906001600160a01b03861690631626ba7e90610bc19089908c908c90600401611d53565b602060405180830381865afa158015610bde573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610c029190611d89565b90506001600160e01b03198116630b135d3f60e11b14610c3557604051632c19a72f60e21b815260040160405180910390fd5b5050505050505050565b606083015183516020808601516040808801516001600160a01b0388811660009081526001865283812082881682528652838120918916815294529220805491929165ffffffffffff808716600160d01b9092041614610cb257604051633ab3447f60e11b815260040160405180910390fd5b610cbe818484886112dd565b856001600160a01b0316846001600160a01b0316886001600160a01b03167fc6a377bfc4eb120024a8ac08eef205be16b817020812c73223e81d1bdb9708ec86868a604051610d33939291906001600160a01b0393909316835265ffffffffffff918216602084015216604082015260600190565b60405180910390a45050505050505050565b600080610d558360000151611266565b60208085015160408087015181517ff3841cd1ff0085026a6327b620b67997ce40f282c88a8e905a7a5626e310f3d0948101949094529083018490526001600160a01b039091166060830152608082015290915060a0015b60405160208183030381529060405280519060200120915050919050565b600080610ddb8360000151611333565b60208085015160408087015181517f939c21a48a8dbe3a9a2404a1d46691e4d39f6583d6ec6b35714604c986d8010694810194909452908301849052336060840152608083019190915260a082015290915060c001610dad565b6040860151602086013590421115610e6857866040015160405163cd21db4f60e01b81526004016102ea91815260200190565b865160200151811115610e9857865160200151604051633728b83d60e01b815260048101919091526024016102ea565b610ea6858860200151611387565b610ebc610eb2856109d9565b8490849088610a21565b61035485610ecd6020890189611cb1565b8951516001600160a01b03169190846111e3565b604080516020810184905290810182905246606082015230608082015260009060a0016040516020818303038152906040528051906020012090505b92915050565b65ffffffffffff811615610f375780610f39565b425b83546001600160d01b031916600160a01b65ffffffffffff92909216919091026001600160a01b031916176001600160a01b03929092169190911790915550565b80515160009081816001600160401b03811115610f9957610f99611481565b604051908082528060200260200182016040528015610fc2578160200160208202803683370190505b50905060005b8281101561102357610ff685600001518281518110610fe957610fe9611c17565b6020026020010151611333565b82828151811061100857611008611c17565b602090810291909101015261101c81611ceb565b9050610fc8565b507ffcf35f5ac6a2c28868dc44c302166470266239195f02b0ee408334829333b766816040516020016110569190611d04565b60408051601f19818403018152828252805160209182012088820151898401519285019590955291830191909152336060830152608082019290925260a081019190915260c0016109ba565b86515160408801514211156110d257876040015160405163cd21db4f60e01b81526004016102ea91815260200190565b8086146110f5576040516001621398b960e31b0319815260040160405180910390fd5b611103858960200151611387565b61110f610eb2856109d9565b60005b818110156111d85760008960000151828151811061113257611132611c17565b60200260200101519050600089898481811061115057611150611c17565b9050604002016020013590508160200151811115611189578160200151604051633728b83d60e01b81526004016102ea91815260200190565b80156111ce576111ce888b8b868181106111a5576111a5611c17565b6111bb9260206040909202019081019150611cb1565b84516001600160a01b03169190846111e3565b5050600101611112565b505050505050505050565b60006040516323b872dd60e01b81528460048201528360248201528260448201526020600060648360008a5af13d15601f3d11600160005114161716915050806103c25760405162461bcd60e51b81526020600482015260146024820152731514905394d1915497d19493d357d1905253115160621b60448201526064016102ea565b604080517f65626cad6cb96493bf6f5ebea28756c966f023ab9e8a83a7101849d5573b367860208083019190915283516001600160a01b039081168385015290840151166060808301919091529183015165ffffffffffff90811660808301529183015190911660a082015260009060c001610a04565b60018101600065ffffffffffff8416156112f757836112f9565b425b905060006001600160a01b03861660a083901b65ffffffffffff60a01b1660d085901b6001600160d01b0319161717909655505050505050565b60007f618358ac3db8dc274f0cd8829da7e234bd48cd73c4a740aede1adec9846d06a182604051602001610a0492919091825280516001600160a01b03166020808401919091520151604082015260600190565b6001600160a01b038216600090815260208181526040808320600885901c808552925282208054600160ff861690811b918218928390559293909190818316900361079c57604051633ab3447f60e11b815260040160405180910390fd5b600080602083850312156113f857600080fd5b82356001600160401b038082111561140f57600080fd5b818501915085601f83011261142357600080fd5b81358181111561143257600080fd5b8660208260071b850101111561144757600080fd5b60209290920196919550909350505050565b6001600160a01b038116811461146e57600080fd5b50565b803561147c81611459565b919050565b634e487b7160e01b600052604160045260246000fd5b604051606081016001600160401b03811182821017156114b9576114b9611481565b60405290565b604051601f8201601f191681016001600160401b03811182821017156114e7576114e7611481565b604052919050565b60006001600160401b0382111561150857611508611481565b5060051b60200190565b803565ffffffffffff8116811461147c57600080fd5b60006080828403121561153a57600080fd5b604051608081018181106001600160401b038211171561155c5761155c611481565b604052905080823561156d81611459565b8152602083013561157d81611459565b602082015261158e60408401611512565b604082015261159f60608401611512565b60608201525092915050565b60008083601f8401126115bd57600080fd5b5081356001600160401b038111156115d457600080fd5b6020830191508360208285010111156115ec57600080fd5b9250929050565b6000806000806060858703121561160957600080fd5b843561161481611459565b93506020858101356001600160401b038082111561163157600080fd5b908701906060828a03121561164557600080fd5b61164d611497565b82358281111561165c57600080fd5b8301601f81018b1361166d57600080fd5b803561168061167b826114ef565b6114bf565b81815260079190911b8201860190868101908d83111561169f57600080fd5b928701925b828410156116c8576116b68e85611528565b825287820191506080840193506116a4565b8452506116d9915050838501611471565b84820152604083013560408201528096505060408801359250808311156116ff57600080fd5b505061170d878288016115ab565b95989497509550505050565b60008060008084860361010081121561173157600080fd5b853561173c81611459565b945060c0601f198201121561175057600080fd5b50611759611497565b6117668760208801611528565b815260a086013561177681611459565b602082015260c08601356040820152925060e08501356001600160401b038111156117a057600080fd5b61170d878288016115ab565b6000604082840312156117be57600080fd5b604051604081018181106001600160401b03821117156117e0576117e0611481565b60405290508082356117f181611459565b8152602092830135920191909152919050565b600080600080600085870361010081121561181e57600080fd5b608081121561182c57600080fd5b611834611497565b61183e89896117ac565b81526040888101356020830152606089013581830152909650607f198201121561186757600080fd5b5060808601935060c086013561187c81611459565b925060e08601356001600160401b0381111561189757600080fd5b6118a3888289016115ab565b969995985093965092949392505050565b600080600080608085870312156118ca57600080fd5b84356118d581611459565b935060208501356118e581611459565b925060408501356118f581611459565b9150606085013561190581611459565b939692955090935050565b6000806040838503121561192357600080fd5b50508035926020909101359150565b6000806040838503121561194557600080fd5b823561195081611459565b946020939093013593505050565b60008060006060848603121561197357600080fd5b833561197e81611459565b9250602084013561198e81611459565b915061199c60408501611512565b90509250925092565b600080600080608085870312156119bb57600080fd5b84356119c681611459565b935060208501356119d681611459565b925060408501356119e681611459565b91506119f460608601611512565b905092959194509250565b600080600060608486031215611a1457600080fd5b8335611a1f81611459565b92506020840135611a2f81611459565b91506040840135611a3f81611459565b809150509250925092565b60008083601f840112611a5c57600080fd5b5081356001600160401b03811115611a7357600080fd5b6020830191508360208260061b85010111156115ec57600080fd5b60008060208385031215611aa157600080fd5b82356001600160401b03811115611ab757600080fd5b611ac385828601611a4a565b90969095509350505050565b60008060008060008060808789031215611ae857600080fd5b6001600160401b038088351115611afe57600080fd5b873588016060818b031215611b1257600080fd5b611b1a611497565b8282351115611b2857600080fd5b813582018b601f820112611b3b57600080fd5b8035611b4961167b826114ef565b8082825260208201915060208360061b85010192508e831115611b6b57600080fd5b6020840193505b82841015611b9757611b848f856117ac565b8252602082019150604084019350611b72565b84525050506020828101358183015260409283013592820192909252975088013581811115611bc557600080fd5b611bd18a828b01611a4a565b9097509550611be4905060408901611471565b9350606088013581811115611bf857600080fd5b611c048a828b016115ab565b989b979a50959850939694959350505050565b634e487b7160e01b600052603260045260246000fd5b600060808284031215611c3f57600080fd5b604051608081018181106001600160401b0382111715611c6157611c61611481565b6040528235611c6f81611459565b81526020830135611c7f81611459565b60208201526040830135611c9281611459565b60408201526060830135611ca581611459565b60608201529392505050565b600060208284031215611cc357600080fd5b8135611cce81611459565b9392505050565b634e487b7160e01b600052601160045260246000fd5b600060018201611cfd57611cfd611cd5565b5060010190565b815160009082906020808601845b83811015611d2e57815185529382019390820190600101611d12565b50929695505050505050565b60ff8181168382160190811115610f1d57610f1d611cd5565b83815260406020820152816040820152818360608301376000818301606090810191909152601f909201601f1916010192915050565b600060208284031215611d9b57600080fd5b81516001600160e01b031981168114611cce57600080fdfea264697066735822122006fc79187ae0535cc082343b4c6f769e8de40290e02eb8786d4de1c5155618c664736f6c63430008110033";
const isSuperArgs = (xs) => xs.length > 1;
class Permit2__factory extends ethers_1.ContractFactory {
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
exports.Permit2__factory = Permit2__factory;
Permit2__factory.bytecode = _bytecode;
Permit2__factory.abi = _abi;
//# sourceMappingURL=Permit2__factory.js.map