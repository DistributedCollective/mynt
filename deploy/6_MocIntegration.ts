import { ethers } from "hardhat";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async ({ deployments, getNamedAccounts }) => {
  const { deploy, get, log } = deployments;
  const { deployer } = await getNamedAccounts();

  const networkName = deployments.getNetworkName();
  let mocAddress;
  let docAddress;

  if (["rskMainnet", "rskTestnet"].includes(networkName)) {
    mocAddress = (await get("MocMintRedeemDoc")).address;
    docAddress = (await get("DoC")).address;
    log(`using addresses on the '${networkName}'
    MoC main contract address: ${mocAddress}
    DoC address: ${docAddress}`);
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

    log(`using Money On Chain addresses on the '${networkName}'
    MoC main contract address: ${mocAddress}
    DoC address: ${docAddress}`);
  }
  const dllrAddress = (await get("DLLR")).address;

  const massetManagerAddress = (await get("MassetManager")).address;

  await deploy("MocIntegration", {
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
