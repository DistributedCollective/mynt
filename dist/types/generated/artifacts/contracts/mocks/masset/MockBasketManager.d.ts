import type { BaseContract, BigNumber, BigNumberish, BytesLike, CallOverrides, ContractTransaction, Overrides, PopulatedTransaction, Signer, utils } from "ethers";
import type { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent, PromiseOrValue } from "../../../../common";
export interface MockBasketManagerInterface extends utils.Interface {
    functions: {
        "addBasset(address,int256,address,uint256,uint256,bool)": FunctionFragment;
        "addBassets(address[],int256[],address[],uint256[],uint256[],bool[])": FunctionFragment;
        "checkBasketBalanceForDeposit(address,uint256)": FunctionFragment;
        "checkBasketBalanceForWithdrawal(address,uint256)": FunctionFragment;
        "convertBassetToMassetQuantity(address,uint256)": FunctionFragment;
        "convertMassetToBassetQuantity(address,uint256)": FunctionFragment;
        "getBassetBalance(address)": FunctionFragment;
        "getBassets()": FunctionFragment;
        "getBridge(address)": FunctionFragment;
        "getFactor(address)": FunctionFragment;
        "getPaused(address)": FunctionFragment;
        "getProxyImplementation()": FunctionFragment;
        "getRange(address)": FunctionFragment;
        "getTotalMassetBalance()": FunctionFragment;
        "getVersion()": FunctionFragment;
        "initialize(address)": FunctionFragment;
        "isPowerOfTen(int256)": FunctionFragment;
        "isValidBasset(address)": FunctionFragment;
        "owner()": FunctionFragment;
        "removeBasset(address)": FunctionFragment;
        "renounceOwnership()": FunctionFragment;
        "setBridge(address,address)": FunctionFragment;
        "setFactor(address,int256)": FunctionFragment;
        "setPaused(address,bool)": FunctionFragment;
        "setRange(address,uint256,uint256)": FunctionFragment;
        "transferOwnership(address)": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "addBasset" | "addBassets" | "checkBasketBalanceForDeposit" | "checkBasketBalanceForWithdrawal" | "convertBassetToMassetQuantity" | "convertMassetToBassetQuantity" | "getBassetBalance" | "getBassets" | "getBridge" | "getFactor" | "getPaused" | "getProxyImplementation" | "getRange" | "getTotalMassetBalance" | "getVersion" | "initialize" | "isPowerOfTen" | "isValidBasset" | "owner" | "removeBasset" | "renounceOwnership" | "setBridge" | "setFactor" | "setPaused" | "setRange" | "transferOwnership"): FunctionFragment;
    encodeFunctionData(functionFragment: "addBasset", values: [
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<boolean>
    ]): string;
    encodeFunctionData(functionFragment: "addBassets", values: [
        PromiseOrValue<string>[],
        PromiseOrValue<BigNumberish>[],
        PromiseOrValue<string>[],
        PromiseOrValue<BigNumberish>[],
        PromiseOrValue<BigNumberish>[],
        PromiseOrValue<boolean>[]
    ]): string;
    encodeFunctionData(functionFragment: "checkBasketBalanceForDeposit", values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "checkBasketBalanceForWithdrawal", values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "convertBassetToMassetQuantity", values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "convertMassetToBassetQuantity", values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "getBassetBalance", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "getBassets", values?: undefined): string;
    encodeFunctionData(functionFragment: "getBridge", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "getFactor", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "getPaused", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "getProxyImplementation", values?: undefined): string;
    encodeFunctionData(functionFragment: "getRange", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "getTotalMassetBalance", values?: undefined): string;
    encodeFunctionData(functionFragment: "getVersion", values?: undefined): string;
    encodeFunctionData(functionFragment: "initialize", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "isPowerOfTen", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "isValidBasset", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "owner", values?: undefined): string;
    encodeFunctionData(functionFragment: "removeBasset", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "renounceOwnership", values?: undefined): string;
    encodeFunctionData(functionFragment: "setBridge", values: [PromiseOrValue<string>, PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "setFactor", values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "setPaused", values: [PromiseOrValue<string>, PromiseOrValue<boolean>]): string;
    encodeFunctionData(functionFragment: "setRange", values: [
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>
    ]): string;
    encodeFunctionData(functionFragment: "transferOwnership", values: [PromiseOrValue<string>]): string;
    decodeFunctionResult(functionFragment: "addBasset", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "addBassets", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "checkBasketBalanceForDeposit", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "checkBasketBalanceForWithdrawal", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "convertBassetToMassetQuantity", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "convertMassetToBassetQuantity", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getBassetBalance", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getBassets", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getBridge", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getFactor", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getPaused", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getProxyImplementation", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getRange", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getTotalMassetBalance", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getVersion", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "isPowerOfTen", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "isValidBasset", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "removeBasset", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "renounceOwnership", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setBridge", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setFactor", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setPaused", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setRange", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "transferOwnership", data: BytesLike): Result;
    events: {
        "AdminChanged(address,address)": EventFragment;
        "BassetAdded(address)": EventFragment;
        "BassetRemoved(address)": EventFragment;
        "BeaconUpgraded(address)": EventFragment;
        "BridgeChanged(address,address)": EventFragment;
        "FactorChanged(address,int256)": EventFragment;
        "Initialized(uint8)": EventFragment;
        "OwnershipTransferred(address,address)": EventFragment;
        "PausedChanged(address,bool)": EventFragment;
        "RangeChanged(address,uint256,uint256)": EventFragment;
        "Upgraded(address)": EventFragment;
    };
    getEvent(nameOrSignatureOrTopic: "AdminChanged"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "BassetAdded"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "BassetRemoved"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "BeaconUpgraded"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "BridgeChanged"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "FactorChanged"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "Initialized"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "PausedChanged"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "RangeChanged"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "Upgraded"): EventFragment;
}
export interface AdminChangedEventObject {
    previousAdmin: string;
    newAdmin: string;
}
export type AdminChangedEvent = TypedEvent<[
    string,
    string
], AdminChangedEventObject>;
export type AdminChangedEventFilter = TypedEventFilter<AdminChangedEvent>;
export interface BassetAddedEventObject {
    basset: string;
}
export type BassetAddedEvent = TypedEvent<[string], BassetAddedEventObject>;
export type BassetAddedEventFilter = TypedEventFilter<BassetAddedEvent>;
export interface BassetRemovedEventObject {
    basset: string;
}
export type BassetRemovedEvent = TypedEvent<[string], BassetRemovedEventObject>;
export type BassetRemovedEventFilter = TypedEventFilter<BassetRemovedEvent>;
export interface BeaconUpgradedEventObject {
    beacon: string;
}
export type BeaconUpgradedEvent = TypedEvent<[
    string
], BeaconUpgradedEventObject>;
export type BeaconUpgradedEventFilter = TypedEventFilter<BeaconUpgradedEvent>;
export interface BridgeChangedEventObject {
    basset: string;
    bridge: string;
}
export type BridgeChangedEvent = TypedEvent<[
    string,
    string
], BridgeChangedEventObject>;
export type BridgeChangedEventFilter = TypedEventFilter<BridgeChangedEvent>;
export interface FactorChangedEventObject {
    basset: string;
    factor: BigNumber;
}
export type FactorChangedEvent = TypedEvent<[
    string,
    BigNumber
], FactorChangedEventObject>;
export type FactorChangedEventFilter = TypedEventFilter<FactorChangedEvent>;
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
export interface PausedChangedEventObject {
    basset: string;
    paused: boolean;
}
export type PausedChangedEvent = TypedEvent<[
    string,
    boolean
], PausedChangedEventObject>;
export type PausedChangedEventFilter = TypedEventFilter<PausedChangedEvent>;
export interface RangeChangedEventObject {
    basset: string;
    min: BigNumber;
    max: BigNumber;
}
export type RangeChangedEvent = TypedEvent<[
    string,
    BigNumber,
    BigNumber
], RangeChangedEventObject>;
export type RangeChangedEventFilter = TypedEventFilter<RangeChangedEvent>;
export interface UpgradedEventObject {
    implementation: string;
}
export type UpgradedEvent = TypedEvent<[string], UpgradedEventObject>;
export type UpgradedEventFilter = TypedEventFilter<UpgradedEvent>;
export interface MockBasketManager extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: MockBasketManagerInterface;
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
        addBasset(_basset: PromiseOrValue<string>, _factor: PromiseOrValue<BigNumberish>, _bridge: PromiseOrValue<string>, _min: PromiseOrValue<BigNumberish>, _max: PromiseOrValue<BigNumberish>, _paused: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        addBassets(_bassets: PromiseOrValue<string>[], _factors: PromiseOrValue<BigNumberish>[], _bridges: PromiseOrValue<string>[], _mins: PromiseOrValue<BigNumberish>[], _maxs: PromiseOrValue<BigNumberish>[], _pausedFlags: PromiseOrValue<boolean>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        checkBasketBalanceForDeposit(_basset: PromiseOrValue<string>, _bassetQuantity: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[boolean]>;
        checkBasketBalanceForWithdrawal(_basset: PromiseOrValue<string>, _bassetQuantity: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[boolean]>;
        convertBassetToMassetQuantity(_basset: PromiseOrValue<string>, _bassetQuantity: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[
            BigNumber,
            BigNumber
        ] & {
            massetQuantity: BigNumber;
            bassetQuantity: BigNumber;
        }>;
        convertMassetToBassetQuantity(_basset: PromiseOrValue<string>, _massetQuantity: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[
            BigNumber,
            BigNumber
        ] & {
            bassetQuantity: BigNumber;
            massetQuantity: BigNumber;
        }>;
        getBassetBalance(_basset: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[BigNumber]>;
        getBassets(overrides?: CallOverrides): Promise<[string[]]>;
        getBridge(_basset: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[string]>;
        getFactor(_basset: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[BigNumber]>;
        getPaused(_basset: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[boolean]>;
        getProxyImplementation(overrides?: CallOverrides): Promise<[string]>;
        getRange(_basset: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[BigNumber, BigNumber] & {
            min: BigNumber;
            max: BigNumber;
        }>;
        getTotalMassetBalance(overrides?: CallOverrides): Promise<[BigNumber] & {
            total: BigNumber;
        }>;
        getVersion(overrides?: CallOverrides): Promise<[string]>;
        initialize(_massetManager: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        isPowerOfTen(x: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[boolean] & {
            result: boolean;
        }>;
        isValidBasset(_basset: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[boolean]>;
        owner(overrides?: CallOverrides): Promise<[string]>;
        removeBasset(_basset: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        renounceOwnership(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setBridge(_basset: PromiseOrValue<string>, _bridge: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setFactor(_basset: PromiseOrValue<string>, _factor: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setPaused(_basset: PromiseOrValue<string>, _flag: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setRange(_basset: PromiseOrValue<string>, _min: PromiseOrValue<BigNumberish>, _max: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        transferOwnership(newOwner: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
    };
    addBasset(_basset: PromiseOrValue<string>, _factor: PromiseOrValue<BigNumberish>, _bridge: PromiseOrValue<string>, _min: PromiseOrValue<BigNumberish>, _max: PromiseOrValue<BigNumberish>, _paused: PromiseOrValue<boolean>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    addBassets(_bassets: PromiseOrValue<string>[], _factors: PromiseOrValue<BigNumberish>[], _bridges: PromiseOrValue<string>[], _mins: PromiseOrValue<BigNumberish>[], _maxs: PromiseOrValue<BigNumberish>[], _pausedFlags: PromiseOrValue<boolean>[], overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    checkBasketBalanceForDeposit(_basset: PromiseOrValue<string>, _bassetQuantity: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<boolean>;
    checkBasketBalanceForWithdrawal(_basset: PromiseOrValue<string>, _bassetQuantity: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<boolean>;
    convertBassetToMassetQuantity(_basset: PromiseOrValue<string>, _bassetQuantity: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[
        BigNumber,
        BigNumber
    ] & {
        massetQuantity: BigNumber;
        bassetQuantity: BigNumber;
    }>;
    convertMassetToBassetQuantity(_basset: PromiseOrValue<string>, _massetQuantity: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[
        BigNumber,
        BigNumber
    ] & {
        bassetQuantity: BigNumber;
        massetQuantity: BigNumber;
    }>;
    getBassetBalance(_basset: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
    getBassets(overrides?: CallOverrides): Promise<string[]>;
    getBridge(_basset: PromiseOrValue<string>, overrides?: CallOverrides): Promise<string>;
    getFactor(_basset: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
    getPaused(_basset: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
    getProxyImplementation(overrides?: CallOverrides): Promise<string>;
    getRange(_basset: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[BigNumber, BigNumber] & {
        min: BigNumber;
        max: BigNumber;
    }>;
    getTotalMassetBalance(overrides?: CallOverrides): Promise<BigNumber>;
    getVersion(overrides?: CallOverrides): Promise<string>;
    initialize(_massetManager: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    isPowerOfTen(x: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<boolean>;
    isValidBasset(_basset: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
    owner(overrides?: CallOverrides): Promise<string>;
    removeBasset(_basset: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    renounceOwnership(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setBridge(_basset: PromiseOrValue<string>, _bridge: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setFactor(_basset: PromiseOrValue<string>, _factor: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setPaused(_basset: PromiseOrValue<string>, _flag: PromiseOrValue<boolean>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setRange(_basset: PromiseOrValue<string>, _min: PromiseOrValue<BigNumberish>, _max: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    transferOwnership(newOwner: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    callStatic: {
        addBasset(_basset: PromiseOrValue<string>, _factor: PromiseOrValue<BigNumberish>, _bridge: PromiseOrValue<string>, _min: PromiseOrValue<BigNumberish>, _max: PromiseOrValue<BigNumberish>, _paused: PromiseOrValue<boolean>, overrides?: CallOverrides): Promise<void>;
        addBassets(_bassets: PromiseOrValue<string>[], _factors: PromiseOrValue<BigNumberish>[], _bridges: PromiseOrValue<string>[], _mins: PromiseOrValue<BigNumberish>[], _maxs: PromiseOrValue<BigNumberish>[], _pausedFlags: PromiseOrValue<boolean>[], overrides?: CallOverrides): Promise<void>;
        checkBasketBalanceForDeposit(_basset: PromiseOrValue<string>, _bassetQuantity: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<boolean>;
        checkBasketBalanceForWithdrawal(_basset: PromiseOrValue<string>, _bassetQuantity: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<boolean>;
        convertBassetToMassetQuantity(_basset: PromiseOrValue<string>, _bassetQuantity: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[
            BigNumber,
            BigNumber
        ] & {
            massetQuantity: BigNumber;
            bassetQuantity: BigNumber;
        }>;
        convertMassetToBassetQuantity(_basset: PromiseOrValue<string>, _massetQuantity: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[
            BigNumber,
            BigNumber
        ] & {
            bassetQuantity: BigNumber;
            massetQuantity: BigNumber;
        }>;
        getBassetBalance(_basset: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        getBassets(overrides?: CallOverrides): Promise<string[]>;
        getBridge(_basset: PromiseOrValue<string>, overrides?: CallOverrides): Promise<string>;
        getFactor(_basset: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        getPaused(_basset: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
        getProxyImplementation(overrides?: CallOverrides): Promise<string>;
        getRange(_basset: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[BigNumber, BigNumber] & {
            min: BigNumber;
            max: BigNumber;
        }>;
        getTotalMassetBalance(overrides?: CallOverrides): Promise<BigNumber>;
        getVersion(overrides?: CallOverrides): Promise<string>;
        initialize(_massetManager: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        isPowerOfTen(x: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<boolean>;
        isValidBasset(_basset: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
        owner(overrides?: CallOverrides): Promise<string>;
        removeBasset(_basset: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        renounceOwnership(overrides?: CallOverrides): Promise<void>;
        setBridge(_basset: PromiseOrValue<string>, _bridge: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        setFactor(_basset: PromiseOrValue<string>, _factor: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        setPaused(_basset: PromiseOrValue<string>, _flag: PromiseOrValue<boolean>, overrides?: CallOverrides): Promise<void>;
        setRange(_basset: PromiseOrValue<string>, _min: PromiseOrValue<BigNumberish>, _max: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        transferOwnership(newOwner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
    };
    filters: {
        "AdminChanged(address,address)"(previousAdmin?: null, newAdmin?: null): AdminChangedEventFilter;
        AdminChanged(previousAdmin?: null, newAdmin?: null): AdminChangedEventFilter;
        "BassetAdded(address)"(basset?: null): BassetAddedEventFilter;
        BassetAdded(basset?: null): BassetAddedEventFilter;
        "BassetRemoved(address)"(basset?: null): BassetRemovedEventFilter;
        BassetRemoved(basset?: null): BassetRemovedEventFilter;
        "BeaconUpgraded(address)"(beacon?: PromiseOrValue<string> | null): BeaconUpgradedEventFilter;
        BeaconUpgraded(beacon?: PromiseOrValue<string> | null): BeaconUpgradedEventFilter;
        "BridgeChanged(address,address)"(basset?: null, bridge?: null): BridgeChangedEventFilter;
        BridgeChanged(basset?: null, bridge?: null): BridgeChangedEventFilter;
        "FactorChanged(address,int256)"(basset?: null, factor?: null): FactorChangedEventFilter;
        FactorChanged(basset?: null, factor?: null): FactorChangedEventFilter;
        "Initialized(uint8)"(version?: null): InitializedEventFilter;
        Initialized(version?: null): InitializedEventFilter;
        "OwnershipTransferred(address,address)"(previousOwner?: PromiseOrValue<string> | null, newOwner?: PromiseOrValue<string> | null): OwnershipTransferredEventFilter;
        OwnershipTransferred(previousOwner?: PromiseOrValue<string> | null, newOwner?: PromiseOrValue<string> | null): OwnershipTransferredEventFilter;
        "PausedChanged(address,bool)"(basset?: null, paused?: null): PausedChangedEventFilter;
        PausedChanged(basset?: null, paused?: null): PausedChangedEventFilter;
        "RangeChanged(address,uint256,uint256)"(basset?: null, min?: null, max?: null): RangeChangedEventFilter;
        RangeChanged(basset?: null, min?: null, max?: null): RangeChangedEventFilter;
        "Upgraded(address)"(implementation?: PromiseOrValue<string> | null): UpgradedEventFilter;
        Upgraded(implementation?: PromiseOrValue<string> | null): UpgradedEventFilter;
    };
    estimateGas: {
        addBasset(_basset: PromiseOrValue<string>, _factor: PromiseOrValue<BigNumberish>, _bridge: PromiseOrValue<string>, _min: PromiseOrValue<BigNumberish>, _max: PromiseOrValue<BigNumberish>, _paused: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        addBassets(_bassets: PromiseOrValue<string>[], _factors: PromiseOrValue<BigNumberish>[], _bridges: PromiseOrValue<string>[], _mins: PromiseOrValue<BigNumberish>[], _maxs: PromiseOrValue<BigNumberish>[], _pausedFlags: PromiseOrValue<boolean>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        checkBasketBalanceForDeposit(_basset: PromiseOrValue<string>, _bassetQuantity: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        checkBasketBalanceForWithdrawal(_basset: PromiseOrValue<string>, _bassetQuantity: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        convertBassetToMassetQuantity(_basset: PromiseOrValue<string>, _bassetQuantity: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        convertMassetToBassetQuantity(_basset: PromiseOrValue<string>, _massetQuantity: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        getBassetBalance(_basset: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        getBassets(overrides?: CallOverrides): Promise<BigNumber>;
        getBridge(_basset: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        getFactor(_basset: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        getPaused(_basset: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        getProxyImplementation(overrides?: CallOverrides): Promise<BigNumber>;
        getRange(_basset: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        getTotalMassetBalance(overrides?: CallOverrides): Promise<BigNumber>;
        getVersion(overrides?: CallOverrides): Promise<BigNumber>;
        initialize(_massetManager: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        isPowerOfTen(x: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        isValidBasset(_basset: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        owner(overrides?: CallOverrides): Promise<BigNumber>;
        removeBasset(_basset: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        renounceOwnership(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setBridge(_basset: PromiseOrValue<string>, _bridge: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setFactor(_basset: PromiseOrValue<string>, _factor: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setPaused(_basset: PromiseOrValue<string>, _flag: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setRange(_basset: PromiseOrValue<string>, _min: PromiseOrValue<BigNumberish>, _max: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        transferOwnership(newOwner: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
    };
    populateTransaction: {
        addBasset(_basset: PromiseOrValue<string>, _factor: PromiseOrValue<BigNumberish>, _bridge: PromiseOrValue<string>, _min: PromiseOrValue<BigNumberish>, _max: PromiseOrValue<BigNumberish>, _paused: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        addBassets(_bassets: PromiseOrValue<string>[], _factors: PromiseOrValue<BigNumberish>[], _bridges: PromiseOrValue<string>[], _mins: PromiseOrValue<BigNumberish>[], _maxs: PromiseOrValue<BigNumberish>[], _pausedFlags: PromiseOrValue<boolean>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        checkBasketBalanceForDeposit(_basset: PromiseOrValue<string>, _bassetQuantity: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        checkBasketBalanceForWithdrawal(_basset: PromiseOrValue<string>, _bassetQuantity: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        convertBassetToMassetQuantity(_basset: PromiseOrValue<string>, _bassetQuantity: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        convertMassetToBassetQuantity(_basset: PromiseOrValue<string>, _massetQuantity: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getBassetBalance(_basset: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getBassets(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getBridge(_basset: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getFactor(_basset: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getPaused(_basset: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getProxyImplementation(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getRange(_basset: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getTotalMassetBalance(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getVersion(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        initialize(_massetManager: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        isPowerOfTen(x: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        isValidBasset(_basset: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        removeBasset(_basset: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        renounceOwnership(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setBridge(_basset: PromiseOrValue<string>, _bridge: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setFactor(_basset: PromiseOrValue<string>, _factor: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setPaused(_basset: PromiseOrValue<string>, _flag: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setRange(_basset: PromiseOrValue<string>, _min: PromiseOrValue<BigNumberish>, _max: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        transferOwnership(newOwner: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
    };
}
