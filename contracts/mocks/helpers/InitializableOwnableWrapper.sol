// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract InitializableOwnableWrapper is OwnableUpgradeable {
    function initialize() public initializer {
        __Ownable_init_unchained();
    }
}
