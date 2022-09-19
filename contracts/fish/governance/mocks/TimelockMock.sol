pragma solidity ^0.5.17;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "../ErrorDecoder.sol";
import { ITimelock } from "../Timelock.sol";

/**
 * @dev This contract is a copy of `Timelock.sol` with changed value of MINIMUM_DELAY for tests purposes
 * */
contract TimelockMock is ErrorDecoder, ITimelock {
	using SafeMath for uint256;

	uint256 public constant GRACE_PERIOD = 14 days;
	uint256 public constant MINIMUM_DELAY = 0;
	uint256 public constant MAXIMUM_DELAY = 30 days;

	address public admin;
	address public pendingAdmin;
	uint256 public delay;

	mapping(bytes32 => bool) public queuedTransactions;

	event NewAdmin(address indexed newAdmin);
	event NewPendingAdmin(address indexed newPendingAdmin);
	event NewDelay(uint256 indexed newDelay);
	event CancelTransaction(bytes32 indexed txHash, address indexed target, uint256 value, string signature, bytes data, uint256 eta);
	event ExecuteTransaction(bytes32 indexed txHash, address indexed target, uint256 value, string signature, bytes data, uint256 eta);
	event QueueTransaction(bytes32 indexed txHash, address indexed target, uint256 value, string signature, bytes data, uint256 eta);

	/**
	 * @notice Function called on instance deployment of the contract.
	 * @param admin_ Governance contract address.
	 * @param delay_ Time to wait for queued transactions to be executed.
	 * */
	constructor(address admin_, uint256 delay_) public {
		require(delay_ >= MINIMUM_DELAY, "Timelock::constructor: Delay must exceed minimum delay.");
		require(delay_ <= MAXIMUM_DELAY, "Timelock::setDelay: Delay must not exceed maximum delay.");

		admin = admin_;
		delay = delay_;
	}

	/**
	 * @notice Fallback function is to react to receiving value (rBTC).
	 * */
	function() external payable {}

	/**
	 * @notice Set a new delay when executing the contract calls.
	 * @param delay_ The amount of time to wait until execution.
	 * */
	function setDelay(uint256 delay_) public {
		require(msg.sender == address(this), "Timelock::setDelay: Call must come from Timelock.");
		require(delay_ >= MINIMUM_DELAY, "Timelock::setDelay: Delay must exceed minimum delay.");
		require(delay_ <= MAXIMUM_DELAY, "Timelock::setDelay: Delay must not exceed maximum delay.");
		delay = delay_;

		emit NewDelay(delay);
	}

	/**
	 * @notice Accept a new admin for the timelock.
	 * */
	function acceptAdmin() public {
		require(msg.sender == pendingAdmin, "Timelock::acceptAdmin: Call must come from pendingAdmin.");
		admin = msg.sender;
		pendingAdmin = address(0);

		emit NewAdmin(admin);
	}

	/**
	 * @notice Set a new pending admin for the timelock.
	 * @param pendingAdmin_ The new pending admin address.
	 * */
	function setPendingAdmin(address pendingAdmin_) public {
		require(msg.sender == address(this), "Timelock::setPendingAdmin: Call must come from Timelock.");
		pendingAdmin = pendingAdmin_;

		emit NewPendingAdmin(pendingAdmin);
	}

	/**
	 * @notice Queue a new transaction from the governance contract.
	 * @param target The contract to call.
	 * @param value The amount to send in the transaction.
	 * @param signature The stanndard representation of the function called.
	 * @param data The ethereum transaction input data payload.
	 * @param eta Estimated Time of Accomplishment. The timestamp that the
	 * proposal will be available for execution, set once the vote succeeds.
	 * */
	function queueTransaction(
		address target,
		uint256 value,
		string memory signature,
		bytes memory data,
		uint256 eta
	) public returns (bytes32) {
		require(msg.sender == admin, "Timelock::queueTransaction: Call must come from admin.");
		require(eta >= getBlockTimestamp().add(delay), "Timelock::queueTransaction: Estimated execution block must satisfy delay.");

		bytes32 txHash = keccak256(abi.encode(target, value, signature, data, eta));
		queuedTransactions[txHash] = true;

		emit QueueTransaction(txHash, target, value, signature, data, eta);
		return txHash;
	}

	/**
	 * @notice Cancel a transaction.
	 * @param target The contract to call.
	 * @param value The amount to send in the transaction.
	 * @param signature The stanndard representation of the function called.
	 * @param data The ethereum transaction input data payload.
	 * @param eta Estimated Time of Accomplishment. The timestamp that the
	 * proposal will be available for execution, set once the vote succeeds.
	 * */
	function cancelTransaction(
		address target,
		uint256 value,
		string memory signature,
		bytes memory data,
		uint256 eta
	) public {
		require(msg.sender == admin, "Timelock::cancelTransaction: Call must come from admin.");

		bytes32 txHash = keccak256(abi.encode(target, value, signature, data, eta));
		queuedTransactions[txHash] = false;

		emit CancelTransaction(txHash, target, value, signature, data, eta);
	}

	/**
	 * @notice Executes a previously queued transaction from the governance.
	 * @param target The contract to call.
	 * @param value The amount to send in the transaction.
	 * @param signature The stanndard representation of the function called.
	 * @param data The ethereum transaction input data payload.
	 * @param eta Estimated Time of Accomplishment. The timestamp that the
	 * proposal will be available for execution, set once the vote succeeds.
	 * */
	function executeTransaction(
		address target,
		uint256 value,
		string memory signature,
		bytes memory data,
		uint256 eta
	) public payable returns (bytes memory) {
		require(msg.sender == admin, "Timelock::executeTransaction: Call must come from admin.");

		bytes32 txHash = keccak256(abi.encode(target, value, signature, data, eta));
		require(queuedTransactions[txHash], "Timelock::executeTransaction: Transaction hasn't been queued.");
		require(getBlockTimestamp() >= eta, "Timelock::executeTransaction: Transaction hasn't surpassed time lock.");
		require(getBlockTimestamp() <= eta.add(GRACE_PERIOD), "Timelock::executeTransaction: Transaction is stale.");

		queuedTransactions[txHash] = false;

		bytes memory callData;

		if (bytes(signature).length == 0) {
			callData = data;
		} else {
			callData = abi.encodePacked(bytes4(keccak256(bytes(signature))), data);
		}

		// solium-disable-next-line security/no-call-value
		(bool success, bytes memory returnData) = target.call.value(value)(callData);
		if (!success) {
			if (returnData.length <= ERROR_MESSAGE_SHIFT) {
				revert("Timelock::executeTransaction: Transaction execution reverted.");
			} else {
				revert(_addErrorMessage("Timelock::executeTransaction: ", string(returnData)));
			}
		}

		emit ExecuteTransaction(txHash, target, value, signature, data, eta);

		return returnData;
	}

	/**
	 * @notice A function used to get the current Block Timestamp.
	 * @dev Timestamp of the current block in seconds since the epoch.
	 * It is a Unix time stamp. So, it has the complete information about
	 * the date, hours, minutes, and seconds (in UTC) when the block was
	 * created.
	 * */
	function getBlockTimestamp() internal view returns (uint256) {
		// solium-disable-next-line security/no-block-members
		return block.timestamp;
	}
}
