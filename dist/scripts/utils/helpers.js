"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultValueMultisigOrSipFlag = exports.injectHre = exports.createProposal = exports.multisigCheckTx = exports.signWithMultisig = exports.sendWithMultisig = exports.getParsedEventLogFromReceipt = exports.getEthersLog = exports.parseEthersLog = void 0;
let hre;
let ethers;
// @dev run this function to initialize hre
const injectHre = (_hre) => {
    hre = _hre;
    ethers = hre.ethers;
};
exports.injectHre = injectHre;
const sendWithMultisig = async (multisigAddress, contractAddress, data, sender, value = 0) => {
    const multisig = await ethers.getContractAt("MultiSigWallet", multisigAddress);
    const signer = await ethers.getSigner(sender);
    const receipt = await (await multisig
        .connect(signer)
        .submitTransaction(contractAddress, value, data)).wait();
    const abi = ["event Submission(uint256 indexed transactionId)"];
    const iface = new ethers.utils.Interface(abi);
    const parsedEvent = await getParsedEventLogFromReceipt(receipt, iface, "Submission");
    await multisigCheckTx(parsedEvent.transactionId.value.toNumber(), multisig.address);
};
exports.sendWithMultisig = sendWithMultisig;
const signWithMultisig = async (multisigAddress, txId, sender) => {
    console.log("Signing multisig txId:", txId);
    const multisig = await ethers.getContractAt("MultiSigWallet", multisigAddress);
    const signer = await ethers.getSigner(sender);
    await (await multisig.connect(signer).confirmTransaction(txId)).wait();
    // console.log("Required signatures:", await multisig.required());
    console.log("Signed. Details:");
    await multisigCheckTx(txId, multisig.address);
};
exports.signWithMultisig = signWithMultisig;
const multisigCheckTx = async (txId, multisigAddress = ethers.constants.AddressZero) => {
    const { deployments: { get }, } = hre;
    const multisig = await ethers.getContractAt("MultiSigWallet", multisigAddress === ethers.constants.AddressZero
        ? (await get("MultiSigWallet")).address
        : multisigAddress);
    const transaction = await multisig.transactions(txId);
    console.log("TX { ID: ", txId, ", Data: ", transaction.data, ", Value: ", transaction.value.toString(), ", Destination: ", transaction.destination, ", Confirmations: ", (await multisig.getConfirmationCount(txId)).toNumber(), ", Executed:", transaction.executed, ", Confirmed by:", await multisig.getConfirmations(txId), "}");
};
exports.multisigCheckTx = multisigCheckTx;
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
    events.forEach((event) => {
        const ethersParsed = contract.interface.parseLog(event);
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
const createProposal = async (governorAddress, targets, values, signatures, callDatas, description) => {
    // governorDeployment = (await get("GovernorAlpha")).address;
    console.log(`=============================================================
    Governor Address:    ${governorAddress}
    Target:              ${targets}
    Values:              ${values}
    Signature:           ${signatures}
    Data:                ${callDatas}
    Description:         ${description}
    =============================================================`);
    const gov = (await ethers.getContractAt("GovernorAlpha", governorAddress));
    const tx = await (await gov.propose(targets, values, signatures, callDatas, description)).wait();
    console.log(tx);
};
exports.createProposal = createProposal;
const defaultValueMultisigOrSipFlag = (networkTags) => {
    let isMultisigFlag, isSIPFlag;
    if (networkTags["testnet"]) {
        isMultisigFlag = true;
    }
    else if (networkTags["mainnet"]) {
        isSIPFlag = true;
    }
    else {
        throw new Error(`Non-supported ${JSON.stringify(networkTags)} network tags`);
    }
    return { isMultisigFlag, isSIPFlag };
};
exports.defaultValueMultisigOrSipFlag = defaultValueMultisigOrSipFlag;
//# sourceMappingURL=helpers.js.map