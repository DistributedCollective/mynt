import type { BaseContract, BigNumber, BytesLike, CallOverrides, PopulatedTransaction, Signer, utils } from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from "../../../../../common";
export interface MockDummy2Interface extends utils.Interface {
    functions: {
        "getVersion()": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "getVersion"): FunctionFragment;
    encodeFunctionData(functionFragment: "getVersion", values?: undefined): string;
    decodeFunctionResult(functionFragment: "getVersion", data: BytesLike): Result;
    events: {};
}
export interface MockDummy2 extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: MockDummy2Interface;
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
    };
    getVersion(overrides?: CallOverrides): Promise<string>;
    callStatic: {
        getVersion(overrides?: CallOverrides): Promise<string>;
    };
    filters: {};
    estimateGas: {
        getVersion(overrides?: CallOverrides): Promise<BigNumber>;
    };
    populateTransaction: {
        getVersion(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    };
}
