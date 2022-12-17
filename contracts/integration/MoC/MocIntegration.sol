// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import { IMocMintRedeemDoc, PermitParams } from "./IMoC.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../../meta-asset-token/DLLR.sol";
import "../../interfaces/IMassetManager.sol";
import "../../interfaces/IDLLR.sol";

// Here you will import your own dependencies

// > DLLR withdraw DOC to the contract by permit
// > the contract calls IMoC to redeem DoC for RBTC
// >> if redemption by settlement then the user can call redemption later on this contract (security!?)
// >>> check if there is an option to redeem from this contract to the user
// >> else transfer DoC directly to the user

contract MocIntegration {
    // Address of the MoC contract
    IMocMintRedeemDoc public immutable moc;
    // Address of the DoC token
    IERC20 public immutable doc;
    IDLLR public immutable dllr;
    IMassetManager public immutable massetManager;

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
     * @notice Convert DLLR _amount to DoC utilizing EIP-2612 permit
     * to reduce the additional sending transaction for doing the approval to the spender.
     *
     * @param _amount The amount of the DLLR (mAsset) token that will be burned in exchange for _toToken
     * @param _permitParams EIP-2612 permit params:
     *        _deadline Expiration time of the signature.
     *        _v Last 1 byte of ECDSA signature.
     *        _r First 32 bytes of ECDSA signature.
     *        _s 32 bytes after _r in ECDSA signature.
     * @param _redeemFree MoC redeem has 2 options - redeem free DoC or create redeem request //TODO: add link to the description
     */
    function getDocFromDllrAndRedeemRBTC(
        uint256 _amount,
        PermitParams calldata _permitParams,
        bool _redeemFree
    ) external {
        // transfer DLLR _amount to this contract by permit ()
        address thisAddress = address(this);
        uint256 dllrBalanceBefore = dllr.balanceOf(thisAddress);
        dllr.transferWithPermit(
            msg.sender,
            thisAddress,
            _amount,
            _permitParams.deadline,
            _permitParams.v,
            _permitParams.r,
            _permitParams.s
        );
        require(
            dllr.balanceOf(thisAddress) == dllrBalanceBefore + _amount,
            "MocIntegration:: DLLR transfer with permit received wrong amount"
        );

        // redeem DoC from DLLR
        require(
            massetManager.redeemTo(address(doc), _amount, thisAddress) == _amount,
            "MocIntegration:: redeemed incorrect DoC amount"
        );

        // redeem RBTC from DoC using Money On Chain and send to the user
        uint256 rbtcBalanceBefore = thisAddress.balance; //doc.balanceOf(thisAddress);
        moc.redeemFreeDocVendors(_amount, payable(address(0)));
        (bool success, ) = msg.sender.call{ value: thisAddress.balance - rbtcBalanceBefore }("");
        require(success, "MocIntegration:: error transferring redeemed RBTC");
    }
}
