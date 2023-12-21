// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
pragma experimental ABIEncoderV2;

import { SafeMath } from "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

/**
 * @title FeesManager
 * @dev Contract is responsible for fees calculations.
 */
contract FeesManager is OwnableUpgradeable {
    using SafeMath for uint256;

    // State

    /**
     * @dev Factor of fees.
     * @notice a value of 10000 means that 223 equals 2.23% and 10000 equals 100%
     */
    uint256 public constant PRECISION = 10000;

    uint256 private depositFee;
    uint256 private DEPRECATED_depositBridgeFee;
    uint256 private withdrawalFee;
    uint256 private DEPRECATED_withdrawalBridgeFee;

    // Events

    /**
     * @dev Emitted when deposit fee has changed.
     * @param depositFee            Amount of the fee.
     */
    event DepositFeeChanged(uint256 depositFee);

    /**
     * @dev Emitted when withdrawal fee has changed.
     * @param withdrawalFee         Amount of the fee.
     */
    event WithdrawalFeeChanged(uint256 withdrawalFee);

    // Initializer

    /**
     * @dev Contract initializer.
     * @param _depositFee           Amount of deposit fee in promils.
     * @param _withdrawalFee        Amount of redeem fee in promils.
     */
    function initialize(uint256 _depositFee, uint256 _withdrawalFee) external initializer {
        __Ownable_init_unchained();
        setDepositFee(_depositFee);
        setWithdrawalFee(_withdrawalFee);
    }

    // Internal

    /**
     * @dev Calculate and return fee amount based on massetAmount and type of fee.
     */
    function _calculateFee(uint256 _massetAmount, uint256 _fee) internal pure returns (uint256) {
        return _massetAmount.mul(_fee).div(PRECISION);
    }

    // Public

    /**
     * @dev Calculate and return deposit fee amount based on massetAmount.
     * @param _massetAmount  Amount of masset to deposit.
     * @return fee           Calculated fee amount.
     */
    function calculateDepositFee(uint256 _massetAmount) external view returns (uint256) {
        return _calculateFee(_massetAmount, depositFee);
    }

    /**
     * @dev Calculate and return redeem fee amount based on massetAmount.
     * @param _massetAmount  Amount of masset.
     * @return fee           Calculated fee amount.
     */
    function calculateRedeemFee(uint256 _massetAmount) external view returns (uint256) {
        return _calculateFee(_massetAmount, withdrawalFee);
    }

    // Getters

    function getDepositFee() external view returns (uint256) {
        return depositFee;
    }

    function getWithdrawalFee() external view returns (uint256) {
        return withdrawalFee;
    }

    // Governance methods

    function setDepositFee(uint256 _amount) public onlyOwner {
        require(_amount <= PRECISION, "invalid fee amount");

        depositFee = _amount;
        emit DepositFeeChanged(_amount);
    }

    function setWithdrawalFee(uint256 _amount) public onlyOwner {
        require(_amount <= PRECISION, "invalid fee amount");

        withdrawalFee = _amount;
        emit WithdrawalFeeChanged(_amount);
    }
}
