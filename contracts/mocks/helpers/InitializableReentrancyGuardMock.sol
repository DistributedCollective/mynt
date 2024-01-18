// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";

interface IReentrantMock {
    function clientMethod() external returns (bool);
}

contract ReentrantMock is IReentrantMock {
    address contractAddress;

    constructor(address _contractAddress) {
        contractAddress = _contractAddress;
    }

    function clientMethod() public returns (bool) {
        InitializableReentrancyMock reentrancyMock = InitializableReentrancyMock(contractAddress);
        reentrancyMock.runClientMethod(address(this));
        return true;
    }
}

contract NonReentrantMock is IReentrantMock {
    function clientMethod() public pure returns (bool) {
        return true;
    }
}

contract InitializableReentrancyMock is ReentrancyGuardUpgradeable {
    function initialize() public initializer {
        __ReentrancyGuard_init_unchained();
    }

    function runClientMethod(address reentrantMockAddress) public nonReentrant {
        IReentrantMock reentrantMock = IReentrantMock(reentrantMockAddress);
        require(reentrantMock.clientMethod(), "");
    }
}
