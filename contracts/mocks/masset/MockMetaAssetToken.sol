pragma solidity ^0.5.17;

import "../../meta-asset-token/MetaAssetToken.sol";

contract MockMetaAssetToken is MetaAssetToken {

  address private assetImpl;
  address private basketManagerImpl;

  constructor(
    string memory _tokenName,
    string memory _symbol,
    address _assetImplementation,
    address _basketManagerImplementation
  ) public MetaAssetToken(_tokenName, _symbol) {
    assetImpl = _assetImplementation;
    basketManagerImpl = _basketManagerImplementation;
  }

  function assetImplementation() public view returns(address) {
      return assetImpl;
  }

    /**
     * @dev getter function of basket manager implementation address
     *
     * @return basket manager implementation address
     */
  function basketManagerImplementation() public view returns(address) {
      return basketManagerImpl;
  }
}