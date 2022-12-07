pragma solidity ^0.8.17;

import "./MetaAssetToken.sol";

contract DLLR is MetaAssetToken {
    constructor(string memory _tokenName, string memory _symbol) MetaAssetToken(_tokenName, _symbol) {}
}
