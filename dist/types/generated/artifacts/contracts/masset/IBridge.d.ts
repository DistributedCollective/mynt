import type { BaseContract, BigNumber, BigNumberish, BytesLike, CallOverrides, ContractTransaction, Overrides, PopulatedTransaction, Signer, utils } from "ethers";
import type { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent, PromiseOrValue } from "../../../common";
export interface IBridgeInterface extends utils.Interface {
    functions: {
        "acceptTransfer(address,address,uint256,string,bytes32,bytes32,uint32,uint8,uint256)": FunctionFragment;
        "acceptTransferAt(address,address,uint256,string,bytes32,bytes32,uint32,uint8,uint256,bytes)": FunctionFragment;
        "calcMaxWithdraw()": FunctionFragment;
        "getFeePercentage()": FunctionFragment;
        "receiveTokens(address,uint256)": FunctionFragment;
        "receiveTokensAt(address,uint256,address,bytes)": FunctionFragment;
        "tokensReceived(address,address,address,uint256,bytes,bytes)": FunctionFragment;
        "version()": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "acceptTransfer" | "acceptTransferAt" | "calcMaxWithdraw" | "getFeePercentage" | "receiveTokens" | "receiveTokensAt" | "tokensReceived" | "version"): FunctionFragment;
    encodeFunctionData(functionFragment: "acceptTransfer", values: [
        PromiseOrValue<string>,
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<string>,
        PromiseOrValue<BytesLike>,
        PromiseOrValue<BytesLike>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>
    ]): string;
    encodeFunctionData(functionFragment: "acceptTransferAt", values: [
        PromiseOrValue<string>,
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<string>,
        PromiseOrValue<BytesLike>,
        PromiseOrValue<BytesLike>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BytesLike>
    ]): string;
    encodeFunctionData(functionFragment: "calcMaxWithdraw", values?: undefined): string;
    encodeFunctionData(functionFragment: "getFeePercentage", values?: undefined): string;
    encodeFunctionData(functionFragment: "receiveTokens", values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "receiveTokensAt", values: [
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<string>,
        PromiseOrValue<BytesLike>
    ]): string;
    encodeFunctionData(functionFragment: "tokensReceived", values: [
        PromiseOrValue<string>,
        PromiseOrValue<string>,
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BytesLike>,
        PromiseOrValue<BytesLike>
    ]): string;
    encodeFunctionData(functionFragment: "version", values?: undefined): string;
    decodeFunctionResult(functionFragment: "acceptTransfer", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "acceptTransferAt", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "calcMaxWithdraw", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getFeePercentage", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "receiveTokens", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "receiveTokensAt", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "tokensReceived", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "version", data: BytesLike): Result;
    events: {
        "AcceptedCrossTransfer(address,address,uint256,uint8,uint256,uint256,uint8,uint256,bytes)": EventFragment;
        "Cross(address,address,uint256,string,bytes,uint8,uint256)": EventFragment;
        "ErrorTokenReceiver(bytes)": EventFragment;
        "FeePercentageChanged(uint256)": EventFragment;
        "NewSideToken(address,address,string,uint256)": EventFragment;
    };
    getEvent(nameOrSignatureOrTopic: "AcceptedCrossTransfer"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "Cross"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "ErrorTokenReceiver"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "FeePercentageChanged"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "NewSideToken"): EventFragment;
}
export interface AcceptedCrossTransferEventObject {
    _tokenAddress: string;
    _to: string;
    _amount: BigNumber;
    _decimals: number;
    _granularity: BigNumber;
    _formattedAmount: BigNumber;
    _calculatedDecimals: number;
    _calculatedGranularity: BigNumber;
    _userData: string;
}
export type AcceptedCrossTransferEvent = TypedEvent<[
    string,
    string,
    BigNumber,
    number,
    BigNumber,
    BigNumber,
    number,
    BigNumber,
    string
], AcceptedCrossTransferEventObject>;
export type AcceptedCrossTransferEventFilter = TypedEventFilter<AcceptedCrossTransferEvent>;
export interface CrossEventObject {
    _tokenAddress: string;
    _to: string;
    _amount: BigNumber;
    _symbol: string;
    _userData: string;
    _decimals: number;
    _granularity: BigNumber;
}
export type CrossEvent = TypedEvent<[
    string,
    string,
    BigNumber,
    string,
    string,
    number,
    BigNumber
], CrossEventObject>;
export type CrossEventFilter = TypedEventFilter<CrossEvent>;
export interface ErrorTokenReceiverEventObject {
    _errorData: string;
}
export type ErrorTokenReceiverEvent = TypedEvent<[
    string
], ErrorTokenReceiverEventObject>;
export type ErrorTokenReceiverEventFilter = TypedEventFilter<ErrorTokenReceiverEvent>;
export interface FeePercentageChangedEventObject {
    _amount: BigNumber;
}
export type FeePercentageChangedEvent = TypedEvent<[
    BigNumber
], FeePercentageChangedEventObject>;
export type FeePercentageChangedEventFilter = TypedEventFilter<FeePercentageChangedEvent>;
export interface NewSideTokenEventObject {
    _newSideTokenAddress: string;
    _originalTokenAddress: string;
    _newSymbol: string;
    _granularity: BigNumber;
}
export type NewSideTokenEvent = TypedEvent<[
    string,
    string,
    string,
    BigNumber
], NewSideTokenEventObject>;
export type NewSideTokenEventFilter = TypedEventFilter<NewSideTokenEvent>;
export interface IBridge extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: IBridgeInterface;
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
        acceptTransfer(originalTokenAddress: PromiseOrValue<string>, receiver: PromiseOrValue<string>, amount: PromiseOrValue<BigNumberish>, symbol: PromiseOrValue<string>, blockHash: PromiseOrValue<BytesLike>, transactionHash: PromiseOrValue<BytesLike>, logIndex: PromiseOrValue<BigNumberish>, decimals: PromiseOrValue<BigNumberish>, granularity: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        acceptTransferAt(originalTokenAddress: PromiseOrValue<string>, receiver: PromiseOrValue<string>, amount: PromiseOrValue<BigNumberish>, symbol: PromiseOrValue<string>, blockHash: PromiseOrValue<BytesLike>, transactionHash: PromiseOrValue<BytesLike>, logIndex: PromiseOrValue<BigNumberish>, decimals: PromiseOrValue<BigNumberish>, granularity: PromiseOrValue<BigNumberish>, userData: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        calcMaxWithdraw(overrides?: CallOverrides): Promise<[BigNumber]>;
        getFeePercentage(overrides?: CallOverrides): Promise<[BigNumber]>;
        receiveTokens(tokenToUse: PromiseOrValue<string>, amount: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        receiveTokensAt(tokenToUse: PromiseOrValue<string>, amount: PromiseOrValue<BigNumberish>, receiver: PromiseOrValue<string>, extraData: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        tokensReceived(operator: PromiseOrValue<string>, from: PromiseOrValue<string>, to: PromiseOrValue<string>, amount: PromiseOrValue<BigNumberish>, userData: PromiseOrValue<BytesLike>, operatorData: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        version(overrides?: CallOverrides): Promise<[string]>;
    };
    acceptTransfer(originalTokenAddress: PromiseOrValue<string>, receiver: PromiseOrValue<string>, amount: PromiseOrValue<BigNumberish>, symbol: PromiseOrValue<string>, blockHash: PromiseOrValue<BytesLike>, transactionHash: PromiseOrValue<BytesLike>, logIndex: PromiseOrValue<BigNumberish>, decimals: PromiseOrValue<BigNumberish>, granularity: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    acceptTransferAt(originalTokenAddress: PromiseOrValue<string>, receiver: PromiseOrValue<string>, amount: PromiseOrValue<BigNumberish>, symbol: PromiseOrValue<string>, blockHash: PromiseOrValue<BytesLike>, transactionHash: PromiseOrValue<BytesLike>, logIndex: PromiseOrValue<BigNumberish>, decimals: PromiseOrValue<BigNumberish>, granularity: PromiseOrValue<BigNumberish>, userData: PromiseOrValue<BytesLike>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    calcMaxWithdraw(overrides?: CallOverrides): Promise<BigNumber>;
    getFeePercentage(overrides?: CallOverrides): Promise<BigNumber>;
    receiveTokens(tokenToUse: PromiseOrValue<string>, amount: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    receiveTokensAt(tokenToUse: PromiseOrValue<string>, amount: PromiseOrValue<BigNumberish>, receiver: PromiseOrValue<string>, extraData: PromiseOrValue<BytesLike>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    tokensReceived(operator: PromiseOrValue<string>, from: PromiseOrValue<string>, to: PromiseOrValue<string>, amount: PromiseOrValue<BigNumberish>, userData: PromiseOrValue<BytesLike>, operatorData: PromiseOrValue<BytesLike>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    version(overrides?: CallOverrides): Promise<string>;
    callStatic: {
        acceptTransfer(originalTokenAddress: PromiseOrValue<string>, receiver: PromiseOrValue<string>, amount: PromiseOrValue<BigNumberish>, symbol: PromiseOrValue<string>, blockHash: PromiseOrValue<BytesLike>, transactionHash: PromiseOrValue<BytesLike>, logIndex: PromiseOrValue<BigNumberish>, decimals: PromiseOrValue<BigNumberish>, granularity: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<boolean>;
        acceptTransferAt(originalTokenAddress: PromiseOrValue<string>, receiver: PromiseOrValue<string>, amount: PromiseOrValue<BigNumberish>, symbol: PromiseOrValue<string>, blockHash: PromiseOrValue<BytesLike>, transactionHash: PromiseOrValue<BytesLike>, logIndex: PromiseOrValue<BigNumberish>, decimals: PromiseOrValue<BigNumberish>, granularity: PromiseOrValue<BigNumberish>, userData: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<boolean>;
        calcMaxWithdraw(overrides?: CallOverrides): Promise<BigNumber>;
        getFeePercentage(overrides?: CallOverrides): Promise<BigNumber>;
        receiveTokens(tokenToUse: PromiseOrValue<string>, amount: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<boolean>;
        receiveTokensAt(tokenToUse: PromiseOrValue<string>, amount: PromiseOrValue<BigNumberish>, receiver: PromiseOrValue<string>, extraData: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<boolean>;
        tokensReceived(operator: PromiseOrValue<string>, from: PromiseOrValue<string>, to: PromiseOrValue<string>, amount: PromiseOrValue<BigNumberish>, userData: PromiseOrValue<BytesLike>, operatorData: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
        version(overrides?: CallOverrides): Promise<string>;
    };
    filters: {
        "AcceptedCrossTransfer(address,address,uint256,uint8,uint256,uint256,uint8,uint256,bytes)"(_tokenAddress?: PromiseOrValue<string> | null, _to?: PromiseOrValue<string> | null, _amount?: null, _decimals?: null, _granularity?: null, _formattedAmount?: null, _calculatedDecimals?: null, _calculatedGranularity?: null, _userData?: null): AcceptedCrossTransferEventFilter;
        AcceptedCrossTransfer(_tokenAddress?: PromiseOrValue<string> | null, _to?: PromiseOrValue<string> | null, _amount?: null, _decimals?: null, _granularity?: null, _formattedAmount?: null, _calculatedDecimals?: null, _calculatedGranularity?: null, _userData?: null): AcceptedCrossTransferEventFilter;
        "Cross(address,address,uint256,string,bytes,uint8,uint256)"(_tokenAddress?: PromiseOrValue<string> | null, _to?: PromiseOrValue<string> | null, _amount?: null, _symbol?: null, _userData?: null, _decimals?: null, _granularity?: null): CrossEventFilter;
        Cross(_tokenAddress?: PromiseOrValue<string> | null, _to?: PromiseOrValue<string> | null, _amount?: null, _symbol?: null, _userData?: null, _decimals?: null, _granularity?: null): CrossEventFilter;
        "ErrorTokenReceiver(bytes)"(_errorData?: null): ErrorTokenReceiverEventFilter;
        ErrorTokenReceiver(_errorData?: null): ErrorTokenReceiverEventFilter;
        "FeePercentageChanged(uint256)"(_amount?: null): FeePercentageChangedEventFilter;
        FeePercentageChanged(_amount?: null): FeePercentageChangedEventFilter;
        "NewSideToken(address,address,string,uint256)"(_newSideTokenAddress?: PromiseOrValue<string> | null, _originalTokenAddress?: PromiseOrValue<string> | null, _newSymbol?: null, _granularity?: null): NewSideTokenEventFilter;
        NewSideToken(_newSideTokenAddress?: PromiseOrValue<string> | null, _originalTokenAddress?: PromiseOrValue<string> | null, _newSymbol?: null, _granularity?: null): NewSideTokenEventFilter;
    };
    estimateGas: {
        acceptTransfer(originalTokenAddress: PromiseOrValue<string>, receiver: PromiseOrValue<string>, amount: PromiseOrValue<BigNumberish>, symbol: PromiseOrValue<string>, blockHash: PromiseOrValue<BytesLike>, transactionHash: PromiseOrValue<BytesLike>, logIndex: PromiseOrValue<BigNumberish>, decimals: PromiseOrValue<BigNumberish>, granularity: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        acceptTransferAt(originalTokenAddress: PromiseOrValue<string>, receiver: PromiseOrValue<string>, amount: PromiseOrValue<BigNumberish>, symbol: PromiseOrValue<string>, blockHash: PromiseOrValue<BytesLike>, transactionHash: PromiseOrValue<BytesLike>, logIndex: PromiseOrValue<BigNumberish>, decimals: PromiseOrValue<BigNumberish>, granularity: PromiseOrValue<BigNumberish>, userData: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        calcMaxWithdraw(overrides?: CallOverrides): Promise<BigNumber>;
        getFeePercentage(overrides?: CallOverrides): Promise<BigNumber>;
        receiveTokens(tokenToUse: PromiseOrValue<string>, amount: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        receiveTokensAt(tokenToUse: PromiseOrValue<string>, amount: PromiseOrValue<BigNumberish>, receiver: PromiseOrValue<string>, extraData: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        tokensReceived(operator: PromiseOrValue<string>, from: PromiseOrValue<string>, to: PromiseOrValue<string>, amount: PromiseOrValue<BigNumberish>, userData: PromiseOrValue<BytesLike>, operatorData: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        version(overrides?: CallOverrides): Promise<BigNumber>;
    };
    populateTransaction: {
        acceptTransfer(originalTokenAddress: PromiseOrValue<string>, receiver: PromiseOrValue<string>, amount: PromiseOrValue<BigNumberish>, symbol: PromiseOrValue<string>, blockHash: PromiseOrValue<BytesLike>, transactionHash: PromiseOrValue<BytesLike>, logIndex: PromiseOrValue<BigNumberish>, decimals: PromiseOrValue<BigNumberish>, granularity: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        acceptTransferAt(originalTokenAddress: PromiseOrValue<string>, receiver: PromiseOrValue<string>, amount: PromiseOrValue<BigNumberish>, symbol: PromiseOrValue<string>, blockHash: PromiseOrValue<BytesLike>, transactionHash: PromiseOrValue<BytesLike>, logIndex: PromiseOrValue<BigNumberish>, decimals: PromiseOrValue<BigNumberish>, granularity: PromiseOrValue<BigNumberish>, userData: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        calcMaxWithdraw(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getFeePercentage(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        receiveTokens(tokenToUse: PromiseOrValue<string>, amount: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        receiveTokensAt(tokenToUse: PromiseOrValue<string>, amount: PromiseOrValue<BigNumberish>, receiver: PromiseOrValue<string>, extraData: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        tokensReceived(operator: PromiseOrValue<string>, from: PromiseOrValue<string>, to: PromiseOrValue<string>, amount: PromiseOrValue<BigNumberish>, userData: PromiseOrValue<BytesLike>, operatorData: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        version(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    };
}
