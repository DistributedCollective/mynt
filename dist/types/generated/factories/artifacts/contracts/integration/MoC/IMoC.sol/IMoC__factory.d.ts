import { Signer } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type { IMoC, IMoCInterface } from "../../../../../../artifacts/contracts/integration/MoC/IMoC.sol/IMoC";
export declare class IMoC__factory {
    static readonly abi: readonly [{
        readonly inputs: readonly [{
            readonly internalType: "bool";
            readonly name: "isAddition";
            readonly type: "bool";
        }, {
            readonly internalType: "uint256";
            readonly name: "delta";
            readonly type: "uint256";
        }];
        readonly name: "alterRedeemRequestAmount";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "redeemer";
            readonly type: "address";
        }];
        readonly name: "docAmountToRedeem";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "btcToMint";
            readonly type: "uint256";
        }];
        readonly name: "mintDoc";
        readonly outputs: readonly [];
        readonly stateMutability: "payable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "btcToMint";
            readonly type: "uint256";
        }, {
            readonly internalType: "address payable";
            readonly name: "vendorAccount";
            readonly type: "address";
        }];
        readonly name: "mintDocVendors";
        readonly outputs: readonly [];
        readonly stateMutability: "payable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "redeemAllDoc";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "docAmount";
            readonly type: "uint256";
        }];
        readonly name: "redeemDocRequest";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "docAmount";
            readonly type: "uint256";
        }];
        readonly name: "redeemFreeDoc";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "docAmount";
            readonly type: "uint256";
        }, {
            readonly internalType: "address payable";
            readonly name: "vendorAccount";
            readonly type: "address";
        }];
        readonly name: "redeemFreeDocVendors";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }];
    static createInterface(): IMoCInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): IMoC;
}
