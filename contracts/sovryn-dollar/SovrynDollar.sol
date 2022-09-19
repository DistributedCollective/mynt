pragma solidity ^0.5.17;

import "@openzeppelin/contracts/token/ERC20/ERC20Detailed.sol";
import "@openzeppelin/contracts/ownership/Ownable.sol";
import "../interfaces/IApproveAndCall.sol";
import "./ERC20Permit.sol";

/**
 * @title Token
 * @dev Implementation of staking Token.
 * Inherits from ERC20 and ERC20Detailed with implemented
 * mint and burn functions.
 */

contract SovrynDollarToken is ERC20Permit, ERC20Detailed, Ownable {
    // events

    /**
     * @dev Emitted when Mynt mAsset config is changed.
     * @param _newMyntAssetProxy                    Address of new Mynt mAsset proxy.
     * @param _newMyntAssetImplementation           Address of new Mynt mAsset implementation.
     */
    event MyntAssetConfigChanged(address indexed _newMyntAssetProxy,  address indexed _newMyntAssetImplementation);

    /**
     * @dev Emitted when Mynt Basket Manager config is changed.
     * @param _newMyntBasketManagerProxy                    Address of new Mynt Basket Manager proxy.
     * @param _newMyntBasketManagerImplementation           Address of new Mynt Basket Manager implementation.
     */
    event MyntBasketManagerConfigChanged(address indexed _newMyntBasketManagerProxy,  address indexed _newMyntBasketManagerImplementation);

    // state

    address public myntAssetProxy;
    address public myntAssetImplementation;
    address public myntBasketManagerProxy;
    address public myntBasketManagerImplementation;

    // modifiers
    modifier onlyMyntAssetProxy() {
      require(msg.sender == myntAssetProxy, "DLLR:unathorized mAsset proxy");
      _;
    }

    /**
     * @notice Constructor called on deployment, initiates the contract.
     */
    // constructor(string memory _domainName) ERC20("Sovryn Dollar", "DLLR") ERC20Permit(_domainName) {}
    constructor() public ERC20Detailed("Sovryn Dollar", "DLLR", 18) {}

    /**
     * @notice setMyntAssetConfig sets the Mynt mAsset proxy & implementation address
     * @param _myntAssetProxy The address of the Mynt mAsset proxy contract
     * @param _myntAssetImplementation The address of the Mynt mAsset implementation contract
     */
    function setMyntAssetConfig(address _myntAssetProxy, address _myntAssetImplementation) external onlyOwner {
        require(_myntAssetProxy != address(0) && _myntAssetImplementation != address(0), "invalid address");
        myntAssetProxy = _myntAssetProxy;
        myntAssetImplementation = _myntAssetImplementation;
        emit MyntAssetConfigChanged(myntAssetProxy, myntAssetImplementation);
    }

     /**
     * @notice setMyntBasketManagerConfig sets the Mynt Basket Manager proxy & implementation address
     * @param _myntBasketManagerProxy The address of the Mynt Basket Manager proxy contract
     * @param _myntBasketManagerImplementation The address of the Mynt Basket Manager implementation contract
     */
    function setMyntBasketManagerConfig(address _myntBasketManagerProxy, address _myntBasketManagerImplementation) external onlyOwner {
        require(_myntBasketManagerProxy != address(0) && _myntBasketManagerImplementation != address(0), "invalid address");
        myntBasketManagerProxy = _myntBasketManagerProxy;
        myntBasketManagerImplementation = _myntBasketManagerImplementation;
        emit MyntBasketManagerConfigChanged(myntBasketManagerProxy, myntBasketManagerImplementation);
    }

    /**
     * @notice Creates new tokens and sends them to the recipient.
     * @notice Can be minted only by the mynt mAsset proxy contract.
     *
     * @param _account The recipient address to get the minted tokens.
     * @param _amount The amount of tokens to be minted.
     */
    function mint(address _account, uint256 _amount) external onlyMyntAssetProxy {
        _mint(_account, _amount);
    }

    /**
     * @notice Burns tokens for the given account.
     * @notice Can be burned only by the mynt mAsset proxy contract.
     *
     * @param _account The recipient address to get the minted tokens.
     * @param _amount The amount of tokens to be minted.
     */
    function burn(address _account, uint256 _amount) external onlyMyntAssetProxy {
        _burn(_account, _amount);
    }

    /**
     * @notice Only owner who can transfer the token.
     * @notice destination cannot be:
     * - Zero address.
     * - DDLR contract address.
     * - Sovryn Mynt mAsset proxy & implementation address.
     * - Sovryn Mynt Basket Manager proxy & implementation address.
     *
     * @param _recipient Recipient of the token.
     * @param _amount The amount of token that will be transferred.
     *
     * @return true / false.
     */
    function transfer(address _recipient, uint256 _amount) public returns (bool) {
        _requireValidRecipient(_recipient);
        _transfer(_msgSender(), _recipient, _amount);
        return true;
    }

    /**
     * @notice Only owner who can transfer the token.
     * @notice destination cannot be:
     * - Zero address.
     * - DDLR contract address.
     * - Sovryn Mynt mAsset proxy & implementation address.
     * - Sovryn Mynt Basket Manager proxy & implementation address.
     *
     * @param _from Sender of the token.
     * @param _to Recipient of the token.
     * @param _amount The amount of token that will be transferred.
     *
     * @return true / false.
     */
    function transferFrom(address _from, address _to, uint256 _amount) public returns (bool) {
        _requireValidRecipient(_to);
        _approve(
            _from,
            msg.sender,
            allowance(_from, msg.sender).sub(_amount, "ERC20: transfer amount exceeds allowance")
        );
        _transfer(_from, _to, _amount);
        return true;
    }

    /**
     * @notice transfer utilizing EIP-2612, to reduce the additional sending transaction for doing the approval to the spender.
     *
     * @notice destination cannot be:
     * - Zero address.
     * - DDLR contract address.
     * - Sovryn Mynt mAsset proxy & implementation address.
     * - Sovryn Mynt Basket Manager proxy & implementation address.
     *
     * @dev By calling this function, the allowance will be overwritten by the total amount.
     *
     * @param _from Sender of the token.
     * @param _to Recipient of the token.
     * @param _amount The amount of the token that will be transferred.
     * @param _deadline Expiration time of the signature.
     * @param _v Last 1 byte of ECDSA signature.
     * @param _r First 32 bytes of ECDSA signature.
     * @param _s 32 bytes after _r in ECDSA signature.
     */
    function transferWithPermit(address _from, address _to, uint256 _amount, uint256 _deadline, uint8 _v, bytes32 _r, bytes32 _s) external {
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
    function approveAndCall(
        address _spender,
        uint256 _amount,
        bytes calldata _data
    ) external {
        approve(_spender, _amount);
        IApproveAndCall(_spender).receiveApproval(msg.sender, _amount, address(this), _data);
    }

    /** Internal function */
    function _requireValidRecipient(address _recipient) private view {
        require(
            _recipient != address(0) && _recipient != address(this),
            "DLLR: Invalid address. Cannot transfer DLLR directly to the DLLR contract or the null address"
        );

        require(
            _recipient != myntAssetProxy && _recipient != myntAssetImplementation && _recipient != myntBasketManagerProxy && _recipient != myntBasketManagerImplementation,
            "DLLR: Invalid address. Cannot transfer DLLR directly to a Sovryn Mynt protocol address."
        );
    }
}
