import { ethers } from "hardhat";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async ({ deployments, getNamedAccounts }) => {
  const { deploy, get, log } = deployments;
  const { deployer } = await getNamedAccounts();

  const networkName = deployments.getNetworkName();
  let mocAddress;
  let docAddress;
  let zusdAddress;

  if (["development", "hardhat"].includes(networkName)) {
    // @todo add handling forked networks
    docAddress = (
      await deploy("DoC", {
        contract: "MockERC20",
        args: [
          "DoC Token",
          "DoC",
          18,
          deployer,
          ethers.utils.parseEther("100000000"),
        ],
        from: deployer,
        log: true,
      })
    ).address;

    zusdAddress = (
      await deploy("ZUSD", {
        contract: "MockERC20",
        args: [
          "ZUSD Token",
          "ZUSD",
          18,
          deployer,
          ethers.constants.Zero, //  utils.parseEther("100000000"),
        ],
        from: deployer,
        log: true,
      })
    ).address;

    log(`using Money On Chain addresses on the '${networkName}'
    MoC main contract address: ${mocAddress}
    DoC address: ${docAddress}`);
    log(`Zero ZUSD address: ${zusdAddress}`);
  }
};

func.tags = ["DeployMockBAssets"];

export default func;
