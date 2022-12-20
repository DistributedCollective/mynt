import { DeployFunction } from "hardhat-deploy/types";
import { abi as IERC20 } from "@openzeppelin/contracts/build/contracts/IERC20.json";

const func: DeployFunction = async ({ deployments, getNamedAccounts }) => {
  const { deploy, get } = deployments;
  const { deployer } = await getNamedAccounts();

  const moc = (await get("IMocMintRedeemDoc")).address;
  const doc = (await get("DoC")).address;
  const dllr = (await get("DLLR")).address;
  const massetManager = (await get("MassetManager")).address;

  await deploy("MocIntegration", {
    args: [moc, doc, dllr, massetManager],
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

export default func;
