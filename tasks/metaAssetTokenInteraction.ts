/* eslint-disable no-empty-pattern */
import { task, types } from "hardhat/config";
import Logs from "node-logs";
import * as helpers from "../scripts/utils/helpers";
import { createSIP } from "./sips/createSIP";
import { ISipArgument } from "./sips/args/SIPArgs";

const logger = new Logs().showInConsole(true);

task("mynt:get-massetManagerConfig", "Fetch massetManagerProxy address")
  .addParam(
    "contractAddress",
    "Meta asset token contract address (DLLR, etc)",
    undefined,
    types.string,
    false
  )
  .setAction(async ({ contractAddress }, hre) => {
    const { ethers } = hre;
    const MetaAssetToken = await ethers.getContractAt(
      "MetaAssetToken",
      contractAddress
    );
    console.log(
      `massetManagerProxy address: ${await MetaAssetToken.massetManagerProxy()}`
    );
    console.log(
      `massetManagerImplementation address: ${await MetaAssetToken.massetManagerImplementation()}`
    );
  });

task("mynt:get-basketManagerConfig", "Fetch basketManagerProxy address")
  .addParam(
    "contractAddress",
    "Meta asset token contract address (DLLR, etc)",
    undefined,
    types.string,
    false
  )
  .setAction(async ({ contractAddress }, hre) => {
    const { ethers } = hre;
    const MetaAssetToken = await ethers.getContractAt(
      "MetaAssetToken",
      contractAddress
    );
    console.log(
      `basketManagerProxy address: ${await MetaAssetToken.basketManagerProxy()}`
    );
    console.log(
      `basketManagerImplementation address: ${await MetaAssetToken.basketManagerImplementation()}`
    );
  });

task("mynt:get-chainid", "Fetch chain id")
  .addParam(
    "contractAddress",
    "Meta asset token contract address (DLLR, etc)",
    undefined,
    types.string,
    false
  )
  .setAction(async ({ contractAddress }, hre) => {
    const { ethers } = hre;
    const MetaAssetToken = await ethers.getContractAt(
      "MetaAssetToken",
      contractAddress
    );
    console.log(`chain id: ${await MetaAssetToken.getChainId()}`);
  });

task("multisig:set-massetManagerProxy", "Set massetManagerProxy")
  .addParam(
    "contractAddress",
    "Meta asset token contract address (DLLR, etc)",
    undefined,
    types.string,
    false
  )
  .addParam(
    "newMassetManagerProxy",
    "new masset manager proxy address",
    undefined,
    types.string,
    false
  )
  .addOptionalParam(
    "isMultisig",
    "flag if transaction needs to be intiated from the multisig contract"
  )
  .addOptionalParam(
    "isSIP",
    "flag if transaction needs to be initiated from the SIP"
  )
  .setAction(
    async (
      { contractAddress, newMassetManagerProxy, isMultisig, isSIP },
      hre
    ) => {
      // if isMultisig & isSIP are false, assign based on network tags.
      const { network } = hre;
      if (!isMultisig && !isSIP) {
        const { isMultisigFlag, isSIPFlag } =
          helpers.defaultValueMultisigOrSipFlag(network.tags);
        isMultisig = isMultisigFlag;
        isSIP = isSIPFlag;
      }

      helpers.injectHre(hre);
      const {
        ethers,
        deployments: { get },
        getNamedAccounts,
      } = hre;
      const MetaAssetToken = await ethers.getContractAt(
        "MetaAssetToken",
        contractAddress
      );
      const { deployer } = await getNamedAccounts();

      if (isMultisig) {
        const multisigAddress = (await get("MultisigWallet")).address;
        const data = MetaAssetToken.interface.encodeFunctionData(
          "setMassetManagerProxy",
          [newMassetManagerProxy]
        );
        await helpers.sendWithMultisig(
          multisigAddress,
          MetaAssetToken.address,
          data,
          deployer
        );
      } else if (isSIP) {
        const signature = "setMassetManagerProxy(address)";
        const data = MetaAssetToken.interface.encodeFunctionData(
          "setMassetManagerProxy",
          [newMassetManagerProxy]
        );

        const sipArgs: ISipArgument = {
          targets: [contractAddress],
          values: [0],
          signatures: [signature],
          data: [data],
          description: "Set massetManagerProxy address",
        };

        createSIP(hre, sipArgs);
      } else {
        await MetaAssetToken.setMassetManagerProxy(newMassetManagerProxy);
      }
    }
  );

task("multisig:set-basketManagerProxy", "Set basketManagerProxy")
  .addParam(
    "contractAddress",
    "Meta asset token contract address (DLLR, etc)",
    undefined,
    types.string,
    false
  )
  .addParam(
    "newBasketManagerProxy",
    "new basket manager proxy address",
    undefined,
    types.string,
    false
  )
  .addOptionalParam(
    "isMultisig",
    "flag if transaction needs to be intiated from the multisig contract"
  )
  .addOptionalParam(
    "isSIP",
    "flag if transaction needs to be initiated from the SIP"
  )
  .setAction(
    async (
      { contractAddress, newBasketManagerProxy, isMultisig, isSIP },
      hre
    ) => {
      const { network } = hre;
      if (!isMultisig && !isSIP) {
        const { isMultisigFlag, isSIPFlag } =
          helpers.defaultValueMultisigOrSipFlag(network.tags);
        isMultisig = isMultisigFlag;
        isSIP = isSIPFlag;
      }

      // if isMultisig & isSIP are false, transaction will be initiated as per normal
      helpers.injectHre(hre);
      const {
        ethers,
        deployments: { get },
        getNamedAccounts,
      } = hre;
      const MetaAssetToken = await ethers.getContractAt(
        "MetaAssetToken",
        contractAddress
      );
      const { deployer } = await getNamedAccounts();
      if (isMultisig) {
        const multisigAddress = (await get("MultisigWallet")).address;
        const data = MetaAssetToken.interface.encodeFunctionData(
          "setBasketManagerProxy",
          [newBasketManagerProxy]
        );
        await helpers.sendWithMultisig(
          multisigAddress,
          MetaAssetToken.address,
          data,
          deployer
        );
      } else if (isSIP) {
        const signature = "setBasketManagerProxy(address)";
        const data = MetaAssetToken.interface.encodeFunctionData(
          "setBasketManagerProxy",
          [newBasketManagerProxy]
        );

        const sipArgs: ISipArgument = {
          targets: [contractAddress],
          values: [0],
          signatures: [signature],
          data: [data],
          description: "Set basketManagerProxy address",
        };

        createSIP(hre, sipArgs);
      } else {
        await MetaAssetToken.setBasketManagerProxy(newBasketManagerProxy);
      }
    }
  );

/** BasketManager contract interaction */
task(
  "basketManager:isValidBasset",
  "Checks if bAasset is valid by checking its presence in the bAssets factors list"
)
  .addParam(
    "basset",
    "Basset address to be checked",
    undefined,
    types.string,
    false
  )
  .setAction(async ({ basset }, hre) => {
    const { ethers } = hre;
    const basketManager = await ethers.getContract("BasketManagerV3"); // as BasketManagerV3;
    console.log("is valid: ", await basketManager.isValidBasset(basset));
  });

task(
  "basketManager:checkBasketBalanceForDeposit",
  "Checks if ratio of bAssets in basket is within limits to make a deposit of specific asset"
)
  .addParam(
    "basset",
    "Basset address to deposit",
    undefined,
    types.string,
    false
  )
  .addParam(
    "bassetQuantity",
    "Amount of bAssets to deposit",
    undefined,
    types.string,
    false
  )
  .setAction(async ({ basset, bassetQuantity }, hre) => {
    const { ethers } = hre;
    const basketManager = await ethers.getContract("BasketManagerV3"); // as BasketManagerV3;
    console.log(
      "result: ",
      await basketManager.checkBasketBalanceForDeposit(basset, bassetQuantity)
    );
  });

task(
  "basketManager:checkBasketBalanceForWithdrawal",
  "Checks if ratio of bAssets in basket is within limits to make a withdrawal of specific asset"
)
  .addParam(
    "basset",
    "Basset address to redeem",
    undefined,
    types.string,
    false
  )
  .addParam(
    "bassetQuantity",
    "Amount of bAssets to redeem",
    undefined,
    types.string,
    false
  )
  .setAction(async ({ basset, bassetQuantity }, hre) => {
    const { ethers } = hre;
    const basketManager = await ethers.getContract("BasketManagerV3"); // as BasketManagerV3;
    console.log(
      "result: ",
      await basketManager.checkBasketBalanceForWithdrawal(
        basset,
        bassetQuantity
      )
    );
  });

task(
  "basketManager:convertBassetToMassetQuantity",
  "Converts bAsset to mAsset quantity"
)
  .addParam("basset", "Basset address", undefined, types.string, false)
  .addParam(
    "bassetQuantity",
    "Amount of bAssets to check",
    undefined,
    types.string,
    false
  )
  .setAction(async ({ basset, bassetQuantity }, hre) => {
    const { ethers } = hre;
    const basketManager = await ethers.getContract("BasketManagerV3"); // as BasketManagerV3;
    console.log(
      "result: ",
      await basketManager.convertBassetToMassetQuantity(basset, bassetQuantity)
    );
  });

task(
  "basketManager:convertMassetToBassetQuantity",
  "Converts mAsset to bAsset quantity"
)
  .addParam("basset", "Basset address", undefined, types.string, false)
  .addParam(
    "massetQuantity",
    "Amount of mAssets to check",
    undefined,
    types.string,
    false
  )
  .setAction(async ({ basset, massetQuantity }, hre) => {
    const { ethers } = hre;
    const basketManager = await ethers.getContract("BasketManagerV3"); // as BasketManagerV3;
    console.log(
      "result: ",
      await basketManager.convertMassetToBassetQuantity(basset, massetQuantity)
    );
  });

task(
  "basketManager:getTotalMassetBalance",
  "Calculates total mAsset balance"
).setAction(async ({}, hre) => {
  const { ethers } = hre;
  const basketManager = await ethers.getContract("BasketManagerV3"); // as BasketManagerV3;
  console.log(
    "result: ",
    (await basketManager.getTotalMassetBalance()).toString()
  );
});

task("mynt:getBassetBalance", "Calculates total bAsset balance")
  .addParam("basset", "Basset address", undefined, types.string, false)
  .setAction(async ({ basset }, hre) => {
    const { ethers } = hre;
    const basketManager = await ethers.getContract("BasketManagerV3"); // as BasketManagerV3;
    console.log(
      "result: ",
      (await basketManager.getBassetBalance(basset)).toString()
    );
  });

task("mynt:getBMVersion", "Get version of basket manager").setAction(
  async ({}, hre) => {
    const { ethers } = hre;
    const basketManager = await ethers.getContract("BasketManagerV3"); // as BasketManagerV3;
    console.log("result: ", await basketManager.getVersion());
  }
);

task("mynt:getBassets", "Get list of bAssets").setAction(async ({}, hre) => {
  const { ethers } = hre;
  const basketManager = await ethers.getContract("BasketManagerV3"); // as BasketManagerV3;
  console.log(await basketManager.getBassets());
});

task("mynt:getFactor", "Get factor")
  .addParam("basset", "Basset address", undefined, types.string, false)
  .setAction(async ({ basset }, hre) => {
    const { ethers } = hre;
    const basketManager = await ethers.getContract("BasketManagerV3"); // as BasketManagerV3;
    console.log("result: ", (await basketManager.getFactor(basset)).toString());
  });

task("mynt:getRange", "Get range(min,max)")
  .addParam("basset", "Basset address", undefined, types.string, false)
  .setAction(async ({ basset }, hre) => {
    const { ethers } = hre;
    const basketManager = await ethers.getContract("BasketManagerV3"); // as BasketManagerV3;
    console.log("result: ", await basketManager.getRange(basset));
  });

task("mynt:getPaused", "Get paused status of basset")
  .addParam("basset", "Basset address", undefined, types.string, false)
  .setAction(async ({ basset }, hre) => {
    const { ethers } = hre;
    const basketManager = await ethers.getContract("BasketManagerV3"); // as BasketManagerV3;
    console.log("result: ", await basketManager.getPaused(basset));
  });

task(
  "basketManager:getProxyImplementation",
  "Get proxy implementation of basket manager"
).setAction(async ({}, hre) => {
  const { ethers } = hre;
  const basketManager = await ethers.getContract("BasketManagerV3"); // as BasketManagerV3;
  console.log("result: ", await basketManager.getProxyImplementation());
});
