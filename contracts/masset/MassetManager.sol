// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
pragma experimental ABIEncoderV2;

import { SafeMath } from "@openzeppelin/contracts/utils/math/SafeMath.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import { BasketManagerV3 } from "./BasketManagerV3.sol";
import { FeesVault } from "../vault/FeesVault.sol";
import { FeesManager } from "./FeesManager.sol";
import "../meta-asset-token/MetaAssetToken.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/ERC1967/ERC1967UpgradeUpgradeable.sol";

/**
 * @title MassetManager
 * @dev Contract is responsible for managing mAsset and bAsset.
 * Used for minting and burning tokens and calculating fees.
 * if transaction based on token from another blockchain.
 */

contract MassetManager is
    OwnableUpgradeable,
    ReentrancyGuardUpgradeable,
    ERC1967UpgradeUpgradeable
{
    using SafeMath for uint256;
    using SafeERC20 for IERC20;
    using SafeERC20 for MetaAssetToken;

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

    // state

    string private version;

    BasketManagerV3 private basketManager;
    MetaAssetToken private mAssetToken;

    FeesVault private feesVault;
    FeesManager private feesManager;

    // public

    /**
     * @dev Contract initializer.
     * @param _basketManagerAddress           Address of the basket manager.
     * @param _mAssetTokenAddress             Address of the mAsset mAssetToken.
     */
    function initialize(
        address _basketManagerAddress,
        address _mAssetTokenAddress
    ) public initializer {
        require(
            address(basketManager) == address(0) && address(mAssetToken) == address(0),
            "already initialized"
        );
        require(_basketManagerAddress != address(0), "invalid basket manager");
        require(_mAssetTokenAddress != address(0), "invalid mAssetToken");

        __Ownable_init_unchained();
        __ReentrancyGuard_init_unchained();

        basketManager = BasketManagerV3(_basketManagerAddress);
        mAssetToken = MetaAssetToken(_mAssetTokenAddress);

        version = "1.0";
    }

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
    ) external nonReentrant returns (uint256 massetMinted) {
        return _mintTo(_bAsset, _bAssetQuantity, msg.sender);
    }

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
    ) external nonReentrant returns (uint256 massetMinted) {
        return _mintTo(_bAsset, _bAssetQuantity, _recipient);
    }

    /***************************************
              MINTING (INTERNAL)
    ****************************************/

    /**
     * @dev Mint a single mAsset to recipient address, at a 1:1 ratio with the bAsset.
     *      This contract must have approval to spend the senders bAsset.
     * @param _basset         Address of the bAsset.
     * @param _bassetQuantity Quantity in bAsset units.
     * @param _recipient      Receipient of the newly minted mAsset tokens.
     * @return massetMinted   Number of newly minted mAssets.
     */
    function _mintTo(
        address _basset,
        uint256 _bassetQuantity,
        address _recipient
    ) internal returns (uint256 massetMinted) {
        require(_recipient != address(0), "must be a valid recipient");
        require(_bassetQuantity > 0, "quantity must not be 0");

        require(basketManager.isValidBasset(_basset), "invalid basset");

        require(
            basketManager.checkBasketBalanceForDeposit(_basset, _bassetQuantity),
            "invalid basket"
        );

        (uint256 massetQuantity, uint256 bassetQuantity) = basketManager
            .convertBassetToMassetQuantity(_basset, _bassetQuantity);

        IERC20(_basset).safeTransferFrom(msg.sender, address(this), bassetQuantity);

        uint256 massetsToMint = _mintAndCalculateFee(massetQuantity);
        mAssetToken.mint(_recipient, massetsToMint);

        emit Minted(msg.sender, _recipient, massetsToMint, _basset, bassetQuantity);

        return massetsToMint;
    }

    /**
     * @dev Mints fee to vault contract and return the amount of massets that goes to the user.
     * @param massetQuantity    Amount of massets.
     * @return massetsToMint    Amount of massets that is left to mint for user.
     */
    function _mintAndCalculateFee(
        uint256 massetQuantity
    ) internal returns (uint256 massetsToMint) {
        uint256 fee;
        fee = feesManager.calculateDepositFee(massetQuantity);

        massetsToMint = massetQuantity.sub(fee);

        mAssetToken.mint(address(feesVault), fee);

        return massetsToMint;
    }

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
    ) external nonReentrant returns (uint256 massetRedeemed) {
        return _redeemTo(_bAsset, _massetQuantity, msg.sender);
    }

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
    ) external nonReentrant returns (uint256 massetRedeemed) {
        return _redeemTo(_bAsset, _massetQuantity, _recipient);
    }

    /***************************************
              REDEMPTION (INTERNAL)
    ****************************************/

    /**
     * @dev Credits a recipient with a certain quantity of selected bAsset, in exchange for burning the
     *      relative mAsset quantity from the sender. Sender also incurs a small fee, if any.
     * @param _basset           Address of the bAsset to redeem.
     * @param _massetQuantity   Units of the masset to redeem.
     * @param _recipient        Address to credit with withdrawn bAssets.
     * @return massetRedeemed     Relative number of mAsset units burned to pay for the bAssets.
     */
    function _redeemTo(
        address _basset,
        uint256 _massetQuantity,
        address _recipient
    ) internal returns (uint256 massetRedeemed) {
        require(_recipient != address(0), "must be a valid recipient");
        require(_massetQuantity > 0, "mAsset quantity must be greater than 0");
        require(basketManager.isValidBasset(_basset), "invalid basset");

        // massetsToBurn is the amount of massets that is left to burn after the fee was taken.
        // It is used to calculate amount of bassets that are transfered to user.
        uint256 massetsAfterFee = _transferAndCalulateFee(_massetQuantity, msg.sender);
        (uint256 bassetQuantity, uint256 massetsToBurn) = basketManager
            .convertMassetToBassetQuantity(_basset, massetsAfterFee);

        require(
            basketManager.checkBasketBalanceForWithdrawal(_basset, bassetQuantity),
            "invalid basket"
        );

        mAssetToken.burn(msg.sender, massetsToBurn);

        IERC20(_basset).safeTransfer(_recipient, bassetQuantity);

        emit Redeemed(msg.sender, _recipient, _massetQuantity, _basset, bassetQuantity);

        return massetsToBurn;
    }

    /**
     * @dev Transfers fee to vault contract and return the amount of massets that will be burned
     *      must have approval to spend the sender's mAasset.
     * @param massetQuantity        Amount of massets to withdraw.
     * @param sender                Owner of massets.
     * @return massetsToBurn        Amount of massets that is left to burn.
     */
    function _transferAndCalulateFee(
        uint256 massetQuantity,
        address sender
    ) internal returns (uint256 massetsToBurn) {
        uint256 fee = feesManager.calculateRedeemFee(massetQuantity);

        massetsToBurn = massetQuantity.sub(fee);

        mAssetToken.safeTransferFrom(sender, address(feesVault), fee);

        return massetsToBurn;
    }

    // Getters

    function getFeesVault() external view returns (address) {
        return address(feesVault);
    }

    function getFeesManager() external view returns (address) {
        return address(feesManager);
    }

    function getVersion() external view returns (string memory) {
        return version;
    }

    function getToken() external view returns (address) {
        return address(mAssetToken);
    }

    function getBasketManager() external view returns (address) {
        return address(basketManager);
    }

    // v3 migration
    /**
     * @dev Migration to V3 version.
     * @param _basketManagerAddress     Address of new BasketManagerV3.
     * @param _tokenAddress             Address of mAsset token.
     * @param _feesVaultAddress         Address of FeesVault contract.
     * @param _feesManagerAddress       Adress of FeesManager contract.
     */
    function upgradeToV3(
        address _basketManagerAddress,
        address _tokenAddress,
        address _feesVaultAddress,
        address _feesManagerAddress
    ) external {
        require(
            keccak256(bytes(version)) == keccak256(bytes("1.0")) ||
                keccak256(bytes(version)) == keccak256(bytes("2.0")),
            "wrong version (1)"
        );
        require(
            keccak256(bytes(BasketManagerV3(_basketManagerAddress).getVersion())) ==
                keccak256(bytes("3.0")),
            "wrong version (2)"
        );
        require(_feesVaultAddress != address(0), "invalid vault address");
        require(_feesManagerAddress != address(0), "invalid fees manager address");

        feesVault = FeesVault(_feesVaultAddress);
        feesManager = FeesManager(_feesManagerAddress);
        basketManager = BasketManagerV3(_basketManagerAddress);
        mAssetToken = MetaAssetToken(_tokenAddress);
        version = "3.0";
    }

    /**
     * @dev get the implementation logic address referring to ERC1967 standard.
     *
     * @return logic implementation address.
     */
    function getProxyImplementation() external view returns (address) {
        return ERC1967UpgradeUpgradeable._getImplementation();
    }
}
