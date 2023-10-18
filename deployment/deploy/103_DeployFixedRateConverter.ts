import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async ({
  deployments: { deploy, get, log },
  getNamedAccounts,
}) => {
  const { deployer } = await getNamedAccounts();
  const deployedMynt = await get("Mynt");
  const deployedSov = await get("Sov");
  const deployedMultisig = await get("MultiSigWallet");
  await deploy("FixedRateConverter", {
    from: deployer,
    contract: "FixedRateConverter",
    log: true,
    skipIfAlreadyDeployed: true,
    args: [
      deployedMynt.address,
      deployedSov.address,
      4723550439442834 // sov rate per 1 Mynt; 0.004723550439442834
    ],
  });
};

func.tags = ["FixedRateConverter"];

export default func;
