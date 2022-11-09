// SPDX-License-Identifier: MIT

pragma solidity 0.5.17;

interface IProxy {
  function implementation() external view returns (address);
}