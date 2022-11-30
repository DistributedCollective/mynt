// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "../../shared/ERC20Permit.sol";

contract MockERC20Permit is ERC20Permit {
  /**
  * @notice Constructor called on deployment, initiates the contract.
  */
  constructor(string memory _tokenName, string memory _symbol, address _initialHolder, uint256 _initialSupply) ERC20(_tokenName, _symbol) {
    _mint(_initialHolder, _initialSupply);
  }
}