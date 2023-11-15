import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "@nomiclabs/hardhat-web3";
import "@nomicfoundation/hardhat-chai-matchers";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-truffle5";
import "hardhat-deploy";
import "tsconfig-paths/register";
import "@typechain/hardhat";
import "hardhat-docgen";
import "hardhat-contract-sizer";
import "@openzeppelin/hardhat-upgrades";
import "@nomiclabs/hardhat-solhint";
import "./tasks";
declare const config: HardhatUserConfig;
export default config;