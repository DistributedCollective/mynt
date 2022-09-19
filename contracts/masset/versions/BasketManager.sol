pragma solidity ^0.5.17;

import { SafeMath } from "@openzeppelin/contracts/math/SafeMath.sol";

contract BasketManager {

    using SafeMath for uint256;

    // state
    address[] private bassetsArray;
    mapping(address => bool) private bassetsMap;
    mapping(address => int256) private factorMap;
    mapping(address => address) private bridgeMap;

    function _isValidBasset(address _basset) internal view returns(bool) {
        return _basset != address(0) && bassetsMap[_basset];
    }

    // external
    constructor(address[] memory _bassets, int256[] memory _factors, address[] memory _bridges) public {
        require(_bassets.length > 0, "some basset required");
        require(_bassets.length == _factors.length, "factor array length mismatch");
        require(_bridges.length == _factors.length, "bridge array length mismatch");

        bassetsArray = _bassets;
        for(uint i=0; i<bassetsArray.length; i++) {
            address basset = bassetsArray[i];
            require(basset != address(0), "invalid basset address");
            require(!bassetsMap[basset], "basset not unique");
            bassetsMap[basset] = true;
            require(_factors[i] != 0, "invalid factor");
            factorMap[basset] = _factors[i];
            if(_bridges[i] != address(0)) {
                bridgeMap[basset] = _bridges[i];
            }
        }
    }

    function isValidBasset(address _basset) external view returns(bool) {
        return _isValidBasset(_basset);
    }

    function checkBasketBalanceForDeposit(address _basset, uint256 _bassetQuantity) external view returns(bool) {
        return _isValidBasset(_basset);
    }

    function checkBasketBalanceForWithdrawal(address _basset, uint256 _bassetQuantity) external view returns(bool) {
        return _isValidBasset(_basset);
    }

    function convertBassetToMassetQuantity(address _basset, uint256 _bassetQuantity) external view returns(uint256) {
        require(_isValidBasset(_basset), "invalid basset");
        int256 factor = factorMap[_basset];
        if(factor > 0) {
            return _bassetQuantity.div(uint256(factor));
        }
        return _bassetQuantity.mul(uint256(-factor));
    }

    function convertMassetToBassetQuantity(address _basset, uint256 _massetQuantity) external view returns(uint256) {
        require(_isValidBasset(_basset), "invalid basset");
        int256 factor = factorMap[_basset];
        if(factor > 0) {
            return _massetQuantity.mul(uint256(factor));
        }
        return _massetQuantity.div(uint256(-factor));
    }

    function getBridge(address _basset) external view returns(address) {
        return bridgeMap[_basset];
    }

    function getVersion() external pure returns(string memory) {
        return "2.0";
    }
}
