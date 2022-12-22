import hre, { ethers } from "hardhat";
import { providers } from "ethers";
import { DeployFunction } from "hardhat-deploy/types";
import { MockERC20 } from "types/generated";

const func: DeployFunction = async ({ deployments, getNamedAccounts }) => {
  const { deploy, get, log } = deployments;
  const { deployer } = await getNamedAccounts();

  const deployedDLLR = await deployments.get("DLLR");

  const networkName = deployments.getNetworkName();
  let mocAddress;
  let docAddress;
  if (["rskMainnet", "rskTestnet"].includes(networkName)) {
    mocAddress = (await get("MocMintRedeemDoc")).address;
    docAddress = (await get("DoC")).address;
  } else if (["development", "hardhat"].includes(networkName)) {
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
    mocAddress = (await deploy("MocMock", { from: deployer, log: true }))
      .address;
  }
  const dllrAddress = (await get("DLLR")).address; // "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"; //

  const massetManagerAddress = (await get("MassetManager")).address;

  const result = await deploy("MocIntegration", {
    args: [mocAddress, docAddress, dllrAddress, massetManagerAddress],
    proxy: {
      owner: deployer,
      proxyContract: "OpenZeppelinTransparentProxy",
      viaAdminContract: {
        name: "MyntAdminProxy",
        artifact: "MyntAdminProxy",
      },
    },
    from: deployer,
    log: true,
  });
};

func.tags = ["MocIntegration"];
func.dependencies = ["DLLR", "MassetManager", "MyAdminProxy"];

export default func;
