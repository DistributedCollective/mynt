import type { BaseContract, BigNumber, BigNumberish, BytesLike, CallOverrides, ContractTransaction, Overrides, PopulatedTransaction, Signer, utils } from "ethers";
import type { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent, PromiseOrValue } from "../../../common";
export interface MassetManagerInterface extends utils.Interface {
    functions: {
        "getBasketManager()": FunctionFragment;
        "getFeesManager()": FunctionFragment;
        "getFeesVault()": FunctionFragment;
        "getProxyImplementation()": FunctionFragment;
        "getToken()": FunctionFragment;
        "getVersion()": FunctionFragment;
        "initialize(address,address,bool)": FunctionFragment;
        "mint(address,uint256)": FunctionFragment;
        "mintTo(address,uint256,address)": FunctionFragment;
        "onTokensMinted(uint256,address,bytes)": FunctionFragment;
        "owner()": FunctionFragment;
        "redeem(address,uint256)": FunctionFragment;
        "redeemByBridge(address,uint256,address)": FunctionFragment;
        "redeemTo(address,uint256,address)": FunctionFragment;
        "redeemToBridge(address,uint256,address,address)": FunctionFragment;
        "redeemToBridge(address,uint256,address)": FunctionFragment;
        "renounceOwnership()": FunctionFragment;
        "tokensReceived(address,address,address,uint256,bytes,bytes)": FunctionFragment;
        "transferOwnership(address)": FunctionFragment;
        "upgradeToV3(address,address,address,address)": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "getBasketManager" | "getFeesManager" | "getFeesVault" | "getProxyImplementation" | "getToken" | "getVersion" | "initialize" | "mint" | "mintTo" | "onTokensMinted" | "owner" | "redeem" | "redeemByBridge" | "redeemTo" | "redeemToBridge(address,uint256,address,address)" | "redeemToBridge(address,uint256,address)" | "renounceOwnership" | "tokensReceived" | "transferOwnership" | "upgradeToV3"): FunctionFragment;
    encodeFunctionData(functionFragment: "getBasketManager", values?: undefined): string;
    encodeFunctionData(functionFragment: "getFeesManager", values?: undefined): string;
    encodeFunctionData(functionFragment: "getFeesVault", values?: undefined): string;
    encodeFunctionData(functionFragment: "getProxyImplementation", values?: undefined): string;
    encodeFunctionData(functionFragment: "getToken", values?: undefined): string;
    encodeFunctionData(functionFragment: "getVersion", values?: undefined): string;
    encodeFunctionData(functionFragment: "initialize", values: [
        PromiseOrValue<string>,
        PromiseOrValue<string>,
        PromiseOrValue<boolean>
    ]): string;
    encodeFunctionData(functionFragment: "mint", values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "mintTo", values: [
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<string>
    ]): string;
    encodeFunctionData(functionFragment: "onTokensMinted", values: [
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<string>,
        PromiseOrValue<BytesLike>
    ]): string;
    encodeFunctionData(functionFragment: "owner", values?: undefined): string;
    encodeFunctionData(functionFragment: "redeem", values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "redeemByBridge", values: [
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<string>
    ]): string;
    encodeFunctionData(functionFragment: "redeemTo", values: [
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<string>
    ]): string;
    encodeFunctionData(functionFragment: "redeemToBridge(address,uint256,address,address)", values: [
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<string>,
        PromiseOrValue<string>
    ]): string;
    encodeFunctionData(functionFragment: "redeemToBridge(address,uint256,address)", values: [
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<string>
    ]): string;
    encodeFunctionData(functionFragment: "renounceOwnership", values?: undefined): string;
    encodeFunctionData(functionFragment: "tokensReceived", values: [
        PromiseOrValue<string>,
        PromiseOrValue<string>,
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BytesLike>,
        PromiseOrValue<BytesLike>
    ]): string;
    encodeFunctionData(functionFragment: "transferOwnership", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "upgradeToV3", values: [
        PromiseOrValue<string>,
        PromiseOrValue<string>,
        PromiseOrValue<string>,
        PromiseOrValue<string>
    ]): string;
    decodeFunctionResult(functionFragment: "getBasketManager", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getFeesManager", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getFeesVault", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getProxyImplementation", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getToken", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getVersion", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "mint", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "mintTo", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "onTokensMinted", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "redeem", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "redeemByBridge", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "redeemTo", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "redeemToBridge(address,uint256,address,address)", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "redeemToBridge(address,uint256,address)", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "renounceOwnership", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "tokensReceived", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "transferOwnership", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "upgradeToV3", data: BytesLike): Result;
    events: {
        "AdminChanged(address,address)": EventFragment;
        "BeaconUpgraded(address)": EventFragment;
        "Initialized(uint8)": EventFragment;
        "Minted(address,address,uint256,address,uint256)": EventFragment;
        "OwnershipTransferred(address,address)": EventFragment;
        "Redeemed(address,address,uint256,address,uint256)": EventFragment;
        "Upgraded(address)": EventFragment;
        "onTokensMintedCalled(address,uint256,address,bytes)": EventFragment;
        "onTokensReceivedCalled(address,address,address,uint256,bytes,bytes)": EventFragment;
    };
    getEvent(nameOrSignatureOrTopic: "AdminChanged"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "BeaconUpgraded"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "Initialized"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "Minted"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "Redeemed"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "Upgraded"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "onTokensMintedCalled"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "onTokensReceivedCalled"): EventFragment;
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
export interface InitializedEventObject {
    version: number;
}
export type InitializedEvent = TypedEvent<[number], InitializedEventObject>;
export type InitializedEventFilter = TypedEventFilter<InitializedEvent>;
export interface MintedEventObject {
    minter: string;
    recipient: string;
    massetQuantity: BigNumber;
    bAsset: string;
    bassetQuantity: BigNumber;
}
export type MintedEvent = TypedEvent<[
    string,
    string,
    BigNumber,
    string,
    BigNumber
], MintedEventObject>;
export type MintedEventFilter = TypedEventFilter<MintedEvent>;
export interface OwnershipTransferredEventObject {
    previousOwner: string;
    newOwner: string;
}
export type OwnershipTransferredEvent = TypedEvent<[
    string,
    string
], OwnershipTransferredEventObject>;
export type OwnershipTransferredEventFilter = TypedEventFilter<OwnershipTransferredEvent>;
export interface RedeemedEventObject {
    redeemer: string;
    recipient: string;
    massetQuantity: BigNumber;
    bAsset: string;
    bassetQuantity: BigNumber;
}
export type RedeemedEvent = TypedEvent<[
    string,
    string,
    BigNumber,
    string,
    BigNumber
], RedeemedEventObject>;
export type RedeemedEventFilter = TypedEventFilter<RedeemedEvent>;
export interface UpgradedEventObject {
    implementation: string;
}
export type UpgradedEvent = TypedEvent<[string], UpgradedEventObject>;
export type UpgradedEventFilter = TypedEventFilter<UpgradedEvent>;
export interface onTokensMintedCalledEventObject {
    sender: string;
    orderAmount: BigNumber;
    tokenAddress: string;
    userData: string;
}
export type onTokensMintedCalledEvent = TypedEvent<[
    string,
    BigNumber,
    string,
    string
], onTokensMintedCalledEventObject>;
export type onTokensMintedCalledEventFilter = TypedEventFilter<onTokensMintedCalledEvent>;
export interface onTokensReceivedCalledEventObject {
    operator: string;
    from: string;
    to: string;
    amount: BigNumber;
    userData: string;
    operatorData: string;
}
export type onTokensReceivedCalledEvent = TypedEvent<[
    string,
    string,
    string,
    BigNumber,
    string,
    string
], onTokensReceivedCalledEventObject>;
export type onTokensReceivedCalledEventFilter = TypedEventFilter<onTokensReceivedCalledEvent>;
export interface MassetManager extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: MassetManagerInterface;
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
        getBasketManager(overrides?: CallOverrides): Promise<[string]>;
        getFeesManager(overrides?: CallOverrides): Promise<[string]>;
        getFeesVault(overrides?: CallOverrides): Promise<[string]>;
        getProxyImplementation(overrides?: CallOverrides): Promise<[string]>;
        getToken(overrides?: CallOverrides): Promise<[string]>;
        getVersion(overrides?: CallOverrides): Promise<[string]>;
        initialize(_basketManagerAddress: PromiseOrValue<string>, _mAssetTokenAddress: PromiseOrValue<string>, _registerAsERC777RecipientFlag: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        mint(_bAsset: PromiseOrValue<string>, _bAssetQuantity: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        mintTo(_bAsset: PromiseOrValue<string>, _bAssetQuantity: PromiseOrValue<BigNumberish>, _recipient: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        onTokensMinted(_orderAmount: PromiseOrValue<BigNumberish>, _tokenAddress: PromiseOrValue<string>, _userData: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        owner(overrides?: CallOverrides): Promise<[string]>;
        redeem(_bAsset: PromiseOrValue<string>, _massetQuantity: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        redeemByBridge(_basset: PromiseOrValue<string>, _massetQuantity: PromiseOrValue<BigNumberish>, _recipient: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        redeemTo(_bAsset: PromiseOrValue<string>, _massetQuantity: PromiseOrValue<BigNumberish>, _recipient: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        "redeemToBridge(address,uint256,address,address)"(_basset: PromiseOrValue<string>, _massetQuantity: PromiseOrValue<BigNumberish>, _recipient: PromiseOrValue<string>, _bridgeAddress: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        "redeemToBridge(address,uint256,address)"(_basset: PromiseOrValue<string>, _massetQuantity: PromiseOrValue<BigNumberish>, _recipient: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        renounceOwnership(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        tokensReceived(_operator: PromiseOrValue<string>, _from: PromiseOrValue<string>, _to: PromiseOrValue<string>, _amount: PromiseOrValue<BigNumberish>, _userData: PromiseOrValue<BytesLike>, _operatorData: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        transferOwnership(newOwner: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        upgradeToV3(_basketManagerAddress: PromiseOrValue<string>, _tokenAddress: PromiseOrValue<string>, _feesVaultAddress: PromiseOrValue<string>, _feesManagerAddress: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
    };
    getBasketManager(overrides?: CallOverrides): Promise<string>;
    getFeesManager(overrides?: CallOverrides): Promise<string>;
    getFeesVault(overrides?: CallOverrides): Promise<string>;
    getProxyImplementation(overrides?: CallOverrides): Promise<string>;
    getToken(overrides?: CallOverrides): Promise<string>;
    getVersion(overrides?: CallOverrides): Promise<string>;
    initialize(_basketManagerAddress: PromiseOrValue<string>, _mAssetTokenAddress: PromiseOrValue<string>, _registerAsERC777RecipientFlag: PromiseOrValue<boolean>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    mint(_bAsset: PromiseOrValue<string>, _bAssetQuantity: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    mintTo(_bAsset: PromiseOrValue<string>, _bAssetQuantity: PromiseOrValue<BigNumberish>, _recipient: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    onTokensMinted(_orderAmount: PromiseOrValue<BigNumberish>, _tokenAddress: PromiseOrValue<string>, _userData: PromiseOrValue<BytesLike>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    owner(overrides?: CallOverrides): Promise<string>;
    redeem(_bAsset: PromiseOrValue<string>, _massetQuantity: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    redeemByBridge(_basset: PromiseOrValue<string>, _massetQuantity: PromiseOrValue<BigNumberish>, _recipient: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    redeemTo(_bAsset: PromiseOrValue<string>, _massetQuantity: PromiseOrValue<BigNumberish>, _recipient: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    "redeemToBridge(address,uint256,address,address)"(_basset: PromiseOrValue<string>, _massetQuantity: PromiseOrValue<BigNumberish>, _recipient: PromiseOrValue<string>, _bridgeAddress: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    "redeemToBridge(address,uint256,address)"(_basset: PromiseOrValue<string>, _massetQuantity: PromiseOrValue<BigNumberish>, _recipient: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    renounceOwnership(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    tokensReceived(_operator: PromiseOrValue<string>, _from: PromiseOrValue<string>, _to: PromiseOrValue<string>, _amount: PromiseOrValue<BigNumberish>, _userData: PromiseOrValue<BytesLike>, _operatorData: PromiseOrValue<BytesLike>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    transferOwnership(newOwner: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    upgradeToV3(_basketManagerAddress: PromiseOrValue<string>, _tokenAddress: PromiseOrValue<string>, _feesVaultAddress: PromiseOrValue<string>, _feesManagerAddress: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    callStatic: {
        getBasketManager(overrides?: CallOverrides): Promise<string>;
        getFeesManager(overrides?: CallOverrides): Promise<string>;
        getFeesVault(overrides?: CallOverrides): Promise<string>;
        getProxyImplementation(overrides?: CallOverrides): Promise<string>;
        getToken(overrides?: CallOverrides): Promise<string>;
        getVersion(overrides?: CallOverrides): Promise<string>;
        initialize(_basketManagerAddress: PromiseOrValue<string>, _mAssetTokenAddress: PromiseOrValue<string>, _registerAsERC777RecipientFlag: PromiseOrValue<boolean>, overrides?: CallOverrides): Promise<void>;
        mint(_bAsset: PromiseOrValue<string>, _bAssetQuantity: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        mintTo(_bAsset: PromiseOrValue<string>, _bAssetQuantity: PromiseOrValue<BigNumberish>, _recipient: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        onTokensMinted(_orderAmount: PromiseOrValue<BigNumberish>, _tokenAddress: PromiseOrValue<string>, _userData: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
        owner(overrides?: CallOverrides): Promise<string>;
        redeem(_bAsset: PromiseOrValue<string>, _massetQuantity: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        redeemByBridge(_basset: PromiseOrValue<string>, _massetQuantity: PromiseOrValue<BigNumberish>, _recipient: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        redeemTo(_bAsset: PromiseOrValue<string>, _massetQuantity: PromiseOrValue<BigNumberish>, _recipient: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        "redeemToBridge(address,uint256,address,address)"(_basset: PromiseOrValue<string>, _massetQuantity: PromiseOrValue<BigNumberish>, _recipient: PromiseOrValue<string>, _bridgeAddress: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        "redeemToBridge(address,uint256,address)"(_basset: PromiseOrValue<string>, _massetQuantity: PromiseOrValue<BigNumberish>, _recipient: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        renounceOwnership(overrides?: CallOverrides): Promise<void>;
        tokensReceived(_operator: PromiseOrValue<string>, _from: PromiseOrValue<string>, _to: PromiseOrValue<string>, _amount: PromiseOrValue<BigNumberish>, _userData: PromiseOrValue<BytesLike>, _operatorData: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
        transferOwnership(newOwner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        upgradeToV3(_basketManagerAddress: PromiseOrValue<string>, _tokenAddress: PromiseOrValue<string>, _feesVaultAddress: PromiseOrValue<string>, _feesManagerAddress: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
    };
    filters: {
        "AdminChanged(address,address)"(previousAdmin?: null, newAdmin?: null): AdminChangedEventFilter;
        AdminChanged(previousAdmin?: null, newAdmin?: null): AdminChangedEventFilter;
        "BeaconUpgraded(address)"(beacon?: PromiseOrValue<string> | null): BeaconUpgradedEventFilter;
        BeaconUpgraded(beacon?: PromiseOrValue<string> | null): BeaconUpgradedEventFilter;
        "Initialized(uint8)"(version?: null): InitializedEventFilter;
        Initialized(version?: null): InitializedEventFilter;
        "Minted(address,address,uint256,address,uint256)"(minter?: PromiseOrValue<string> | null, recipient?: PromiseOrValue<string> | null, massetQuantity?: null, bAsset?: null, bassetQuantity?: null): MintedEventFilter;
        Minted(minter?: PromiseOrValue<string> | null, recipient?: PromiseOrValue<string> | null, massetQuantity?: null, bAsset?: null, bassetQuantity?: null): MintedEventFilter;
        "OwnershipTransferred(address,address)"(previousOwner?: PromiseOrValue<string> | null, newOwner?: PromiseOrValue<string> | null): OwnershipTransferredEventFilter;
        OwnershipTransferred(previousOwner?: PromiseOrValue<string> | null, newOwner?: PromiseOrValue<string> | null): OwnershipTransferredEventFilter;
        "Redeemed(address,address,uint256,address,uint256)"(redeemer?: PromiseOrValue<string> | null, recipient?: PromiseOrValue<string> | null, massetQuantity?: null, bAsset?: null, bassetQuantity?: null): RedeemedEventFilter;
        Redeemed(redeemer?: PromiseOrValue<string> | null, recipient?: PromiseOrValue<string> | null, massetQuantity?: null, bAsset?: null, bassetQuantity?: null): RedeemedEventFilter;
        "Upgraded(address)"(implementation?: PromiseOrValue<string> | null): UpgradedEventFilter;
        Upgraded(implementation?: PromiseOrValue<string> | null): UpgradedEventFilter;
        "onTokensMintedCalled(address,uint256,address,bytes)"(sender?: PromiseOrValue<string> | null, orderAmount?: null, tokenAddress?: null, userData?: null): onTokensMintedCalledEventFilter;
        onTokensMintedCalled(sender?: PromiseOrValue<string> | null, orderAmount?: null, tokenAddress?: null, userData?: null): onTokensMintedCalledEventFilter;
        "onTokensReceivedCalled(address,address,address,uint256,bytes,bytes)"(operator?: null, from?: null, to?: null, amount?: null, userData?: null, operatorData?: null): onTokensReceivedCalledEventFilter;
        onTokensReceivedCalled(operator?: null, from?: null, to?: null, amount?: null, userData?: null, operatorData?: null): onTokensReceivedCalledEventFilter;
    };
    estimateGas: {
        getBasketManager(overrides?: CallOverrides): Promise<BigNumber>;
        getFeesManager(overrides?: CallOverrides): Promise<BigNumber>;
        getFeesVault(overrides?: CallOverrides): Promise<BigNumber>;
        getProxyImplementation(overrides?: CallOverrides): Promise<BigNumber>;
        getToken(overrides?: CallOverrides): Promise<BigNumber>;
        getVersion(overrides?: CallOverrides): Promise<BigNumber>;
        initialize(_basketManagerAddress: PromiseOrValue<string>, _mAssetTokenAddress: PromiseOrValue<string>, _registerAsERC777RecipientFlag: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        mint(_bAsset: PromiseOrValue<string>, _bAssetQuantity: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        mintTo(_bAsset: PromiseOrValue<string>, _bAssetQuantity: PromiseOrValue<BigNumberish>, _recipient: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        onTokensMinted(_orderAmount: PromiseOrValue<BigNumberish>, _tokenAddress: PromiseOrValue<string>, _userData: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        owner(overrides?: CallOverrides): Promise<BigNumber>;
        redeem(_bAsset: PromiseOrValue<string>, _massetQuantity: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        redeemByBridge(_basset: PromiseOrValue<string>, _massetQuantity: PromiseOrValue<BigNumberish>, _recipient: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        redeemTo(_bAsset: PromiseOrValue<string>, _massetQuantity: PromiseOrValue<BigNumberish>, _recipient: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        "redeemToBridge(address,uint256,address,address)"(_basset: PromiseOrValue<string>, _massetQuantity: PromiseOrValue<BigNumberish>, _recipient: PromiseOrValue<string>, _bridgeAddress: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        "redeemToBridge(address,uint256,address)"(_basset: PromiseOrValue<string>, _massetQuantity: PromiseOrValue<BigNumberish>, _recipient: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        renounceOwnership(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        tokensReceived(_operator: PromiseOrValue<string>, _from: PromiseOrValue<string>, _to: PromiseOrValue<string>, _amount: PromiseOrValue<BigNumberish>, _userData: PromiseOrValue<BytesLike>, _operatorData: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        transferOwnership(newOwner: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        upgradeToV3(_basketManagerAddress: PromiseOrValue<string>, _tokenAddress: PromiseOrValue<string>, _feesVaultAddress: PromiseOrValue<string>, _feesManagerAddress: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
    };
    populateTransaction: {
        getBasketManager(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getFeesManager(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getFeesVault(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getProxyImplementation(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getToken(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getVersion(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        initialize(_basketManagerAddress: PromiseOrValue<string>, _mAssetTokenAddress: PromiseOrValue<string>, _registerAsERC777RecipientFlag: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        mint(_bAsset: PromiseOrValue<string>, _bAssetQuantity: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        mintTo(_bAsset: PromiseOrValue<string>, _bAssetQuantity: PromiseOrValue<BigNumberish>, _recipient: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        onTokensMinted(_orderAmount: PromiseOrValue<BigNumberish>, _tokenAddress: PromiseOrValue<string>, _userData: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        redeem(_bAsset: PromiseOrValue<string>, _massetQuantity: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        redeemByBridge(_basset: PromiseOrValue<string>, _massetQuantity: PromiseOrValue<BigNumberish>, _recipient: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        redeemTo(_bAsset: PromiseOrValue<string>, _massetQuantity: PromiseOrValue<BigNumberish>, _recipient: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        "redeemToBridge(address,uint256,address,address)"(_basset: PromiseOrValue<string>, _massetQuantity: PromiseOrValue<BigNumberish>, _recipient: PromiseOrValue<string>, _bridgeAddress: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        "redeemToBridge(address,uint256,address)"(_basset: PromiseOrValue<string>, _massetQuantity: PromiseOrValue<BigNumberish>, _recipient: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        renounceOwnership(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        tokensReceived(_operator: PromiseOrValue<string>, _from: PromiseOrValue<string>, _to: PromiseOrValue<string>, _amount: PromiseOrValue<BigNumberish>, _userData: PromiseOrValue<BytesLike>, _operatorData: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        transferOwnership(newOwner: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        upgradeToV3(_basketManagerAddress: PromiseOrValue<string>, _tokenAddress: PromiseOrValue<string>, _feesVaultAddress: PromiseOrValue<string>, _feesManagerAddress: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
    };
}
