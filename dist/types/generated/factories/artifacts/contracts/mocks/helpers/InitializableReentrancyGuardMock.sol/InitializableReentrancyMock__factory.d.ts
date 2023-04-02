import { Signer, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../../../common";
import type { InitializableReentrancyMock, InitializableReentrancyMockInterface } from "../../../../../../artifacts/contracts/mocks/helpers/InitializableReentrancyGuardMock.sol/InitializableReentrancyMock";
type InitializableReentrancyMockConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class InitializableReentrancyMock__factory extends ContractFactory {
    constructor(...args: InitializableReentrancyMockConstructorParams);
    deploy(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<InitializableReentrancyMock>;
    getDeployTransaction(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): TransactionRequest;
    attach(address: string): InitializableReentrancyMock;
    connect(signer: Signer): InitializableReentrancyMock__factory;
    static readonly bytecode = "0x608060405234801561001057600080fd5b50610363806100206000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c80635594bcfb1461003b5780638129fc1c14610050575b600080fd5b61004e6100493660046102db565b610058565b005b61004e610101565b610060610211565b6000819050806001600160a01b031663848d0bd46040518163ffffffff1660e01b81526004016020604051808303816000875af11580156100a5573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906100c9919061030b565b6100f45760405162461bcd60e51b815260206004820152600060248201526044015b60405180910390fd5b506100fe60018055565b50565b600054610100900460ff16158080156101215750600054600160ff909116105b8061013b5750303b15801561013b575060005460ff166001145b61019e5760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b60648201526084016100eb565b6000805460ff1916600117905580156101c1576000805461ff0019166101001790555b6101c9610270565b80156100fe576000805461ff0019169055604051600181527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989060200160405180910390a150565b6002600154036102635760405162461bcd60e51b815260206004820152601f60248201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c0060448201526064016100eb565b6002600155565b60018055565b600054610100900460ff1661026a5760405162461bcd60e51b815260206004820152602b60248201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960448201526a6e697469616c697a696e6760a81b60648201526084016100eb565b6000602082840312156102ed57600080fd5b81356001600160a01b038116811461030457600080fd5b9392505050565b60006020828403121561031d57600080fd5b8151801515811461030457600080fdfea264697066735822122040cba72f8f06b829fffa4f82cb60d8bd061738f3cdec00761d0f8b359cc17c5564736f6c63430008110033";
    static readonly abi: readonly [{
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: false;
            readonly internalType: "uint8";
            readonly name: "version";
            readonly type: "uint8";
        }];
        readonly name: "Initialized";
        readonly type: "event";
    }, {
        readonly inputs: readonly [];
        readonly name: "initialize";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "reentrantMockAddress";
            readonly type: "address";
        }];
        readonly name: "runClientMethod";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }];
    static createInterface(): InitializableReentrancyMockInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): InitializableReentrancyMock;
}
export {};
