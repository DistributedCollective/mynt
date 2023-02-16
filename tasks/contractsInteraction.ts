import { task, types } from "hardhat/config";
/* import {
  BasketManagerV3,
  BasketManagerV3__factory,
  Ownable,
  Ownable__factory,
} from "types/generated"; */

import {
  impersonateAccount,
  stopImpersonatingAccount,
} from "@nomicfoundation/hardhat-network-helpers";
import * as helpers from "../scripts/utils/helpers";

/// ------ REPLACE bAsset ----- ///
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
    const basketManager = await ethers.getContract("BasketManagerV3"); // as BasketManagerV3;

    helpers.injectHre(hre);
    const { deployer } = await getNamedAccounts();

    const networkName = getNetworkName();
    if (["rskTestnet", "rskForkedTestnet"].includes(networkName)) {
      // multisig tx
      const multisigAddress = (await get("MultiSigWallet")).address;
      const contractAddress = basketManager.address;
      const sender = deployer;

      const BasketManagerV3Interface = new ethers.utils.Interface(
        (await get("BasketManagerV3")).abi
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
      if (networkName === "rskMainnet") {
        // @todo create a proposal - meanwhile use the core protocol py script
      } else {
        // @todo forked mainnet to replace bAsset - impersonate accounts: TimelockOwner, GvernorOwner, whale accounts
        //   - create proposal (impersonate a whale account)
        //   - timetravel
        //   - impersonate or fund whale accounts to vote
        //   - vote
        //   - timetravel to queue and then execute proposal
        //   - run (create?) tests to check the consistency
        const timelockAddress = (await get("TimelockOwner")).address;
        await impersonateAccount(timelockAddress);
        const timelockSigner = ethers.provider.getSigner(timelockAddress);
      }
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

/// ------ TRANSFER OWNERSHIP ----- ///
task("interaction:transfer-ownership", "Transfer contracts ownership")
  .addParam("newOwner", "New owner address", undefined, types.string, false)
  .addParam(
    "contracts",
    "contracts to transfer ownership: e.g. [DLLR, FeesManager, MassetManager]",
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

    const contractsAddresses = await Promise.all(
      contractsList.map(async (contract): Promise<string> => {
        const addr = (await get(contract)).address;
        console.log(`${contract}: ${addr}`);
        return addr;
      })
    );

    helpers.injectHre(hre);
    const { deployer } = await getNamedAccounts();
    const ownableABI = [
      "function transferOwnership(address newOwner)",
      "function owner() view returns(address)",
    ];
    const ownableInterface = new ethers.utils.Interface(ownableABI);
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
        contractsAddresses.map(async (contractAddress) => {
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
    } else if (["localhost", "development", "hardhat"].includes(networkName)) {
      // local ganache deployer
      await Promise.all(
        contractsAddresses.map(async (contractAddress, index) => {
          const ownable = await ethers.getContractAt(
            ownableABI,
            // contractsList[index],
            contractAddress
          );

          if (Object.keys(ownable.functions).includes("owner()")) {
            const currentOwner = await ownable.owner();
            console.log(
              `processing ${contractsList[index]} @ ${contractAddress}, owner ${currentOwner}`
            );
            console.log("Impersonating", currentOwner);
            await impersonateAccount(currentOwner);
            const signer = await ethers.getSigner(currentOwner);
            await ownable.connect(signer).transferOwnership(newOwner);

            console.log(
              `processed contract ${contractsList[index]} @ ${contractAddress} - ownership transferred`
            );
          } else {
            console.log(
              `skipping contract ${contractsList[index]} @ ${contractAddress} as is not ownable - no owner() function`
            );
          }
        })
      );
    }
  });

task("interaction:get-contracts-owner", "Log contracts owners")
  .addParam(
    "contracts",
    "contracts to transfer ownership: e.g. [DLLR, FeesManager, MassetManager]",
    undefined,
    types.string,
    true
  )
  .setAction(async ({ contracts }, hre) => {
    const {
      ethers,
      deployments: { get },
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

    const ownableABI = ["function owner() view returns(address)"];

    console.log();
    console.log("Contracts owners: ...");
    console.log();

    await Promise.all(
      contractsList.map(async (contractName, index) => {
        const contractAddress = (await get(contractName)).address;
        const ownable = await ethers.getContractAt(ownableABI, contractAddress);
        console.log(
          `${
            contractsList[index]
          } @ ${contractAddress}: owner ${await ownable.owner()}`
        );
      })
    );
  });
