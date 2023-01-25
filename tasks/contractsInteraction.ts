import { task, types } from "hardhat/config";
import {
  BasketManagerV3,
  BasketManagerV3__factory,
  Ownable,
  Ownable__factory,
} from "types/generated";
import * as helpers from "../scripts/utils/helpers";

task("interaction:replace-basset", "Replace bAsset")
  .addParam("prevBasset", "bAsset to replace", undefined, types.string, false)
  .addParam("newBasset", "New bAsset", undefined, types.string, false)
  .addParam(
    "pausePrevBasset",
    "Pause old basset - used if can't be removed (Mynt balance > 0)",
    false,
    types.boolean,
    true
  )
  .setAction(async ({ prevBasset, newBasset, pausePrevBasset }, hre) => {
    const {
      ethers,
      getNamedAccounts,
      deployments: { get, getNetworkName },
    } = hre;
    const basketManager: BasketManagerV3 = (await ethers.getContract(
      "BasketManagerV3"
    )) as BasketManagerV3;

    helpers.injectHre(hre);
    const { deployer } = await getNamedAccounts();

    const networkName = getNetworkName();
    if (["rskTestnet", "rskForkedTestnet"].includes(networkName)) {
      // multisig tx
      const multisigAddress = (await get("MultiSigWallet")).address;
      const contractAddress = basketManager.address;
      const sender = deployer;
      const BasketManagerV3Interface = new ethers.utils.Interface(
        BasketManagerV3__factory.abi
      );

      const dataRemove = pausePrevBasset
        ? BasketManagerV3Interface.encodeFunctionData("pauseBasset", [
            prevBasset,
            true,
          ])
        : BasketManagerV3Interface.encodeFunctionData("removeBasset", [
            prevBasset,
          ]);

      const dataAdd = BasketManagerV3Interface.encodeFunctionData("addBasset", [
        newBasset,
        1,
        ethers.constants.AddressZero,
        0,
        1000,
        false,
      ]);

      console.log(`removing basset multisig tx:`);
      await helpers.sendWithMultisig(
        multisigAddress,
        contractAddress,
        dataRemove,
        sender
      );
      console.log(`adding basset multisig tx:`);
      await helpers.sendWithMultisig(
        multisigAddress,
        contractAddress,
        dataAdd,
        sender
      );
    } else if (["rskMainnet", "rskForkedMainnet"].includes(networkName)) {
      // governance or multisig
      // @todo add governance or ms?
    } else if (["development", "hardhat"].includes(networkName)) {
      // local ganache deployer
      console.log(`removing basset: ${prevBasset}`);
      if (pausePrevBasset) {
        await basketManager.setPaused(prevBasset, true);
      } else {
        await basketManager.removeBasset(prevBasset);
      }

      console.log(`setting new basset: ${newBasset}`);
      await basketManager.addBasset(
        newBasset,
        1,
        ethers.constants.AddressZero,
        0,
        1000,
        false
      );
    }
    console.log("Basset updated");
  });

task("interaction:transfer-ownership", "Transfer contracts ownership")
  .addParam("newOwner", "New ownerAddress", undefined, types.string, false)
  .addParam(
    "contractsList",
    "bAsset to replace: e.g. '[DLLR, FeesManager, MassetManager]'",
    undefined,
    types.string,
    true
  )
  .setAction(async ({ contracts, newOwner }, hre) => {
    const {
      ethers,
      getNamedAccounts,
      deployments: { get, getNetworkName },
    } = hre;
    let contractsList: string[];
    if (contracts) {
      contractsList = JSON.parse(contracts) as Array<string>;
    } else {
      contractsList = [
        "DLLR",
        "MassetManager",
        "BasketManagerV3",
        "FeesManager",
        "MocIntegration",
        "MyntAdminProxy",
      ];
    }

    contracts = await Promise.all(
      contractsList.map(async (contract): Promise<string> => {
        const addr = (await get(contract)).address;
        console.log(`${contract}: ${addr}`);
        return addr;
      })
    );

    helpers.injectHre(hre);
    const { deployer } = await getNamedAccounts();
    const ownableInterface = new ethers.utils.Interface(Ownable__factory.abi);
    const networkName = getNetworkName();

    console.log("Transferring contracts ownership...");

    if (["rskTestnet", "rskForkedTestnet"].includes(networkName)) {
      // multisig tx
      const multisigAddress = (await get("MultiSigWallet")).address;
      const sender = deployer;
      const data = ownableInterface.encodeFunctionData("transferOwnership", [
        newOwner,
      ]);
      await Promise.all(
        contracts.map(async (contractAddress) => {
          console.log(`processing ${contractAddress}:`);
          await helpers.sendWithMultisig(
            multisigAddress,
            contractAddress,
            data,
            sender
          );
        })
      );
    } else if (["rskMainnet", "rskForkedMainnet"].includes(networkName)) {
      // governance or multisig
      // @todo add governance or ms?
    } else if (["development", "hardhat"].includes(networkName)) {
      // local ganache deployer
      await Promise.all(
        contracts.map(async (contractAddress) => {
          console.log(`processing ${contractAddress}:`);

          const ownable = (await ethers.getContractAt(
            "Ownable",
            contractAddress
          )) as Ownable;

          const currentOwner = await ownable.owner();
          await hre.network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [currentOwner],
          });

          const signer = await ethers.getSigner(currentOwner);
          await ownable.connect(signer).transferOwnership(newOwner);
        })
      );
    }
  });
