pragma solidity ^0.5.17;

import "@openzeppelin/contracts/token/ERC20/ERC20Detailed.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Mintable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { IERC777Recipient } from "@openzeppelin/contracts/token/ERC777/IERC777Recipient.sol";

contract MockERC20 is ERC20, ERC20Detailed, ERC20Mintable {

    function () external payable {
    }

    constructor (
        string memory _name,
        string memory _symbol,
        uint8 _decimals,
        address _initialRecipient,
        uint256 _initialMint
    ) ERC20Detailed(_name, _symbol, _decimals) public {
        _mint(_initialRecipient, _initialMint.mul(10 ** uint256(_decimals)));
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
