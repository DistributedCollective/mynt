import { DeployFunction } from "hardhat-deploy/types";

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

func.tags = ["BasketManager"];

export default func;
