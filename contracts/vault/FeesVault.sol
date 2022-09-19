pragma solidity ^0.5.17;

import { InitializableOwnable } from "../helpers/InitializableOwnable.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";

/**
 * @title FeesVault
 * @dev Contract is used to store fees.
 */
contract FeesVault is InitializableOwnable {
    using SafeERC20 for IERC20;

    function initialize() external {
        _initialize();
    }

    /**
     * @dev Withdraw collected fees.
     * @param _token            Address of token to withdraw.
     * @param _amount           Amount to withdraw.
     * @param _recipient        Recipient of withdrawn tokens.
     */
    function withdraw (address _token, uint256 _amount, address _recipient) public onlyOwner {
        IERC20(_token).safeTransfer(_recipient, _amount);
    }
}
