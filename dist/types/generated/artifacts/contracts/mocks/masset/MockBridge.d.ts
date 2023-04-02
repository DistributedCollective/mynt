import type { BaseContract, BigNumber, BigNumberish, BytesLike, CallOverrides, ContractTransaction, Overrides, PopulatedTransaction, Signer, utils } from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent, PromiseOrValue } from "../../../../common";
export interface MockBridgeInterface extends utils.Interface {
    functions: {
        "callOnTokensMinted(address,uint256,address,address)": FunctionFragment;
        "callRedeemByBridge(address,address,uint256,address)": FunctionFragment;
        "receiveTokensAt(address,uint256,address,bytes)": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "callOnTokensMinted" | "callRedeemByBridge" | "receiveTokensAt"): FunctionFragment;
    encodeFunctionData(functionFragment: "callOnTokensMinted", values: [
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<string>,
        PromiseOrValue<string>
    ]): string;
    encodeFunctionData(functionFragment: "callRedeemByBridge", values: [
        PromiseOrValue<string>,
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<string>
    ]): string;
    encodeFunctionData(functionFragment: "receiveTokensAt", values: [
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<string>,
        PromiseOrValue<BytesLike>
    ]): string;
    decodeFunctionResult(functionFragment: "callOnTokensMinted", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "callRedeemByBridge", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "receiveTokensAt", data: BytesLike): Result;
    events: {};
}
export interface MockBridge extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: MockBridgeInterface;
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
        callOnTokensMinted(massetManager: PromiseOrValue<string>, _orderAmount: PromiseOrValue<BigNumberish>, _tokenAddress: PromiseOrValue<string>, _userData: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        callRedeemByBridge(massetManager: PromiseOrValue<string>, _basset: PromiseOrValue<string>, _massetQuantity: PromiseOrValue<BigNumberish>, _recipient: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        receiveTokensAt(tokenToUse: PromiseOrValue<string>, amount: PromiseOrValue<BigNumberish>, arg2: PromiseOrValue<string>, arg3: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
    };
    callOnTokensMinted(massetManager: PromiseOrValue<string>, _orderAmount: PromiseOrValue<BigNumberish>, _tokenAddress: PromiseOrValue<string>, _userData: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    callRedeemByBridge(massetManager: PromiseOrValue<string>, _basset: PromiseOrValue<string>, _massetQuantity: PromiseOrValue<BigNumberish>, _recipient: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    receiveTokensAt(tokenToUse: PromiseOrValue<string>, amount: PromiseOrValue<BigNumberish>, arg2: PromiseOrValue<string>, arg3: PromiseOrValue<BytesLike>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    callStatic: {
        callOnTokensMinted(massetManager: PromiseOrValue<string>, _orderAmount: PromiseOrValue<BigNumberish>, _tokenAddress: PromiseOrValue<string>, _userData: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        callRedeemByBridge(massetManager: PromiseOrValue<string>, _basset: PromiseOrValue<string>, _massetQuantity: PromiseOrValue<BigNumberish>, _recipient: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        receiveTokensAt(tokenToUse: PromiseOrValue<string>, amount: PromiseOrValue<BigNumberish>, arg2: PromiseOrValue<string>, arg3: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<boolean>;
    };
    filters: {};
    estimateGas: {
        callOnTokensMinted(massetManager: PromiseOrValue<string>, _orderAmount: PromiseOrValue<BigNumberish>, _tokenAddress: PromiseOrValue<string>, _userData: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        callRedeemByBridge(massetManager: PromiseOrValue<string>, _basset: PromiseOrValue<string>, _massetQuantity: PromiseOrValue<BigNumberish>, _recipient: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        receiveTokensAt(tokenToUse: PromiseOrValue<string>, amount: PromiseOrValue<BigNumberish>, arg2: PromiseOrValue<string>, arg3: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
    };
    populateTransaction: {
        callOnTokensMinted(massetManager: PromiseOrValue<string>, _orderAmount: PromiseOrValue<BigNumberish>, _tokenAddress: PromiseOrValue<string>, _userData: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        callRedeemByBridge(massetManager: PromiseOrValue<string>, _basset: PromiseOrValue<string>, _massetQuantity: PromiseOrValue<BigNumberish>, _recipient: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        receiveTokensAt(tokenToUse: PromiseOrValue<string>, amount: PromiseOrValue<BigNumberish>, arg2: PromiseOrValue<string>, arg3: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
    };
}
