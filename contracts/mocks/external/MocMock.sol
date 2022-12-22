// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/// Interface to the Money OnChain main contract MoC to mint DoC and redeem RBTC
contract MocMock {
    uint256 public docToRbtcRate = uint256(1 ether / 16000); // 62500000000000 sat/DoC

    function setExRate(uint256 _newRate) external {
        docToRbtcRate = _newRate;
    }

    /**
      @dev Redeems the requested amount for the msg.sender, or the max amount of free docs possible (retrocompatible function).
      @dev Retrocompatible function.
      @param _docAmount Amount of Docs to redeem.
      @param _vendor Vendor adddress (not used here)
    */
    function redeemFreeDocVendors(uint256 _docAmount, address _vendor) external {
        (bool success, ) = msg.sender.call{ value: this.getRbtcValue(_docAmount) }("");

        require(success, "MocMintRedeemDoc::redeemFreeDoc fail");
    }

    function getRbtcValue(uint256 _docAmount) external view returns (uint256) {
        return (_docAmount * docToRbtcRate) / 1 ether;
    }

    /*
    @dev Returns the total amount of Docs in the redeem queue for redeemer
    @param redeemer address for which ^ is computed
    @return total amount of Docs in the redeem queue for redeemer
   */
    // function docAmountToRedeem(address redeemer) external view returns (uint256);

    /*
     * @dev Creates or updates the amount of a Doc redeem Request from the msg.sender
     * @param docAmount Amount of Docs to redeem on settlement [using mocPrecision]
     */
    // function redeemDocRequest(uint256 docAmount) external;

    /*
    @dev Alters the redeem amount position for the redeemer
    @param isAddition true if adding amount to redeem, false to substract.
    @param delta the amount to add/substract to current position
  */
    // function alterRedeemRequestAmount(bool isAddition, uint256 delta) external;

    /*
    @dev Mint Doc tokens and pays the commisions of the operation (retrocompatible function).
    @dev Retrocompatible function.
    @param btcToMint Amount in RBTC to mint
  */
    // function mintDoc(uint256 btcToMint) external payable;

    /*
     * @dev Mint Doc tokens and pays the commisions of the operation
     * @param btcToMint Amount in RBTC to mint
     * @param vendorAccount Vendor address
     */
    // function mintDocVendors(uint256 btcToMint, address payable vendorAccount) external payable;

    /*
      @dev Redeems the requested amount for the msg.sender, or the max amount of free docs possible.
      @param docAmount Amount of Docs to redeem.
      @param vendorAccount Vendor address
    */
    //function redeemFreeDocVendors(uint256 docAmount, address payable vendorAccount) external;

    /*
    @dev Allow redeem on liquidation state, user DoCs get burned and he receives
    the equivalent BTCs if can be covered, or the maximum available
  */
    //function redeemAllDoc() external;
}
