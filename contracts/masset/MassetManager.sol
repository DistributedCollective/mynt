// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
pragma experimental ABIEncoderV2;

import { SafeMath } from "@openzeppelin/contracts/utils/math/SafeMath.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import { IERC777Recipient } from "@openzeppelin/contracts/token/ERC777/IERC777Recipient.sol";
import { IERC1820Registry } from "@openzeppelin/contracts/utils/introspection/IERC1820Registry.sol";
import { IBridge } from "./IBridge.sol";
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
 * Used for minting and burning tokens, calculating fees and calling the bridge
 * if transaction based on token from another blockchain.
 */

contract MassetManager is IERC777Recipient, OwnableUpgradeable, ReentrancyGuardUpgradeable, ERC1967UpgradeUpgradeable {
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
        uint amount,
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

    // state

    bytes32 constant ERC777_RECIPIENT_INTERFACE_HASH = keccak256("ERC777TokensRecipient");

    string private version;

    BasketManagerV3 private basketManager;
    MetaAssetToken private token;

    FeesVault private feesVault;
    FeesManager private feesManager;

    // internal

    /**
     * @dev Register this contracts as implementer of the "ERC777 Tokens Recipient" interface in the ERC1820 registry.
     */
    function registerAsERC777Recipient() internal {
        IERC1820Registry ERC1820 = IERC1820Registry(0x1820a4B7618BdE71Dce8cdc73aAB6C95905faD24);
        ERC1820.setInterfaceImplementer(address(this), ERC777_RECIPIENT_INTERFACE_HASH, address(this));
    }

    // public

    /**
     * @dev Contract initializer.
     * @param _basketManagerAddress           Address of the basket manager.
     * @param _tokenAddress                   Address of the mAsset token.
     * @param _registerAsERC777RecipientFlag  Bool determine if contract should be register as ERC777 recipient.
     */
    function initialize(
        address _basketManagerAddress,
        address _tokenAddress,
        bool _registerAsERC777RecipientFlag
    ) public initializer {
        require(address(basketManager) == address(0) && address(token) == address(0), "already initialized");
        require(_basketManagerAddress != address(0), "invalid basket manager");
        require(_tokenAddress != address(0), "invalid token");

        __Ownable_init_unchained();
        __ReentrancyGuard_init_unchained();

        basketManager = BasketManagerV3(_basketManagerAddress);
        token = MetaAssetToken(_tokenAddress);
        if (_registerAsERC777RecipientFlag) {
            registerAsERC777Recipient();
        }

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
     * @return massetMinted   Number of newly minted mAssets.
     */
    function mint(address _bAsset, uint256 _bAssetQuantity) external nonReentrant returns (uint256 massetMinted) {
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
        require(basketManager.checkBasketBalanceForDeposit(_basset, _bassetQuantity), "invalid basket");

        (uint256 massetQuantity, uint256 bassetQuantity) = basketManager.convertBassetToMassetQuantity(
            _basset,
            _bassetQuantity
        );

        IERC20(_basset).safeTransferFrom(msg.sender, address(this), bassetQuantity);

        uint256 massetsToMint = _mintAndCalculateFee(massetQuantity, false);
        token.mint(_recipient, massetsToMint);

        emit Minted(msg.sender, _recipient, massetsToMint, _basset, bassetQuantity);

        return massetsToMint;
    }

    /**
     * @dev Mints fee to vault contract and return the amount of massets that goes to the user.
     * @param massetQuantity    Amount of massets.
     * @param _bridgeFlag       Flag that indicates if the proces is used with conjunction with bridge.
     * @return massetsToMint    Amount of massets that is left to mint for user.
     */
    function _mintAndCalculateFee(uint256 massetQuantity, bool _bridgeFlag) internal returns (uint256 massetsToMint) {
        uint256 fee;
        if (_bridgeFlag) {
            fee = feesManager.calculateDepositBridgeFee(massetQuantity);
        } else {
            fee = feesManager.calculateDepositFee(massetQuantity);
        }

        massetsToMint = massetQuantity.sub(fee);

        token.mint(address(feesVault), fee);

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
    function redeem(address _bAsset, uint256 _massetQuantity) external nonReentrant returns (uint256 massetRedeemed) {
        return _redeemTo(_bAsset, _massetQuantity, msg.sender, false, false);
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
        return _redeemTo(_bAsset, _massetQuantity, _recipient, false, false);
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
     * @param _bridgeFlag       Flag that indicates if the reedem proces is used with conjunction with bridge.
     * @param _useCallback      Flag that indicates if this method should call onTokensMinted in case of usage of bridge.
     * @return massetRedeemed     Relative number of mAsset units burned to pay for the bAssets.
     */
    function _redeemTo(
        address _basset,
        uint256 _massetQuantity,
        address _recipient,
        bool _bridgeFlag,
        bool _useCallback
    ) internal returns (uint256 massetRedeemed) {
        require(_recipient != address(0), "must be a valid recipient");
        require(_massetQuantity > 0, "mAsset quantity must be greater than 0");
        require(basketManager.isValidBasset(_basset), "invalid basset");

        address massetSource = (_bridgeFlag && !_useCallback) ? _recipient : msg.sender;

        // massetsToBurn is the amount of massets that is left to burn after the fee was taken.
        // It is used to calculate amount of bassets that are transfered to user.
        uint256 massetsAfterFee = _transferAndCalulateFee(_massetQuantity, massetSource, _bridgeFlag);
        (uint256 bassetQuantity, uint256 massetsToBurn) = basketManager.convertMassetToBassetQuantity(
            _basset,
            massetsAfterFee
        );

        require(basketManager.checkBasketBalanceForWithdrawal(_basset, bassetQuantity), "invalid basket");

        token.burn(massetSource, massetsToBurn);
        // In case of withdrawal to bridge the receiveTokensAt is called instead of transfer.
        if (_bridgeFlag && _useCallback) {
            address bridgeAddress = basketManager.getBridge(_basset);
            require(bridgeAddress != address(0), "invalid bridge");

            IERC20(_basset).approve(bridgeAddress, bassetQuantity);
            require(
                IBridge(bridgeAddress).receiveTokensAt(_basset, bassetQuantity, _recipient, bytes("")),
                "call to bridge failed"
            );
        } else {
            IERC20(_basset).safeTransfer(_recipient, bassetQuantity);
        }

        emit Redeemed(massetSource, _recipient, _massetQuantity, _basset, bassetQuantity);

        return massetsToBurn;
    }

    /**
     * @dev Transfers fee to vault contract and return the amount of massets that will be burned
     *      must have approval to spend the sender's mAasset.
     * @param massetQuantity        Amount of massets to withdraw.
     * @param sender                Owner of massets.
     * @param _bridgeFlag           Flag that indicates if the proces is used with conjunction with bridge.
     * @return massetsToBurn        Amount of massets that is left to burn.
     */
    function _transferAndCalulateFee(
        uint256 massetQuantity,
        address sender,
        bool _bridgeFlag
    ) internal returns (uint256 massetsToBurn) {
        uint256 fee;
        if (_bridgeFlag) {
            fee = feesManager.calculateRedeemBridgeFee(massetQuantity);
        } else {
            fee = feesManager.calculateRedeemFee(massetQuantity);
        }

        massetsToBurn = massetQuantity.sub(fee);

        token.safeTransferFrom(sender, address(feesVault), fee);

        return massetsToBurn;
    }

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
    ) external nonReentrant returns (uint256 massetRedeemed) {
        return _redeemTo(_basset, _massetQuantity, _recipient, true, true);
    }

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
    ) external nonReentrant returns (uint256 massetRedeemed) {
        return _redeemTo(_basset, _massetQuantity, _recipient, true, true);
    }

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
    ) external nonReentrant returns (uint256 massetRedeemed) {
        address bridgeAddress = basketManager.getBridge(_basset);
        require(bridgeAddress != address(0), "invalid bridge");
        require(bridgeAddress == msg.sender, "must be called by bridge");

        return _redeemTo(_basset, _massetQuantity, _recipient, true, false);
    }

    /**
     * @dev Decode bytes data to address.
     * @param data              Data to decode.
     * @return address          Decoded address.
     */
    function _decodeAddress(bytes memory data) private pure returns (address) {
        address addr = abi.decode(data, (address));
        require(addr != address(0), "Converter: Error decoding extraData");
        return addr;
    }

    /**
     * @dev Encode address to bytes data.
     * @param _address          Address to encode.
     * @return address          Decoded address.
     */
    function _encodeAddress(address _address) private pure returns (bytes memory) {
        require(_address != address(0), "Converter: Error encoding extraData");
        return abi.encode(_address);
    }

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
        uint _amount,
        bytes calldata _userData,
        bytes calldata _operatorData
    ) external {
        emit onTokensReceivedCalled(_operator, _from, _to, _amount, _userData, _operatorData);
    }

    /**
     * @dev This is called by the bridge to let us know the user has sent tokens through it and
     *      into the mAsset.
     * @param _orderAmount      Units of the mAsset to redeem.
     * @param _tokenAddress     Address of the bAsset to redeem.
     * @param _userData         Address of the final recipient as ABI encoded bytes.
     */
    function onTokensMinted(
        uint256 _orderAmount,
        address _tokenAddress,
        bytes calldata _userData
    ) external nonReentrant {
        emit onTokensMintedCalled(msg.sender, _orderAmount, _tokenAddress, _userData);

        require(_orderAmount > 0, "amount must be > 0");

        address recipient = _decodeAddress(_userData);
        address basset = _tokenAddress;

        address bridgeAddress = basketManager.getBridge(basset);
        require(msg.sender == bridgeAddress, "only bridge may call");

        require(basketManager.isValidBasset(basset), "invalid basset");
        require(basketManager.checkBasketBalanceForDeposit(basset, _orderAmount), "basket out of balance");

        (uint256 massetQuantity, uint256 bassetQuantity) = basketManager.convertBassetToMassetQuantity(
            basset,
            _orderAmount
        );
        uint256 massetsToMint = _mintAndCalculateFee(massetQuantity, true);
        token.mint(recipient, massetsToMint);

        emit Minted(msg.sender, recipient, massetsToMint, basset, bassetQuantity);
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
        return address(token);
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
            keccak256(bytes(BasketManagerV3(_basketManagerAddress).getVersion())) == keccak256(bytes("3.0")),
            "wrong version (2)"
        );
        require(_feesVaultAddress != address(0), "invalid vault address");
        require(_feesManagerAddress != address(0), "invalid fees manager address");

        feesVault = FeesVault(_feesVaultAddress);
        feesManager = FeesManager(_feesManagerAddress);
        basketManager = BasketManagerV3(_basketManagerAddress);
        token = MetaAssetToken(_tokenAddress);
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
