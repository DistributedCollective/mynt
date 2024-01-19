"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSip = exports.isMultisig = exports.getAuthorizedDeployerKey = exports.transferOwnership = exports.deployWithCustomProxy = exports.defaultValueMultisigOrSipFlag = exports.createProposal = exports.isMultisigOwner = exports.multisigRevokeConfirmation = exports.multisigRemoveOwner = exports.multisigAddOwner = exports.multisigCheckTx = exports.multisigExecuteTx = exports.signWithMultisig = exports.sendWithMultisig = exports.getParsedEventLogFromReceipt = exports.getEthersLog = exports.parseEthersLogToValue = exports.parseEthersLog = exports.getTxLog = void 0;
const node_logs_1 = __importDefault(require("node-logs"));
const logger = new node_logs_1.default().showInConsole(true);
const sendWithMultisig = async (hre, multisigAddress, contractAddress, data, sender, value = 0) => {
    const { ethers } = hre;
    const signer = await ethers.getSigner(sender);
    const multisig = await ethers.getContractAt("MultiSigWallet", multisigAddress, signer);
    const receipt = await (await multisig.submitTransaction(contractAddress, value, data)).wait();
    const abi = ["event Submission(uint256 indexed transactionId)"];
    const iface = new ethers.utils.Interface(abi);
    const parsedEvent = await getParsedEventLogFromReceipt(receipt, iface, "Submission");
    await multisigCheckTx(hre, parsedEvent.transactionId.value.toNumber(), multisig.address);
};
exports.sendWithMultisig = sendWithMultisig;
const signWithMultisig = async (hre, multisigAddress, txId, sender) => {
    const { ethers } = hre;
    console.log("Signing multisig txId:", txId);
    const multisig = await ethers.getContractAt("MultiSigWallet", multisigAddress);
    const signer = await ethers.getSigner(sender);
    await (await multisig.connect(signer).confirmTransaction(txId)).wait();
    // console.log("Required signatures:", await multisig.required());
    console.log("Signed. Details:");
    await multisigCheckTx(txId, multisig.address);
};
exports.signWithMultisig = signWithMultisig;
const multisigAddOwner = async (hre, addAddress, sender) => {
    const { ethers, getNamedAccounts, deployments: { get }, } = hre;
    const multisigDeployment = await get("MultiSigWallet");
    let multisigInterface = new ethers.utils.Interface(multisigDeployment.abi);
    let data = multisigInterface.encodeFunctionData("addOwner", [addAddress]);
    ///@todo check if the deployer is one of ms owners
    console.log(`creating multisig tx to add new owner ${addAddress}...`);
    await sendWithMultisig(hre, multisigDeployment.address, multisigDeployment.address, data, sender);
    logger.info(`>>> DONE. Requires Multisig (${multisigDeployment.address}) signing to execute tx <<<`);
};
exports.multisigAddOwner = multisigAddOwner;
const multisigRemoveOwner = async (hre, removeAddress, sender) => {
    const { ethers, getNamedAccounts, deployments: { get }, } = hre;
    const multisigDeployment = await get("MultiSigWallet");
    let multisigInterface = new ethers.utils.Interface(multisigDeployment.abi);
    let data = multisigInterface.encodeFunctionData("removeOwner", [
        removeAddress,
    ]);
    console.log(`creating multisig tx to remove owner ${removeAddress}...`);
    await sendWithMultisig(hre, multisigDeployment.address, multisigDeployment.address, data, sender);
    logger.info(`>>> DONE. Requires Multisig (${multisigDeployment.address}) signing to execute tx <<<`);
};
exports.multisigRemoveOwner = multisigRemoveOwner;
const multisigExecuteTx = async (hre, txId, sender, multisigAddress = hre.ethers.constants.AddressZero) => {
    const { ethers, deployments: { get }, } = hre;
    const signer = await ethers.getSigner(sender);
    const multisig = await ethers.getContractAt("MultiSigWallet", multisigAddress == ethers.constants.AddressZero
        ? (await get("MultiSigWallet")).address
        : multisigAddress, signer);
    console.log("Executing multisig txId", txId, "...");
    const gasEstimated = (await multisig.estimateGas.executeTransaction(txId)).toNumber();
    console.log("Estimated Gas:", gasEstimated);
    const lastBlock = await ethers.provider.getBlock("latest");
    const lastBlockGasLimit = lastBlock.gasLimit.toNumber();
    console.log("Last Block Gas Limit:", lastBlockGasLimit);
    const gasEstimatedMul = gasEstimated * 1.3;
    let receipt;
    let wontExecute = false;
    if (gasEstimatedMul < lastBlockGasLimit) {
        try {
            await multisig.callStatic.executeTransaction(txId, { gasEstimatedMul });
            receipt = await (await multisig.executeTransaction(txId, { gasEstimatedMul })).wait();
        }
        catch (e) {
            wontExecute = true;
        }
    }
    if (wontExecute || gasEstimatedMul >= lastBlockGasLimit) {
        receipt = await (await multisig.executeTransaction(txId, { gasLimit: lastBlockGasLimit })).wait();
    }
    logger.warn("===============================================================================");
    logger.success("DONE. Details:");
    console.log("Tx hash:", receipt.transactionHash);
    console.log("Gas used:", receipt.gasUsed.toNumber());
    await multisigCheckTx(txId, multisig.address);
    logger.warn("===============================================================================");
};
exports.multisigExecuteTx = multisigExecuteTx;
const multisigCheckTx = async (hre, txId, multisigAddress = undefined) => {
    const { ethers, deployments: { get }, } = hre;
    const multisig = await ethers.getContractAt("MultiSigWallet", multisigAddress === undefined
        ? (await get("MultiSigWallet")).address
        : multisigAddress);
    const transaction = await multisig.transactions(txId);
    console.log("TX { ID: ", txId, ", Data: ", transaction.data, ", Value: ", transaction.value.toString(), ", Destination: ", transaction.destination, ", Confirmations: ", (await multisig.getConfirmationCount(txId)).toNumber(), ", Executed:", transaction.executed, ", Confirmed by:", await multisig.getConfirmations(txId), "}");
};
exports.multisigCheckTx = multisigCheckTx;
const isMultisigOwner = async (hre, multisigAddress, checkAddress) => {
    const { ethers } = hre;
    const multisig = await ethers.getContractAt("MultiSigWallet", multisigAddress);
    return await multisig.isOwner(checkAddress);
};
exports.isMultisigOwner = isMultisigOwner;
const multisigRevokeConfirmation = async (hre, txId, sender, multisigAddress = hre.ethers.constants.AddressZero) => {
    const { ethers, deployments: { get }, } = hre;
    const signer = await ethers.getSigner(sender);
    const multisig = await ethers.getContractAt("MultiSigWallet", multisigAddress == ethers.constants.AddressZero
        ? (await get("MultiSigWallet")).address
        : multisigAddress, signer);
    console.log("Revoking confirmation of txId", txId, "...");
    await (await multisig.revokeConfirmation(txId)).wait();
    // console.log("Required signatures:", await multisig.required());
    console.log(`Confirmation of txId ${txId} revoked.`);
    console.log("Details:");
    await multisigCheckTx(txId, multisig.address);
};
exports.multisigRevokeConfirmation = multisigRevokeConfirmation;
const parseEthersLogToValue = (parsed) => {
    let parsedEvent = {};
    for (let i = 0; i < parsed.args.length; i++) {
        const input = parsed.eventFragment.inputs[i];
        const arg = parsed.args[i];
        const newObj = { ...input, ...{ value: arg.toString() } };
        parsedEvent[input["name"]] = newObj.value;
    }
    return parsedEvent;
};
exports.parseEthersLogToValue = parseEthersLogToValue;
const getTxLog = (tx, contract) => {
    return tx.logs.map((log) => parseEthersLogToValue(contract.interface.parseLog(log)));
};
exports.getTxLog = getTxLog;
const parseEthersLog = (parsed) => {
    const parsedEvent = {};
    for (let i = 0; i < parsed.args.length; i++) {
        const input = parsed.eventFragment.inputs[i];
        const arg = parsed.args[i];
        const newObj = { ...input, ...{ value: arg } };
        parsedEvent[input.name] = newObj;
    }
    return parsedEvent;
};
exports.parseEthersLog = parseEthersLog;
const getEthersLog = async (contract, filter) => {
    if (contract === undefined || filter === undefined)
        return;
    const events = await contract.queryFilter(filter);
    if (events.length === 0)
        return;
    const parsedEvents = [];
    events.forEach(({ topics: topicsR, data }) => {
        // const { topics, data } = event;
        const topics = topicsR.forEach((el) => el.toString());
        const ethersParsed = contract.interface.parseLog({ topics, data });
        const customParsed = parseEthersLog(ethersParsed);
        parsedEvents.push(customParsed);
    });
    return parsedEvents;
};
exports.getEthersLog = getEthersLog;
const getParsedEventLogFromReceipt = async (receipt, iface, eventName) => {
    const topic = iface.getEventTopic(eventName);
    // search for the log by the topic
    const log = receipt.logs.find((x) => x.topics.indexOf(topic) >= 0);
    // finally, you can parse the log with the interface
    // to get a more user-friendly event object
    const parsedLog = iface.parseLog(log);
    return parseEthersLog(parsedLog);
};
exports.getParsedEventLogFromReceipt = getParsedEventLogFromReceipt;
const createProposal = async (hre, governorAddress, targets, values, signatures, callDatas, description, signer) => {
    // governorDeployment = (await get("GovernorAlpha")).address;
    console.log(`=============================================================
    Governor Address:    ${governorAddress}
    Target:              ${targets}
    Values:              ${values}
    Signature:           ${signatures}
    Data:                ${callDatas}
    Description:         ${description}
    =============================================================`);
    const { ethers } = hre;
    const gov = await ethers.getContractAt("GovernorAlpha", governorAddress);
    const tx = await (await gov
        .connect(signer)
        .propose(targets, values, signatures, callDatas, description)).wait();
    console.log(tx);
};
exports.createProposal = createProposal;
const defaultValueMultisigOrSipFlag = (networkTags) => {
    let isMultisigFlag = false;
    let isSIPFlag = false;
    if (networkTags.testnet) {
        isMultisigFlag = true;
    }
    else if (networkTags.mainnet) {
        isSIPFlag = true;
    }
    else {
        throw new Error(`Non-supported ${JSON.stringify(networkTags)} network tags`);
    }
    return { isMultisigFlag, isSIPFlag };
};
exports.defaultValueMultisigOrSipFlag = defaultValueMultisigOrSipFlag;
const deployWithCustomProxy = async (hre, deployer, logicName, proxyName, isOwnerMultisig = false, multisigName = "MultiSigWallet", proxyOwner = "", args = [], proxyArgs = []) => {
    const { deployments: { deploy, get, getOrNull, log, save: deploymentsSave }, ethers, } = hre;
    const proxyDeployedName = logicName + "_Proxy";
    const logicDeployedName = logicName + "_Implementation";
    let proxyDeployment = await getOrNull(proxyDeployedName);
    let isNewProxy = false;
    if (!proxyDeployment) {
        await deploy(proxyDeployedName, {
            contract: proxyName,
            from: deployer,
            args: proxyArgs,
            log: true,
        });
        isNewProxy = true;
    }
    const tx = await deploy(logicDeployedName, {
        contract: logicName,
        from: deployer,
        args: args,
        log: true,
    });
    const proxy = await ethers.getContract(proxyDeployedName);
    const prevImpl = await proxy.getImplementation();
    log(`Current ${logicDeployedName}: ${prevImpl}`);
    if (tx.newlyDeployed || tx.address != prevImpl) {
        log(`New ${logicDeployedName}: ${tx.address}`);
        if (!tx.newlyDeployed) {
            logger.information(`${logicDeployedName} is not re-deployed but not upgraded yet in the proxy`);
        }
        const proxyDeployment = await get(proxyDeployedName);
        await deploymentsSave(logicName, {
            abi: tx.abi,
            address: proxy.address,
            receipt: tx.receipt,
            bytecode: tx.bytecode,
            deployedBytecode: tx.deployedBytecode,
            implementation: tx.address,
        });
        if ((hre.network.tags["testnet"] || isOwnerMultisig) && !isNewProxy) {
            //multisig is the owner
            const multisigDeployment = await get(multisigName);
            //@todo wrap getting ms tx data into a helper
            let proxyInterface = new ethers.utils.Interface(proxyDeployment.abi);
            let data = proxyInterface.encodeFunctionData("setImplementation", [
                tx.address,
            ]);
            log(`Creating multisig tx to set ${logicDeployedName} (${tx.address}) as implementation for ${logicDeployedName} (${proxyDeployment.address}...`);
            log();
            await sendWithMultisig(hre, multisigDeployment.address, proxy.address, data, deployer);
            log(`>>> DONE. Requires Multisig (${multisigDeployment.address}) signing to execute tx <<<
                 >>> DON'T PUSH/MERGE ${logicName} TO THE DEVELOPMENT BRANCH REPO UNTIL THE MULTISIG TX SUCCESSFULLY SIGNED & EXECUTED <<<`);
        }
        else if (hre.network.tags["mainnet"] && !isNewProxy) {
            // log(">>> Create a Bitocracy proposal via a SIP <<<");
            logger.information(">>> Create a Bitocracy proposal via a SIP <<<");
            logger.information(`>>> DON'T MERGE ${logicName} TO THE MAIN BRANCH UNTIL THE SIP IS SUCCESSFULLY EXECUTED <<<`);
            // governance is the owner - need a SIP to register
            // alternatively can use brownie sip_interaction scripts to create proposal
        }
        else {
            await proxy.setImplementation(tx.address);
            logger.information(`>>> New implementation ${await proxy.getImplementation()} is set to the proxy <<<`);
        }
        if (ethers.utils.isAddress(proxyOwner) &&
            (await proxy.getOwner()) !== proxyOwner) {
            await proxy.transferOwnership(proxyOwner);
            logger.success(`Proxy ${proxyDeployedName} ownership transferred to ${await proxy.getOwner()}`);
        }
        log();
    }
};
exports.deployWithCustomProxy = deployWithCustomProxy;
// eslint-disable-next-line no-underscore-dangle
const transferOwnership = async (hre, contractAddress, newOwner, isMultisig = false) => {
    const { ethers, getNamedAccounts, deployments: { get }, } = hre;
    const ownableABI = [
        "function transferOwnership(address newOwner)",
        "function owner() view returns(address)",
    ];
    const ownable = await ethers.getContractAt(ownableABI, contractAddress);
    if (isMultisig) {
        const { deployer } = await getNamedAccounts();
        const multisigAddress = (await get("MultiSigWallet")).address;
        const data = ownable.interface.encodeFunctionData("transferOwnership", [
            newOwner,
        ]);
        await sendWithMultisig(hre, multisigAddress, contractAddress, data, deployer);
    }
    else {
        await (await ownable.transferOwnership(newOwner)).wait();
        if ((await ownable.owner()) === newOwner) {
            logger.success(`Contract ${contractAddress} ownership has been transferred to: ${await ownable.owner()}`);
        }
        else {
            logger.error(`Contract ${contractAddress} ownership has NOT been transferred to: ${await ownable.owner()}`);
        }
    }
};
exports.transferOwnership = transferOwnership;
const getAuthorizedDeployerKey = () => {
    return {
        multisig: "MultiSigWallet",
        sip: {
            timelockOwner: "TimelockOwner",
            timelockAdmin: "TimelockAdmin"
        }
    };
};
exports.getAuthorizedDeployerKey = getAuthorizedDeployerKey;
const isMultisig = async (hre, ownerAddress) => {
    const { deployments: { get }, } = hre;
    const deployerKey = getAuthorizedDeployerKey();
    const multisigDeployment = await get(deployerKey["multisig"]);
    if (ownerAddress.toLowerCase() == multisigDeployment.address.toLowerCase())
        return true;
    return false;
};
exports.isMultisig = isMultisig;
const isSip = async (hre, ownerAddress) => {
    const { deployments: { get }, } = hre;
    const deployerKey = getAuthorizedDeployerKey();
    const timelockOwnerDeployment = await get(deployerKey["sip"]["timelockOwner"]);
    const timelockAdminDeployment = await get(deployerKey["sip"]["timelockAdmin"]);
    if (ownerAddress.toLowerCase() == timelockOwnerDeployment.address.toLowerCase() || ownerAddress.toLowerCase() == timelockAdminDeployment.address.toLowerCase())
        return true;
    return false;
};
exports.isSip = isSip;
//# sourceMappingURL=helpers.js.map