import type { BaseContract, BigNumber, BigNumberish, BytesLike, CallOverrides, ContractTransaction, Overrides, PopulatedTransaction, Signer, utils } from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent, PromiseOrValue } from "../../../../common";
export interface MocMockInterface extends utils.Interface {
    functions: {
        "docToRbtcRate()": FunctionFragment;
        "getRbtcValue(uint256)": FunctionFragment;
        "redeemFreeDocVendors(uint256,address)": FunctionFragment;
        "setExRate(uint256)": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "docToRbtcRate" | "getRbtcValue" | "redeemFreeDocVendors" | "setExRate"): FunctionFragment;
    encodeFunctionData(functionFragment: "docToRbtcRate", values?: undefined): string;
    encodeFunctionData(functionFragment: "getRbtcValue", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "redeemFreeDocVendors", values: [PromiseOrValue<BigNumberish>, PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "setExRate", values: [PromiseOrValue<BigNumberish>]): string;
    decodeFunctionResult(functionFragment: "docToRbtcRate", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getRbtcValue", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "redeemFreeDocVendors", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setExRate", data: BytesLike): Result;
    events: {};
}
export interface MocMock extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: MocMockInterface;
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
        docToRbtcRate(overrides?: CallOverrides): Promise<[BigNumber]>;
        getRbtcValue(_docAmount: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[BigNumber]>;
        redeemFreeDocVendors(_docAmount: PromiseOrValue<BigNumberish>, _vendor: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setExRate(_newRate: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
    };
    docToRbtcRate(overrides?: CallOverrides): Promise<BigNumber>;
    getRbtcValue(_docAmount: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
    redeemFreeDocVendors(_docAmount: PromiseOrValue<BigNumberish>, _vendor: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setExRate(_newRate: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    callStatic: {
        docToRbtcRate(overrides?: CallOverrides): Promise<BigNumber>;
        getRbtcValue(_docAmount: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        redeemFreeDocVendors(_docAmount: PromiseOrValue<BigNumberish>, _vendor: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        setExRate(_newRate: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
    };
    filters: {};
    estimateGas: {
        docToRbtcRate(overrides?: CallOverrides): Promise<BigNumber>;
        getRbtcValue(_docAmount: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        redeemFreeDocVendors(_docAmount: PromiseOrValue<BigNumberish>, _vendor: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setExRate(_newRate: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
    };
    populateTransaction: {
        docToRbtcRate(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getRbtcValue(_docAmount: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        redeemFreeDocVendors(_docAmount: PromiseOrValue<BigNumberish>, _vendor: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setExRate(_newRate: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
    };
}
