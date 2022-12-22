// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @dev Permit params (EIP-2612) wrapper struct
 */
struct PermitParams {
    uint256 deadline;
    uint8 v;
    bytes32 r;
    bytes32 s;
}

/**
 * @title DLLR mAsset interface.
 * @dev mAsset - Meta Asset Token implementation.
 * Inherits from ERC20.
 * mint and burn functions.
 */
interface IDLLR is IERC20 {
    // events

    /**
     * @dev Emitted when MassetManager config is changed.
     * @param _newMassetManagerProxy                    Address of new MassetManager proxy.
     */
    event MassetManagerProxyChanged(address indexed _newMassetManagerProxy);

    /**
     * @dev Emitted when Basket Manager config is changed.
     * @param _newBasketManagerProxy                    Address of new Basket Manager proxy.
     */
    event BasketManagerProxyChanged(address indexed _newBasketManagerProxy);

    /**
     * @dev getter function of MassetManager implementation address
     *
     * @return MassetManager implementation address
     */
    function massetManagerImplementation() external view returns (address);

    /**
     * @dev getter function of basket manager implementation address
     *
     * @return basket manager implementation address
     */
    function basketManagerImplementation() external view returns (address);

    /**
     * @notice setMassetManagerProxy sets the MassetManager proxy address
     * @param _massetManagerProxy The address of the MassetManager proxy contract
     */
    function setMassetManagerProxy(address _massetManagerProxy) external;

    /**
     * @notice setBasketManagerConfig sets the Basket Manager proxy address
     * @param _basketManagerProxy The address of the Basket Manager proxy contract
     */
    function setBasketManagerProxy(address _basketManagerProxy) external;

    /**
     * @notice Creates new tokens and sends them to the recipient.
     * @notice Can be minted only by the MassetManager proxy contract.
     *
     * @param _account The recipient address to get the minted tokens.
     * @param _amount The amount of tokens to be minted.
     */
    function mint(address _account, uint256 _amount) external;

    /**
     * @notice Burns tokens for the given account.
     * @notice Can be burned only by the MassetManager proxy contract.
     *
     * @param _account The recipient address to get the minted tokens.
     * @param _amount The amount of tokens to be minted.
     */
    function burn(address _account, uint256 _amount) external;

    /**
     * @notice Only owner who can transfer the token.
     * @notice destination cannot be:
     * - zero (0x0) address.
     *
     * @param _recipient Recipient of the token.
     * @param _amount The amount of token that will be transferred.
     *
     * @return true / false.
     */
    function transfer(address _recipient, uint256 _amount) external returns (bool);

    /**
     * @notice Only owner who can transfer the token.
     * @notice destination cannot be:
     * - zero (0x0) address.
     *
     * @param _from Sender of the token.
     * @param _to Recipient of the token.
     * @param _amount The amount of token that will be transferred.
     *
     * @return true / false.
     */
    function transferFrom(address _from, address _to, uint256 _amount) external returns (bool);

    /**
     * @notice transfer utilizing EIP-2612, to reduce the additional sending transaction for doing the approval to the spender.
     *
     * @notice destination cannot be:
     * - zero (0x0) address.
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
    ) external;

    /**
     * @notice Approves and then calls the receiving contract.
     * Useful to encapsulate sending tokens to a contract in one call.
     * Solidity has no native way to send tokens to contracts.
     * ERC-20 tokens require approval to be spent by third parties, such as a contract in this case.
     * @param _spender The contract address to spend the tokens.
     * @param _amount The amount of tokens to be sent.
     * @param _data Parameters for the contract call, such as endpoint signature.
     */
    function approveAndCall(address _spender, uint256 _amount, bytes calldata _data) external;

    /**
     * @dev to support EIP712, will need the token contract to return the chain id.
     *
     * @return chain id.
     *
     */
    function getChainId() external view returns (uint256);
}
