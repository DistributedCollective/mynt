export interface IListAddresses {
  owner: string;
  timelockOwner: string;
  timelockAdmin: string;
  governorOwner: string;
  governorAdmin: string;
}

export interface IAddresses {
  testnet: IListAddresses,
  mainnet: IListAddresses
}

export const addresses: IAddresses = {
  testnet: {
    owner: "0x189ecD23E9e34CFC07bFC3b7f5711A23F43F8a57",
    timelockOwner: "0xF09631d220f9Da04F707F4bfA24376b1cac630B1",
    timelockAdmin: "0x1528f0341a1Ea546780caD690F54b4FBE1834ED4",
    governorOwner: "0x058FD3F6a40b92b311B49E5e3E064300600021D7",
    governorAdmin: "0x1528f0341a1Ea546780caD690F54b4FBE1834ED4",
  },
  mainnet: {
    owner: "0x924f5ad34698Fd20c90Fe5D5A8A0abd3b42dc711",
    timelockOwner: "0x967c84b731679E36A344002b8E3CE50620A7F69f",
    timelockAdmin: "0x6c94c8aa97C08fC31fb06fbFDa90e1E09529FB13",
    governorOwner: "0x6496df39d000478a7a7352c01e0e713835051ccd",
    governorAdmin: "0xfF25f66b7D7F385503D70574AE0170b6B1622dAd",
  }
}