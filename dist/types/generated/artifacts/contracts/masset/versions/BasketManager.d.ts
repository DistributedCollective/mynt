import type { BaseContract, BigNumber, BigNumberish, BytesLike, CallOverrides, PopulatedTransaction, Signer, utils } from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent, PromiseOrValue } from "../../../../common";
export interface BasketManagerInterface extends utils.Interface {
    functions: {
        "checkBasketBalanceForDeposit(address,uint256)": FunctionFragment;
        "checkBasketBalanceForWithdrawal(address,uint256)": FunctionFragment;
        "convertBassetToMassetQuantity(address,uint256)": FunctionFragment;
        "convertMassetToBassetQuantity(address,uint256)": FunctionFragment;
        "getBridge(address)": FunctionFragment;
        "getVersion()": FunctionFragment;
        "isValidBasset(address)": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "checkBasketBalanceForDeposit" | "checkBasketBalanceForWithdrawal" | "convertBassetToMassetQuantity" | "convertMassetToBassetQuantity" | "getBridge" | "getVersion" | "isValidBasset"): FunctionFragment;
    encodeFunctionData(functionFragment: "checkBasketBalanceForDeposit", values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "checkBasketBalanceForWithdrawal", values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "convertBassetToMassetQuantity", values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "convertMassetToBassetQuantity", values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "getBridge", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "getVersion", values?: undefined): string;
    encodeFunctionData(functionFragment: "isValidBasset", values: [PromiseOrValue<string>]): string;
    decodeFunctionResult(functionFragment: "checkBasketBalanceForDeposit", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "checkBasketBalanceForWithdrawal", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "convertBassetToMassetQuantity", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "convertMassetToBassetQuantity", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getBridge", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getVersion", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "isValidBasset", data: BytesLike): Result;
    events: {};
}
export interface BasketManager extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: BasketManagerInterface;
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
        checkBasketBalanceForDeposit(_basset: PromiseOrValue<string>, arg1: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[boolean]>;
        checkBasketBalanceForWithdrawal(_basset: PromiseOrValue<string>, arg1: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[boolean]>;
        convertBassetToMassetQuantity(_basset: PromiseOrValue<string>, _bassetQuantity: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[BigNumber]>;
        convertMassetToBassetQuantity(_basset: PromiseOrValue<string>, _massetQuantity: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[BigNumber]>;
        getBridge(_basset: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[string]>;
        getVersion(overrides?: CallOverrides): Promise<[string]>;
        isValidBasset(_basset: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[boolean]>;
    };
    checkBasketBalanceForDeposit(_basset: PromiseOrValue<string>, arg1: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<boolean>;
    checkBasketBalanceForWithdrawal(_basset: PromiseOrValue<string>, arg1: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<boolean>;
    convertBassetToMassetQuantity(_basset: PromiseOrValue<string>, _bassetQuantity: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
    convertMassetToBassetQuantity(_basset: PromiseOrValue<string>, _massetQuantity: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
    getBridge(_basset: PromiseOrValue<string>, overrides?: CallOverrides): Promise<string>;
    getVersion(overrides?: CallOverrides): Promise<string>;
    isValidBasset(_basset: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
    callStatic: {
        checkBasketBalanceForDeposit(_basset: PromiseOrValue<string>, arg1: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<boolean>;
        checkBasketBalanceForWithdrawal(_basset: PromiseOrValue<string>, arg1: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<boolean>;
        convertBassetToMassetQuantity(_basset: PromiseOrValue<string>, _bassetQuantity: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        convertMassetToBassetQuantity(_basset: PromiseOrValue<string>, _massetQuantity: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        getBridge(_basset: PromiseOrValue<string>, overrides?: CallOverrides): Promise<string>;
        getVersion(overrides?: CallOverrides): Promise<string>;
        isValidBasset(_basset: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
    };
    filters: {};
    estimateGas: {
        checkBasketBalanceForDeposit(_basset: PromiseOrValue<string>, arg1: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        checkBasketBalanceForWithdrawal(_basset: PromiseOrValue<string>, arg1: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        convertBassetToMassetQuantity(_basset: PromiseOrValue<string>, _bassetQuantity: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        convertMassetToBassetQuantity(_basset: PromiseOrValue<string>, _massetQuantity: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        getBridge(_basset: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        getVersion(overrides?: CallOverrides): Promise<BigNumber>;
        isValidBasset(_basset: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
    };
    populateTransaction: {
        checkBasketBalanceForDeposit(_basset: PromiseOrValue<string>, arg1: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        checkBasketBalanceForWithdrawal(_basset: PromiseOrValue<string>, arg1: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        convertBassetToMassetQuantity(_basset: PromiseOrValue<string>, _bassetQuantity: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        convertMassetToBassetQuantity(_basset: PromiseOrValue<string>, _massetQuantity: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getBridge(_basset: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getVersion(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        isValidBasset(_basset: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
    };
}
