"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllowanceTransfer__factory = void 0;
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
const _bytecode = "0x60c060405234801561001057600080fd5b504660a0818152604080517f8cad95687ba82c2ce50e74f7b754645e5117c3a5bec8151c0726d5857980a8666020808301919091527f9ac997416e8ff9d2ff6bebeb7149f65cdae5e32e2b90440b566bb3044041d36a828401526060820194909452306080808301919091528251808303909101815292019052805191012060805260805160a0516115ef6100b760003960006103120152600061038901526115ef6000f3fe608060405234801561001057600080fd5b50600436106100935760003560e01c806336c785161161006657806336c78516146100ee57806365d9723c1461010157806387517c4514610114578063927da10514610127578063cc53287f146101a957600080fd5b80630d58b1db146100985780632a2d80d1146100ad5780632b67b570146100c05780633644e515146100d3575b600080fd5b6100ab6100a6366004610e85565b6101bc565b005b6100ab6100bb366004611075565b61021f565b6100ab6100ce3660046111a9565b6102bf565b6100db61030e565b6040519081526020015b60405180910390f35b6100ab6100fc36600461124f565b6103ab565b6100ab61010f3660046112ab565b6103b7565b6100ab6101223660046112f2565b6104eb565b61017b61013536600461134c565b600060208181529381526040808220855292815282812090935282529020546001600160a01b0381169065ffffffffffff600160a01b8204811691600160d01b90041683565b604080516001600160a01b03909416845265ffffffffffff92831660208501529116908201526060016100e5565b6100ab6101b7366004611397565b61057e565b8060005b818110156102195760008484838181106101dc576101dc6113fa565b9050608002018036038101906101f29190611410565b90506102108160000151826020015183604001518460600151610670565b506001016101c0565b50505050565b826040015142111561025557826040015160405163cd21db4f60e01b815260040161024c91815260200190565b60405180910390fd5b6102736102696102648561075e565b6108ac565b83908390876108f4565b602083015183515160005b818110156102b6576102ae8660000151828151811061029f5761029f6113fa565b60200260200101518885610b12565b60010161027e565b50505050505050565b82604001514211156102ec57826040015160405163cd21db4f60e01b815260040161024c91815260200190565b6102fb61026961026485610c17565b6102198360000151858560200151610b12565b60007f00000000000000000000000000000000000000000000000000000000000000004614610386576103817f8cad95687ba82c2ce50e74f7b754645e5117c3a5bec8151c0726d5857980a8667f9ac997416e8ff9d2ff6bebeb7149f65cdae5e32e2b90440b566bb3044041d36a610c9c565b905090565b507f000000000000000000000000000000000000000000000000000000000000000090565b61021984848484610670565b336000908152602081815260408083206001600160a01b038781168552908352818420908616845290915290205465ffffffffffff600160d01b9091048116908216811061041857604051633ab3447f60e11b815260040160405180910390fd5b80820361ffff65ffffffffffff8216111561044657604051631269ad1360e11b815260040160405180910390fd5b50336000818152602081815260408083206001600160a01b03898116808652918452828520908916808652935292819020805465ffffffffffff8816600160d01b026001600160d01b03909116179055519092907f55eb90d810e1700b35a8e7e25395ff7f2b2259abd7415ca2284dfb1c246418f3906104dd908790879065ffffffffffff92831681529116602082015260400190565b60405180910390a450505050565b336000908152602081815260408083206001600160a01b03888116855290835281842090871684529091529020610523818484610cde565b604080516001600160a01b03858116825265ffffffffffff85166020830152808716929088169133917fda9fa7c1b00402c17d0161b249b1ab8bbec047c5a52207b9c112deffd817036b910160405180910390a45050505050565b338160005b8181101561066957600085858381811061059f5761059f6113fa565b6105b59260206040909202019081019150611495565b905060008686848181106105cb576105cb6113fa565b90506040020160200160208101906105e39190611495565b6001600160a01b038681166000818152602081815260408083208886168085529083528184209587168085529583529281902080546001600160a01b0319169055805192835290820193909352929350917f89b1add15eff56b3dfe299ad94e01f2b52fbcb80ae1a3baea6ae8c04cb2b98a4910160405180910390a25050600101610583565b5050505050565b6001600160a01b0384811660009081526020818152604080832093851683529281528282203383529052208054600160a01b900465ffffffffffff164211156106df578054604051636c0d979760e11b8152600160a01b90910465ffffffffffff16600482015260240161024c565b80546001600160a01b0390811690811461073c5780846001600160a01b031611156107205760405163f96fb07160e01b81526004810182905260240161024c565b81546001600160a01b0319168482036001600160a01b03161782555b6107566001600160a01b0384811690889088908816610d35565b505050505050565b805151600090818167ffffffffffffffff81111561077e5761077e610f22565b6040519080825280602002602001820160405280156107a7578160200160208202803683370190505b50905060005b82811015610808576107db856000015182815181106107ce576107ce6113fa565b6020026020010151610db8565b8282815181106107ed576107ed6113fa565b6020908102919091010152610801816114cf565b90506107ad565b507faf1b0d30d2cab0380e68f0689007e3254993c596f2fdd0aaa7f4d04f794408638160405160200161083b91906114e8565b604051602081830303815290604052805190602001208560200151866040015160405160200161088d949392919093845260208401929092526001600160a01b03166040830152606082015260800190565b6040516020818303038152906040528051906020012092505050919050565b60006108b661030e565b60405161190160f01b60208201526022810191909152604281018390526062015b604051602081830303815290604052805190602001209050919050565b6000806000836001600160a01b03163b600003610a61576041869003610949576109208688018861151e565b909350915086866040818110610938576109386113fa565b919091013560f81c91506109a19050565b60408690036109885760006109608789018961151e565b9094506001600160ff1b0381169350905061098060ff82901c601b611540565b9150506109a1565b604051634be6321b60e01b815260040160405180910390fd5b6040805160008082526020820180845288905260ff841692820192909252606081018590526080810184905260019060a0016020604051602081039080840390855afa1580156109f5573d6000803e3d6000fd5b5050604051601f1901519150506001600160a01b038116610a2957604051638baa579f60e01b815260040160405180910390fd5b846001600160a01b0316816001600160a01b031614610a5b57604051632057875960e21b815260040160405180910390fd5b506102b6565b604051630b135d3f60e11b81526000906001600160a01b03861690631626ba7e90610a949089908c908c90600401611559565b602060405180830381865afa158015610ab1573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610ad5919061158f565b90506001600160e01b03198116630b135d3f60e11b14610b0857604051632c19a72f60e21b815260040160405180910390fd5b5050505050505050565b606083015183516020808601516040808801516001600160a01b03888116600090815280865283812082881682528652838120918916815294529220805491929165ffffffffffff808716600160d01b9092041614610b8457604051633ab3447f60e11b815260040160405180910390fd5b610b9081848488610e2f565b856001600160a01b0316846001600160a01b0316886001600160a01b03167fc6a377bfc4eb120024a8ac08eef205be16b817020812c73223e81d1bdb9708ec86868a604051610c05939291906001600160a01b0393909316835265ffffffffffff918216602084015216604082015260600190565b60405180910390a45050505050505050565b600080610c278360000151610db8565b60208085015160408087015181517ff3841cd1ff0085026a6327b620b67997ce40f282c88a8e905a7a5626e310f3d0948101949094529083018490526001600160a01b039091166060830152608082015290915060a00160405160208183030381529060405280519060200120915050919050565b604080516020810184905290810182905246606082015230608082015260009060a0016040516020818303038152906040528051906020012090505b92915050565b65ffffffffffff811615610cf25780610cf4565b425b83546001600160d01b031916600160a01b65ffffffffffff92909216919091026001600160a01b031916176001600160a01b03929092169190911790915550565b60006040516323b872dd60e01b81528460048201528360248201528260448201526020600060648360008a5af13d15601f3d11600160005114161716915050806106695760405162461bcd60e51b81526020600482015260146024820152731514905394d1915497d19493d357d1905253115160621b604482015260640161024c565b604080517f65626cad6cb96493bf6f5ebea28756c966f023ab9e8a83a7101849d5573b367860208083019190915283516001600160a01b039081168385015290840151166060808301919091529183015165ffffffffffff90811660808301529183015190911660a082015260009060c0016108d7565b60018101600065ffffffffffff841615610e495783610e4b565b425b905060006001600160a01b03861660a083901b65ffffffffffff60a01b1660d085901b6001600160d01b0319161717909655505050505050565b60008060208385031215610e9857600080fd5b823567ffffffffffffffff80821115610eb057600080fd5b818501915085601f830112610ec457600080fd5b813581811115610ed357600080fd5b8660208260071b8501011115610ee857600080fd5b60209290920196919550909350505050565b6001600160a01b0381168114610f0f57600080fd5b50565b8035610f1d81610efa565b919050565b634e487b7160e01b600052604160045260246000fd5b6040516060810167ffffffffffffffff81118282101715610f5b57610f5b610f22565b60405290565b604051601f8201601f1916810167ffffffffffffffff81118282101715610f8a57610f8a610f22565b604052919050565b803565ffffffffffff81168114610f1d57600080fd5b600060808284031215610fba57600080fd5b6040516080810181811067ffffffffffffffff82111715610fdd57610fdd610f22565b6040529050808235610fee81610efa565b81526020830135610ffe81610efa565b602082015261100f60408401610f92565b604082015261102060608401610f92565b60608201525092915050565b60008083601f84011261103e57600080fd5b50813567ffffffffffffffff81111561105657600080fd5b60208301915083602082850101111561106e57600080fd5b9250929050565b6000806000806060858703121561108b57600080fd5b843561109681610efa565b935060208581013567ffffffffffffffff808211156110b457600080fd5b908701906060828a0312156110c857600080fd5b6110d0610f38565b8235828111156110df57600080fd5b8301601f81018b136110f057600080fd5b80358381111561110257611102610f22565b611110868260051b01610f61565b81815260079190911b8201860190868101908d83111561112f57600080fd5b928701925b82841015611158576111468e85610fa8565b82528782019150608084019350611134565b845250611169915050838501610f12565b848201526040830135604082015280965050604088013592508083111561118f57600080fd5b505061119d8782880161102c565b95989497509550505050565b6000806000808486036101008112156111c157600080fd5b85356111cc81610efa565b945060c0601f19820112156111e057600080fd5b506040516060810167ffffffffffffffff828210818311171561120557611205610f22565b816040526112168960208a01610fa8565b835260a0880135915061122882610efa565b81602084015260c0880135604084015282955060e088013592508083111561118f57600080fd5b6000806000806080858703121561126557600080fd5b843561127081610efa565b9350602085013561128081610efa565b9250604085013561129081610efa565b915060608501356112a081610efa565b939692955090935050565b6000806000606084860312156112c057600080fd5b83356112cb81610efa565b925060208401356112db81610efa565b91506112e960408501610f92565b90509250925092565b6000806000806080858703121561130857600080fd5b843561131381610efa565b9350602085013561132381610efa565b9250604085013561133381610efa565b915061134160608601610f92565b905092959194509250565b60008060006060848603121561136157600080fd5b833561136c81610efa565b9250602084013561137c81610efa565b9150604084013561138c81610efa565b809150509250925092565b600080602083850312156113aa57600080fd5b823567ffffffffffffffff808211156113c257600080fd5b818501915085601f8301126113d657600080fd5b8135818111156113e557600080fd5b8660208260061b8501011115610ee857600080fd5b634e487b7160e01b600052603260045260246000fd5b60006080828403121561142257600080fd5b6040516080810181811067ffffffffffffffff8211171561144557611445610f22565b604052823561145381610efa565b8152602083013561146381610efa565b6020820152604083013561147681610efa565b6040820152606083013561148981610efa565b60608201529392505050565b6000602082840312156114a757600080fd5b81356114b281610efa565b9392505050565b634e487b7160e01b600052601160045260246000fd5b6000600182016114e1576114e16114b9565b5060010190565b815160009082906020808601845b83811015611512578151855293820193908201906001016114f6565b50929695505050505050565b6000806040838503121561153157600080fd5b50508035926020909101359150565b60ff8181168382160190811115610cd857610cd86114b9565b83815260406020820152816040820152818360608301376000818301606090810191909152601f909201601f1916010192915050565b6000602082840312156115a157600080fd5b81516001600160e01b0319811681146114b257600080fdfea264697066735822122052a76d6e5e838a86719011d35c0e8d9e1e430da9ee0cc9633c09b24c21ef90ff64736f6c63430008110033";
const isSuperArgs = (xs) => xs.length > 1;
class AllowanceTransfer__factory extends ethers_1.ContractFactory {
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
exports.AllowanceTransfer__factory = AllowanceTransfer__factory;
AllowanceTransfer__factory.bytecode = _bytecode;
AllowanceTransfer__factory.abi = _abi;
//# sourceMappingURL=AllowanceTransfer__factory.js.map