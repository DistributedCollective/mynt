"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-empty-pattern */
const config_1 = require("hardhat/config");
/* import {
  BasketManagerV3,
  BasketManagerV3__factory,
  Ownable,
  Ownable__factory,
} from "types/generated"; */
const hardhat_network_helpers_1 = require("@nomicfoundation/hardhat-network-helpers");
const helpers_1 = require("../scripts/helpers/helpers");
const helpers_2 = require("../scripts/helpers/helpers");
const node_logs_1 = __importDefault(require("node-logs"));
const logger = new node_logs_1.default().showInConsole(true);
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
    const { deployer } = await getNamedAccounts();
    const networkName = getNetworkName();
    if (network.tags.testnet) {
        // multisig tx
        const multisigAddress = (await get("MultiSigWallet")).address;
        const sender = deployer;
        console.log(`removing basset multisig tx:`);
        await (0, helpers_1.sendWithMultisig)(hre, multisigAddress, contractAddress, dataRemove, sender);
        console.log(`adding basset multisig tx:`);
        await (0, helpers_1.sendWithMultisig)(hre, multisigAddress, contractAddress, dataAdd, sender);
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
                description: "",
            };
            logger.warn(">>> CREATE A SIP WITH THIS ARGS: <<<");
            logger.info(sipArgs);
            logger.warn("====================================");
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
            await (0, helpers_1.sendWithMultisig)(hre, multisigAddress, contractAddress, data, sender);
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
(0, config_1.task)("mynt:get-massetManagerConfig", "Fetch massetManagerProxy address")
    .addParam("contractAddress", "Meta asset token contract address (DLLR, etc)", undefined, config_1.types.string, false)
    .setAction(async ({ contractAddress }, hre) => {
    const { ethers } = hre;
    const MetaAssetToken = await ethers.getContractAt("MetaAssetToken", contractAddress);
    console.log(`massetManagerProxy address: ${await MetaAssetToken.massetManagerProxy()}`);
    console.log(`massetManagerImplementation address: ${await MetaAssetToken.massetManagerImplementation()}`);
});
(0, config_1.task)("mynt:get-basketManagerConfig", "Fetch basketManagerProxy address")
    .addParam("contractAddress", "Meta asset token contract address (DLLR, etc)", undefined, config_1.types.string, false)
    .setAction(async ({ contractAddress }, hre) => {
    const { ethers } = hre;
    const MetaAssetToken = await ethers.getContractAt("MetaAssetToken", contractAddress);
    console.log(`basketManagerProxy address: ${await MetaAssetToken.basketManagerProxy()}`);
    console.log(`basketManagerImplementation address: ${await MetaAssetToken.basketManagerImplementation()}`);
});
(0, config_1.task)("mynt:get-chainid", "Fetch chain id")
    .addParam("contractAddress", "Meta asset token contract address (DLLR, etc)", undefined, config_1.types.string, false)
    .setAction(async ({ contractAddress }, hre) => {
    const { ethers } = hre;
    const MetaAssetToken = await ethers.getContractAt("MetaAssetToken", contractAddress);
    console.log(`chain id: ${await MetaAssetToken.getChainId()}`);
});
(0, config_1.task)("mynt:set-massetManagerProxy", "Set massetManagerProxy")
    .addParam("contractAddress", "Meta asset token contract address (DLLR, etc)", undefined, config_1.types.string, false)
    .addParam("newMassetManagerProxy", "new masset manager proxy address", undefined, config_1.types.string, false)
    .addOptionalParam("isMultisig", "flag if transaction needs to be intiated from the multisig contract")
    .addOptionalParam("isSIP", "flag if transaction needs to be initiated from the SIP")
    .setAction(async ({ contractAddress, newMassetManagerProxy, isMultisig, isSIP }, hre) => {
    // if isMultisig & isSIP are false, assign based on network tags.
    const { network } = hre;
    if (!isMultisig && !isSIP) {
        const { isMultisigFlag, isSIPFlag } = (0, helpers_1.defaultValueMultisigOrSipFlag)(network.tags);
        isMultisig = isMultisigFlag;
        isSIP = isSIPFlag;
    }
    const { ethers, deployments: { get }, getNamedAccounts, } = hre;
    const MetaAssetToken = await ethers.getContractAt("MetaAssetToken", contractAddress);
    const { deployer } = await getNamedAccounts();
    if (isMultisig) {
        const multisigAddress = (await get("MultiSigWallet")).address;
        const data = MetaAssetToken.interface.encodeFunctionData("setMassetManagerProxy", [newMassetManagerProxy]);
        await (0, helpers_1.sendWithMultisig)(hre, multisigAddress, MetaAssetToken.address, data, deployer);
    }
    else if (isSIP) {
        const signature = "setMassetManagerProxy(address)";
        const data = MetaAssetToken.interface.encodeFunctionData("setMassetManagerProxy", [newMassetManagerProxy]);
        const sipArgs = {
            targets: [contractAddress],
            values: [0],
            signatures: [signature],
            data: [data],
            description: "",
        };
        logger.warn(">>> CREATE A SIP WITH THIS ARGS: <<<");
        logger.info(sipArgs);
        logger.warn("====================================");
    }
    else {
        await MetaAssetToken.setMassetManagerProxy(newMassetManagerProxy);
    }
});
(0, config_1.task)("mynt:set-basketManagerProxy", "Set basketManagerProxy")
    .addParam("contractAddress", "Meta asset token contract address (DLLR, etc)", undefined, config_1.types.string, false)
    .addParam("newBasketManagerProxy", "new basket manager proxy address", undefined, config_1.types.string, false)
    .addOptionalParam("isMultisig", "flag if transaction needs to be intiated from the multisig contract")
    .addOptionalParam("isSIP", "flag if transaction needs to be initiated from the SIP")
    .setAction(async ({ contractAddress, newBasketManagerProxy, isMultisig, isSIP }, hre) => {
    const { network } = hre;
    if (!isMultisig && !isSIP) {
        const { isMultisigFlag, isSIPFlag } = (0, helpers_1.defaultValueMultisigOrSipFlag)(network.tags);
        isMultisig = isMultisigFlag;
        isSIP = isSIPFlag;
    }
    // if isMultisig & isSIP are false, transaction will be initiated as per normal
    const { ethers, deployments: { get }, getNamedAccounts, } = hre;
    const MetaAssetToken = await ethers.getContractAt("MetaAssetToken", contractAddress);
    const { deployer } = await getNamedAccounts();
    if (isMultisig) {
        const multisigAddress = (await get("MultiSigWallet")).address;
        const data = MetaAssetToken.interface.encodeFunctionData("setBasketManagerProxy", [newBasketManagerProxy]);
        await (0, helpers_1.sendWithMultisig)(hre, multisigAddress, MetaAssetToken.address, data, deployer);
    }
    else if (isSIP) {
        const signature = "setBasketManagerProxy(address)";
        const data = MetaAssetToken.interface.encodeFunctionData("setBasketManagerProxy", [newBasketManagerProxy]);
        const sipArgs = {
            targets: [contractAddress],
            values: [0],
            signatures: [signature],
            data: [data],
            description: "Set basketManagerProxy address",
        };
        logger.warn(">>> CREATE A SIP WITH THIS ARGS: <<<");
        logger.info(sipArgs);
        logger.warn("====================================");
    }
    else {
        await MetaAssetToken.setBasketManagerProxy(newBasketManagerProxy);
    }
});
/** BasketManager contract interaction */
(0, config_1.task)("mynt:basketManager:isValidBasset", "Checks if bAasset is valid by checking its presence in the bAssets factors list")
    .addParam("basset", "Basset address to be checked", undefined, config_1.types.string, false)
    .setAction(async ({ basset }, hre) => {
    const { ethers } = hre;
    const basketManager = await ethers.getContract("BasketManagerV3"); // as BasketManagerV3;
    console.log("is valid: ", await basketManager.isValidBasset(basset));
});
(0, config_1.task)("mynt:basketManager:checkBasketBalanceForDeposit", "Checks if ratio of bAssets in basket is within limits to make a deposit of specific asset")
    .addParam("basset", "Basset address to deposit", undefined, config_1.types.string, false)
    .addParam("bassetQuantity", "Amount of bAssets to deposit", undefined, config_1.types.string, false)
    .setAction(async ({ basset, bassetQuantity }, hre) => {
    const { ethers } = hre;
    const basketManager = await ethers.getContract("BasketManagerV3"); // as BasketManagerV3;
    console.log("result: ", await basketManager.checkBasketBalanceForDeposit(basset, bassetQuantity));
});
(0, config_1.task)("mynt:basketManager:checkBasketBalanceForWithdrawal", "Checks if ratio of bAssets in basket is within limits to make a withdrawal of specific asset")
    .addParam("basset", "Basset address to redeem", undefined, config_1.types.string, false)
    .addParam("bassetQuantity", "Amount of bAssets to redeem", undefined, config_1.types.string, false)
    .setAction(async ({ basset, bassetQuantity }, hre) => {
    const { ethers } = hre;
    const basketManager = await ethers.getContract("BasketManagerV3"); // as BasketManagerV3;
    console.log("result: ", await basketManager.checkBasketBalanceForWithdrawal(basset, bassetQuantity));
});
(0, config_1.task)("mynt:basketManager:convertBassetToMassetQuantity", "Converts bAsset to mAsset quantity")
    .addParam("basset", "Basset address", undefined, config_1.types.string, false)
    .addParam("bassetQuantity", "Amount of bAssets to check", undefined, config_1.types.string, false)
    .setAction(async ({ basset, bassetQuantity }, hre) => {
    const { ethers } = hre;
    const basketManager = await ethers.getContract("BasketManagerV3"); // as BasketManagerV3;
    console.log("result: ", await basketManager.convertBassetToMassetQuantity(basset, bassetQuantity));
});
(0, config_1.task)("mynt:basketManager:convertMassetToBassetQuantity", "Converts mAsset to bAsset quantity")
    .addParam("basset", "Basset address", undefined, config_1.types.string, false)
    .addParam("massetQuantity", "Amount of mAssets to check", undefined, config_1.types.string, false)
    .setAction(async ({ basset, massetQuantity }, hre) => {
    const { ethers } = hre;
    const basketManager = await ethers.getContract("BasketManagerV3"); // as BasketManagerV3;
    console.log("result: ", await basketManager.convertMassetToBassetQuantity(basset, massetQuantity));
});
(0, config_1.task)("mynt:basketManager:getTotalMassetBalance", "Calculates total mAsset balance").setAction(async ({}, hre) => {
    const { ethers } = hre;
    const basketManager = await ethers.getContract("BasketManagerV3"); // as BasketManagerV3;
    console.log("result: ", (await basketManager.getTotalMassetBalance()).toString());
});
(0, config_1.task)("mynt:getBassetBalance", "Calculates total bAsset balance")
    .addParam("basset", "Basset address", undefined, config_1.types.string, false)
    .setAction(async ({ basset }, hre) => {
    const { ethers } = hre;
    const basketManager = await ethers.getContract("BasketManagerV3"); // as BasketManagerV3;
    console.log("result: ", (await basketManager.getBassetBalance(basset)).toString());
});
(0, config_1.task)("mynt:getBMVersion", "Get version of basket manager").setAction(async ({}, hre) => {
    const { ethers } = hre;
    const basketManager = await ethers.getContract("BasketManagerV3"); // as BasketManagerV3;
    console.log("result: ", await basketManager.getVersion());
});
(0, config_1.task)("mynt:getBassets", "Get list of bAssets").setAction(async ({}, hre) => {
    const { ethers } = hre;
    const basketManager = await ethers.getContract("BasketManagerV3"); // as BasketManagerV3;
    console.log(await basketManager.getBassets());
});
(0, config_1.task)("mynt:getFactor", "Get factor")
    .addParam("basset", "Basset address", undefined, config_1.types.string, false)
    .setAction(async ({ basset }, hre) => {
    const { ethers } = hre;
    const basketManager = await ethers.getContract("BasketManagerV3"); // as BasketManagerV3;
    console.log("result: ", (await basketManager.getFactor(basset)).toString());
});
(0, config_1.task)("mynt:getRange", "Get range(min,max)")
    .addParam("basset", "Basset address", undefined, config_1.types.string, false)
    .setAction(async ({ basset }, hre) => {
    const { ethers } = hre;
    const basketManager = await ethers.getContract("BasketManagerV3"); // as BasketManagerV3;
    console.log("result: ", await basketManager.getRange(basset));
});
(0, config_1.task)("mynt:getPaused", "Get paused status of basset")
    .addParam("basset", "Basset address", undefined, config_1.types.string, false)
    .setAction(async ({ basset }, hre) => {
    const { ethers } = hre;
    const basketManager = await ethers.getContract("BasketManagerV3"); // as BasketManagerV3;
    console.log("result: ", await basketManager.getPaused(basset));
});
(0, config_1.task)("mynt:basketManager:getProxyImplementation", "Get proxy implementation of basket manager").setAction(async ({}, hre) => {
    const { ethers } = hre;
    const basketManager = await ethers.getContract("BasketManagerV3"); // as BasketManagerV3;
    console.log("result: ", await basketManager.getProxyImplementation());
});
(0, config_1.task)("mynt:FeesManager:transfer-ownership", "Upgrade implementation of feesManager contract")
    .addParam("newOwner", "New address of the owner", undefined, config_1.types.string, false)
    .addVariadicPositionalParam("contractAddresses", "Array of contract address which ownership will be transferred")
    .addOptionalParam("isMultisig", "flag if transaction needs to be intiated from the multisig contract")
    .setAction(async ({ contractAddresses, newOwner, isMultisig }, hre) => {
    await Promise.all(contractAddresses.map(async (contractAddress) => {
        await (0, helpers_2.transferOwnership)(hre, contractAddress, newOwner, isMultisig);
    }));
});
(0, config_1.task)("mynt:upgrade:massetManager", "Upgrade implementation of massetManager contract")
    .addOptionalParam("isMultisig", "flag if transaction needs to be intiated from the multisig contract")
    .addOptionalParam("isSIP", "flag if transaction needs to be initiated from the SIP")
    .setAction(async ({ isMultisig, isSIP }, hre) => {
    const { ethers, deployments: { get }, getNamedAccounts, } = hre;
    const { deployer } = await getNamedAccounts();
    const myntAdminProxy = await ethers.getContract("MyntAdminProxy");
    const massetManagerProxy = await ethers.getContract("MassetManager");
    const MassetManagerFactory = await ethers.getContractFactory("MassetManager");
    const newMassetManagerImpl = await MassetManagerFactory.deploy();
    console.log(`Upgrading massetManager implementation to ${newMassetManagerImpl.address}`);
    if (isMultisig) {
        const multisigAddress = (await get("MultiSigWallet")).address;
        const dataUpgrade = myntAdminProxy.interface.encodeFunctionData("upgrade", [massetManagerProxy.address, newMassetManagerImpl.address]);
        await (0, helpers_1.sendWithMultisig)(hre, multisigAddress, myntAdminProxy.address, dataUpgrade, deployer);
    }
    else if (isSIP) {
        const signatureUpgrade = "upgrade(address,address)";
        const dataUpgrade = myntAdminProxy.interface.encodeFunctionData("upgrade", [massetManagerProxy.address, newMassetManagerImpl.address]);
        const sipArgs = {
            targets: [massetManagerProxy.address],
            values: [0],
            signatures: [signatureUpgrade],
            data: [dataUpgrade],
            description: "Upgrade masset manager contract",
        };
        logger.warn(">>> CREATE A SIP WITH THIS ARGS: <<<");
        logger.info(sipArgs);
        logger.warn("====================================");
    }
});
(0, config_1.task)("mynt:upgrade:feesVault", "Upgrade implementation of feesVault contract")
    .addOptionalParam("isMultisig", "flag if transaction needs to be intiated from the multisig contract")
    .addOptionalParam("isSIP", "flag if transaction needs to be initiated from the SIP")
    .setAction(async ({ isMultisig, isSIP }, hre) => {
    const { ethers, deployments: { get }, getNamedAccounts, } = hre;
    const { deployer } = await getNamedAccounts();
    const myntAdminProxy = await ethers.getContract("MyntAdminProxy");
    const feesVaultProxy = await ethers.getContract("FeesVault");
    const FeesVaultFactory = await ethers.getContractFactory("FeesVault");
    const newFeesVaultImpl = await FeesVaultFactory.deploy();
    console.log(`Upgrading feesVault implementation to ${newFeesVaultImpl.address}`);
    if (isMultisig) {
        const multisigAddress = (await get("MultiSigWallet")).address;
        const dataUpgrade = myntAdminProxy.interface.encodeFunctionData("upgrade", [feesVaultProxy.address, newFeesVaultImpl.address]);
        await (0, helpers_1.sendWithMultisig)(hre, multisigAddress, myntAdminProxy.address, dataUpgrade, deployer);
    }
    else if (isSIP) {
        const signatureUpgrade = "upgrade(address,address)";
        const dataUpgrade = myntAdminProxy.interface.encodeFunctionData("upgrade", [feesVaultProxy.address, newFeesVaultImpl.address]);
        const sipArgs = {
            targets: [feesVaultProxy.address],
            values: [0],
            signatures: [signatureUpgrade],
            data: [dataUpgrade],
            description: "Upgrade fees vault contract",
        };
        logger.warn(">>> CREATE A SIP WITH THIS ARGS: <<<");
        logger.info(sipArgs);
        logger.warn("====================================");
    }
});
(0, config_1.task)("mynt:upgrade:feesManager", "Upgrade implementation of feesManager contract")
    .addOptionalParam("isMultisig", "flag if transaction needs to be intiated from the multisig contract")
    .addOptionalParam("isSIP", "flag if transaction needs to be initiated from the SIP")
    .setAction(async ({ isMultisig, isSIP }, hre) => {
    const { ethers, deployments: { get }, getNamedAccounts, } = hre;
    const { deployer } = await getNamedAccounts();
    const myntAdminProxy = await ethers.getContract("MyntAdminProxy");
    const feesManagerProxy = await ethers.getContract("FeesManager");
    const FeesManagerFactory = await ethers.getContractFactory("FeesManager");
    const newFeesManagerImpl = await FeesManagerFactory.deploy();
    console.log(`Upgrading feesManager implementation to ${newFeesManagerImpl.address}`);
    if (isMultisig) {
        const multisigAddress = (await get("MultiSigWallet")).address;
        const dataUpgrade = myntAdminProxy.interface.encodeFunctionData("upgrade", [feesManagerProxy.address, newFeesManagerImpl.address]);
        await (0, helpers_1.sendWithMultisig)(hre, multisigAddress, myntAdminProxy.address, dataUpgrade, deployer);
    }
    else if (isSIP) {
        const signatureUpgrade = "upgrade(address,address)";
        const dataUpgrade = myntAdminProxy.interface.encodeFunctionData("upgrade", [feesManagerProxy.address, newFeesManagerImpl.address]);
        const sipArgs = {
            targets: [feesManagerProxy.address],
            values: [0],
            signatures: [signatureUpgrade],
            data: [dataUpgrade],
            description: "Upgrade fees manager contract",
        };
        logger.warn(">>> CREATE A SIP WITH THIS ARGS: <<<");
        logger.info(sipArgs);
        logger.warn("====================================");
    }
});
(0, config_1.task)("mynt:upgrade:basketManager", "Upgrade implementation of basketManager contract")
    .addOptionalParam("isMultisig", "flag if transaction needs to be intiated from the multisig contract")
    .addOptionalParam("isSIP", "flag if transaction needs to be initiated from the SIP")
    .setAction(async ({ isMultisig, isSIP }, hre) => {
    const { ethers, deployments: { get }, getNamedAccounts, } = hre;
    const { deployer } = await getNamedAccounts();
    const myntAdminProxy = await ethers.getContract("MyntAdminProxy");
    const basketManagerProxy = await ethers.getContract("BasketManagerV3"); // basketManagerV3
    const BasketManagerFactory = await ethers.getContractFactory("BasketManagerV3");
    const newBasketManagerImpl = await BasketManagerFactory.deploy();
    console.log(`Upgrading basket manager implementation to ${newBasketManagerImpl.address}`);
    if (isMultisig) {
        const multisigAddress = (await get("MultiSigWallet")).address;
        const dataUpgrade = myntAdminProxy.interface.encodeFunctionData("upgrade", [basketManagerProxy.address, newBasketManagerImpl.address]);
        await (0, helpers_1.sendWithMultisig)(hre, multisigAddress, myntAdminProxy.address, dataUpgrade, deployer);
    }
    else if (isSIP) {
        const signatureUpgrade = "upgrade(address,address)";
        const dataUpgrade = myntAdminProxy.interface.encodeFunctionData("upgrade", [basketManagerProxy.address, newBasketManagerImpl.address]);
        const sipArgs = {
            targets: [basketManagerProxy.address],
            values: [0],
            signatures: [signatureUpgrade],
            data: [dataUpgrade],
            description: "Upgrade fees vault contract",
        };
        logger.warn(">>> CREATE A SIP WITH THIS ARGS: <<<");
        logger.info(sipArgs);
        logger.warn("====================================");
    }
});
//# sourceMappingURL=mynt.js.map