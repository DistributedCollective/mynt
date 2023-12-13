// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/**
 * @title MassetManager
 * @dev Contract is responsible for managing mAsset and bAsset.
 * Used for minting and burning tokens and calculating fees
 * if transaction based on token from another blockchain.
 */

interface IMassetManager {
    // events

    /**
     * @dev Emitted when deposit is completed.
     * @param minter            Address of the minter.
     * @param recipient         Address of the recipient.
     * @param massetQuantity    Masset quantity.
     * @param bAsset            Address of the bAsset.
     * @param bassetQuantity    Basset quantity.
     */
    event Minted(
        address indexed minter,
        address indexed recipient,
        uint256 massetQuantity,
        address bAsset,
        uint256 bassetQuantity
    );

    /**
     * @dev Emitted when withdrawal is completed.
     * @param redeemer          Address of the redeemer.
     * @param recipient         Address of the recipient.
     * @param massetQuantity    Masset quantity.
     * @param bAsset            Address of the bAsset.
     * @param bassetQuantity    Basset quantity.
     */
    event Redeemed(
        address indexed redeemer,
        address indexed recipient,
        uint256 massetQuantity,
        address bAsset,
        uint256 bassetQuantity
    );

    /***************************************
                MINTING (PUBLIC)
    ****************************************/

    /**
     * @dev Mint a single mAsset, at a 1:1 ratio with the bAsset. This contract
     *      must have approval to spend the senders bAsset.
     * @param _bAsset         Address of the bAsset.
     * @param _bAssetQuantity Quantity in bAsset units.
     * @return massetMinted   Quantity of newly minted mAsset.
     */
    function mint(
        address _bAsset,
        uint256 _bAssetQuantity
    ) external returns (uint256 massetMinted);

    /**
     * @dev Mint a single mAsset to recipient address, at a 1:1 ratio with the bAsset.
     *      This contract must have approval to spend the senders bAsset.
     * @param _bAsset         Address of the bAsset.
     * @param _bAssetQuantity Quantity in bAsset units.
     * @param _recipient      Receipient of the newly minted mAsset tokens.
     * @return massetMinted   Number of newly minted mAssets.
     */
    function mintTo(
        address _bAsset,
        uint256 _bAssetQuantity,
        address _recipient
    ) external returns (uint256 massetMinted);

    /***************************************
              REDEMPTION (PUBLIC)
    ****************************************/

    /**
     * @dev Credits the sender with a certain quantity of selected bAsset, in exchange for burning the
     *      relative mAsset quantity from the sender. Sender also incurs a small mAsset fee, if any.
     * @param _bAsset           Address of the bAsset to redeem.
     * @param _massetQuantity   Units of the masset to redeem.
     * @return massetRedeemed   Relative number of mAsset units burned to pay for the bAssets.
     */
    function redeem(
        address _bAsset,
        uint256 _massetQuantity
    ) external returns (uint256 massetRedeemed);

    /**
     * @dev Credits a recipient with a certain quantity of selected bAsset, in exchange for burning the
     *      relative mAsset quantity from the sender. Sender also incurs a small fee, if any.
     * @param _bAsset           Address of the bAsset to redeem.
     * @param _massetQuantity   Units of the masset to redeem.
     * @param _recipient        Address to credit with withdrawn bAssets.
     * @return massetRedeemed   Relative number of mAsset units burned to pay for the bAssets.
     */
    function redeemTo(
        address _bAsset,
        uint256 _massetQuantity,
        address _recipient
    ) external returns (uint256 massetRedeemed);

    // Getters

    function getFeesVault() external view returns (address);

    function getFeesManager() external view returns (address);

    function getVersion() external view returns (string memory);

    function getToken() external view returns (address);

    function getBasketManager() external view returns (address);

    /**
     * @dev get the implementation logic address referring to ERC1967 standard.
     *
     * @return logic implementation address.
     */
    function getProxyImplementation() external view returns (address);
}
