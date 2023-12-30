// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

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
 * @title DllrTransferWithPermit interface
 */
interface IDllrTransferWithPermit {
    /** EVENT */

    /**
     * @dev Emitted when transferWithPermit is executed.
     */
    event TransferWithPermit(address _from, address _to, uint256 _amount);

    /**
     *
     * @dev This is the intermediary function of transferWithPermit (permit + transferFro) to the actual DLLR token contract address.
     *
     * @notice destination cannot be:
     * - zero (0x0) address.
     * - actual dllr contract address.
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
     * @dev to support EIP712, will need the token contract to return the chain id.
     *
     * @return chain id.
     *
     */
    function getChainId() external view returns (uint256);

    /**
     * @dev getter for the actual dllr contract address
     *
     * @return actual dllr contract address
     *
     */
    function dllr() external view returns (address);

    /**
     * @dev Proxy function to get the actual Dllr balance
     *
     * @param account account address
     *
     * @return balance amount of the account
     */
    function balanceOf(address account) external view returns (uint256);
}
