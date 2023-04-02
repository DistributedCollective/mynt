import { Interface } from "@ethersproject/abi/lib/interface";
import { BytesLike, Contract, ContractReceipt } from "ethers";
import { Address } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
declare const injectHre: (_hre: HardhatRuntimeEnvironment) => void;
declare const sendWithMultisig: (multisigAddress: Address, contractAddress: Address, data: BytesLike, sender: Address, value?: number) => Promise<void>;
declare const signWithMultisig: (multisigAddress: any, txId: any, sender: any) => Promise<void>;
declare const multisigCheckTx: (txId: any, multisigAddress?: string) => Promise<void>;
declare const parseEthersLog: (parsed: any) => any;
declare const getEthersLog: (contract: Contract, filter: any) => Promise<any[] | undefined>;
declare const getParsedEventLogFromReceipt: (receipt: ContractReceipt, iface: Interface, eventName: string) => Promise<any>;
declare const createProposal: (governorAddress: any, targets: any, values: any, signatures: any, callDatas: any, description: any) => Promise<void>;
declare const defaultValueMultisigOrSipFlag: (networkTags: Record<string, boolean>) => {
    isMultisigFlag: boolean;
    isSIPFlag: boolean;
};
export { parseEthersLog, getEthersLog, getParsedEventLogFromReceipt, sendWithMultisig, signWithMultisig, multisigCheckTx, createProposal, injectHre, defaultValueMultisigOrSipFlag, };
