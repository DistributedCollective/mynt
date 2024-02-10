// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/ERC1967/ERC1967UpgradeUpgradeable.sol";
import { IMocMintRedeemDoc } from "./IMoC.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "../../meta-asset-token/DLLR.sol";
import "../../interfaces/IMassetManager.sol";
import { IDLLR, PermitParams } from "../../interfaces/IDLLR.sol";
import { IPermit2, ISignatureTransfer } from "../../permit2/interfaces/IPermit2.sol";

/// @notice This contract provides compound functions with Money On Chain wrapping them in one transaction for convenience and to save on gas
contract MocIntegration is OwnableUpgradeable, ERC1967UpgradeUpgradeable {
    using Counters for Counters.Counter;
    // Money On Chain DoC redeem interface at MoC main contract address
    IMocMintRedeemDoc public immutable moc;
    // IERC20@[DoC token]
    IERC20 public immutable doc;
    IDLLR public immutable dllr;
    IMassetManager public immutable massetManager;

    address public mocVendorAccount;

    IPermit2 public immutable permit2;

    event GetDocFromDllrAndRedeemRBTC(address indexed from, uint256 fromDLLR, uint256 toRBTC);
    event MocVendorAccountSet(address newMocVendorAccount);

    /**
     * @param _moc MoC main contract address
     * @param _doc DoC contract address
     * @param _dllr DLLR contract address
     * @param _massetManager MassetManager contract address
     */
    constructor(
        address _moc,
        address _doc,
        address _dllr,
        address _massetManager,
        address _permit2
    ) {
        require(
            _moc != address(0) &&
                _doc != address(0) &&
                _dllr != address(0) &&
                _massetManager != address(0) &&
                _permit2 != address(0),
            "MocIntegration:: no null addresses allowed"
        );
        moc = IMocMintRedeemDoc(_moc);
        doc = IERC20(_doc);
        dllr = IDLLR(_dllr);
        massetManager = IMassetManager(_massetManager);
        permit2 = IPermit2(_permit2);
    }

    function initialize(address payable _mocVendorAccount) external initializer {
        __Ownable_init();
        _setMocVendorAccount(_mocVendorAccount);
    }

    ///@dev the contract requires receiving funds temporarily before transferring them to users
    receive() external payable {}

    /**
     * @notice how getDocFromDllrAndRedeemRBTC function works:
     * -------------------------------------------------------------------------------------------
     * |               Mynt                         |                Money On Chain              |
     * -------------------------------------------------------------------------------------------
     * | get DLLR (EIP-2612) -> convert DLLR to DoC | -> get RBTC from DoC -> send RBTC to user  |
     * -------------------------------------------------------------------------------------------
     *
     * @param _dllrAmount The amount of the DLLR (mAsset) that will be burned in exchange for _toToken
     * @param _permitParams EIP-2612 permit params:
     *        _deadline Expiration time of the signature.
     *        _v Last 1 byte of ECDSA signature.
     *        _r First 32 bytes of ECDSA signature.
     *        _s 32 bytes after _r in ECDSA signature.
     */
    function getDocFromDllrAndRedeemRBTC(
        uint256 _dllrAmount,
        PermitParams calldata _permitParams
    ) external {
        // transfer _dllrAmount to this contract by permit (EIP-2612)
        address thisAddress = address(this);
        dllr.transferWithPermit(
            msg.sender,
            thisAddress,
            _dllrAmount,
            _permitParams.deadline,
            _permitParams.v,
            _permitParams.r,
            _permitParams.s
        );

        // redeem DoC from DLLR
        require(
            massetManager.redeemTo(address(doc), _dllrAmount, thisAddress) == _dllrAmount,
            "MocIntegration:: redeemed incorrect DoC amount"
        );

        // redeem RBTC from DoC using Money On Chain and send to the user
        uint256 rbtcBalanceBefore = thisAddress.balance;
        moc.redeemFreeDocVendors(_dllrAmount, payable(mocVendorAccount));
        uint256 rbtcAmount = thisAddress.balance - rbtcBalanceBefore;
        (bool success, ) = msg.sender.call{ value: rbtcAmount }("");
        require(success, "MocIntegration:: error transferring redeemed RBTC");

        emit GetDocFromDllrAndRedeemRBTC(msg.sender, _dllrAmount, rbtcAmount);
    }

    /**
     * @notice how getDocFromDllrAndRedeemRBTC function works:
     * -------------------------------------------------------------------------------------------
     * |               Mynt                         |                Money On Chain              |
     * -------------------------------------------------------------------------------------------
     * | get DLLR (EIP-2612) -> convert DLLR to DoC | -> get RBTC from DoC -> send RBTC to user  |
     * -------------------------------------------------------------------------------------------
     *
     * @param permit permit data, in form of PermitTransferFrom struct.
     * @param signature of the permit data.
     */
    function getDocFromDllrAndRedeemRbtcWithPermit2(
        ISignatureTransfer.PermitTransferFrom memory permit,
        bytes memory signature
    ) external {
        address thisAddress = address(this);
        uint256 _dllrAmount = permit.permitted.amount;

        ISignatureTransfer.SignatureTransferDetails
            memory transferDetails = _generateTransferDetails(thisAddress, _dllrAmount);

        permit2.permitTransferFrom(permit, transferDetails, msg.sender, signature);

        // redeem DoC from DLLR
        require(
            massetManager.redeemTo(address(doc), _dllrAmount, thisAddress) == _dllrAmount,
            "MocIntegration:: redeemed incorrect DoC amount"
        );

        // redeem RBTC from DoC using Money On Chain and send to the user
        uint256 rbtcBalanceBefore = thisAddress.balance;
        moc.redeemFreeDocVendors(_dllrAmount, payable(mocVendorAccount));
        uint256 rbtcAmount = thisAddress.balance - rbtcBalanceBefore;
        (bool success, ) = msg.sender.call{ value: rbtcAmount }("");
        require(success, "MocIntegration:: error transferring redeemed RBTC");

        emit GetDocFromDllrAndRedeemRBTC(msg.sender, _dllrAmount, rbtcAmount);
    }

    /// Set MoC registered Vendor account to receive markup fees https://docs.moneyonchain.com/main-rbtc-contract/integration-with-moc-platform/vendors
    function setMocVendorAccount(address payable newMocVedorAccount) external onlyOwner {
        _setMocVendorAccount(newMocVedorAccount);
    }

    function _setMocVendorAccount(address newMocVedorAccount) internal {
        mocVendorAccount = newMocVedorAccount;
        emit MocVendorAccountSet(mocVendorAccount);
    }

    /**
     * @dev get the implementation logic address referring to ERC1967 standard.
     *
     * @return logic implementation address.
     */
    function getProxyImplementation() external view returns (address) {
        return ERC1967UpgradeUpgradeable._getImplementation();
    }

    /**
     * @dev view function to construct SignatureTransferDetails struct to be used by Permit2
     *
     * @param _to ultimate recipient
     * @param _amount amount of transfer
     *
     * @return SignatureTransferDetails struct object
     */
    function _generateTransferDetails(
        address _to,
        uint256 _amount
    ) private pure returns (ISignatureTransfer.SignatureTransferDetails memory) {
        ISignatureTransfer.SignatureTransferDetails memory transferDetails = ISignatureTransfer
            .SignatureTransferDetails({ to: _to, requestedAmount: _amount });

        return transferDetails;
    }
}
