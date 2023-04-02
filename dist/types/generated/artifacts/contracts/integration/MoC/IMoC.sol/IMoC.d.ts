import type { BaseContract, BigNumber, BigNumberish, BytesLike, CallOverrides, ContractTransaction, Overrides, PayableOverrides, PopulatedTransaction, Signer, utils } from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent, PromiseOrValue } from "../../../../../common";
export interface IMoCInterface extends utils.Interface {
    functions: {
        "alterRedeemRequestAmount(bool,uint256)": FunctionFragment;
        "docAmountToRedeem(address)": FunctionFragment;
        "mintDoc(uint256)": FunctionFragment;
        "mintDocVendors(uint256,address)": FunctionFragment;
        "redeemAllDoc()": FunctionFragment;
        "redeemDocRequest(uint256)": FunctionFragment;
        "redeemFreeDoc(uint256)": FunctionFragment;
        "redeemFreeDocVendors(uint256,address)": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "alterRedeemRequestAmount" | "docAmountToRedeem" | "mintDoc" | "mintDocVendors" | "redeemAllDoc" | "redeemDocRequest" | "redeemFreeDoc" | "redeemFreeDocVendors"): FunctionFragment;
    encodeFunctionData(functionFragment: "alterRedeemRequestAmount", values: [PromiseOrValue<boolean>, PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "docAmountToRedeem", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "mintDoc", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "mintDocVendors", values: [PromiseOrValue<BigNumberish>, PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "redeemAllDoc", values?: undefined): string;
    encodeFunctionData(functionFragment: "redeemDocRequest", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "redeemFreeDoc", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "redeemFreeDocVendors", values: [PromiseOrValue<BigNumberish>, PromiseOrValue<string>]): string;
    decodeFunctionResult(functionFragment: "alterRedeemRequestAmount", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "docAmountToRedeem", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "mintDoc", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "mintDocVendors", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "redeemAllDoc", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "redeemDocRequest", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "redeemFreeDoc", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "redeemFreeDocVendors", data: BytesLike): Result;
    events: {};
}
export interface IMoC extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: IMoCInterface;
    queryFilter<TEvent extends TypedEvent>(event: TypedEventFilter<TEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TEvent>>;
    listeners<TEvent extends TypedEvent>(eventFilter?: TypedEventFilter<TEvent>): Array<TypedListener<TEvent>>;
    listeners(eventName?: string): Array<Listener>;
    removeAllListeners<TEvent extends TypedEvent>(eventFilter: TypedEventFilter<TEvent>): this;
    removeAllListeners(eventName?: string): this;
    off: OnEvent<this>;
    on: OnEvent<this>;
    once: OnEvent<this>;
    removeListener: OnEvent<this>;
    functions: {
        alterRedeemRequestAmount(isAddition: PromiseOrValue<boolean>, delta: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        docAmountToRedeem(redeemer: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[BigNumber]>;
        mintDoc(btcToMint: PromiseOrValue<BigNumberish>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        mintDocVendors(btcToMint: PromiseOrValue<BigNumberish>, vendorAccount: PromiseOrValue<string>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        redeemAllDoc(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        redeemDocRequest(docAmount: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        redeemFreeDoc(docAmount: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        redeemFreeDocVendors(docAmount: PromiseOrValue<BigNumberish>, vendorAccount: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
    };
    alterRedeemRequestAmount(isAddition: PromiseOrValue<boolean>, delta: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    docAmountToRedeem(redeemer: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
    mintDoc(btcToMint: PromiseOrValue<BigNumberish>, overrides?: PayableOverrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    mintDocVendors(btcToMint: PromiseOrValue<BigNumberish>, vendorAccount: PromiseOrValue<string>, overrides?: PayableOverrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    redeemAllDoc(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    redeemDocRequest(docAmount: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    redeemFreeDoc(docAmount: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    redeemFreeDocVendors(docAmount: PromiseOrValue<BigNumberish>, vendorAccount: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    callStatic: {
        alterRedeemRequestAmount(isAddition: PromiseOrValue<boolean>, delta: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        docAmountToRedeem(redeemer: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        mintDoc(btcToMint: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        mintDocVendors(btcToMint: PromiseOrValue<BigNumberish>, vendorAccount: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        redeemAllDoc(overrides?: CallOverrides): Promise<void>;
        redeemDocRequest(docAmount: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        redeemFreeDoc(docAmount: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        redeemFreeDocVendors(docAmount: PromiseOrValue<BigNumberish>, vendorAccount: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
    };
    filters: {};
    estimateGas: {
        alterRedeemRequestAmount(isAddition: PromiseOrValue<boolean>, delta: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        docAmountToRedeem(redeemer: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        mintDoc(btcToMint: PromiseOrValue<BigNumberish>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        mintDocVendors(btcToMint: PromiseOrValue<BigNumberish>, vendorAccount: PromiseOrValue<string>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        redeemAllDoc(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        redeemDocRequest(docAmount: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        redeemFreeDoc(docAmount: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        redeemFreeDocVendors(docAmount: PromiseOrValue<BigNumberish>, vendorAccount: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
    };
    populateTransaction: {
        alterRedeemRequestAmount(isAddition: PromiseOrValue<boolean>, delta: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        docAmountToRedeem(redeemer: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        mintDoc(btcToMint: PromiseOrValue<BigNumberish>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        mintDocVendors(btcToMint: PromiseOrValue<BigNumberish>, vendorAccount: PromiseOrValue<string>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        redeemAllDoc(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        redeemDocRequest(docAmount: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        redeemFreeDoc(docAmount: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        redeemFreeDocVendors(docAmount: PromiseOrValue<BigNumberish>, vendorAccount: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
    };
}
