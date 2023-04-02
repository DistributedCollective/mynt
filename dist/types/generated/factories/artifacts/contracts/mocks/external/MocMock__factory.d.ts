import { Signer, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../../common";
import type { MocMock, MocMockInterface } from "../../../../../artifacts/contracts/mocks/external/MocMock";
type MocMockConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class MocMock__factory extends ContractFactory {
    constructor(...args: MocMockConstructorParams);
    deploy(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<MocMock>;
    getDeployTransaction(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): TransactionRequest;
    attach(address: string): MocMock;
    connect(signer: Signer): MocMock__factory;
    static readonly bytecode = "0x60806040526538d7ea4c680060005534801561001a57600080fd5b506102c78061002a6000396000f3fe608060405234801561001057600080fd5b506004361061004c5760003560e01c8063695f9e401461005157806377d476441461006c578063827414dc14610081578063b7aa53e714610094575b600080fd5b61005a60005481565b60405190815260200160405180910390f35b61007f61007a3660046101dc565b600055565b005b61005a61008f3660046101dc565b6100a7565b61007f6100a23660046101f5565b6100d0565b6000670de0b6b3a7640000600054836100c09190610231565b6100ca9190610256565b92915050565b60405163209d053760e21b8152600481018390526000903390309063827414dc90602401602060405180830381865afa158015610111573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906101359190610278565b604051600081818185875af1925050503d8060008114610171576040519150601f19603f3d011682016040523d82523d6000602084013e610176565b606091505b50509050806101d75760405162461bcd60e51b8152602060048201526024808201527f4d6f634d696e7452656465656d446f633a3a72656465656d46726565446f632060448201526319985a5b60e21b606482015260840160405180910390fd5b505050565b6000602082840312156101ee57600080fd5b5035919050565b6000806040838503121561020857600080fd5b8235915060208301356001600160a01b038116811461022657600080fd5b809150509250929050565b80820281158282048414176100ca57634e487b7160e01b600052601160045260246000fd5b60008261027357634e487b7160e01b600052601260045260246000fd5b500490565b60006020828403121561028a57600080fd5b505191905056fea264697066735822122078c6fcdd0f2c1ffdbaedbfdd7b73b63e5784a73efdb6990dd783879d216ef62e64736f6c63430008110033";
    static readonly abi: readonly [{
        readonly inputs: readonly [];
        readonly name: "docToRbtcRate";
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
            readonly name: "_docAmount";
            readonly type: "uint256";
        }];
        readonly name: "getRbtcValue";
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
            readonly name: "_docAmount";
            readonly type: "uint256";
        }, {
            readonly internalType: "address";
            readonly name: "_vendor";
            readonly type: "address";
        }];
        readonly name: "redeemFreeDocVendors";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "_newRate";
            readonly type: "uint256";
        }];
        readonly name: "setExRate";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }];
    static createInterface(): MocMockInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): MocMock;
}
export {};
