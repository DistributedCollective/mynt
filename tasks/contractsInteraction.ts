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
import { getAddresses, IListAddresses } from "../configs/addresses";
import { _createSIP } from "./sips/createSIP";
import { ISipArgument } from "./sips/args/SIPArgs";

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
    const contractAddress = basketManager.address;
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

    helpers.injectHre(hre);
    const { deployer } = await getNamedAccounts();

    const networkName = getNetworkName();
    if (["rskTestnet", "rskForkedTestnet"].includes(networkName)) {
      // multisig tx
      const multisigAddress = (await get("MultiSigWallet")).address;
      const sender = deployer;

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
        // @todo create a proposal
        const signatureRemove = pausePrevBasset ? "pauseBasset(address)" : "removeBasset(address)";
        const signatureAdd = "addBasset(address,int256,address,uint256,uint256,bool)";
        const sipArgs: ISipArgument = {
          target: [contractAddress, contractAddress],
          value: [0, 0],
          signature: [signatureRemove, signatureAdd],
          data: [dataRemove, dataAdd],
          description: "Replace Basset"
        }

        _createSIP(hre, sipArgs);
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

/** MetaAssetToken contract interaction */
task("interaction:get-massetManagerConfig", "Fetch massetManagerProxy address")
.addParam("contractAddress", "Meta asset token contract address (DLLR, etc)", undefined, types.string, false)
.setAction(async ({ contractAddress }, hre) => {
  const {ethers} = hre;
  const MetaAssetToken = await ethers.getContractAt("MetaAssetToken", contractAddress);
  console.log(`massetManagerProxy address: ${await MetaAssetToken.massetManagerProxy()}`);
  console.log(`massetManagerImplementation address: ${await MetaAssetToken.massetManagerImplementation()}`);
});

task("interaction:get-basketManagerConfig", "Fetch basketManagerProxy address")
.addParam("contractAddress", "Meta asset token contract address (DLLR, etc)", undefined, types.string, false)
.setAction(async ({ contractAddress }, hre) => {
  const {ethers} = hre;
  const MetaAssetToken = await ethers.getContractAt("MetaAssetToken", contractAddress);
  console.log(`basketManagerProxy address: ${await MetaAssetToken.basketManagerProxy()}`);
  console.log(`basketManagerImplementation address: ${await MetaAssetToken.basketManagerImplementation()}`);
});

task("interaction:get-chainid", "Fetch chain id")
.addParam("contractAddress", "Meta asset token contract address (DLLR, etc)", undefined, types.string, false)
.setAction(async ({ contractAddress }, hre) => {
  const {ethers} = hre;
  const MetaAssetToken = await ethers.getContractAt("MetaAssetToken", contractAddress);
  console.log(`chain id: ${await MetaAssetToken.getChainId()}`);
});

task("multisig:set-massetManagerProxy", "Set massetManagerProxy")
.addParam("contractAddress", "Meta asset token contract address (DLLR, etc)", undefined, types.string, false)
.addParam("newMassetManagerProxy", "new masset manager proxy address", undefined, types.string, false)
.setAction(async ({ contractAddress, newMassetManagerProxy }, hre) => {
  helpers.injectHre(hre);
  const {ethers, network, getNamedAccounts} = hre;
  const configAddresses = getAddresses(network.name);
  const MetaAssetToken = await ethers.getContractAt("MetaAssetToken", contractAddress);
  const { deployer } = await getNamedAccounts();
  const data = MetaAssetToken.interface.encodeFunctionData("setMassetManagerProxy", [
    newMassetManagerProxy,
  ]);
  await helpers.sendWithMultisig(
    configAddresses.multisig,
    MetaAssetToken.address,
    data,
    deployer
  );
});

task("multisig:set-basketManagerProxy", "Set basketManagerProxy")
.addParam("contractAddress", "Meta asset token contract address (DLLR, etc)", undefined, types.string, false)
.addParam("newBasketManagerProxy", "new basket manager proxy address", undefined, types.string, false)
.setAction(async ({ contractAddress, newBasketManagerProxy }, hre) => {
  helpers.injectHre(hre);
  const {ethers, network, getNamedAccounts} = hre;
  const configAddresses = getAddresses(network.name)
  const MetaAssetToken = await ethers.getContractAt("MetaAssetToken", contractAddress);
  const { deployer } = await getNamedAccounts();
  const data = MetaAssetToken.interface.encodeFunctionData("setBasketManagerProxy", [
    newBasketManagerProxy,
  ]);
  await helpers.sendWithMultisig(
    configAddresses.multisig,
    MetaAssetToken.address,
    data,
    deployer
  );
});

/** BasketManager contract interaction */
task("basketManager:isValidBasset", "Checks if bAasset is valid by checking its presence in the bAssets factors list")
.addParam("basset", "Basset address to be checked", undefined, types.string, false)
.setAction(async ({ basset }, hre) => {
  const { ethers } = hre;
  const basketManager = await ethers.getContract("BasketManagerV3"); // as BasketManagerV3;
  console.log("is valid: ", await basketManager.isValidBasset(basset));
})

task("basketManager:checkBasketBalanceForDeposit", "Checks if ratio of bAssets in basket is within limits to make a deposit of specific asset")
.addParam("basset", "Basset address to deposit", undefined, types.string, false)
.addParam("bassetQuantity", "Amount of bAssets to deposit", undefined, types.string, false)
.setAction(async ({ basset, bassetQuantity }, hre) => {
  const { ethers } = hre;
  const basketManager = await ethers.getContract("BasketManagerV3"); // as BasketManagerV3;
  console.log("result: ", await basketManager.checkBasketBalanceForDeposit(basset, bassetQuantity));
})

task("basketManager:checkBasketBalanceForWithdrawal", "Checks if ratio of bAssets in basket is within limits to make a withdrawal of specific asset")
.addParam("basset", "Basset address to redeem", undefined, types.string, false)
.addParam("bassetQuantity", "Amount of bAssets to redeem", undefined, types.string, false)
.setAction(async ({ basset, bassetQuantity }, hre) => {
  const { ethers } = hre;
  const basketManager = await ethers.getContract("BasketManagerV3"); // as BasketManagerV3;
  console.log("result: ", await basketManager.checkBasketBalanceForWithdrawal(basset, bassetQuantity));
})

task("basketManager:convertBassetToMassetQuantity", "Converts bAsset to mAsset quantity")
.addParam("basset", "Basset address", undefined, types.string, false)
.addParam("bassetQuantity", "Amount of bAssets to check", undefined, types.string, false)
.setAction(async ({ basset, bassetQuantity }, hre) => {
  const { ethers } = hre;
  const basketManager = await ethers.getContract("BasketManagerV3"); // as BasketManagerV3;
  console.log("result: ",await basketManager.convertBassetToMassetQuantity(basset, bassetQuantity));
})

task("basketManager:convertMassetToBassetQuantity", "Converts mAsset to bAsset quantity")
.addParam("basset", "Basset address", undefined, types.string, false)
.addParam("massetQuantity", "Amount of mAssets to check", undefined, types.string, false)
.setAction(async ({ basset, massetQuantity }, hre) => {
  const { ethers } = hre;
  const basketManager = await ethers.getContract("BasketManagerV3"); // as BasketManagerV3;
  console.log("result: ",await basketManager.convertMassetToBassetQuantity(basset, massetQuantity));
})

task("basketManager:getTotalMassetBalance", "Calculates total mAsset balance")
.setAction(async ({}, hre) => {
  const { ethers } = hre;
  const basketManager = await ethers.getContract("BasketManagerV3"); // as BasketManagerV3;
  console.log("result: ",(await basketManager.getTotalMassetBalance()).toString());
})

task("basketManager:getBassetBalance", "Calculates total bAsset balance")
.addParam("basset", "Basset address", undefined, types.string, false)
.setAction(async ({ basset }, hre) => {
  const { ethers } = hre;
  const basketManager = await ethers.getContract("BasketManagerV3"); // as BasketManagerV3;
  console.log("result: ",(await basketManager.getBassetBalance(basset)).toString());
})

task("basketManager:getVersion", "Get version of basket manager")
.setAction(async ({}, hre) => {
  const { ethers } = hre;
  const basketManager = await ethers.getContract("BasketManagerV3"); // as BasketManagerV3;
  console.log("result: ",await basketManager.getVersion());
})

task("basketManager:getBassets", "Get list of bAssets")
.setAction(async ({}, hre) => {
  const { ethers } = hre;
  const basketManager = await ethers.getContract("BasketManagerV3"); // as BasketManagerV3;
  console.log(await basketManager.getBassets());
})

task("basketManager:getFactor", "Get factor")
.addParam("basset", "Basset address", undefined, types.string, false)
.setAction(async ({ basset }, hre) => {
  const { ethers } = hre;
  const basketManager = await ethers.getContract("BasketManagerV3"); // as BasketManagerV3;
  console.log("result: ", (await basketManager.getFactor(basset)).toString());
})

task("basketManager:getRange", "Get range(min,max)")
.addParam("basset", "Basset address", undefined, types.string, false)
.setAction(async ({ basset }, hre) => {
  const { ethers } = hre;
  const basketManager = await ethers.getContract("BasketManagerV3"); // as BasketManagerV3;
  console.log("result: ", await basketManager.getRange(basset));
})

task("basketManager:getPaused", "Get paused status of basset")
.addParam("basset", "Basset address", undefined, types.string, false)
.setAction(async ({ basset }, hre) => {
  const { ethers } = hre;
  const basketManager = await ethers.getContract("BasketManagerV3"); // as BasketManagerV3;
  console.log("result: ", await basketManager.getPaused(basset));
})

task("basketManager:getProxyImplementation", "Get proxy implementation of basket manager")
.setAction(async ({}, hre) => {
  const { ethers } = hre;
  const basketManager = await ethers.getContract("BasketManagerV3"); // as BasketManagerV3;
  console.log("result: ", await basketManager.getProxyImplementation());
})
