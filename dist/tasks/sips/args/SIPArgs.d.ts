export interface ISipArgument {
    targets: string[];
    values: number[];
    signatures: string[];
    data: string[];
    description: string;
}
declare const SIPArgs: {
    SampleSIP01: (hre: any) => Promise<ISipArgument>;
    SIPSetMassetManagerProxy: (hre: any) => Promise<ISipArgument>;
    SIPSetBasketManagerProxy: (hre: any) => Promise<ISipArgument>;
};
export default SIPArgs;
