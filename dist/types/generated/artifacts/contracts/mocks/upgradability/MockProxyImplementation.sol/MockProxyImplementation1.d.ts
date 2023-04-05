import type { BaseContract, BigNumber, BytesLike, CallOverrides, ContractTransaction, Overrides, PopulatedTransaction, Signer, utils } from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent, PromiseOrValue } from "../../../../../common";
export interface MockProxyImplementation1Interface extends utils.Interface {
    functions: {
        "getDep()": FunctionFragment;
        "getVersion()": FunctionFragment;
        "initialize(address)": FunctionFragment;
        "isInitialized()": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "getDep" | "getVersion" | "initialize" | "isInitialized"): FunctionFragment;
    encodeFunctionData(functionFragment: "getDep", values?: undefined): string;
    encodeFunctionData(functionFragment: "getVersion", values?: undefined): string;
    encodeFunctionData(functionFragment: "initialize", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "isInitialized", values?: undefined): string;
    decodeFunctionResult(functionFragment: "getDep", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getVersion", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "isInitialized", data: BytesLike): Result;
    events: {};
}
export interface MockProxyImplementation1 extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: MockProxyImplementation1Interface;
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
        getDep(overrides?: CallOverrides): Promise<[string]>;
        getVersion(overrides?: CallOverrides): Promise<[string]>;
        initialize(_depAddress: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        isInitialized(overrides?: CallOverrides): Promise<[boolean]>;
    };
    getDep(overrides?: CallOverrides): Promise<string>;
    getVersion(overrides?: CallOverrides): Promise<string>;
    initialize(_depAddress: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    isInitialized(overrides?: CallOverrides): Promise<boolean>;
    callStatic: {
        getDep(overrides?: CallOverrides): Promise<string>;
        getVersion(overrides?: CallOverrides): Promise<string>;
        initialize(_depAddress: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        isInitialized(overrides?: CallOverrides): Promise<boolean>;
    };
    filters: {};
    estimateGas: {
        getDep(overrides?: CallOverrides): Promise<BigNumber>;
        getVersion(overrides?: CallOverrides): Promise<BigNumber>;
        initialize(_depAddress: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        isInitialized(overrides?: CallOverrides): Promise<BigNumber>;
    };
    populateTransaction: {
        getDep(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getVersion(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        initialize(_depAddress: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        isInitialized(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    };
}
