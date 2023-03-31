"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("hardhat/config");
/* import {
  BasketManagerV3,
  BasketManagerV3__factory,
  Ownable,
  Ownable__factory,
} from "types/generated"; */
const hardhat_network_helpers_1 = require("@nomicfoundation/hardhat-network-helpers");
const helpers = __importStar(require("../scripts/utils/helpers"));
const createSIP_1 = require("./sips/createSIP");
/// ------ REPLACE bAsset ----- ///
(0, config_1.task)("mynt:replace-basset", "Replace bAsset")
    .addParam("prevBasset", "bAsset to replace", undefined, config_1.types.string, false)
    .addParam("newBasset", "New bAsset", undefined, config_1.types.string, false)
    .addParam("pausePrevBasset", "Pause old basset - used if can't be removed (Mynt balance > 0)", false, config_1.types.boolean, true)
    .setAction(async ({ prevBasset, newBasset, pausePrevBasset }, hre) => {
    const { ethers, getNamedAccounts, deployments: { get, getNetworkName }, network, } = hre;
    const basketManager = await ethers.getContract("BasketManagerV3"); // as BasketManagerV3;
    const contractAddress = basketManager.address;
    const BasketManagerV3Interface = new ethers.utils.Interface((await get("BasketManagerV3")).abi);
    const dataRemove = pausePrevBasset
        ? BasketManagerV3Interface.encodeFunctionData("pauseBasset", [
            prevBasset,
            true,
        ])
        : BasketManagerV3Interface.encodeFunctionData("removeBasset", [
            prevBasset,
        ]);
    const dataAdd = BasketManagerV3Interface.encodeFunctionData("addBasset", [
        newBasset,
        1,
        ethers.constants.AddressZero,
        0,
        1000,
        false,
    ]);
    helpers.injectHre(hre);
    const { deployer } = await getNamedAccounts();
    const networkName = getNetworkName();
    if (network.tags.testnet) {
        // multisig tx
        const multisigAddress = (await get("MultiSigWallet")).address;
        const sender = deployer;
        console.log(`removing basset multisig tx:`);
        await helpers.sendWithMultisig(multisigAddress, contractAddress, dataRemove, sender);
        console.log(`adding basset multisig tx:`);
        await helpers.sendWithMultisig(multisigAddress, contractAddress, dataAdd, sender);
    }
    else if (network.tags.mainnet) {
        if (!network.tags.forked) {
            // @todo create a proposal
            const signatureRemove = pausePrevBasset
                ? "pauseBasset(address)"
                : "removeBasset(address)";
            const signatureAdd = "addBasset(address,int256,address,uint256,uint256,bool)";
            const sipArgs = {
                targets: [contractAddress, contractAddress],
                values: [0, 0],
                signatures: [signatureRemove, signatureAdd],
                data: [dataRemove, dataAdd],
                description: "Replace Basset",
            };
            (0, createSIP_1._createSIP)(hre, sipArgs);
        }
        else {
            // @todo forked mainnet to replace bAsset - impersonate accounts: TimelockOwner, GvernorOwner, whale accounts
            //   - create proposal (impersonate a whale account)
            //   - timetravel
            //   - impersonate or fund whale accounts to vote
            //   - vote
            //   - timetravel to queue and then execute proposal
            //   - run (create?) tests to check the consistency
            const timelockAddress = (await get("TimelockOwner")).address;
            await (0, hardhat_network_helpers_1.impersonateAccount)(timelockAddress);
            const timelockSigner = ethers.provider.getSigner(timelockAddress);
        }
    }
    else if (["development", "hardhat"].includes(networkName)) {
        // local ganache deployer
        console.log(`removing basset: ${prevBasset}`);
        if (pausePrevBasset) {
            await basketManager.setPaused(prevBasset, true);
        }
        else {
            await basketManager.removeBasset(prevBasset);
        }
        console.log(`setting new basset: ${newBasset}`);
        await basketManager.addBasset(newBasset, 1, ethers.constants.AddressZero, 0, 1000, false);
    }
    console.log("Basset updated");
});
/// ------ TRANSFER OWNERSHIP ----- ///
(0, config_1.task)("mynt:transfer-ownership", "Transfer contracts ownership")
    .addParam("newOwner", "New owner address", undefined, config_1.types.string, false)
    .addParam("contracts", "contracts to transfer ownership: e.g. [DLLR, FeesManager, MassetManager]", undefined, config_1.types.string, true)
    .setAction(async ({ contracts, newOwner }, hre) => {
    const { ethers, network, getNamedAccounts, deployments: { get, getNetworkName }, } = hre;
    let contractsList;
    if (contracts) {
        contractsList = JSON.parse(contracts);
    }
    else {
        contractsList = [
            "DLLR",
            "MassetManager",
            "BasketManagerV3",
            "FeesManager",
            "MocIntegration",
            "MyntAdminProxy",
        ];
    }
    const contractsAddresses = await Promise.all(contractsList.map(async (contract) => {
        const addr = (await get(contract)).address;
        console.log(`${contract}: ${addr}`);
        return addr;
    }));
    helpers.injectHre(hre);
    const { deployer } = await getNamedAccounts();
    const ownableABI = [
        "function transferOwnership(address newOwner)",
        "function owner() view returns(address)",
    ];
    const ownableInterface = new ethers.utils.Interface(ownableABI);
    const networkName = getNetworkName();
    console.log("Transferring contracts ownership...");
    if (network.tags.testnet) {
        // multisig tx
        const multisigAddress = (await get("MultiSigWallet")).address;
        const sender = deployer;
        const data = ownableInterface.encodeFunctionData("transferOwnership", [
            newOwner,
        ]);
        await Promise.all(contractsAddresses.map(async (contractAddress) => {
            console.log(`processing ${contractAddress}:`);
            await helpers.sendWithMultisig(multisigAddress, contractAddress, data, sender);
        }));
    }
    if (network.tags.mainnet) {
        // governance or multisig
        // @todo add governance or ms?
    }
    else {
        // local ganache deployer
        await Promise.all(contractsAddresses.map(async (contractAddress, index) => {
            const ownable = await ethers.getContractAt(ownableABI, 
            // contractsList[index],
            contractAddress);
            if (Object.keys(ownable.functions).includes("owner()")) {
                const currentOwner = await ownable.owner();
                console.log(`processing ${contractsList[index]} @ ${contractAddress}, owner ${currentOwner}`);
                console.log("Impersonating", currentOwner);
                await (0, hardhat_network_helpers_1.impersonateAccount)(currentOwner);
                const signer = await ethers.getSigner(currentOwner);
                await ownable.connect(signer).transferOwnership(newOwner);
                console.log(`processed contract ${contractsList[index]} @ ${contractAddress} - ownership transferred`);
            }
            else {
                console.log(`skipping contract ${contractsList[index]} @ ${contractAddress} as is not ownable - no owner() function`);
            }
        }));
    }
});
(0, config_1.task)("mynt:get-contracts-owner", "Log contracts owners")
    .addOptionalParam("contracts", "contracts to transfer ownership: e.g. [DLLR, FeesManager, MassetManager]", undefined, config_1.types.string)
    .setAction(async ({ contracts }, hre) => {
    const { ethers, deployments: { get }, } = hre;
    let contractsList;
    if (contracts) {
        console.log(contracts);
        contractsList = contracts.split(",");
    }
    else {
        contractsList = [
            "DLLR",
            "MassetManager",
            "BasketManagerV3",
            "FeesManager",
            "MocIntegration",
            "MyntAdminProxy",
        ];
    }
    const ownableABI = [
        "function owner() view returns(address)",
        "function getOwner() view returns(address)",
    ];
    console.log();
    console.log("Contracts owners: ...");
    console.log();
    await Promise.all(contractsList.map(async (contractName, index) => {
        const contractDeployment = await get(contractName);
        const contractAddress = contractDeployment.address;
        const ownable = await ethers.getContractAt(ownableABI, contractAddress);
        let owner;
        try {
            owner = await ownable.getOwner();
        }
        catch (e) {
            owner = await ownable.owner();
        }
        console.log(`${contractsList[index]} @ ${contractAddress}: owner ${owner}`);
    }));
});
//# sourceMappingURL=contractsInteraction.js.map