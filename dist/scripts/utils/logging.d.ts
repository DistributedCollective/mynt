export declare const logBlockTimestamp: (web3: any, block?: string) => Promise<void>;
export declare const logSeparator: () => void;
export declare const logObject: (obj: object) => void;
export declare const logAndSanitizeArgs: (args: object) => void;
export declare const logTx: (txPromise: Promise<Truffle.TransactionResponse<any> | Truffle.TransactionResponse<any>[]>, description: string) => Promise<any>;
