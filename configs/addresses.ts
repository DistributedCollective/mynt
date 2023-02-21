export interface IListAddresses {
  owner: string; // target owner of all of the mynt contracts
}

export interface IAddresses {
  testnet: IListAddresses,
  mainnet: IListAddresses
}

export const addresses: IAddresses = {
  testnet: {
    owner: "0x189ecD23E9e34CFC07bFC3b7f5711A23F43F8a57",
  },
  mainnet: {
    owner: "0x924f5ad34698Fd20c90Fe5D5A8A0abd3b42dc711",
  }
}

export const getAddresses = (networkTag: Record<string, boolean>): IListAddresses => {
  let configAddresses: IListAddresses = {} as IListAddresses;
  if(networkTag["testnet"]) {
    configAddresses = addresses.testnet
  } else if(networkTag["mainnet"]) {
    configAddresses = addresses.mainnet
  }

  return configAddresses;
}