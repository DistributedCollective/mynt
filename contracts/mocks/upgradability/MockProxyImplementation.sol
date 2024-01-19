// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts-upgradeable/proxy/ERC1967/ERC1967UpgradeUpgradeable.sol";

contract MockDependency {
    string public desc = "mock dependency contract";
}

abstract contract IMockImplementation {
    bool initialized;

    function isInitialized() public view returns (bool) {
        return initialized;
    }

    function getVersion() external pure virtual returns (string memory);
}

contract MockProxyImplementation1 is IMockImplementation {
    MockDependency private dep;

    function initialize(address _depAddress) public {
        dep = MockDependency(_depAddress);
        initialized = true;
    }

    function getVersion() external pure override returns (string memory) {
        return "1";
    }

    function getDep() public view returns (address) {
        return address(dep);
    }
}

contract MockProxyImplementation2 is IMockImplementation {
    MockDependency private dep;

    function getVersion() external pure override returns (string memory) {
        return "2";
    }

    function getDep() public view returns (address) {
        return address(dep);
    }
}

contract MockProxyImplementationMetaAssetToken is IMockImplementation, ERC1967UpgradeUpgradeable {
    MockDependency private dep;

    function initialize(address _depAddress) public {
        dep = MockDependency(_depAddress);
        initialized = true;
    }

    function getVersion() external pure override returns (string memory) {
        return "1";
    }

    function getDep() public view returns (address) {
        return address(dep);
    }

    function getProxyImplementation() external view returns (address) {
        return ERC1967UpgradeUpgradeable._getImplementation();
    }

    receive() external payable {}
}
