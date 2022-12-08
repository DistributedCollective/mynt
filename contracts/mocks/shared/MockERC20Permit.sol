// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

//import "../../shared/ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";

contract MockERC20Permit is ERC20Permit {
    /**
     * @notice Constructor called on deployment, initiates the contract.
     */
    constructor(
        string memory _tokenName,
        string memory _symbol,
        address _initialHolder,
        uint256 _initialSupply
    ) ERC20(_tokenName, _symbol) ERC20Permit(_tokenName) {
        _mint(_initialHolder, _initialSupply);
    }

    function getChainId() public view returns (uint256) {
        uint256 id;
        assembly {
            id := chainid()
        }
        return id;
    }
}
