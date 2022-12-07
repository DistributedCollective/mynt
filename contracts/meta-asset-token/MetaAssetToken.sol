// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";
import "../interfaces/IApproveAndCall.sol";
import "../interfaces/IProxy.sol";

/**
 * @title Token
 * @dev Implementation of staking Token.
 * Inherits from ERC20.
 * mint and burn functions.
 */

contract MetaAssetToken is ERC20Permit, Ownable {
    // events

    /**
     * @dev Emitted when mAsset config is changed.
     * @param _newAssetProxy                    Address of new mAsset proxy.
     */
    event AssetProxyChanged(address indexed _newAssetProxy);

    /**
     * @dev Emitted when Basket Manager config is changed.
     * @param _newBasketManagerProxy                    Address of new Basket Manager proxy.
     */
    event BasketManagerProxyChanged(address indexed _newBasketManagerProxy);

    // state

    address public assetProxy;
    address public basketManagerProxy;

    // modifiers
    modifier onlyAssetProxy() {
        require(msg.sender == assetProxy, "DLLR:unauthorized mAsset proxy");
        _;
    }

    modifier requireValidRecipient(address _recipient) {
        require(
            _recipient != address(0) && _recipient != address(this),
            "DLLR: Invalid address. Cannot transfer DLLR directly to the DLLR contract or the null address"
        );

        address _assetImplementation = assetImplementation();
        address _basketManagerImplementation = basketManagerImplementation();
        require(
            _recipient != assetProxy &&
                _recipient != _assetImplementation &&
                _recipient != basketManagerProxy &&
                _recipient != _basketManagerImplementation,
            "DLLR: Invalid address. Cannot transfer DLLR directly to a Mynt protocol address"
        );

        _;
    }

    /**
     * @notice Constructor called on deployment, initiates the contract.
     */
    constructor(string memory _tokenName, string memory _symbol) ERC20(_tokenName, _symbol) ERC20Permit("MetaAsset") {}

    /**
     * @dev getter function of asset implementation address
     *
     * @return asset implementation address
     */
    function assetImplementation() public view virtual returns (address) {
        return IProxy(assetProxy).getProxyImplementation();
    }

    /**
     * @dev getter function of basket manager implementation address
     *
     * @return basket manager implementation address
     */
    function basketManagerImplementation() public view virtual returns (address) {
        return IProxy(basketManagerProxy).getProxyImplementation();
    }

    /**
     * @notice setAssetConfig sets the mAsset proxy address
     * @param _assetProxy The address of the mAsset proxy contract
     */
    function setAssetProxy(address _assetProxy) external onlyOwner {
        require(_assetProxy != address(0), "invalid address");
        assetProxy = _assetProxy;

        emit AssetProxyChanged(assetProxy);
    }

    /**
     * @notice setBasketManagerConfig sets the Basket Manager proxy address
     * @param _basketManagerProxy The address of the Basket Manager proxy contract
     */
    function setBasketManagerProxy(address _basketManagerProxy) external onlyOwner {
        require(_basketManagerProxy != address(0), "invalid address");
        basketManagerProxy = _basketManagerProxy;
        emit BasketManagerProxyChanged(basketManagerProxy);
    }

    /**
     * @notice Creates new tokens and sends them to the recipient.
     * @notice Can be minted only by the mAsset proxy contract.
     *
     * @param _account The recipient address to get the minted tokens.
     * @param _amount The amount of tokens to be minted.
     */
    function mint(address _account, uint256 _amount) external onlyAssetProxy {
        _mint(_account, _amount);
    }

    /**
     * @notice Burns tokens for the given account.
     * @notice Can be burned only by the mAsset proxy contract.
     *
     * @param _account The recipient address to get the minted tokens.
     * @param _amount The amount of tokens to be minted.
     */
    function burn(address _account, uint256 _amount) external onlyAssetProxy {
        _burn(_account, _amount);
    }

    /**
     * @notice Only owner who can transfer the token.
     * @notice destination cannot be:
     * - Zero address.
     * - DLLR contract address.
     * - Sovryn mAsset proxy & implementation address.
     * - Sovryn Basket Manager proxy & implementation address.
     *
     * @param _recipient Recipient of the token.
     * @param _amount The amount of token that will be transferred.
     *
     * @return true / false.
     */
    function transfer(
        address _recipient,
        uint256 _amount
    ) public override requireValidRecipient(_recipient) returns (bool) {
        _transfer(_msgSender(), _recipient, _amount);
        return true;
    }

    /**
     * @notice Only owner who can transfer the token.
     * @notice destination cannot be:
     * - Zero address.
     * - DLLR contract address.
     * - Sovryn mAsset proxy & implementation address.
     * - Sovryn Basket Manager proxy & implementation address.
     *
     * @param _from Sender of the token.
     * @param _to Recipient of the token.
     * @param _amount The amount of token that will be transferred.
     *
     * @return true / false.
     */
    function transferFrom(
        address _from,
        address _to,
        uint256 _amount
    ) public override requireValidRecipient(_to) returns (bool) {
        _approve(_from, msg.sender, allowance(_from, msg.sender) - _amount);
        _transfer(_from, _to, _amount);
        return true;
    }

    /**
     * @notice transfer utilizing EIP-2612, to reduce the additional sending transaction for doing the approval to the spender.
     *
     * @notice destination cannot be:
     * - Zero address.
     * - DLLR contract address.
     * - Sovryn mAsset proxy & implementation address.
     * - Sovryn Basket Manager proxy & implementation address.
     *
     * @dev By calling this function, the allowance will be overwritten by the total amount.
     *
     * @param _from Owner of the token.
     * @param _to Recipient of the token.
     * @param _amount The amount of the token that will be transferred.
     * @param _deadline Expiration time of the signature.
     * @param _v Last 1 byte of ECDSA signature.
     * @param _r First 32 bytes of ECDSA signature.
     * @param _s 32 bytes after _r in ECDSA signature.
     */
    function transferWithPermit(
        address _from,
        address _to,
        uint256 _amount,
        uint256 _deadline,
        uint8 _v,
        bytes32 _r,
        bytes32 _s
    ) external requireValidRecipient(_to) {
        permit(_from, msg.sender, _amount, _deadline, _v, _r, _s);
        transferFrom(_from, _to, _amount);
    }

    /**
     * @notice Approves and then calls the receiving contract.
     * Useful to encapsulate sending tokens to a contract in one call.
     * Solidity has no native way to send tokens to contracts.
     * ERC-20 tokens require approval to be spent by third parties, such as a contract in this case.
     * @param _spender The contract address to spend the tokens.
     * @param _amount The amount of tokens to be sent.
     * @param _data Parameters for the contract call, such as endpoint signature.
     */
    function approveAndCall(address _spender, uint256 _amount, bytes calldata _data) external {
        approve(_spender, _amount);
        IApproveAndCall(_spender).receiveApproval(msg.sender, _amount, address(this), _data);
    }

    /**
     * @dev to support EIP712, will need the token contract to return the chain id.
     *
     * @return chain id.
     *
     */
    function getChainId() external view returns (uint256) {
        return block.chainid;
    }
}
