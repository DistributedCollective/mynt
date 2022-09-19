pragma solidity ^0.5.17;

contract IMockDummy {
    function getVersion() external pure returns(string memory);
}

contract MockDummy1 is IMockDummy {
    function getVersion() external pure returns (string memory) {
        return "1";
    }
}

contract MockDummy2 is IMockDummy {
    function getVersion() external pure returns (string memory) {
        return "2";
    }
}
