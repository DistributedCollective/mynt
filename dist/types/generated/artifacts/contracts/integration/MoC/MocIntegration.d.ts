import type { BaseContract, BigNumber, BigNumberish, BytesLike, CallOverrides, ContractTransaction, Overrides, PopulatedTransaction, Signer, utils } from "ethers";
import type { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent, PromiseOrValue } from "../../../../common";
export type PermitParamsStruct = {
    deadline: PromiseOrValue<BigNumberish>;
    v: PromiseOrValue<BigNumberish>;
    r: PromiseOrValue<BytesLike>;
    s: PromiseOrValue<BytesLike>;
};
export type PermitParamsStructOutput = [BigNumber, number, string, string] & {
    deadline: BigNumber;
    v: number;
    r: string;
    s: string;
};
export interface MocIntegrationInterface extends utils.Interface {
    functions: {
        "dllr()": FunctionFragment;
        "doc()": FunctionFragment;
        "getDocFromDllrAndRedeemRBTC(uint256,(uint256,uint8,bytes32,bytes32))": FunctionFragment;
        "getProxyImplementation()": FunctionFragment;
        "initialize(address)": FunctionFragment;
        "massetManager()": FunctionFragment;
        "moc()": FunctionFragment;
        "mocVendorAccount()": FunctionFragment;
        "owner()": FunctionFragment;
        "renounceOwnership()": FunctionFragment;
        "setMocVendorAccount(address)": FunctionFragment;
        "transferOwnership(address)": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "dllr" | "doc" | "getDocFromDllrAndRedeemRBTC" | "getProxyImplementation" | "initialize" | "massetManager" | "moc" | "mocVendorAccount" | "owner" | "renounceOwnership" | "setMocVendorAccount" | "transferOwnership"): FunctionFragment;
    encodeFunctionData(functionFragment: "dllr", values?: undefined): string;
    encodeFunctionData(functionFragment: "doc", values?: undefined): string;
    encodeFunctionData(functionFragment: "getDocFromDllrAndRedeemRBTC", values: [PromiseOrValue<BigNumberish>, PermitParamsStruct]): string;
    encodeFunctionData(functionFragment: "getProxyImplementation", values?: undefined): string;
    encodeFunctionData(functionFragment: "initialize", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "massetManager", values?: undefined): string;
    encodeFunctionData(functionFragment: "moc", values?: undefined): string;
    encodeFunctionData(functionFragment: "mocVendorAccount", values?: undefined): string;
    encodeFunctionData(functionFragment: "owner", values?: undefined): string;
    encodeFunctionData(functionFragment: "renounceOwnership", values?: undefined): string;
    encodeFunctionData(functionFragment: "setMocVendorAccount", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "transferOwnership", values: [PromiseOrValue<string>]): string;
    decodeFunctionResult(functionFragment: "dllr", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "doc", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getDocFromDllrAndRedeemRBTC", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getProxyImplementation", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "massetManager", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "moc", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "mocVendorAccount", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "renounceOwnership", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setMocVendorAccount", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "transferOwnership", data: BytesLike): Result;
    events: {
        "AdminChanged(address,address)": EventFragment;
        "BeaconUpgraded(address)": EventFragment;
        "GetDocFromDllrAndRedeemRBTC(uint256,uint256)": EventFragment;
        "Initialized(uint8)": EventFragment;
        "MocVendorAccountSet(address)": EventFragment;
        "OwnershipTransferred(address,address)": EventFragment;
        "Upgraded(address)": EventFragment;
    };
    getEvent(nameOrSignatureOrTopic: "AdminChanged"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "BeaconUpgraded"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "GetDocFromDllrAndRedeemRBTC"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "Initialized"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "MocVendorAccountSet"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
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
export interface BeaconUpgradedEventObject {
    beacon: string;
}
export type BeaconUpgradedEvent = TypedEvent<[
    string
], BeaconUpgradedEventObject>;
export type BeaconUpgradedEventFilter = TypedEventFilter<BeaconUpgradedEvent>;
export interface GetDocFromDllrAndRedeemRBTCEventObject {
    fromDLLR: BigNumber;
    toRBTC: BigNumber;
}
export type GetDocFromDllrAndRedeemRBTCEvent = TypedEvent<[
    BigNumber,
    BigNumber
], GetDocFromDllrAndRedeemRBTCEventObject>;
export type GetDocFromDllrAndRedeemRBTCEventFilter = TypedEventFilter<GetDocFromDllrAndRedeemRBTCEvent>;
export interface InitializedEventObject {
    version: number;
}
export type InitializedEvent = TypedEvent<[number], InitializedEventObject>;
export type InitializedEventFilter = TypedEventFilter<InitializedEvent>;
export interface MocVendorAccountSetEventObject {
    newMocVendorAccount: string;
}
export type MocVendorAccountSetEvent = TypedEvent<[
    string
], MocVendorAccountSetEventObject>;
export type MocVendorAccountSetEventFilter = TypedEventFilter<MocVendorAccountSetEvent>;
export interface OwnershipTransferredEventObject {
    previousOwner: string;
    newOwner: string;
}
export type OwnershipTransferredEvent = TypedEvent<[
    string,
    string
], OwnershipTransferredEventObject>;
export type OwnershipTransferredEventFilter = TypedEventFilter<OwnershipTransferredEvent>;
export interface UpgradedEventObject {
    implementation: string;
}
export type UpgradedEvent = TypedEvent<[string], UpgradedEventObject>;
export type UpgradedEventFilter = TypedEventFilter<UpgradedEvent>;
export interface MocIntegration extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: MocIntegrationInterface;
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
        dllr(overrides?: CallOverrides): Promise<[string]>;
        doc(overrides?: CallOverrides): Promise<[string]>;
        getDocFromDllrAndRedeemRBTC(_dllrAmount: PromiseOrValue<BigNumberish>, _permitParams: PermitParamsStruct, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        getProxyImplementation(overrides?: CallOverrides): Promise<[string]>;
        initialize(_mocVendorAccount: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        massetManager(overrides?: CallOverrides): Promise<[string]>;
        moc(overrides?: CallOverrides): Promise<[string]>;
        mocVendorAccount(overrides?: CallOverrides): Promise<[string]>;
        owner(overrides?: CallOverrides): Promise<[string]>;
        renounceOwnership(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setMocVendorAccount(newMocVedorAccount: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        transferOwnership(newOwner: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
    };
    dllr(overrides?: CallOverrides): Promise<string>;
    doc(overrides?: CallOverrides): Promise<string>;
    getDocFromDllrAndRedeemRBTC(_dllrAmount: PromiseOrValue<BigNumberish>, _permitParams: PermitParamsStruct, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    getProxyImplementation(overrides?: CallOverrides): Promise<string>;
    initialize(_mocVendorAccount: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    massetManager(overrides?: CallOverrides): Promise<string>;
    moc(overrides?: CallOverrides): Promise<string>;
    mocVendorAccount(overrides?: CallOverrides): Promise<string>;
    owner(overrides?: CallOverrides): Promise<string>;
    renounceOwnership(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setMocVendorAccount(newMocVedorAccount: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    transferOwnership(newOwner: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    callStatic: {
        dllr(overrides?: CallOverrides): Promise<string>;
        doc(overrides?: CallOverrides): Promise<string>;
        getDocFromDllrAndRedeemRBTC(_dllrAmount: PromiseOrValue<BigNumberish>, _permitParams: PermitParamsStruct, overrides?: CallOverrides): Promise<void>;
        getProxyImplementation(overrides?: CallOverrides): Promise<string>;
        initialize(_mocVendorAccount: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        massetManager(overrides?: CallOverrides): Promise<string>;
        moc(overrides?: CallOverrides): Promise<string>;
        mocVendorAccount(overrides?: CallOverrides): Promise<string>;
        owner(overrides?: CallOverrides): Promise<string>;
        renounceOwnership(overrides?: CallOverrides): Promise<void>;
        setMocVendorAccount(newMocVedorAccount: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        transferOwnership(newOwner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
    };
    filters: {
        "AdminChanged(address,address)"(previousAdmin?: null, newAdmin?: null): AdminChangedEventFilter;
        AdminChanged(previousAdmin?: null, newAdmin?: null): AdminChangedEventFilter;
        "BeaconUpgraded(address)"(beacon?: PromiseOrValue<string> | null): BeaconUpgradedEventFilter;
        BeaconUpgraded(beacon?: PromiseOrValue<string> | null): BeaconUpgradedEventFilter;
        "GetDocFromDllrAndRedeemRBTC(uint256,uint256)"(fromDLLR?: null, toRBTC?: null): GetDocFromDllrAndRedeemRBTCEventFilter;
        GetDocFromDllrAndRedeemRBTC(fromDLLR?: null, toRBTC?: null): GetDocFromDllrAndRedeemRBTCEventFilter;
        "Initialized(uint8)"(version?: null): InitializedEventFilter;
        Initialized(version?: null): InitializedEventFilter;
        "MocVendorAccountSet(address)"(newMocVendorAccount?: null): MocVendorAccountSetEventFilter;
        MocVendorAccountSet(newMocVendorAccount?: null): MocVendorAccountSetEventFilter;
        "OwnershipTransferred(address,address)"(previousOwner?: PromiseOrValue<string> | null, newOwner?: PromiseOrValue<string> | null): OwnershipTransferredEventFilter;
        OwnershipTransferred(previousOwner?: PromiseOrValue<string> | null, newOwner?: PromiseOrValue<string> | null): OwnershipTransferredEventFilter;
        "Upgraded(address)"(implementation?: PromiseOrValue<string> | null): UpgradedEventFilter;
        Upgraded(implementation?: PromiseOrValue<string> | null): UpgradedEventFilter;
    };
    estimateGas: {
        dllr(overrides?: CallOverrides): Promise<BigNumber>;
        doc(overrides?: CallOverrides): Promise<BigNumber>;
        getDocFromDllrAndRedeemRBTC(_dllrAmount: PromiseOrValue<BigNumberish>, _permitParams: PermitParamsStruct, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        getProxyImplementation(overrides?: CallOverrides): Promise<BigNumber>;
        initialize(_mocVendorAccount: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        massetManager(overrides?: CallOverrides): Promise<BigNumber>;
        moc(overrides?: CallOverrides): Promise<BigNumber>;
        mocVendorAccount(overrides?: CallOverrides): Promise<BigNumber>;
        owner(overrides?: CallOverrides): Promise<BigNumber>;
        renounceOwnership(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setMocVendorAccount(newMocVedorAccount: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        transferOwnership(newOwner: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
    };
    populateTransaction: {
        dllr(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        doc(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getDocFromDllrAndRedeemRBTC(_dllrAmount: PromiseOrValue<BigNumberish>, _permitParams: PermitParamsStruct, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        getProxyImplementation(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        initialize(_mocVendorAccount: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        massetManager(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        moc(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        mocVendorAccount(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        renounceOwnership(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setMocVendorAccount(newMocVedorAccount: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        transferOwnership(newOwner: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
    };
}
