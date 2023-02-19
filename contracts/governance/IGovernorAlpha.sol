// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
pragma experimental ABIEncoderV2;

interface IGovernorAlpha {
    /// @notice The name of the governance contract.
    function NAME() external view returns(string memory);

    /// @notice The maximum number of actions that can be included in a proposal.
    function proposalMaxOperations() external pure returns (uint256);

    /// @notice The delay before voting on a proposal may take place, once proposed.
    function votingDelay() external pure returns (uint256);

    /// @notice The duration of voting on a proposal, in blocks.
    function votingPeriod() external pure returns (uint256);

    /// @notice The address of the Sovryn Protocol Timelock.
    function timelock() external view returns(TimelockInterface);

    /// @notice The address of the Sovryn staking contract.
    function staking() external view returns(StakingInterface);

    /// @notice The address of the Governor Guardian.
    function guardian() external view returns(address);

    /// @notice The total number of proposals.
    function proposalCount() external view returns(uint256);

    /// @notice Percentage of current total voting power require to vote.
    function quorumPercentageVotes() external view returns(uint96);

    // @notice Majority percentage.
    function majorityPercentageVotes() external view returns(uint96);

    struct Proposal {
        /// @notice Unique id for looking up a proposal.
        uint256 id;
        /// @notice The block at which voting begins: holders must delegate their votes prior to this block.
        uint32 startBlock;
        /// @notice The block at which voting ends: votes must be cast prior to this block.
        uint32 endBlock;
        /// @notice Current number of votes in favor of this proposal.
        uint96 forVotes;
        /// @notice Current number of votes in opposition to this proposal.
        uint96 againstVotes;
        ///@notice the quorum required for this proposal.
        uint96 quorum;
        ///@notice the majority percentage required for this proposal.
        uint96 majorityPercentage;
        /// @notice The timestamp that the proposal will be available for execution, set once the vote succeeds.
        uint64 eta;
        /// @notice the start time is required for the staking contract.
        uint64 startTime;
        /// @notice Flag marking whether the proposal has been canceled.
        bool canceled;
        /// @notice Flag marking whether the proposal has been executed.
        bool executed;
        /// @notice Creator of the proposal.
        address proposer;
        /// @notice the ordered list of target addresses for calls to be made.
        address[] targets;
        /// @notice The ordered list of values (i.e. msg.value) to be passed to the calls to be made.
        uint256[] values;
        /// @notice The ordered list of function signatures to be called.
        string[] signatures;
        /// @notice The ordered list of calldata to be passed to each call.
        bytes[] calldatas;
        /// @notice Receipts of ballots for the entire set of voters.
        mapping(address => Receipt) receipts;
    }

    /// @notice Ballot receipt record for a voter
    struct Receipt {
        /// @notice Whether or not a vote has been cast.
        bool hasVoted;
        /// @notice Whether or not the voter supports the proposal.
        bool support;
        /// @notice The number of votes the voter had, which were cast.
        uint96 votes;
    }

    /// @notice Possible states that a proposal may be in.
    enum ProposalState {
        Pending,
        Active,
        Canceled,
        Defeated,
        Succeeded,
        Queued,
        Expired,
        Executed
    }

    /// @notice The latest proposal for each proposer.
    function latestProposalIds(address) external view returns(uint256);

    /// @notice The EIP-712 typehash for the contract's domain.
    function DOMAIN_TYPEHASH() external view returns(bytes32);

    /// @notice The EIP-712 typehash for the ballot struct used by the contract.
    function BALLOT_TYPEHASH() external view returns(bytes32);

    /* Events */
    function proposalThreshold() external view returns (uint96);

    /// @notice The number of votes in support of a proposal required in order for a quorum to be reached and for a vote to succeed.
    function quorumVotes() external view returns (uint96);

    /**
     * @notice Create a new proposal.
     * @param targets Array of contract addresses to perform proposal execution.
     * @param values Array of rBTC amounts to send on proposal execution.
     * @param signatures Array of function signatures to call on proposal execution.
     * @param calldatas Array of payloads for the calls on proposal execution.
     * @param description Text describing the purpose of the proposal.
     * */
    function propose(
        address[] memory targets,
        uint256[] memory values,
        string[] memory signatures,
        bytes[] memory calldatas,
        string memory description
    ) external returns (uint256);

    /**
     * @notice Enqueue a proposal and everyone of its calls.
     * @param proposalId Proposal index to access the list proposals[] from storage.
     * */
    function queue(uint256 proposalId) external;

    /**
     * @notice Execute a proposal by looping and performing everyone of its calls.
     * @param proposalId Proposal index to access the list proposals[] from storage.
     * */
    function execute(uint256 proposalId) external payable;

    /**
     * @notice Cancel a proposal by looping and cancelling everyone of its calls.
     * @param proposalId Proposal index to access the list proposals[] from storage.
     * */
    function cancel(uint256 proposalId) external;

    /**
     * @notice Get a proposal list of its calls.
     * @param proposalId Proposal index to access the list proposals[] from storage.
     * */
    function getActions(uint256 proposalId)
        external
        view
        returns (
            address[] memory targets,
            uint256[] memory values,
            string[] memory signatures,
            bytes[] memory calldatas
        );

    /**
     * @notice Get a proposal receipt.
     * @param proposalId Proposal index to access the list proposals[] from storage.
     * @param voter A governance stakeholder with voting power.
     * @return The voter receipt of the proposal.
     * */
    function getReceipt(uint256 proposalId, address voter) external view returns (Receipt memory);

    /**
     * @notice Casts a vote by sender.
     * @param proposalId Proposal index to access the list proposals[] from storage.
     * @param support Vote value, yes or no.
     * */
    function castVote(uint256 proposalId, bool support) external;

    /**
     * @notice Voting with EIP-712 Signatures.
     *
     * Voting power can be delegated to any address, and then can be used to
     * vote on proposals. A key benefit to users of by-signature functionality
     * is that they can create a signed vote transaction for free, and have a
     * trusted third-party spend rBTC(or ETH) on gas fees and write it to the
     * blockchain for them.
     *
     * The third party in this scenario, submitting the SOV-holder’s signed
     * transaction holds a voting power that is for only a single proposal.
     * The signatory still holds the power to vote on their own behalf in
     * the proposal if the third party has not yet published the signed
     * transaction that was given to them.
     *
     * @dev The signature needs to be broken up into 3 parameters, known as
     * v, r and s:
     * const r = '0x' + sig.substring(2).substring(0, 64);
     * const s = '0x' + sig.substring(2).substring(64, 128);
     * const v = '0x' + sig.substring(2).substring(128, 130);
     *
     * @param proposalId Proposal index to access the list proposals[] from storage.
     * @param support Vote value, yes or no.
     * @param v The recovery byte of the signature.
     * @param r Half of the ECDSA signature pair.
     * @param s Half of the ECDSA signature pair.
     * */
    function castVoteBySig(
        uint256 proposalId,
        bool support,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external;

    /// @dev Timelock wrapper w/ sender check.
    function __acceptAdmin() external;

    /// @notice Sets guardian address to zero.
    function __abdicate() external;

    /// @dev Timelock wrapper w/ sender check.
    function __queueSetTimelockPendingAdmin(address newPendingAdmin, uint256 eta) external;

    /// @dev Timelock wrapper w/ sender check.
    function __executeSetTimelockPendingAdmin(address newPendingAdmin, uint256 eta) external;

    /**
     * @notice Get a proposal state.
     * @param proposalId Proposal index to access the list proposals[] from storage.
     * @return The state of the proposal: Canceled, Pending, Active, Defeated,
     * Succeeded, Executed, Expired.
     * */
    function state(uint256 proposalId) external view returns (ProposalState);
}

/* Interfaces */
interface TimelockInterface {
    function delay() external view returns (uint256);

    function GRACE_PERIOD() external view returns (uint256);

    function acceptAdmin() external;

    function queuedTransactions(bytes32 hash) external view returns (bool);

    function queueTransaction(
        address target,
        uint256 value,
        string calldata signature,
        bytes calldata data,
        uint256 eta
    ) external returns (bytes32);

    function cancelTransaction(
        address target,
        uint256 value,
        string calldata signature,
        bytes calldata data,
        uint256 eta
    ) external;

    function executeTransaction(
        address target,
        uint256 value,
        string calldata signature,
        bytes calldata data,
        uint256 eta
    ) external payable returns (bytes memory);
}

interface StakingInterface {
    function getPriorVotes(
        address account,
        uint256 blockNumber,
        uint256 date
    ) external view returns (uint96);

    function getPriorTotalVotingPower(uint32 blockNumber, uint256 time)
        external
        view
        returns (uint96);
}
