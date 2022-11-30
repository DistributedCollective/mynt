// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "../../meta-asset-token/MetaAssetToken.sol";

contract MockMetaAssetToken is MetaAssetToken {

  address private assetImpl;
  address private basketManagerImpl;

  constructor(
    string memory _tokenName,
    string memory _symbol,
    address _assetImplementation,
    address _basketManagerImplementation
  ) MetaAssetToken(_tokenName, _symbol) {
    assetImpl = _assetImplementation;
    basketManagerImpl = _basketManagerImplementation;
  }

  function assetImplementation() public override view returns(address) {
      return assetImpl;
  }

    /**
     * @dev getter function of basket manager implementation address
     *
     * @return basket manager implementation address
     */
  function basketManagerImplementation() public override view returns(address) {
      return basketManagerImpl;
  }
}