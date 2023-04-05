declare const PERMIT_TYPEHASH: string;
declare const EIP712Domain: {
    name: string;
    type: string;
}[];
declare const Permit: {
    name: string;
    type: string;
}[];
declare function domainSeparator(name: any, version: any, chainId: any, verifyingContract: any): Promise<string>;
export { EIP712Domain, Permit, PERMIT_TYPEHASH, domainSeparator };
