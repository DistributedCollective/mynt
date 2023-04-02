import type { BaseContract, BigNumber, BytesLike, CallOverrides, PopulatedTransaction, Signer, utils } from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from "../../../../../common";
export interface IMockImplementationInterface extends utils.Interface {
    functions: {
        "getVersion()": FunctionFragment;
        "isInitialized()": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "getVersion" | "isInitialized"): FunctionFragment;
    encodeFunctionData(functionFragment: "getVersion", values?: undefined): string;
    encodeFunctionData(functionFragment: "isInitialized", values?: undefined): string;
    decodeFunctionResult(functionFragment: "getVersion", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "isInitialized", data: BytesLike): Result;
    events: {};
}
export interface IMockImplementation extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: IMockImplementationInterface;
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
        getVersion(overrides?: CallOverrides): Promise<[string]>;
        isInitialized(overrides?: CallOverrides): Promise<[boolean]>;
    };
    getVersion(overrides?: CallOverrides): Promise<string>;
    isInitialized(overrides?: CallOverrides): Promise<boolean>;
    callStatic: {
        getVersion(overrides?: CallOverrides): Promise<string>;
        isInitialized(overrides?: CallOverrides): Promise<boolean>;
    };
    filters: {};
    estimateGas: {
        getVersion(overrides?: CallOverrides): Promise<BigNumber>;
        isInitialized(overrides?: CallOverrides): Promise<BigNumber>;
    };
    populateTransaction: {
        getVersion(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        isInitialized(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    };
}
