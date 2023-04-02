import type { BaseContract, BigNumber, BigNumberish, BytesLike, CallOverrides, ContractTransaction, Overrides, PopulatedTransaction, Signer, utils } from "ethers";
import type { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent, PromiseOrValue } from "../../../common";
export interface FeesManagerInterface extends utils.Interface {
    functions: {
        "PRECISION()": FunctionFragment;
        "calculateDepositBridgeFee(uint256)": FunctionFragment;
        "calculateDepositFee(uint256)": FunctionFragment;
        "calculateRedeemBridgeFee(uint256)": FunctionFragment;
        "calculateRedeemFee(uint256)": FunctionFragment;
        "getDepositBridgeFee()": FunctionFragment;
        "getDepositFee()": FunctionFragment;
        "getWithdrawalBridgeFee()": FunctionFragment;
        "getWithdrawalFee()": FunctionFragment;
        "initialize(uint256,uint256,uint256,uint256)": FunctionFragment;
        "owner()": FunctionFragment;
        "renounceOwnership()": FunctionFragment;
        "setDepositBridgeFee(uint256)": FunctionFragment;
        "setDepositFee(uint256)": FunctionFragment;
        "setWithdrawalBridgeFee(uint256)": FunctionFragment;
        "setWithdrawalFee(uint256)": FunctionFragment;
        "transferOwnership(address)": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "PRECISION" | "calculateDepositBridgeFee" | "calculateDepositFee" | "calculateRedeemBridgeFee" | "calculateRedeemFee" | "getDepositBridgeFee" | "getDepositFee" | "getWithdrawalBridgeFee" | "getWithdrawalFee" | "initialize" | "owner" | "renounceOwnership" | "setDepositBridgeFee" | "setDepositFee" | "setWithdrawalBridgeFee" | "setWithdrawalFee" | "transferOwnership"): FunctionFragment;
    encodeFunctionData(functionFragment: "PRECISION", values?: undefined): string;
    encodeFunctionData(functionFragment: "calculateDepositBridgeFee", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "calculateDepositFee", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "calculateRedeemBridgeFee", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "calculateRedeemFee", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "getDepositBridgeFee", values?: undefined): string;
    encodeFunctionData(functionFragment: "getDepositFee", values?: undefined): string;
    encodeFunctionData(functionFragment: "getWithdrawalBridgeFee", values?: undefined): string;
    encodeFunctionData(functionFragment: "getWithdrawalFee", values?: undefined): string;
    encodeFunctionData(functionFragment: "initialize", values: [
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>
    ]): string;
    encodeFunctionData(functionFragment: "owner", values?: undefined): string;
    encodeFunctionData(functionFragment: "renounceOwnership", values?: undefined): string;
    encodeFunctionData(functionFragment: "setDepositBridgeFee", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "setDepositFee", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "setWithdrawalBridgeFee", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "setWithdrawalFee", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "transferOwnership", values: [PromiseOrValue<string>]): string;
    decodeFunctionResult(functionFragment: "PRECISION", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "calculateDepositBridgeFee", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "calculateDepositFee", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "calculateRedeemBridgeFee", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "calculateRedeemFee", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getDepositBridgeFee", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getDepositFee", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getWithdrawalBridgeFee", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getWithdrawalFee", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "renounceOwnership", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setDepositBridgeFee", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setDepositFee", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setWithdrawalBridgeFee", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setWithdrawalFee", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "transferOwnership", data: BytesLike): Result;
    events: {
        "DepositBridgeFeeChanged(uint256)": EventFragment;
        "DepositFeeChanged(uint256)": EventFragment;
        "Initialized(uint8)": EventFragment;
        "OwnershipTransferred(address,address)": EventFragment;
        "WithdrawalBridgeFeeChanged(uint256)": EventFragment;
        "WithdrawalFeeChanged(uint256)": EventFragment;
    };
    getEvent(nameOrSignatureOrTopic: "DepositBridgeFeeChanged"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "DepositFeeChanged"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "Initialized"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "WithdrawalBridgeFeeChanged"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "WithdrawalFeeChanged"): EventFragment;
}
export interface DepositBridgeFeeChangedEventObject {
    depositBridgeFee: BigNumber;
}
export type DepositBridgeFeeChangedEvent = TypedEvent<[
    BigNumber
], DepositBridgeFeeChangedEventObject>;
export type DepositBridgeFeeChangedEventFilter = TypedEventFilter<DepositBridgeFeeChangedEvent>;
export interface DepositFeeChangedEventObject {
    depositFee: BigNumber;
}
export type DepositFeeChangedEvent = TypedEvent<[
    BigNumber
], DepositFeeChangedEventObject>;
export type DepositFeeChangedEventFilter = TypedEventFilter<DepositFeeChangedEvent>;
export interface InitializedEventObject {
    version: number;
}
export type InitializedEvent = TypedEvent<[number], InitializedEventObject>;
export type InitializedEventFilter = TypedEventFilter<InitializedEvent>;
export interface OwnershipTransferredEventObject {
    previousOwner: string;
    newOwner: string;
}
export type OwnershipTransferredEvent = TypedEvent<[
    string,
    string
], OwnershipTransferredEventObject>;
export type OwnershipTransferredEventFilter = TypedEventFilter<OwnershipTransferredEvent>;
export interface WithdrawalBridgeFeeChangedEventObject {
    withdrawalBridgeFee: BigNumber;
}
export type WithdrawalBridgeFeeChangedEvent = TypedEvent<[
    BigNumber
], WithdrawalBridgeFeeChangedEventObject>;
export type WithdrawalBridgeFeeChangedEventFilter = TypedEventFilter<WithdrawalBridgeFeeChangedEvent>;
export interface WithdrawalFeeChangedEventObject {
    withdrawalFee: BigNumber;
}
export type WithdrawalFeeChangedEvent = TypedEvent<[
    BigNumber
], WithdrawalFeeChangedEventObject>;
export type WithdrawalFeeChangedEventFilter = TypedEventFilter<WithdrawalFeeChangedEvent>;
export interface FeesManager extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: FeesManagerInterface;
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
        PRECISION(overrides?: CallOverrides): Promise<[BigNumber]>;
        calculateDepositBridgeFee(_massetAmount: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[BigNumber]>;
        calculateDepositFee(_massetAmount: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[BigNumber]>;
        calculateRedeemBridgeFee(_massetAmount: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[BigNumber]>;
        calculateRedeemFee(_massetAmount: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[BigNumber]>;
        getDepositBridgeFee(overrides?: CallOverrides): Promise<[BigNumber]>;
        getDepositFee(overrides?: CallOverrides): Promise<[BigNumber]>;
        getWithdrawalBridgeFee(overrides?: CallOverrides): Promise<[BigNumber]>;
        getWithdrawalFee(overrides?: CallOverrides): Promise<[BigNumber]>;
        initialize(_depositFee: PromiseOrValue<BigNumberish>, _depositBridgeFee: PromiseOrValue<BigNumberish>, _withdrawalFee: PromiseOrValue<BigNumberish>, _withdrawalBridgeFee: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        owner(overrides?: CallOverrides): Promise<[string]>;
        renounceOwnership(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setDepositBridgeFee(_amount: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setDepositFee(_amount: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setWithdrawalBridgeFee(_amount: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setWithdrawalFee(_amount: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        transferOwnership(newOwner: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
    };
    PRECISION(overrides?: CallOverrides): Promise<BigNumber>;
    calculateDepositBridgeFee(_massetAmount: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
    calculateDepositFee(_massetAmount: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
    calculateRedeemBridgeFee(_massetAmount: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
    calculateRedeemFee(_massetAmount: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
    getDepositBridgeFee(overrides?: CallOverrides): Promise<BigNumber>;
    getDepositFee(overrides?: CallOverrides): Promise<BigNumber>;
    getWithdrawalBridgeFee(overrides?: CallOverrides): Promise<BigNumber>;
    getWithdrawalFee(overrides?: CallOverrides): Promise<BigNumber>;
    initialize(_depositFee: PromiseOrValue<BigNumberish>, _depositBridgeFee: PromiseOrValue<BigNumberish>, _withdrawalFee: PromiseOrValue<BigNumberish>, _withdrawalBridgeFee: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    owner(overrides?: CallOverrides): Promise<string>;
    renounceOwnership(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setDepositBridgeFee(_amount: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setDepositFee(_amount: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setWithdrawalBridgeFee(_amount: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setWithdrawalFee(_amount: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    transferOwnership(newOwner: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    callStatic: {
        PRECISION(overrides?: CallOverrides): Promise<BigNumber>;
        calculateDepositBridgeFee(_massetAmount: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        calculateDepositFee(_massetAmount: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        calculateRedeemBridgeFee(_massetAmount: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        calculateRedeemFee(_massetAmount: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        getDepositBridgeFee(overrides?: CallOverrides): Promise<BigNumber>;
        getDepositFee(overrides?: CallOverrides): Promise<BigNumber>;
        getWithdrawalBridgeFee(overrides?: CallOverrides): Promise<BigNumber>;
        getWithdrawalFee(overrides?: CallOverrides): Promise<BigNumber>;
        initialize(_depositFee: PromiseOrValue<BigNumberish>, _depositBridgeFee: PromiseOrValue<BigNumberish>, _withdrawalFee: PromiseOrValue<BigNumberish>, _withdrawalBridgeFee: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        owner(overrides?: CallOverrides): Promise<string>;
        renounceOwnership(overrides?: CallOverrides): Promise<void>;
        setDepositBridgeFee(_amount: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        setDepositFee(_amount: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        setWithdrawalBridgeFee(_amount: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        setWithdrawalFee(_amount: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        transferOwnership(newOwner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
    };
    filters: {
        "DepositBridgeFeeChanged(uint256)"(depositBridgeFee?: null): DepositBridgeFeeChangedEventFilter;
        DepositBridgeFeeChanged(depositBridgeFee?: null): DepositBridgeFeeChangedEventFilter;
        "DepositFeeChanged(uint256)"(depositFee?: null): DepositFeeChangedEventFilter;
        DepositFeeChanged(depositFee?: null): DepositFeeChangedEventFilter;
        "Initialized(uint8)"(version?: null): InitializedEventFilter;
        Initialized(version?: null): InitializedEventFilter;
        "OwnershipTransferred(address,address)"(previousOwner?: PromiseOrValue<string> | null, newOwner?: PromiseOrValue<string> | null): OwnershipTransferredEventFilter;
        OwnershipTransferred(previousOwner?: PromiseOrValue<string> | null, newOwner?: PromiseOrValue<string> | null): OwnershipTransferredEventFilter;
        "WithdrawalBridgeFeeChanged(uint256)"(withdrawalBridgeFee?: null): WithdrawalBridgeFeeChangedEventFilter;
        WithdrawalBridgeFeeChanged(withdrawalBridgeFee?: null): WithdrawalBridgeFeeChangedEventFilter;
        "WithdrawalFeeChanged(uint256)"(withdrawalFee?: null): WithdrawalFeeChangedEventFilter;
        WithdrawalFeeChanged(withdrawalFee?: null): WithdrawalFeeChangedEventFilter;
    };
    estimateGas: {
        PRECISION(overrides?: CallOverrides): Promise<BigNumber>;
        calculateDepositBridgeFee(_massetAmount: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        calculateDepositFee(_massetAmount: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        calculateRedeemBridgeFee(_massetAmount: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        calculateRedeemFee(_massetAmount: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        getDepositBridgeFee(overrides?: CallOverrides): Promise<BigNumber>;
        getDepositFee(overrides?: CallOverrides): Promise<BigNumber>;
        getWithdrawalBridgeFee(overrides?: CallOverrides): Promise<BigNumber>;
        getWithdrawalFee(overrides?: CallOverrides): Promise<BigNumber>;
        initialize(_depositFee: PromiseOrValue<BigNumberish>, _depositBridgeFee: PromiseOrValue<BigNumberish>, _withdrawalFee: PromiseOrValue<BigNumberish>, _withdrawalBridgeFee: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        owner(overrides?: CallOverrides): Promise<BigNumber>;
        renounceOwnership(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setDepositBridgeFee(_amount: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setDepositFee(_amount: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setWithdrawalBridgeFee(_amount: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setWithdrawalFee(_amount: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        transferOwnership(newOwner: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
    };
    populateTransaction: {
        PRECISION(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        calculateDepositBridgeFee(_massetAmount: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        calculateDepositFee(_massetAmount: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        calculateRedeemBridgeFee(_massetAmount: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        calculateRedeemFee(_massetAmount: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getDepositBridgeFee(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getDepositFee(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getWithdrawalBridgeFee(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getWithdrawalFee(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        initialize(_depositFee: PromiseOrValue<BigNumberish>, _depositBridgeFee: PromiseOrValue<BigNumberish>, _withdrawalFee: PromiseOrValue<BigNumberish>, _withdrawalBridgeFee: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        renounceOwnership(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setDepositBridgeFee(_amount: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setDepositFee(_amount: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setWithdrawalBridgeFee(_amount: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setWithdrawalFee(_amount: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        transferOwnership(newOwner: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
    };
}
