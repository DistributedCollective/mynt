// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Token
 * @dev Implementation of mAsset Token.
 * Inherits from ERC20 and ERC20Detailed with implemented
 * mint and burn functions.
 */

contract Token is ERC20, Ownable {
    uint8 private _decimals;

    /**
     * @notice Constructor called on deployment, initiates the contract.
     * @param _name The name of the token.
     * @param _symbol The symbol of the token.
     * @param _decimalsValue The decimals of the token.
     * */
    constructor(
        string memory _name,
        string memory _symbol,
        uint8 _decimalsValue
    ) ERC20(_name, _symbol) {
        _decimals = _decimalsValue;
    }

    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }

    /**
     * @notice Creates new tokens and sends them to the recipient.
     * @param _account The recipient address to get the minted tokens.
     * @param _amount The amount of tokens to be minted.
     * */
    function mint(address _account, uint256 _amount) public onlyOwner {
        _mint(_account, _amount);
    }

    /**
     * @notice Burns tokens for the given account.
     * @param _account The recipient address to get the minted tokens.
     * @param _amount The amount of tokens to be minted.
     * */
    function burn(address _account, uint256 _amount) public onlyOwner {
        _burn(_account, _amount);
    }
}
