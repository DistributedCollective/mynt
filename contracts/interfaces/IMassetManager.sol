// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/**
 * @title MassetManager
 * @dev Contract is responsible for managing mAsset and bAsset.
 * Used for minting and burning tokens, calculating fees and calling the bridge
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

    /**
     * @dev Emitted when tokensReceived method is called by the bridge.
     * @param operator         Address operator requesting the transfer.
     * @param from             Address token holder address.
     * @param to               Address recipient address.
     * @param amount           uint256 amount of tokens to transfer.
     * @param userData         Bytes extra information provided by the token holder (if any).
     * @param operatorData     Bytes extra information provided by the operator (if any).
     */
    event onTokensReceivedCalled(
        address operator,
        address from,
        address to,
        uint256 amount,
        bytes userData,
        bytes operatorData
    );

    /**
     * @dev Emitted when onTokensMinted method is called by the bridge.
     * @param sender           Address of the sender.
     * @param orderAmount      Units of the masset to redeem.
     * @param tokenAddress     Address of the bAsset to redeem.
     * @param userData         Address of the final recipient as ABI encoded bytes.
     */
    event onTokensMintedCalled(address indexed sender, uint256 orderAmount, address tokenAddress, bytes userData);

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
    function mint(address _bAsset, uint256 _bAssetQuantity) external returns (uint256 massetMinted);

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
    function redeem(address _bAsset, uint256 _massetQuantity) external returns (uint256 massetRedeemed);

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

    // For the BRIDGE

    /**
     * @dev Credits a recipient with a certain quantity of selected bAsset, in exchange for burning the
     *      relative mAsset quantity from the sender. Sender also incurs a small fee, if any.
     *      This function is designed to also call the bridge in order to have the basset tokens sent to
     *      another blockchain.
     * @param _basset           Address of the bAsset to redeem.
     * @param _massetQuantity   Units of the mAsset to redeem.
     * @param _recipient        Address to credit with withdrawn bAssets.
     * @param _bridgeAddress    This is ignored and is left here for backward compatibility with the FE.
     * @return massetRedeemed   Relative number of mAsset units burned to pay for the bAssets.
     */
    function redeemToBridge(
        address _basset,
        uint256 _massetQuantity,
        address _recipient,
        address _bridgeAddress // IGNORED! for backward compatibility
    ) external returns (uint256 massetRedeemed);

    /**
     * @dev Credits a recipient with a certain quantity of selected bAsset, in exchange for burning the
     *      relative mAsset quantity from the sender. Sender also incurs a small fee, if any.
     *      This function is designed to also call the bridge in order to have the basset tokens sent to
     *      another blockchain.
     * @param _basset           Address of the bAsset to redeem.
     * @param _massetQuantity   Units of the mAsset to redeem.
     * @param _recipient        Address to credit with withdrawn bAssets.
     * @return massetRedeemed   Relative number of mAsset units burned to pay for the bAssets.
     */
    function redeemToBridge(
        address _basset,
        uint256 _massetQuantity,
        address _recipient
    ) external returns (uint256 massetRedeemed);

    /**
     * @dev Credits a recipient with a certain quantity of selected bAsset, in exchange for burning the
     *      relative mAsset quantity from the sender. Sender also incurs a small fee, if any.
     *      This function is designed to be called by the bridge in order to have diffrent fees.
     * @param _basset           Address of the bAsset to redeem.
     * @param _massetQuantity   Units of the mAsset to redeem.
     * @param _recipient        Address to credit with withdrawn bAssets.
     * @return massetRedeemed     Relative number of mAsset units burned to pay for the bAssets.
     */
    function redeemByBridge(
        address _basset,
        uint256 _massetQuantity,
        address _recipient
    ) external returns (uint256 massetRedeemed);

    /**
     * @dev This is called by the bridge to let us know tokens have been received.
     * @param _operator         Address operator requesting the transfer.
     * @param _from             Address token holder address.
     * @param _to               Address recipient address.
     * @param _amount           uint256 amount of tokens to transfer.
     * @param _userData         Bytes extra information provided by the token holder (if any).
     * @param _operatorData     Bytes extra information provided by the operator (if any).
     */
    function tokensReceived(
        address _operator,
        address _from,
        address _to,
        uint256 _amount,
        bytes calldata _userData,
        bytes calldata _operatorData
    ) external;

    /**
     * @dev This is called by the bridge to let us know the user has sent tokens through it and
     *      into the mAsset.
     * @param _orderAmount      Units of the mAsset to redeem.
     * @param _tokenAddress     Address of the bAsset to redeem.
     * @param _userData         Address of the final recipient as ABI encoded bytes.
     */
    function onTokensMinted(uint256 _orderAmount, address _tokenAddress, bytes calldata _userData) external;

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
