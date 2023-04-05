import type { BaseContract, BigNumber, BigNumberish, BytesLike, CallOverrides, ContractTransaction, Overrides, PopulatedTransaction, Signer, utils } from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent, PromiseOrValue } from "../../../../common";
export interface MockApprovalReceiverInterface extends utils.Interface {
    functions: {
        "amount()": FunctionFragment;
        "data()": FunctionFragment;
        "receiveApproval(address,uint256,address,bytes)": FunctionFragment;
        "sender()": FunctionFragment;
        "token()": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "amount" | "data" | "receiveApproval" | "sender" | "token"): FunctionFragment;
    encodeFunctionData(functionFragment: "amount", values?: undefined): string;
    encodeFunctionData(functionFragment: "data", values?: undefined): string;
    encodeFunctionData(functionFragment: "receiveApproval", values: [
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<string>,
        PromiseOrValue<BytesLike>
    ]): string;
    encodeFunctionData(functionFragment: "sender", values?: undefined): string;
    encodeFunctionData(functionFragment: "token", values?: undefined): string;
    decodeFunctionResult(functionFragment: "amount", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "data", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "receiveApproval", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "sender", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "token", data: BytesLike): Result;
    events: {};
}
export interface MockApprovalReceiver extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: MockApprovalReceiverInterface;
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
        amount(overrides?: CallOverrides): Promise<[BigNumber]>;
        data(overrides?: CallOverrides): Promise<[string]>;
        receiveApproval(_sender: PromiseOrValue<string>, _amount: PromiseOrValue<BigNumberish>, _token: PromiseOrValue<string>, _data: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        sender(overrides?: CallOverrides): Promise<[string]>;
        token(overrides?: CallOverrides): Promise<[string]>;
    };
    amount(overrides?: CallOverrides): Promise<BigNumber>;
    data(overrides?: CallOverrides): Promise<string>;
    receiveApproval(_sender: PromiseOrValue<string>, _amount: PromiseOrValue<BigNumberish>, _token: PromiseOrValue<string>, _data: PromiseOrValue<BytesLike>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    sender(overrides?: CallOverrides): Promise<string>;
    token(overrides?: CallOverrides): Promise<string>;
    callStatic: {
        amount(overrides?: CallOverrides): Promise<BigNumber>;
        data(overrides?: CallOverrides): Promise<string>;
        receiveApproval(_sender: PromiseOrValue<string>, _amount: PromiseOrValue<BigNumberish>, _token: PromiseOrValue<string>, _data: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
        sender(overrides?: CallOverrides): Promise<string>;
        token(overrides?: CallOverrides): Promise<string>;
    };
    filters: {};
    estimateGas: {
        amount(overrides?: CallOverrides): Promise<BigNumber>;
        data(overrides?: CallOverrides): Promise<BigNumber>;
        receiveApproval(_sender: PromiseOrValue<string>, _amount: PromiseOrValue<BigNumberish>, _token: PromiseOrValue<string>, _data: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        sender(overrides?: CallOverrides): Promise<BigNumber>;
        token(overrides?: CallOverrides): Promise<BigNumber>;
    };
    populateTransaction: {
        amount(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        data(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        receiveApproval(_sender: PromiseOrValue<string>, _amount: PromiseOrValue<BigNumberish>, _token: PromiseOrValue<string>, _data: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        sender(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        token(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    };
}
