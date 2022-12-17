// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

struct PermitParams {
    uint256 deadline;
    uint8 v;
    bytes32 r;
    bytes32 s;
}

/// Interface to the Money OnChain main contract MoC to mint DoC and redeem RBTC
interface IMocMintRedeemDoc {
    /**
    @dev Returns the total amount of Docs in the redeem queue for redeemer
    @param redeemer address for which ^ is computed
    @return total amount of Docs in the redeem queue for redeemer
   */
    function docAmountToRedeem(address redeemer) external view returns (uint256);

    /**
     * @dev Creates or updates the amount of a Doc redeem Request from the msg.sender
     * @param docAmount Amount of Docs to redeem on settlement [using mocPrecision]
     */
    function redeemDocRequest(uint256 docAmount) external;

    /**
    @dev Alters the redeem amount position for the redeemer
    @param isAddition true if adding amount to redeem, false to substract.
    @param delta the amount to add/substract to current position
  */
    function alterRedeemRequestAmount(bool isAddition, uint256 delta) external;

    /**
    @dev Mint Doc tokens and pays the commisions of the operation (retrocompatible function).
    @dev Retrocompatible function.
    @param btcToMint Amount in RBTC to mint
  */
    function mintDoc(uint256 btcToMint) external payable;

    /**
     * @dev Mint Doc tokens and pays the commisions of the operation
     * @param btcToMint Amount in RBTC to mint
     * @param vendorAccount Vendor address
     */
    function mintDocVendors(uint256 btcToMint, address payable vendorAccount) external payable;

    /**
      @dev Redeems the requested amount for the msg.sender, or the max amount of free docs possible (retrocompatible function).
      @dev Retrocompatible function.
      @param docAmount Amount of Docs to redeem.
    */
    function redeemFreeDoc(uint256 docAmount) external;

    /**
      @dev Redeems the requested amount for the msg.sender, or the max amount of free docs possible.
      @param docAmount Amount of Docs to redeem.
      @param vendorAccount Vendor address
    */
    function redeemFreeDocVendors(uint256 docAmount, address payable vendorAccount) external;

    /**
    @dev Allow redeem on liquidation state, user DoCs get burned and he receives
    the equivalent BTCs if can be covered, or the maximum available
  */
    function redeemAllDoc() external;
}

/// An aggregating interface
interface IMoC is IMocMintRedeemDoc {

}
