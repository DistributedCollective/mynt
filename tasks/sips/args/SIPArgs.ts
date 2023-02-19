export interface ISipArgument {
  target: string[];
  value: number[];
  signature: string[];
  data: string[];
  description: string;
}

const SampleSIP01 = async (hre): Promise<ISipArgument> => {
  const { ethers } = hre;
  const SampleToken = await ethers.getContractFactory("ERC20");
  const args: ISipArgument = {
    target: ["0x95a1CA72Df913f14Dc554a5D14E826B64Bd049FD"],
    value: [0],
    signature: ["transfer(address,uint256)"],
    data: [SampleToken.interface.encodeFunctionData("transfer",["0x95222290dd7278aa3ddd389cc1e1d165cc4bafe5", ethers.utils.parseEther("1")])],
    description: "Transfer Sample Token"
  }

  return args;
}

const SIPSetMassetManagerProxy = async (hre): Promise<ISipArgument> => {
  const { ethers } = hre;
  const newMassetManagerProxy = "";
  const DLLR = await ethers.getContract("DLLR");
  const args: ISipArgument = {
    target: [DLLR.address],
    value: [0],
    signature: ["setMassetManagerProxy(address)"],
    data: [DLLR.interface.encodeFunctionData("setMassetManagerProxy",[newMassetManagerProxy])],
    description: "Set Masset Manager Proxy"
  }

  return args;
}

const SIPSetBasketManagerProxy = async (hre): Promise<ISipArgument> => {
  const { ethers } = hre;
  const newBasketManagerProxy = "";
  const DLLR = await ethers.getContract("DLLR");
  const args: ISipArgument = {
    target: [DLLR.address],
    value: [0],
    signature: ["setBasketManagerProxy(address)"],
    data: [DLLR.interface.encodeFunctionData("setBasketManagerProxy",[newBasketManagerProxy])],
    description: "Set Basket Manager Proxy"
  }

  return args;
}

const SIPArgs = {
  SampleSIP01,
  SIPSetMassetManagerProxy,
  SIPSetBasketManagerProxy,
}

export default SIPArgs;