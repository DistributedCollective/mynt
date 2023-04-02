import type { BaseContract, BigNumber, BigNumberish, BytesLike, CallOverrides, ContractTransaction, Overrides, PayableOverrides, PopulatedTransaction, Signer, utils } from "ethers";
import type { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent, PromiseOrValue } from "../../common";
export declare namespace GovernorAlpha {
    type ReceiptStruct = {
        hasVoted: PromiseOrValue<boolean>;
        support: PromiseOrValue<boolean>;
        votes: PromiseOrValue<BigNumberish>;
    };
    type ReceiptStructOutput = [boolean, boolean, BigNumber] & {
        hasVoted: boolean;
        support: boolean;
        votes: BigNumber;
    };
}
export interface GovernorAlphaInterface extends utils.Interface {
    functions: {
        "BALLOT_TYPEHASH()": FunctionFragment;
        "DOMAIN_TYPEHASH()": FunctionFragment;
        "NAME()": FunctionFragment;
        "__abdicate()": FunctionFragment;
        "__acceptAdmin()": FunctionFragment;
        "__executeSetTimelockPendingAdmin(address,uint256)": FunctionFragment;
        "__queueSetTimelockPendingAdmin(address,uint256)": FunctionFragment;
        "cancel(uint256)": FunctionFragment;
        "castVote(uint256,bool)": FunctionFragment;
        "castVoteBySig(uint256,bool,uint8,bytes32,bytes32)": FunctionFragment;
        "execute(uint256)": FunctionFragment;
        "getActions(uint256)": FunctionFragment;
        "getReceipt(uint256,address)": FunctionFragment;
        "guardian()": FunctionFragment;
        "latestProposalIds(address)": FunctionFragment;
        "majorityPercentageVotes()": FunctionFragment;
        "proposalCount()": FunctionFragment;
        "proposalMaxOperations()": FunctionFragment;
        "proposalThreshold()": FunctionFragment;
        "proposals(uint256)": FunctionFragment;
        "propose(address[],uint256[],string[],bytes[],string)": FunctionFragment;
        "queue(uint256)": FunctionFragment;
        "quorumPercentageVotes()": FunctionFragment;
        "quorumVotes()": FunctionFragment;
        "staking()": FunctionFragment;
        "state(uint256)": FunctionFragment;
        "timelock()": FunctionFragment;
        "votingDelay()": FunctionFragment;
        "votingPeriod()": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "BALLOT_TYPEHASH" | "DOMAIN_TYPEHASH" | "NAME" | "__abdicate" | "__acceptAdmin" | "__executeSetTimelockPendingAdmin" | "__queueSetTimelockPendingAdmin" | "cancel" | "castVote" | "castVoteBySig" | "execute" | "getActions" | "getReceipt" | "guardian" | "latestProposalIds" | "majorityPercentageVotes" | "proposalCount" | "proposalMaxOperations" | "proposalThreshold" | "proposals" | "propose" | "queue" | "quorumPercentageVotes" | "quorumVotes" | "staking" | "state" | "timelock" | "votingDelay" | "votingPeriod"): FunctionFragment;
    encodeFunctionData(functionFragment: "BALLOT_TYPEHASH", values?: undefined): string;
    encodeFunctionData(functionFragment: "DOMAIN_TYPEHASH", values?: undefined): string;
    encodeFunctionData(functionFragment: "NAME", values?: undefined): string;
    encodeFunctionData(functionFragment: "__abdicate", values?: undefined): string;
    encodeFunctionData(functionFragment: "__acceptAdmin", values?: undefined): string;
    encodeFunctionData(functionFragment: "__executeSetTimelockPendingAdmin", values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "__queueSetTimelockPendingAdmin", values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "cancel", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "castVote", values: [PromiseOrValue<BigNumberish>, PromiseOrValue<boolean>]): string;
    encodeFunctionData(functionFragment: "castVoteBySig", values: [
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<boolean>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BytesLike>,
        PromiseOrValue<BytesLike>
    ]): string;
    encodeFunctionData(functionFragment: "execute", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "getActions", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "getReceipt", values: [PromiseOrValue<BigNumberish>, PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "guardian", values?: undefined): string;
    encodeFunctionData(functionFragment: "latestProposalIds", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "majorityPercentageVotes", values?: undefined): string;
    encodeFunctionData(functionFragment: "proposalCount", values?: undefined): string;
    encodeFunctionData(functionFragment: "proposalMaxOperations", values?: undefined): string;
    encodeFunctionData(functionFragment: "proposalThreshold", values?: undefined): string;
    encodeFunctionData(functionFragment: "proposals", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "propose", values: [
        PromiseOrValue<string>[],
        PromiseOrValue<BigNumberish>[],
        PromiseOrValue<string>[],
        PromiseOrValue<BytesLike>[],
        PromiseOrValue<string>
    ]): string;
    encodeFunctionData(functionFragment: "queue", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "quorumPercentageVotes", values?: undefined): string;
    encodeFunctionData(functionFragment: "quorumVotes", values?: undefined): string;
    encodeFunctionData(functionFragment: "staking", values?: undefined): string;
    encodeFunctionData(functionFragment: "state", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "timelock", values?: undefined): string;
    encodeFunctionData(functionFragment: "votingDelay", values?: undefined): string;
    encodeFunctionData(functionFragment: "votingPeriod", values?: undefined): string;
    decodeFunctionResult(functionFragment: "BALLOT_TYPEHASH", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "DOMAIN_TYPEHASH", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "NAME", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "__abdicate", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "__acceptAdmin", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "__executeSetTimelockPendingAdmin", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "__queueSetTimelockPendingAdmin", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "cancel", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "castVote", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "castVoteBySig", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "execute", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getActions", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getReceipt", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "guardian", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "latestProposalIds", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "majorityPercentageVotes", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "proposalCount", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "proposalMaxOperations", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "proposalThreshold", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "proposals", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "propose", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "queue", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "quorumPercentageVotes", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "quorumVotes", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "staking", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "state", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "timelock", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "votingDelay", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "votingPeriod", data: BytesLike): Result;
    events: {
        "ProposalCanceled(uint256)": EventFragment;
        "ProposalCreated(uint256,address,address[],uint256[],string[],bytes[],uint256,uint256,string)": EventFragment;
        "ProposalExecuted(uint256)": EventFragment;
        "ProposalQueued(uint256,uint256)": EventFragment;
        "VoteCast(address,uint256,bool,uint256)": EventFragment;
    };
    getEvent(nameOrSignatureOrTopic: "ProposalCanceled"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "ProposalCreated"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "ProposalExecuted"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "ProposalQueued"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "VoteCast"): EventFragment;
}
export interface ProposalCanceledEventObject {
    id: BigNumber;
}
export type ProposalCanceledEvent = TypedEvent<[
    BigNumber
], ProposalCanceledEventObject>;
export type ProposalCanceledEventFilter = TypedEventFilter<ProposalCanceledEvent>;
export interface ProposalCreatedEventObject {
    id: BigNumber;
    proposer: string;
    targets: string[];
    values: BigNumber[];
    signatures: string[];
    calldatas: string[];
    startBlock: BigNumber;
    endBlock: BigNumber;
    description: string;
}
export type ProposalCreatedEvent = TypedEvent<[
    BigNumber,
    string,
    string[],
    BigNumber[],
    string[],
    string[],
    BigNumber,
    BigNumber,
    string
], ProposalCreatedEventObject>;
export type ProposalCreatedEventFilter = TypedEventFilter<ProposalCreatedEvent>;
export interface ProposalExecutedEventObject {
    id: BigNumber;
}
export type ProposalExecutedEvent = TypedEvent<[
    BigNumber
], ProposalExecutedEventObject>;
export type ProposalExecutedEventFilter = TypedEventFilter<ProposalExecutedEvent>;
export interface ProposalQueuedEventObject {
    id: BigNumber;
    eta: BigNumber;
}
export type ProposalQueuedEvent = TypedEvent<[
    BigNumber,
    BigNumber
], ProposalQueuedEventObject>;
export type ProposalQueuedEventFilter = TypedEventFilter<ProposalQueuedEvent>;
export interface VoteCastEventObject {
    voter: string;
    proposalId: BigNumber;
    support: boolean;
    votes: BigNumber;
}
export type VoteCastEvent = TypedEvent<[
    string,
    BigNumber,
    boolean,
    BigNumber
], VoteCastEventObject>;
export type VoteCastEventFilter = TypedEventFilter<VoteCastEvent>;
export interface GovernorAlpha extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: GovernorAlphaInterface;
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
        BALLOT_TYPEHASH(overrides?: CallOverrides): Promise<[string]>;
        DOMAIN_TYPEHASH(overrides?: CallOverrides): Promise<[string]>;
        NAME(overrides?: CallOverrides): Promise<[string]>;
        __abdicate(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        __acceptAdmin(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        __executeSetTimelockPendingAdmin(newPendingAdmin: PromiseOrValue<string>, eta: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        __queueSetTimelockPendingAdmin(newPendingAdmin: PromiseOrValue<string>, eta: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        cancel(proposalId: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        castVote(proposalId: PromiseOrValue<BigNumberish>, support: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        castVoteBySig(proposalId: PromiseOrValue<BigNumberish>, support: PromiseOrValue<boolean>, v: PromiseOrValue<BigNumberish>, r: PromiseOrValue<BytesLike>, s: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        execute(proposalId: PromiseOrValue<BigNumberish>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        getActions(proposalId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[
            string[],
            BigNumber[],
            string[],
            string[]
        ] & {
            targets: string[];
            values: BigNumber[];
            signatures: string[];
            calldatas: string[];
        }>;
        getReceipt(proposalId: PromiseOrValue<BigNumberish>, voter: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[GovernorAlpha.ReceiptStructOutput]>;
        guardian(overrides?: CallOverrides): Promise<[string]>;
        latestProposalIds(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[BigNumber]>;
        majorityPercentageVotes(overrides?: CallOverrides): Promise<[BigNumber]>;
        proposalCount(overrides?: CallOverrides): Promise<[BigNumber]>;
        proposalMaxOperations(overrides?: CallOverrides): Promise<[BigNumber]>;
        proposalThreshold(overrides?: CallOverrides): Promise<[BigNumber]>;
        proposals(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[
            BigNumber,
            number,
            number,
            BigNumber,
            BigNumber,
            BigNumber,
            BigNumber,
            BigNumber,
            BigNumber,
            boolean,
            boolean,
            string
        ] & {
            id: BigNumber;
            startBlock: number;
            endBlock: number;
            forVotes: BigNumber;
            againstVotes: BigNumber;
            quorum: BigNumber;
            majorityPercentage: BigNumber;
            eta: BigNumber;
            startTime: BigNumber;
            canceled: boolean;
            executed: boolean;
            proposer: string;
        }>;
        propose(targets: PromiseOrValue<string>[], values: PromiseOrValue<BigNumberish>[], signatures: PromiseOrValue<string>[], calldatas: PromiseOrValue<BytesLike>[], description: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        queue(proposalId: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        quorumPercentageVotes(overrides?: CallOverrides): Promise<[BigNumber]>;
        quorumVotes(overrides?: CallOverrides): Promise<[BigNumber]>;
        staking(overrides?: CallOverrides): Promise<[string]>;
        state(proposalId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[number]>;
        timelock(overrides?: CallOverrides): Promise<[string]>;
        votingDelay(overrides?: CallOverrides): Promise<[BigNumber]>;
        votingPeriod(overrides?: CallOverrides): Promise<[BigNumber]>;
    };
    BALLOT_TYPEHASH(overrides?: CallOverrides): Promise<string>;
    DOMAIN_TYPEHASH(overrides?: CallOverrides): Promise<string>;
    NAME(overrides?: CallOverrides): Promise<string>;
    __abdicate(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    __acceptAdmin(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    __executeSetTimelockPendingAdmin(newPendingAdmin: PromiseOrValue<string>, eta: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    __queueSetTimelockPendingAdmin(newPendingAdmin: PromiseOrValue<string>, eta: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    cancel(proposalId: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    castVote(proposalId: PromiseOrValue<BigNumberish>, support: PromiseOrValue<boolean>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    castVoteBySig(proposalId: PromiseOrValue<BigNumberish>, support: PromiseOrValue<boolean>, v: PromiseOrValue<BigNumberish>, r: PromiseOrValue<BytesLike>, s: PromiseOrValue<BytesLike>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    execute(proposalId: PromiseOrValue<BigNumberish>, overrides?: PayableOverrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    getActions(proposalId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[
        string[],
        BigNumber[],
        string[],
        string[]
    ] & {
        targets: string[];
        values: BigNumber[];
        signatures: string[];
        calldatas: string[];
    }>;
    getReceipt(proposalId: PromiseOrValue<BigNumberish>, voter: PromiseOrValue<string>, overrides?: CallOverrides): Promise<GovernorAlpha.ReceiptStructOutput>;
    guardian(overrides?: CallOverrides): Promise<string>;
    latestProposalIds(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
    majorityPercentageVotes(overrides?: CallOverrides): Promise<BigNumber>;
    proposalCount(overrides?: CallOverrides): Promise<BigNumber>;
    proposalMaxOperations(overrides?: CallOverrides): Promise<BigNumber>;
    proposalThreshold(overrides?: CallOverrides): Promise<BigNumber>;
    proposals(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[
        BigNumber,
        number,
        number,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        boolean,
        boolean,
        string
    ] & {
        id: BigNumber;
        startBlock: number;
        endBlock: number;
        forVotes: BigNumber;
        againstVotes: BigNumber;
        quorum: BigNumber;
        majorityPercentage: BigNumber;
        eta: BigNumber;
        startTime: BigNumber;
        canceled: boolean;
        executed: boolean;
        proposer: string;
    }>;
    propose(targets: PromiseOrValue<string>[], values: PromiseOrValue<BigNumberish>[], signatures: PromiseOrValue<string>[], calldatas: PromiseOrValue<BytesLike>[], description: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    queue(proposalId: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    quorumPercentageVotes(overrides?: CallOverrides): Promise<BigNumber>;
    quorumVotes(overrides?: CallOverrides): Promise<BigNumber>;
    staking(overrides?: CallOverrides): Promise<string>;
    state(proposalId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<number>;
    timelock(overrides?: CallOverrides): Promise<string>;
    votingDelay(overrides?: CallOverrides): Promise<BigNumber>;
    votingPeriod(overrides?: CallOverrides): Promise<BigNumber>;
    callStatic: {
        BALLOT_TYPEHASH(overrides?: CallOverrides): Promise<string>;
        DOMAIN_TYPEHASH(overrides?: CallOverrides): Promise<string>;
        NAME(overrides?: CallOverrides): Promise<string>;
        __abdicate(overrides?: CallOverrides): Promise<void>;
        __acceptAdmin(overrides?: CallOverrides): Promise<void>;
        __executeSetTimelockPendingAdmin(newPendingAdmin: PromiseOrValue<string>, eta: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        __queueSetTimelockPendingAdmin(newPendingAdmin: PromiseOrValue<string>, eta: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        cancel(proposalId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        castVote(proposalId: PromiseOrValue<BigNumberish>, support: PromiseOrValue<boolean>, overrides?: CallOverrides): Promise<void>;
        castVoteBySig(proposalId: PromiseOrValue<BigNumberish>, support: PromiseOrValue<boolean>, v: PromiseOrValue<BigNumberish>, r: PromiseOrValue<BytesLike>, s: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
        execute(proposalId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        getActions(proposalId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[
            string[],
            BigNumber[],
            string[],
            string[]
        ] & {
            targets: string[];
            values: BigNumber[];
            signatures: string[];
            calldatas: string[];
        }>;
        getReceipt(proposalId: PromiseOrValue<BigNumberish>, voter: PromiseOrValue<string>, overrides?: CallOverrides): Promise<GovernorAlpha.ReceiptStructOutput>;
        guardian(overrides?: CallOverrides): Promise<string>;
        latestProposalIds(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        majorityPercentageVotes(overrides?: CallOverrides): Promise<BigNumber>;
        proposalCount(overrides?: CallOverrides): Promise<BigNumber>;
        proposalMaxOperations(overrides?: CallOverrides): Promise<BigNumber>;
        proposalThreshold(overrides?: CallOverrides): Promise<BigNumber>;
        proposals(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[
            BigNumber,
            number,
            number,
            BigNumber,
            BigNumber,
            BigNumber,
            BigNumber,
            BigNumber,
            BigNumber,
            boolean,
            boolean,
            string
        ] & {
            id: BigNumber;
            startBlock: number;
            endBlock: number;
            forVotes: BigNumber;
            againstVotes: BigNumber;
            quorum: BigNumber;
            majorityPercentage: BigNumber;
            eta: BigNumber;
            startTime: BigNumber;
            canceled: boolean;
            executed: boolean;
            proposer: string;
        }>;
        propose(targets: PromiseOrValue<string>[], values: PromiseOrValue<BigNumberish>[], signatures: PromiseOrValue<string>[], calldatas: PromiseOrValue<BytesLike>[], description: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        queue(proposalId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        quorumPercentageVotes(overrides?: CallOverrides): Promise<BigNumber>;
        quorumVotes(overrides?: CallOverrides): Promise<BigNumber>;
        staking(overrides?: CallOverrides): Promise<string>;
        state(proposalId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<number>;
        timelock(overrides?: CallOverrides): Promise<string>;
        votingDelay(overrides?: CallOverrides): Promise<BigNumber>;
        votingPeriod(overrides?: CallOverrides): Promise<BigNumber>;
    };
    filters: {
        "ProposalCanceled(uint256)"(id?: null): ProposalCanceledEventFilter;
        ProposalCanceled(id?: null): ProposalCanceledEventFilter;
        "ProposalCreated(uint256,address,address[],uint256[],string[],bytes[],uint256,uint256,string)"(id?: null, proposer?: null, targets?: null, values?: null, signatures?: null, calldatas?: null, startBlock?: null, endBlock?: null, description?: null): ProposalCreatedEventFilter;
        ProposalCreated(id?: null, proposer?: null, targets?: null, values?: null, signatures?: null, calldatas?: null, startBlock?: null, endBlock?: null, description?: null): ProposalCreatedEventFilter;
        "ProposalExecuted(uint256)"(id?: null): ProposalExecutedEventFilter;
        ProposalExecuted(id?: null): ProposalExecutedEventFilter;
        "ProposalQueued(uint256,uint256)"(id?: null, eta?: null): ProposalQueuedEventFilter;
        ProposalQueued(id?: null, eta?: null): ProposalQueuedEventFilter;
        "VoteCast(address,uint256,bool,uint256)"(voter?: null, proposalId?: null, support?: null, votes?: null): VoteCastEventFilter;
        VoteCast(voter?: null, proposalId?: null, support?: null, votes?: null): VoteCastEventFilter;
    };
    estimateGas: {
        BALLOT_TYPEHASH(overrides?: CallOverrides): Promise<BigNumber>;
        DOMAIN_TYPEHASH(overrides?: CallOverrides): Promise<BigNumber>;
        NAME(overrides?: CallOverrides): Promise<BigNumber>;
        __abdicate(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        __acceptAdmin(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        __executeSetTimelockPendingAdmin(newPendingAdmin: PromiseOrValue<string>, eta: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        __queueSetTimelockPendingAdmin(newPendingAdmin: PromiseOrValue<string>, eta: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        cancel(proposalId: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        castVote(proposalId: PromiseOrValue<BigNumberish>, support: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        castVoteBySig(proposalId: PromiseOrValue<BigNumberish>, support: PromiseOrValue<boolean>, v: PromiseOrValue<BigNumberish>, r: PromiseOrValue<BytesLike>, s: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        execute(proposalId: PromiseOrValue<BigNumberish>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        getActions(proposalId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        getReceipt(proposalId: PromiseOrValue<BigNumberish>, voter: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        guardian(overrides?: CallOverrides): Promise<BigNumber>;
        latestProposalIds(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        majorityPercentageVotes(overrides?: CallOverrides): Promise<BigNumber>;
        proposalCount(overrides?: CallOverrides): Promise<BigNumber>;
        proposalMaxOperations(overrides?: CallOverrides): Promise<BigNumber>;
        proposalThreshold(overrides?: CallOverrides): Promise<BigNumber>;
        proposals(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        propose(targets: PromiseOrValue<string>[], values: PromiseOrValue<BigNumberish>[], signatures: PromiseOrValue<string>[], calldatas: PromiseOrValue<BytesLike>[], description: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        queue(proposalId: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        quorumPercentageVotes(overrides?: CallOverrides): Promise<BigNumber>;
        quorumVotes(overrides?: CallOverrides): Promise<BigNumber>;
        staking(overrides?: CallOverrides): Promise<BigNumber>;
        state(proposalId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        timelock(overrides?: CallOverrides): Promise<BigNumber>;
        votingDelay(overrides?: CallOverrides): Promise<BigNumber>;
        votingPeriod(overrides?: CallOverrides): Promise<BigNumber>;
    };
    populateTransaction: {
        BALLOT_TYPEHASH(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        DOMAIN_TYPEHASH(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        NAME(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        __abdicate(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        __acceptAdmin(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        __executeSetTimelockPendingAdmin(newPendingAdmin: PromiseOrValue<string>, eta: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        __queueSetTimelockPendingAdmin(newPendingAdmin: PromiseOrValue<string>, eta: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        cancel(proposalId: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        castVote(proposalId: PromiseOrValue<BigNumberish>, support: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        castVoteBySig(proposalId: PromiseOrValue<BigNumberish>, support: PromiseOrValue<boolean>, v: PromiseOrValue<BigNumberish>, r: PromiseOrValue<BytesLike>, s: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        execute(proposalId: PromiseOrValue<BigNumberish>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        getActions(proposalId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getReceipt(proposalId: PromiseOrValue<BigNumberish>, voter: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        guardian(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        latestProposalIds(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        majorityPercentageVotes(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        proposalCount(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        proposalMaxOperations(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        proposalThreshold(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        proposals(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        propose(targets: PromiseOrValue<string>[], values: PromiseOrValue<BigNumberish>[], signatures: PromiseOrValue<string>[], calldatas: PromiseOrValue<BytesLike>[], description: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        queue(proposalId: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        quorumPercentageVotes(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        quorumVotes(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        staking(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        state(proposalId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        timelock(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        votingDelay(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        votingPeriod(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    };
}
