/* eslint-disable no-plusplus */
import { Interface } from "@ethersproject/abi/lib/interface";
import { BytesLike, Contract, ContractReceipt } from "ethers";
import { Address } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { GovernorAlpha } from "types/generated";

let hre: HardhatRuntimeEnvironment;
let ethers: HardhatRuntimeEnvironment["ethers"];

// @dev run this function to initialize hre
const injectHre = (_hre: HardhatRuntimeEnvironment) => {
  hre = _hre;
  ethers = hre.ethers;
};

const sendWithMultisig = async (
  multisigAddress: Address,
  contractAddress: Address,
  data: BytesLike,
  sender: Address,
  value = 0
) => {
  const multisig = await ethers.getContractAt(
    "MultiSigWallet",
    multisigAddress
  );
  const signer = await ethers.getSigner(sender);
  const receipt = await (
    await multisig
      .connect(signer)
      .submitTransaction(contractAddress, value, data)
  ).wait();

  const abi = ["event Submission(uint256 indexed transactionId)"];
  const iface = new ethers.utils.Interface(abi);
  const parsedEvent = await getParsedEventLogFromReceipt(
    receipt,
    iface,
    "Submission"
  );
  await multisigCheckTx(
    parsedEvent.transactionId.value.toNumber(),
    multisig.address
  );
};

const signWithMultisig = async (multisigAddress, txId, sender) => {
  console.log("Signing multisig txId:", txId);
  const multisig = await ethers.getContractAt(
    "MultiSigWallet",
    multisigAddress
  );
  const signer = await ethers.getSigner(sender);
  await (await multisig.connect(signer).confirmTransaction(txId)).wait();
  // console.log("Required signatures:", await multisig.required());
  console.log("Signed. Details:");
  await multisigCheckTx(txId, multisig.address);
};

const multisigCheckTx = async (
  txId,
  multisigAddress = ethers.constants.AddressZero
) => {
  const {
    deployments: { get },
  } = hre;
  const multisig = await ethers.getContractAt(
    "MultiSigWallet",
    multisigAddress === ethers.constants.AddressZero
      ? (
          await get("MultiSigWallet")
        ).address
      : multisigAddress
  );
  const transaction = await multisig.transactions(txId);
  console.log(
    "TX { ID: ",
    txId,
    ", Data: ",
    transaction.data,
    ", Value: ",
    transaction.value.toString(),
    ", Destination: ",
    transaction.destination,
    ", Confirmations: ",
    (await multisig.getConfirmationCount(txId)).toNumber(),
    ", Executed:",
    transaction.executed,
    ", Confirmed by:",
    await multisig.getConfirmations(txId),
    "}"
  );
};

const parseEthersLog = (parsed) => {
  const parsedEvent: any = {};
  for (let i = 0; i < parsed.args.length; i++) {
    const input = parsed.eventFragment.inputs[i];
    const arg = parsed.args[i];
    const newObj = { ...input, ...{ value: arg } };
    parsedEvent[input.name] = newObj;
  }
  return parsedEvent;
};

const getEthersLog = async (contract: Contract, filter) => {
  if (contract === undefined || filter === undefined) return;
  const events = await contract.queryFilter(filter);
  if (events.length === 0) return;
  const parsedEvents: any[] = [];
  events.forEach((event) => {
    const ethersParsed = contract.interface.parseLog(event);
    const customParsed = parseEthersLog(ethersParsed);
    parsedEvents.push(customParsed);
  });
  return parsedEvents;
};

const getParsedEventLogFromReceipt = async (
  receipt: ContractReceipt,
  iface: Interface,
  eventName: string
) => {
  const topic = iface.getEventTopic(eventName);
  // search for the log by the topic
  const log = receipt.logs.find((x) => x.topics.indexOf(topic) >= 0) as {
    topics: Array<string>;
    data: string;
  };
  // finally, you can parse the log with the interface
  // to get a more user-friendly event object
  const parsedLog = iface.parseLog(log);
  return parseEthersLog(parsedLog);
};

const createProposal = async (
  governorAddress,
  targets,
  values,
  signatures,
  callDatas,
  description
) => {
  // governorDeployment = (await get("GovernorAlpha")).address;
  console.log(`=============================================================
    Governor Address:    ${governorAddress}
    Target:              ${targets}
    Values:              ${values}
    Signature:           ${signatures}
    Data:                ${callDatas}
    Description:         ${description}
    =============================================================`);
  const gov = (await ethers.getContractAt(
    "GovernorAlpha",
    governorAddress
  )) as GovernorAlpha;
  const tx = await (
    await gov.propose(targets, values, signatures, callDatas, description)
  ).wait();
  console.log(tx);
};

const defaultValueMultisigOrSipFlag = (networkTags: Record<string, boolean>): {isMultisigFlag: boolean, isSIPFlag: boolean} => {
  let isMultisigFlag, isSIPFlag;
  if(networkTags["testnet"]) {
    isMultisigFlag = true;
  } else if(networkTags["mainnet"]) {
    isSIPFlag = true;
  } else {
    throw new Error(`Non-supported ${JSON.stringify(networkTags)} network tags`);
  }

  return {isMultisigFlag, isSIPFlag}
}

export {
  parseEthersLog,
  getEthersLog,
  getParsedEventLogFromReceipt,
  sendWithMultisig,
  signWithMultisig,
  multisigCheckTx,
  createProposal,
  injectHre,
  defaultValueMultisigOrSipFlag,
};
