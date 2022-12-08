// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "../interfaces/IApproveAndCall.sol";

/**
 * @title Token
 * @dev Implementation of staking Token.
 * Inherits from ERC20
 * mint and burn functions.
 */

contract MyntToken is ERC20, Ownable {
    // events

    /**
     * @dev Emitted when market maker address is changed.
     * @param _address          Address of new market maker.
     */
    event MarketMakerChanged(address indexed _address);

    /**
     * @dev Emitted when presale address is changed.
     * @param _address          Address of new presale.
     */
    event PresaleChanged(address indexed _address);

    // state

    address public marketMaker = address(0);
    address public presale = address(0);

    /**
     * @notice Constructor called on deployment, initiates the contract.
     */
    constructor() ERC20("Sovryn Mynt", "MYNT") {}

    /**
     * @notice setMarketMaker sets the token's market maker address
     * @param _address The address of the market maker contract
     */
    function setMarketMaker(address _address) public onlyOwner {
        require(_address != address(0), "invalid address");
        marketMaker = _address;
        emit MarketMakerChanged(_address);
    }

    /**
     * @notice setPresale sets the token's presale contract
     * @param _address The address of the presale contract
     */
    function setPresale(address _address) public onlyOwner {
        require(_address != address(0), "invalid address");
        presale = _address;
        emit PresaleChanged(_address);
    }

    /**
     * @notice Creates new tokens and sends them to the recipient.
     * @param _account The recipient address to get the minted tokens.
     * @param _amount The amount of tokens to be minted.
     */
    function mint(address _account, uint256 _amount) public {
        // only the presale contract and the market maker are allowed to mint
        require(msg.sender == presale || msg.sender == marketMaker, "not allowed");
        _mint(_account, _amount);
    }

    /**
     * @notice Burns tokens for the given account.
     * @param _account The recipient address to get the minted tokens.
     * @param _amount The amount of tokens to be minted.
     */
    function burn(address _account, uint256 _amount) public {
        // only the market maker is allowed to burn tokens,
        // ...and the user is allowed to burn his own tokens
        require(msg.sender == marketMaker || msg.sender == _account, "not allowed");
        _burn(_account, _amount);
    }

    /**
     * @notice Approves and then calls the receiving contract.
     * Useful to encapsulate sending tokens to a contract in one call.
     * Solidity has no native way to send tokens to contracts.
     * ERC-20 tokens require approval to be spent by third parties, such as a contract in this case.
     * @param _spender The contract address to spend the tokens.
     * @param _amount The amount of tokens to be sent.
     * @param _data Parameters for the contract call, such as endpoint signature.
     */
    function approveAndCall(address _spender, uint256 _amount, bytes memory _data) public {
        approve(_spender, _amount);
        IApproveAndCall(_spender).receiveApproval(msg.sender, _amount, address(this), _data);
    }
}
