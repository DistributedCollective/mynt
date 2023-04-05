import { Signer, ContractFactory, BigNumberish, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../../common";
import type { BasketManager, BasketManagerInterface } from "../../../../../artifacts/contracts/masset/versions/BasketManager";
type BasketManagerConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class BasketManager__factory extends ContractFactory {
    constructor(...args: BasketManagerConstructorParams);
    deploy(_bassets: PromiseOrValue<string>[], _factors: PromiseOrValue<BigNumberish>[], _bridges: PromiseOrValue<string>[], overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<BasketManager>;
    getDeployTransaction(_bassets: PromiseOrValue<string>[], _factors: PromiseOrValue<BigNumberish>[], _bridges: PromiseOrValue<string>[], overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): TransactionRequest;
    attach(address: string): BasketManager;
    connect(signer: Signer): BasketManager__factory;
    static readonly bytecode = "0x60806040523480156200001157600080fd5b5060405162000a9038038062000a90833981016040819052620000349162000521565b60008351116200008b5760405162461bcd60e51b815260206004820152601460248201527f736f6d652062617373657420726571756972656400000000000000000000000060448201526064015b60405180910390fd5b8151835114620000de5760405162461bcd60e51b815260206004820152601c60248201527f666163746f72206172726179206c656e677468206d69736d6174636800000000604482015260640162000082565b8151815114620001315760405162461bcd60e51b815260206004820152601c60248201527f627269646765206172726179206c656e677468206d69736d6174636800000000604482015260640162000082565b825162000146906000906020860190620003a7565b5060005b6000548110156200039d5760008082815481106200016c576200016c6200060c565b6000918252602090912001546001600160a01b0316905080620001d25760405162461bcd60e51b815260206004820152601660248201527f696e76616c696420626173736574206164647265737300000000000000000000604482015260640162000082565b6001600160a01b03811660009081526001602052604090205460ff1615620002315760405162461bcd60e51b8152602060048201526011602482015270626173736574206e6f7420756e6971756560781b604482015260640162000082565b6001600160a01b0381166000908152600160208190526040909120805460ff1916909117905583518490839081106200026e576200026e6200060c565b6020026020010151600003620002b85760405162461bcd60e51b815260206004820152600e60248201526d34b73b30b634b2103330b1ba37b960911b604482015260640162000082565b838281518110620002cd57620002cd6200060c565b6020908102919091018101516001600160a01b03831660009081526002909252604082205583518490849081106200030957620003096200060c565b60200260200101516001600160a01b03161462000387578282815181106200033557620003356200060c565b602002602001015160036000836001600160a01b03166001600160a01b0316815260200190815260200160002060006101000a8154816001600160a01b0302191690836001600160a01b031602179055505b5080620003948162000622565b9150506200014a565b505050506200064a565b828054828255906000526020600020908101928215620003ff579160200282015b82811115620003ff57825182546001600160a01b0319166001600160a01b03909116178255602090920191600190910190620003c8565b506200040d92915062000411565b5090565b5b808211156200040d576000815560010162000412565b634e487b7160e01b600052604160045260246000fd5b604051601f8201601f191681016001600160401b038111828210171562000469576200046962000428565b604052919050565b60006001600160401b038211156200048d576200048d62000428565b5060051b60200190565b600082601f830112620004a957600080fd5b81516020620004c2620004bc8362000471565b6200043e565b82815260059290921b84018101918181019086841115620004e257600080fd5b8286015b84811015620005165780516001600160a01b0381168114620005085760008081fd5b8352918301918301620004e6565b509695505050505050565b6000806000606084860312156200053757600080fd5b83516001600160401b03808211156200054f57600080fd5b6200055d8783880162000497565b94506020915081860151818111156200057557600080fd5b8601601f810188136200058757600080fd5b805162000598620004bc8262000471565b81815260059190911b8201840190848101908a831115620005b857600080fd5b928501925b82841015620005d857835182529285019290850190620005bd565b60408a0151909750945050505080821115620005f357600080fd5b50620006028682870162000497565b9150509250925092565b634e487b7160e01b600052603260045260246000fd5b6000600182016200064357634e487b7160e01b600052601160045260246000fd5b5060010190565b610436806200065a6000396000f3fe608060405234801561001057600080fd5b506004361061007d5760003560e01c8063a9f02efe1161005b578063a9f02efe146100e4578063c7bbc865146100e4578063d80f5a8714610107578063f44c7c8f1461011a57600080fd5b80630d8e6e2c146100825780631af327bd146100b05780635ac99461146100d1575b600080fd5b60408051808201825260038152620322e360ec1b602082015290516100a791906102e6565b60405180910390f35b6100c36100be366004610350565b61015e565b6040519081526020016100a7565b6100c36100df366004610350565b6101fb565b6100f76100f2366004610350565b610281565b60405190151581526020016100a7565b6100f761011536600461037a565b610293565b61014661012836600461037a565b6001600160a01b039081166000908152600360205260409020541690565b6040516001600160a01b0390911681526020016100a7565b60006101698361029a565b6101ab5760405162461bcd60e51b815260206004820152600e60248201526d1a5b9d985b1a590818985cdcd95d60921b60448201526064015b60405180910390fd5b6001600160a01b038316600090815260026020526040812054908113156101de576101d683826102ce565b9150506101f5565b6101f16101ea826103ab565b84906102da565b9150505b92915050565b60006102068361029a565b6102435760405162461bcd60e51b815260206004820152600e60248201526d1a5b9d985b1a590818985cdcd95d60921b60448201526064016101a2565b6001600160a01b0383166000908152600260205260408120549081131561026e576101d683826102da565b6101f161027a826103ab565b84906102ce565b600061028c8361029a565b9392505050565b60006101f5825b60006001600160a01b038216158015906101f55750506001600160a01b031660009081526001602052604090205460ff1690565b600061028c82846103c7565b600061028c82846103e9565b600060208083528351808285015260005b81811015610313578581018301518582016040015282016102f7565b506000604082860101526040601f19601f8301168501019250505092915050565b80356001600160a01b038116811461034b57600080fd5b919050565b6000806040838503121561036357600080fd5b61036c83610334565b946020939093013593505050565b60006020828403121561038c57600080fd5b61028c82610334565b634e487b7160e01b600052601160045260246000fd5b6000600160ff1b82016103c0576103c0610395565b5060000390565b6000826103e457634e487b7160e01b600052601260045260246000fd5b500490565b80820281158282048414176101f5576101f561039556fea264697066735822122002ff87ad5954af9cdfbc04b7868a41fb33a38f76cc3310c31d556ab1c564b38264736f6c63430008110033";
    static readonly abi: readonly [{
        readonly inputs: readonly [{
            readonly internalType: "address[]";
            readonly name: "_bassets";
            readonly type: "address[]";
        }, {
            readonly internalType: "int256[]";
            readonly name: "_factors";
            readonly type: "int256[]";
        }, {
            readonly internalType: "address[]";
            readonly name: "_bridges";
            readonly type: "address[]";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "constructor";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "_basset";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly name: "checkBasketBalanceForDeposit";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "_basset";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly name: "checkBasketBalanceForWithdrawal";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "_basset";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "_bassetQuantity";
            readonly type: "uint256";
        }];
        readonly name: "convertBassetToMassetQuantity";
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
            readonly name: "_basset";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "_massetQuantity";
            readonly type: "uint256";
        }];
        readonly name: "convertMassetToBassetQuantity";
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
            readonly name: "_basset";
            readonly type: "address";
        }];
        readonly name: "getBridge";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "getVersion";
        readonly outputs: readonly [{
            readonly internalType: "string";
            readonly name: "";
            readonly type: "string";
        }];
        readonly stateMutability: "pure";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "_basset";
            readonly type: "address";
        }];
        readonly name: "isValidBasset";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }];
    static createInterface(): BasketManagerInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): BasketManager;
}
export {};
