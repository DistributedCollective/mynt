pragma solidity ^0.8.17;

import "./MetaAssetToken.sol";

contract DLLR is MetaAssetToken {
    constructor() MetaAssetToken("Sovryn Dollar", "DLLR") {}
}
