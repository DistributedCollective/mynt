pragma solidity ^0.5.17;

import { InitializableReentrancyGuard } from "../../helpers/InitializableReentrancyGuard.sol";

interface IReentrantMock {
    function clientMethod () external returns(bool);
}

contract ReentrantMock is IReentrantMock {
    address contractAddress;

    constructor (address _contractAddress) public {
        contractAddress = _contractAddress;
    }

    function clientMethod() public returns(bool) {
        InitializableReentrancyMock reentrancyMock = InitializableReentrancyMock(contractAddress);
        reentrancyMock.runClientMethod(address(this));
        return true;
    }
}

contract NonReentrantMock is IReentrantMock {
    function clientMethod() public returns(bool) {
        return true;
    }
}

contract InitializableReentrancyMock is InitializableReentrancyGuard {
    function initialize () public {
        _initialize();

    }

    function runClientMethod (address reentrantMockAddress) public nonReentrant {
        IReentrantMock reentrantMock = IReentrantMock(reentrantMockAddress);
        require(reentrantMock.clientMethod(), "");
    }
}
