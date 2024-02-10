import { ethers, network } from "hardhat";
import { DeployFunction } from "hardhat-deploy/types";
import { upgradeWithTransparentUpgradableProxy } from "../helpers/deployment";

const func: DeployFunction = async ({ deployments, getNamedAccounts }) => {
  const { deploy, get, getOrNull, log } = deployments;
  const { deployer } = await getNamedAccounts();

  const networkName = deployments.getNetworkName();
  let mocAddress;
  const docAddress = (await get("DoC")).address;

  if (network.tags.mainnet || network.tags.testnet) {
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
  const permit2Address = (await get("Permit2")).address;

  const deploymentName = "MocIntegration";
  const deployment = await getOrNull(deploymentName);
  const massetManagerAddress = (await get("MassetManager")).address;
  if (deployment) {
    await upgradeWithTransparentUpgradableProxy(
      deployer,
      deploymentName,
      "TransparentUpgradeableProxy",
      undefined,
      `${deploymentName}_Proxy`,
      "MyntAdminProxy",
      false,
      [mocAddress, docAddress, dllrAddress, massetManagerAddress, permit2Address]
    );
  } else {
    await deploy(deploymentName, {
      args: [mocAddress, docAddress, dllrAddress, massetManagerAddress, permit2Address],
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
            args: [ethers.constants.AddressZero],
          },
        },
      },
      from: deployer,
      log: true,
    });
  }
};

func.tags = ["MocIntegration"];
func.dependencies = [
  "DLLR",
  "MassetManager",
  "MyntAdminProxy",
  "DeployMockBAssets",
  "Permit2",
];

export default func;
