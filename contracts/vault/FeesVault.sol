// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title FeesVault
 * @dev Contract is used to store fees.
 */
contract FeesVault is OwnableUpgradeable {
    using SafeERC20 for IERC20;

    function initialize() external initializer {
        __Ownable_init_unchained();
    }

    /**
     * @dev Withdraw collected fees.
     * @param _token            Address of token to withdraw.
     * @param _amount           Amount to withdraw.
     * @param _recipient        Recipient of withdrawn tokens.
     */
    function withdraw(address _token, uint256 _amount, address _recipient) public onlyOwner {
        IERC20(_token).safeTransfer(_recipient, _amount);
    }
}
