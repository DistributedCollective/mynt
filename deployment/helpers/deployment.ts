import hre from "hardhat";

/// @dev This file requires HardhatRuntimeEnvironment `hre` variable in its parent context for functions using hre to work

import col from "cli-color";
import { sendWithMultisig } from "../../scripts/helpers/helpers";
import {
  MyntAdminProxy,
  TransparentUpgradeableProxy,
} from "../../types/generated";

const {
  deployments: { deploy, get, log, save },
  ethers,
} = hre;

const upgradeWithTransparentUpgradableProxy = async (
  deployer,
  logicArtifactName, // logic contract artifact name
  proxyArtifactName, // proxy deployment name
  logicInstanceName: string | undefined = undefined, // save logic implementation as
  proxyInstanceName: string | undefined = undefined, // save proxy implementation as
  proxyAdminName = "MyntAdminProxy", // proxy admin implementation
  forceOwnerIsMultisig = false, // overrides network dependency
  args: string[] = [],
  multisigName = "MultiSigWallet"
) => {
  proxyInstanceName = proxyInstanceName === "" ? undefined : proxyInstanceName;
  logicInstanceName = logicInstanceName === "" ? undefined : logicInstanceName;

  const proxyAdminDeployment = await get(proxyAdminName);
  const proxyAdmin = await ethers.getContract(proxyAdminName);

  const proxyName = proxyInstanceName ?? proxyArtifactName; // support multiple deployments of the same artifact

  const logicName = logicInstanceName ?? logicArtifactName;
  const logicImplName = `${logicName}_Implementation`; // naming convention like in hh deployment
  const logicDeploymentTx = await deploy(logicImplName, {
    contract: logicArtifactName,
    from: deployer,
    args: args,
    log: true,
  });

  const proxy: TransparentUpgradeableProxy = await ethers.getContract(
    proxyName
  );
  const proxyDeployment = await get(proxyName);
  const prevImpl = await proxyAdmin.getProxyImplementation(proxy.address);
  log(`Current ${proxyName} implementation: ${prevImpl}`);

  if (
    logicDeploymentTx.newlyDeployed ||
    logicDeploymentTx.address !== prevImpl
  ) {
    log(
      `New ${proxyName} implementation: ${logicImplName} @ ${logicDeploymentTx.address}`
    );
    await save(logicName, {
      address: proxy.address,
      implementation: logicDeploymentTx.address,
      abi: logicDeploymentTx.abi,
      bytecode: logicDeploymentTx.bytecode,
      deployedBytecode: logicDeploymentTx.deployedBytecode,
      devdoc: logicDeploymentTx.devdoc,
      userdoc: logicDeploymentTx.userdoc,
      storageLayout: logicDeploymentTx.storageLayout,
    });

    if (hre.network.tags.testnet || hre.network.tags.mainnet) {
      if (hre.network.tags.testnet || forceOwnerIsMultisig) {
        // multisig is the owner
        const multisigDeployment = await get(multisigName);
        // @todo wrap getting ms tx data into a helper
        const proxyAdminInterface = new ethers.utils.Interface(
          proxyAdminDeployment.abi
        );
        const data = proxyAdminInterface.encodeFunctionData("upgrade", [
          proxyDeployment.address,
          logicDeploymentTx.address,
        ]);
        log(
          `Creating multisig tx to set ${logicArtifactName} (${logicDeploymentTx.address}) as implementation for ${proxyName} (${proxyDeployment.address}...`
        );
        log();
        await sendWithMultisig(
          hre,
          multisigDeployment.address,
          proxyAdminDeployment.address,
          data,
          deployer
        );
        log(
          col.bgBlue(
            `>>> DONE. Requires Multisig (${multisigDeployment.address}) signing to execute tx <<<
                 >>> DON'T PUSH DEPLOYMENTS TO THE REPO UNTIL THE MULTISIG TX SUCCESSFULLY SIGNED & EXECUTED <<<`
          )
        );
      } else if (hre.network.tags.mainnet) {
        log(">>> Create a Bitocracy proposal via SIP <<<");
        log(
          col.bgBlue(
            "Prepare and run SIP function in sips.js to create the proposal with args:"
          )
        );
        const sipArgs = {
          targets: [proxyAdminDeployment.address],
          values: [0],
          signatures: ["upgrade(address,address)"],
          data: [
            ethers.utils.defaultAbiCoder.encode(
              ["address", "address"],
              [proxyDeployment.address, logicDeploymentTx.address]
            ),
          ],
        };
        log(col.yellowBright(JSON.stringify(sipArgs)));
        log(
          ">>> DON'T MERGE DEPLOYMENTS TO THE MAIN (DEVELOPMENT) BRANCH UNTIL THE SIP IS SUCCESSFULLY EXECUTED <<<`"
        );
        // governance is the owner - need a SIP to register
        // TODO: implementation ; meanwhile use brownie sip_interaction scripts to create proposal
      }
    } else {
      // eslint-disable-next-line no-shadow
      const adminProxy: MyntAdminProxy = await ethers.getContractAt(
        proxyName,
        proxyDeployment.address
      );
      await adminProxy.upgrade(
        proxyDeployment.address,
        logicDeploymentTx.address
      );
      log(
        `>>> New implementation ${await adminProxy.getProxyImplementation(
          proxyDeployment.address
        )} is set to the proxy <<<`
      );
    }
    log();
  }
};

export { upgradeWithTransparentUpgradableProxy };
