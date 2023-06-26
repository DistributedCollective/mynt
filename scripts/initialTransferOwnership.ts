import hre from "hardhat";
import Logs from "node-logs";
const logger = new Logs().showInConsole(true);

(async () => {
  console.log("starting...");
  const {
    ethers,
    network,
    getNamedAccounts,
    deployments: { get, getNetworkName, getArtifact },
  } = hre;
  let contractsList = [
    "DLLR",
    "MassetManager",
    "BasketManagerV3",
    "FeesManager",
    "MocIntegration",
    "FeesVault",
    // "MyntAdminProxy",
  ];

  const contractsAddresses = await Promise.all(
    contractsList.map(async (contract): Promise<string> => {
      const addr = (await get(contract)).address;
      console.log(`${contract}: ${addr}`);
      return addr;
    })
  );

  const { deployer } = await getNamedAccounts();
  const ownableABI = [
    "function transferOwnership(address newOwner)",
    "function owner() view returns(address)",
  ];
  const ownableInterface = new ethers.utils.Interface(ownableABI);
  const networkName = getNetworkName();

  console.log("Transferring contracts ownership...");

  if (network.tags.testnet) {
    const multisigAddress = (await get("MultiSigWallet")).address;
    const signer = await ethers.getSigner(
      (
        await hre.getNamedAccounts()
      ).signerShared
    );
    console.log("signerShared address:", signer.address);
    // await Promise.all(
    let index = 0;
    for await (const contractAddress of contractsAddresses) {
      const contractAbi = (await getArtifact(contractsList[index])).abi;
      const ownable = await ethers.getContractAt(
        //ownableABI,
        //contractsList[index],
        contractAbi, // taking ABI from deployment for consistency
        contractAddress,
        signer
      );

      if (Object.keys(ownable.functions).includes("owner()")) {
        const currentOwner = await ownable.owner();
        console.log(
          `processing ${contractsList[index]} @ ${contractAddress}, owner ${currentOwner}`
        );

        if (currentOwner !== multisigAddress) {
          console.log("transferring ownership .............");
          await (await ownable.transferOwnership(multisigAddress)).wait();
          console.log(
            `processed contract ${contractsList[index]} @ ${contractAddress} - ownership transferred`
          );
        } else {
          console.log(
            `contract ${contractsList[index]} @ ${contractAddress} - ownership ALREADY transferred`
          );
        }
        logger.warning(
          `Contract ${
            contractsList[index]
          } @ ${contractAddress} owner ${await ownable.owner()}`
        );
      } else {
        logger.error(
          `Contract ${contractsList[index]} @ ${contractAddress} doesn't have 'owner()' function - cannot transfer ownership`
        );
      }

      index++;
    }
    //);
  }
})();
