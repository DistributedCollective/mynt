pragma solidity ^0.5.17;

import { InitializableAdminUpgradeabilityProxy } from "../helpers/InitializableAdminUpgradeabilityProxy.sol";

/**
 * @title MassetProxy
 * @dev Implements a proxy that allows to change the
 * mAsset contract address.
 */
contract BasketManagerProxy is InitializableAdminUpgradeabilityProxy {}
