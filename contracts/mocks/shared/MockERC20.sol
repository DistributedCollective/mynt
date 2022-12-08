// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { IERC777Recipient } from "@openzeppelin/contracts/token/ERC777/IERC777Recipient.sol";

contract MockERC20 is ERC20 {

    receive () external payable {}

    constructor (
        string memory _name,
        string memory _symbol,
        uint8 _decimals,
        address _initialRecipient,
        uint256 _initialMint
    ) ERC20(_name, _symbol) {
        _mint(_initialRecipient, _initialMint * (10 ** uint256(_decimals)));
    }

    function giveMe(uint256 amount) external {
        _mint(msg.sender, amount);
    }

    function callTokensReceived(
        address aggregator,
        address operator,
        address from,
        address to,
        uint amount,
        bytes calldata userData,
        bytes calldata operatorData
        ) external {
        IERC777Recipient(aggregator).tokensReceived(operator, from, to, amount, userData, operatorData);
    }
}
