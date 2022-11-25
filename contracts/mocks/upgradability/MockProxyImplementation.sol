pragma solidity 0.8.17;

contract MockDependency {
    string public desc = "mock dependency contract";
}

abstract contract IMockImplementation {
    bool initialized = false;

    function isInitialized() public view returns(bool) {
        return initialized;
    }

    function getVersion() external virtual pure returns(string memory);
}

contract MockProxyImplementation1 is IMockImplementation {
    MockDependency private dep;

    function initialize(address _depAddress) public {
        dep = MockDependency(_depAddress);
        initialized = true;
    }

    function getVersion() external override pure returns (string memory) {
        return "1";
    }

    function getDep () public view returns(address) {
        return address(dep);
    }
}

contract MockProxyImplementation2 is IMockImplementation {
    MockDependency private dep;

    function getVersion() external override pure returns (string memory) {
        return "2";
    }

    function getDep () public view returns(address) {
        return address(dep);
    }
}


contract MockProxyImplementationMetaAssetToken is IMockImplementation {
    MockDependency private dep;

    function initialize(address _depAddress) public {
        dep = MockDependency(_depAddress);
        initialized = true;
    }

    function getVersion() external override pure returns (string memory) {
        return "1";
    }

    function getDep () public view returns(address) {
        return address(dep);
    }

    fallback() external payable {}
}