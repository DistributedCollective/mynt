import type { BaseContract, BigNumber, BytesLike, CallOverrides, PopulatedTransaction, Signer, utils } from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from "../../../../../common";
export interface NonReentrantMockInterface extends utils.Interface {
    functions: {
        "clientMethod()": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "clientMethod"): FunctionFragment;
    encodeFunctionData(functionFragment: "clientMethod", values?: undefined): string;
    decodeFunctionResult(functionFragment: "clientMethod", data: BytesLike): Result;
    events: {};
}
export interface NonReentrantMock extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: NonReentrantMockInterface;
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
        clientMethod(overrides?: CallOverrides): Promise<[boolean]>;
    };
    clientMethod(overrides?: CallOverrides): Promise<boolean>;
    callStatic: {
        clientMethod(overrides?: CallOverrides): Promise<boolean>;
    };
    filters: {};
    estimateGas: {
        clientMethod(overrides?: CallOverrides): Promise<BigNumber>;
    };
    populateTransaction: {
        clientMethod(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    };
}
