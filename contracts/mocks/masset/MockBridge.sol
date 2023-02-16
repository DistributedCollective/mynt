// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { MassetManager } from "../../masset/MassetManager.sol";

contract MockBridge {
    function receiveTokensAt(address tokenToUse, uint256 amount, address, bytes calldata) external returns (bool) {
        require(IERC20(tokenToUse).transferFrom(msg.sender, address(this), amount), "transfer failed");

        return true;
    }

    // It is used to test the case, when bridge is calling the onTokensMinted method on MassetManager
    function callOnTokensMinted(
        address massetManager,
        uint256 _orderAmount,
        address _tokenAddress,
        address _userData
    ) external {
        MassetManager(massetManager).onTokensMinted(_orderAmount, _tokenAddress, abi.encode(_userData));
    }

    // It is used to test the case, when bridge is calling the redeemByBridge method on  MassetManager
    function callRedeemByBridge(
        address massetManager,
        address _basset,
        uint256 _massetQuantity,
        address _recipient
    ) external returns (uint256 massetRedeemed) {
        return MassetManager(massetManager).redeemByBridge(_basset, _massetQuantity, _recipient);
    }
}
