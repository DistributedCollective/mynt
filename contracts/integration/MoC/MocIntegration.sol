// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import { IMocMintRedeemDoc, PermitParams } from "./IMoC.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../../meta-asset-token/DLLR.sol";
import "../../interfaces/IMassetManager.sol";
import "../../interfaces/IDLLR.sol";

/// @notice This contract provides compound functions with Money On Chain wrapping them in one transaction for convenience and to save on gas
contract MocIntegration {
    // Address of the MoC contract
    IMocMintRedeemDoc public immutable moc;
    // Address of the DoC token
    IERC20 public immutable doc;
    IDLLR public immutable dllr;
    IMassetManager public immutable massetManager;

    event GetDocFromDllrAndRedeemRBTC(uint256 fromDLLR, uint256 toRBTC);

    /**
     * @param _moc MoC main contract address
     * @param _doc DoC contract address
     * @param _dllr DLLR contract address
     * @param _massetManager MassetManager contract address
     */
    constructor(address _moc, address _doc, address _dllr, address _massetManager) {
        require(
            _moc != address(0) && _doc != address(0) && _dllr != address(0) && _massetManager != address(0),
            "No null addresses allowed"
        );
        moc = IMocMintRedeemDoc(_moc);
        doc = IERC20(_doc);
        dllr = IDLLR(_dllr);
        massetManager = IMassetManager(_massetManager);
    }

    /**
     * @notice how getDocFromDllrAndRedeemRBTC function works:
     * -------------------------------------------------------------------------------------------
     * |               Mynt                         |                Money On Chain              |
     * -------------------------------------------------------------------------------------------
     * | Get DLLR (EIP-2612) -> convert DLLR to DoC | -> get RBTC from DLLR -> send RBTC to user |
     * -------------------------------------------------------------------------------------------
     *
     * @param _dllrAmount The amount of the DLLR (mAsset) that will be burned in exchange for _toToken
     * @param _permitParams EIP-2612 permit params:
     *        _deadline Expiration time of the signature.
     *        _v Last 1 byte of ECDSA signature.
     *        _r First 32 bytes of ECDSA signature.
     *        _s 32 bytes after _r in ECDSA signature.
     */
    function getDocFromDllrAndRedeemRBTC(uint256 _dllrAmount, PermitParams calldata _permitParams) external {
        // transfer _dllrAmount to this contract by permit (EIP-2612)
        address thisAddress = address(this);
        uint256 dllrBalanceBefore = dllr.balanceOf(thisAddress);
        dllr.transferWithPermit(
            msg.sender,
            thisAddress,
            _dllrAmount,
            _permitParams.deadline,
            _permitParams.v,
            _permitParams.r,
            _permitParams.s
        );
        require(
            dllr.balanceOf(thisAddress) == dllrBalanceBefore + _dllrAmount,
            "MocIntegration:: DLLR transfer with permit received wrong amount"
        );

        // redeem DoC from DLLR
        require(
            massetManager.redeemTo(address(doc), _dllrAmount, thisAddress) == _dllrAmount,
            "MocIntegration:: redeemed incorrect DoC amount"
        );

        // redeem RBTC from DoC using Money On Chain and send to the user
        uint256 rbtcBalanceBefore = thisAddress.balance;
        // TODO: clarify the vendor address param
        moc.redeemFreeDocVendors(_dllrAmount, payable(address(0)));
        uint256 rbtcAmount = thisAddress.balance - rbtcBalanceBefore;
        (bool success, ) = msg.sender.call{ value: rbtcAmount }("");
        require(success, "MocIntegration:: error transferring redeemed RBTC");

        emit GetDocFromDllrAndRedeemRBTC(_dllrAmount, rbtcAmount);
    }
}
