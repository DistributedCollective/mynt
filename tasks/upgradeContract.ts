import { task } from "hardhat/config";
import * as helpers from "../scripts/utils/helpers";
import { _createSIP } from "./sips/createSIP";
import { ISipArgument } from "./sips/args/SIPArgs";

task("upgrade:massetManager", "Upgrade implementation of massetManager contract")
.addOptionalParam("isMultisig", "flag if transaction needs to be intiated from the multisig contract")
.addOptionalParam("isSIP", "flag if transaction needs to be initiated from the SIP")
.setAction(async ({ isMultisig, isSIP }, hre) => {
  helpers.injectHre(hre);
  const { ethers, deployments: { get }, getNamedAccounts } = hre;
  const { deployer } = await getNamedAccounts();
  const myntAdminProxy = await ethers.getContract("MyntAdminProxy");
  const massetManagerProxy = await ethers.getContract("MassetManager");

  const MassetManagerFactory = await ethers.getContractFactory("MassetManager");
  const newMassetManagerImpl = await MassetManagerFactory.deploy();
  console.log(`Upgrading massetManager implementation to ${newMassetManagerImpl.address}`)

  if(isMultisig) {
    const multisigAddress = (await get("MultisigWallet")).address;
    const dataUpgrade = myntAdminProxy.interface.encodeFunctionData("upgrade", [
      massetManagerProxy.address, newMassetManagerImpl.address
    ]);

    await helpers.sendWithMultisig(
      multisigAddress,
      myntAdminProxy.address,
      dataUpgrade,
      deployer
    );
  } else if(isSIP) {
    const signatureUpgrade = "upgrade(address,address)";
    const dataUpgrade = myntAdminProxy.interface.encodeFunctionData("upgrade", [
      massetManagerProxy.address, newMassetManagerImpl.address
    ]);

    const sipArgs: ISipArgument = {
      targets: [massetManagerProxy.address],
      values: [0],
      signatures: [signatureUpgrade],
      data: [dataUpgrade],
      description: "Upgrade masset manager contract"
    }

    _createSIP(hre, sipArgs);
  }
});

task("upgrade:feesVault", "Upgrade implementation of feesVault contract")
.addOptionalParam("isMultisig", "flag if transaction needs to be intiated from the multisig contract")
.addOptionalParam("isSIP", "flag if transaction needs to be initiated from the SIP")
.setAction(async ({ isMultisig, isSIP }, hre) => {
  helpers.injectHre(hre);
  const { ethers, deployments: { get }, getNamedAccounts } = hre;
  const { deployer } = await getNamedAccounts();
  const myntAdminProxy = await ethers.getContract("MyntAdminProxy");
  const feesVaultProxy = await ethers.getContract("FeesVault");

  const FeesVaultFactory = await ethers.getContractFactory("FeesVault");
  const newFeesVaultImpl = await FeesVaultFactory.deploy();
  console.log(`Upgrading feesVault implementation to ${newFeesVaultImpl.address}`)

  if(isMultisig) {
    const multisigAddress = (await get("MultisigWallet")).address;
    const dataUpgrade = myntAdminProxy.interface.encodeFunctionData("upgrade", [
      feesVaultProxy.address, newFeesVaultImpl.address
    ]);

    await helpers.sendWithMultisig(
      multisigAddress,
      myntAdminProxy.address,
      dataUpgrade,
      deployer
    );
  } else if(isSIP) {
    const signatureUpgrade = "upgrade(address,address)";
    const dataUpgrade = myntAdminProxy.interface.encodeFunctionData("upgrade", [
      feesVaultProxy.address, newFeesVaultImpl.address
    ]);

    const sipArgs: ISipArgument = {
      targets: [feesVaultProxy.address],
      values: [0],
      signatures: [signatureUpgrade],
      data: [dataUpgrade],
      description: "Upgrade fees vault contract"
    }

    _createSIP(hre, sipArgs);
  }
});

task("upgrade:feesManager", "Upgrade implementation of feesManager contract")
.addOptionalParam("isMultisig", "flag if transaction needs to be intiated from the multisig contract")
.addOptionalParam("isSIP", "flag if transaction needs to be initiated from the SIP")
.setAction(async ({ isMultisig, isSIP }, hre) => {
  helpers.injectHre(hre);
  const { ethers, deployments: { get }, getNamedAccounts } = hre;
  const { deployer } = await getNamedAccounts();
  const myntAdminProxy = await ethers.getContract("MyntAdminProxy");
  const feesManagerProxy = await ethers.getContract("FeesManager");

  const FeesManagerFactory = await ethers.getContractFactory("FeesManager");
  const newFeesManagerImpl = await FeesManagerFactory.deploy();
  console.log(`Upgrading feesManager implementation to ${newFeesManagerImpl.address}`)

  if(isMultisig) {
    const multisigAddress = (await get("MultisigWallet")).address;
    const dataUpgrade = myntAdminProxy.interface.encodeFunctionData("upgrade", [
      feesManagerProxy.address, newFeesManagerImpl.address
    ]);

    await helpers.sendWithMultisig(
      multisigAddress,
      myntAdminProxy.address,
      dataUpgrade,
      deployer
    );
  } else if(isSIP) {
    const signatureUpgrade = "upgrade(address,address)";
    const dataUpgrade = myntAdminProxy.interface.encodeFunctionData("upgrade", [
      feesManagerProxy.address, newFeesManagerImpl.address
    ]);

    const sipArgs: ISipArgument = {
      targets: [feesManagerProxy.address],
      values: [0],
      signatures: [signatureUpgrade],
      data: [dataUpgrade],
      description: "Upgrade fees manager contract"
    }

    _createSIP(hre, sipArgs);
  }
});

task("upgrade:basketManager", "Upgrade implementation of basketManager contract")
.addOptionalParam("isMultisig", "flag if transaction needs to be intiated from the multisig contract")
.addOptionalParam("isSIP", "flag if transaction needs to be initiated from the SIP")
.setAction(async ({ isMultisig, isSIP }, hre) => {
  helpers.injectHre(hre);
  const { ethers, deployments: { get }, getNamedAccounts } = hre;
  const { deployer } = await getNamedAccounts();
  const myntAdminProxy = await ethers.getContract("MyntAdminProxy");
  const basketManagerProxy = await ethers.getContract("BasketManagerV3"); // basketManagerV3

  const BasketManagerFactory = await ethers.getContractFactory("BasketManagerV3");
  const newBasketManagerImpl = await BasketManagerFactory.deploy();
  console.log(`Upgrading basket manager implementation to ${newBasketManagerImpl.address}`)

  if(isMultisig) {
    const multisigAddress = (await get("MultisigWallet")).address;
    const dataUpgrade = myntAdminProxy.interface.encodeFunctionData("upgrade", [
      basketManagerProxy.address, newBasketManagerImpl.address
    ]);

    await helpers.sendWithMultisig(
      multisigAddress,
      myntAdminProxy.address,
      dataUpgrade,
      deployer
    );
  } else if(isSIP) {
    const signatureUpgrade = "upgrade(address,address)";
    const dataUpgrade = myntAdminProxy.interface.encodeFunctionData("upgrade", [
      basketManagerProxy.address, newBasketManagerImpl.address
    ]);

    const sipArgs: ISipArgument = {
      targets: [basketManagerProxy.address],
      values: [0],
      signatures: [signatureUpgrade],
      data: [dataUpgrade],
      description: "Upgrade fees vault contract"
    }

    _createSIP(hre, sipArgs);
  }
});
