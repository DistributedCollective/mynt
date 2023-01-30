import { ethers } from "hardhat";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async ({ deployments, getNamedAccounts }) => {
  const { deploy, get, log } = deployments;
  const { deployer } = await getNamedAccounts();

  const networkName = deployments.getNetworkName();
  let mocAddress;
  const docAddress = (await get("DoC")).address;

  if (
    [
      "rskMainnet",
      "rskTestnet",
      "rskForkedkMainnet",
      "rskForkedTestnet",
    ].includes(networkName)
  ) {
    mocAddress = (await get("MocMintRedeemDoc")).address;
  } else if (["development", "hardhat", "localhost"].includes(networkName)) {
    // @todo add handling forked networks
    mocAddress = (await deploy("MocMock", { from: deployer, log: true }))
      .address;
  }

  log(`using addresses on the '${networkName}'
    MoC main contract address: ${mocAddress}
    DoC address: ${docAddress}`);

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
      execute: {
        init: {
          methodName: "initialize",
          args: [],
        },
      },
    },
    from: deployer,
    log: true,
  });
};

func.tags = ["MocIntegration"];
func.dependencies = [
  "DLLR",
  "MassetManager",
  "MyAdminProxy",
  "DeployMockBAssets",
];

export default func;
