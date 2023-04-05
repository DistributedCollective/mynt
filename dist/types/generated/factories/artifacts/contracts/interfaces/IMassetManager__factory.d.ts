import { Signer } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type { IMassetManager, IMassetManagerInterface } from "../../../../artifacts/contracts/interfaces/IMassetManager";
export declare class IMassetManager__factory {
    static readonly abi: readonly [{
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "minter";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "recipient";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "massetQuantity";
            readonly type: "uint256";
        }, {
            readonly indexed: false;
            readonly internalType: "address";
            readonly name: "bAsset";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "bassetQuantity";
            readonly type: "uint256";
        }];
        readonly name: "Minted";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "redeemer";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "recipient";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "massetQuantity";
            readonly type: "uint256";
        }, {
            readonly indexed: false;
            readonly internalType: "address";
            readonly name: "bAsset";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "bassetQuantity";
            readonly type: "uint256";
        }];
        readonly name: "Redeemed";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "sender";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "orderAmount";
            readonly type: "uint256";
        }, {
            readonly indexed: false;
            readonly internalType: "address";
            readonly name: "tokenAddress";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "bytes";
            readonly name: "userData";
            readonly type: "bytes";
        }];
        readonly name: "onTokensMintedCalled";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: false;
            readonly internalType: "address";
            readonly name: "operator";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "address";
            readonly name: "from";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "address";
            readonly name: "to";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "uint256";
            readonly name: "amount";
            readonly type: "uint256";
        }, {
            readonly indexed: false;
            readonly internalType: "bytes";
            readonly name: "userData";
            readonly type: "bytes";
        }, {
            readonly indexed: false;
            readonly internalType: "bytes";
            readonly name: "operatorData";
            readonly type: "bytes";
        }];
        readonly name: "onTokensReceivedCalled";
        readonly type: "event";
    }, {
        readonly inputs: readonly [];
        readonly name: "getBasketManager";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "getFeesManager";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "getFeesVault";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
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
        readonly inputs: readonly [];
        readonly name: "getToken";
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
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "_bAsset";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "_bAssetQuantity";
            readonly type: "uint256";
        }];
        readonly name: "mint";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "massetMinted";
            readonly type: "uint256";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "_bAsset";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "_bAssetQuantity";
            readonly type: "uint256";
        }, {
            readonly internalType: "address";
            readonly name: "_recipient";
            readonly type: "address";
        }];
        readonly name: "mintTo";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "massetMinted";
            readonly type: "uint256";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "_orderAmount";
            readonly type: "uint256";
        }, {
            readonly internalType: "address";
            readonly name: "_tokenAddress";
            readonly type: "address";
        }, {
            readonly internalType: "bytes";
            readonly name: "_userData";
            readonly type: "bytes";
        }];
        readonly name: "onTokensMinted";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "_bAsset";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "_massetQuantity";
            readonly type: "uint256";
        }];
        readonly name: "redeem";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "massetRedeemed";
            readonly type: "uint256";
        }];
        readonly stateMutability: "nonpayable";
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
        }, {
            readonly internalType: "address";
            readonly name: "_recipient";
            readonly type: "address";
        }];
        readonly name: "redeemByBridge";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "massetRedeemed";
            readonly type: "uint256";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "_bAsset";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "_massetQuantity";
            readonly type: "uint256";
        }, {
            readonly internalType: "address";
            readonly name: "_recipient";
            readonly type: "address";
        }];
        readonly name: "redeemTo";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "massetRedeemed";
            readonly type: "uint256";
        }];
        readonly stateMutability: "nonpayable";
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
        }, {
            readonly internalType: "address";
            readonly name: "_recipient";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "_bridgeAddress";
            readonly type: "address";
        }];
        readonly name: "redeemToBridge";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "massetRedeemed";
            readonly type: "uint256";
        }];
        readonly stateMutability: "nonpayable";
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
        }, {
            readonly internalType: "address";
            readonly name: "_recipient";
            readonly type: "address";
        }];
        readonly name: "redeemToBridge";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "massetRedeemed";
            readonly type: "uint256";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "_operator";
            readonly type: "address";
        }, {
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
            readonly internalType: "bytes";
            readonly name: "_userData";
            readonly type: "bytes";
        }, {
            readonly internalType: "bytes";
            readonly name: "_operatorData";
            readonly type: "bytes";
        }];
        readonly name: "tokensReceived";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }];
    static createInterface(): IMassetManagerInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): IMassetManager;
}
