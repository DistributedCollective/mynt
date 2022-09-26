pragma solidity 0.5.17;

import "../../shared/ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Detailed.sol";

contract MockERC20Permit is ERC20Permit, ERC20Detailed {
  /**
  * @notice Constructor called on deployment, initiates the contract.
  */
  constructor(string memory _tokenName, string memory _symbol, address _initialHolder, uint256 _initialSupply) public ERC20Detailed(_tokenName, _symbol, 18) {
    _mint(_initialHolder, _initialSupply);
  }
}