// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./MetaAssetToken.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/draft-ERC20PermitUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/ERC1967/ERC1967UpgradeUpgradeable.sol";

interface IERC20PermitWithTransfer {
    /**
     * @dev Sets `value` as the allowance of `spender` over ``owner``'s tokens,
     * given ``owner``'s signed approval.
     *
     * IMPORTANT: The same issues {IERC20-approve} has related to transaction
     * ordering also apply here.
     *
     * Emits an {Approval} event.
     *
     * Requirements:
     *
     * - `spender` cannot be the zero address.
     * - `deadline` must be a timestamp in the future.
     * - `v`, `r` and `s` must be a valid `secp256k1` signature from `owner`
     * over the EIP712-formatted function arguments.
     * - the signature must use ``owner``'s current nonce (see {nonces}).
     *
     * For more information on the signature format, see the
     * https://eips.ethereum.org/EIPS/eip-2612#specification[relevant EIP
     * section].
     */
    function permit(
        address owner,
        address spender,
        uint256 value,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external;

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
     * @dev Returns the remaining number of tokens that `spender` will be
     * allowed to spend on behalf of `owner` through {transferFrom}. This is
     * zero by default.
     *
     * This value changes when {approve} or {transferFrom} are called.
     */
    function allowance(address owner, address spender) external view returns (uint256);
}

/**
 * @dev This is an intermediary contract to fix the griefing attack vulnerbility in the DLLR contract.
 */
contract DllrTransferWithPermit is ERC20PermitUpgradeable, OwnableUpgradeable, ERC1967UpgradeUpgradeable {
    /** MODIFIER */
    modifier requireValidRecipient(address _recipient) {
        require(
            _recipient != address(0) && _recipient != address(this),
            "DLLR: Invalid address. Cannot transfer DLLR to the null address."
        );
        _;
    }

    /** EVENT */
    /**
     * @dev Emitted when transfer  Manager config is changed.
     */
    event TransferWithPermit(address _from, address _to, uint256 _amount);

    /** STORAGE */
    IERC20PermitWithTransfer public dllr;

    function initialize(address payable _dllrTokenAddress) external initializer {
        __ERC20Permit_init("Sovryn Dollar");
        __ERC20_init("Sovryn Dollar", "DLLR");
        dllr = IERC20PermitWithTransfer(_dllrTokenAddress);
        __Ownable_init();
    }

    function transferWithPermit(
        address _from,
        address _to,
        uint256 _amount,
        uint256 _deadline,
        uint8 _v,
        bytes32 _r,
        bytes32 _s
    ) external requireValidRecipient(_to) {
        if (dllr.allowance(_from, address(this)) < _amount) {
            dllr.permit(_from, address(this), _amount, _deadline, _v, _r, _s);
        }

        require(
            dllr.transferFrom(_from, _to, _amount),
            "MetaAssetToken::transferWithPermit: transfer failed"
        );

        emit TransferWithPermit(_from, _to, _amount);
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
