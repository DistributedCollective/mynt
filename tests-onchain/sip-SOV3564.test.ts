// first run a local forked mainnet node in a separate terminal window:
//     npx hardhat node --fork https://mainnet-dev.sovryn.app/rpc --no-deploy
// now run the test:
//     npx hardhat test tests-onchain/sip-sov3564.test.ts --network rskForkedMainnet
const chai = require("chai");
const { expect } = chai;

import {
  mine,
  mineUpTo,
  time,
  setBalance,
  reset,
  SnapshotRestorer,
  takeSnapshot,
} from "@nomicfoundation/hardhat-network-helpers";
import { JsonRpcSigner } from "@ethersproject/providers";
import hre from "hardhat";

const {
  ethers,
  deployments,
  deployments: { createFixture },
} = hre;

const MAX_DURATION = ethers.BigNumber.from(24 * 60 * 60).mul(1092);
const ONE_RBTC = ethers.utils.parseEther("1.0");

describe("SIP-Sov3564 onchain test", () => {
  const getImpersonatedSignerFromJsonRpcProvider = async (
    addressToImpersonate
  ) => {
    //await impersonateAccount(addressToImpersonate);
    //await ethers.provider.send("hardhat_impersonateAccount", [addressToImpersonate]);
    //return await ethers.getSigner(addressToImpersonate);
    const provider = new ethers.providers.JsonRpcProvider(
      "http://localhost:8545"
    );
    await provider.send("hardhat_impersonateAccount", [addressToImpersonate]);
    //return await ethers.getSigner(addressToImpersonate);
    return provider.getSigner(addressToImpersonate);
  };

  const setupTest = createFixture(async ({ deployments, getNamedAccounts }) => {
    let { deployer } = await getNamedAccounts();

    if (!deployer) {
      deployer = (await ethers.getSigners())[0].address;
    }

    console.log("deployer:", deployer);

    const deployerSigner = await ethers.getSigner(deployer);
    await setBalance(deployer, ONE_RBTC.mul(10));
    /*await deployments.fixture(["StakingModules", "StakingModulesProxy"], {
            keepExistingDeployments: true,
        }); // start from a fresh deployments
        */
    const stakingProxy = await ethers.getContract("StakingProxy", deployer);
    const stakingModulesProxy = await ethers.getContract(
      "StakingModulesProxy",
      deployer
    );

    const god = await deployments.get("GovernorOwner");
    const governorOwner = await ethers.getContract("GovernorOwner");
    /*const governorOwner = await ethers.getContractAt(
            "GovernorAlpha",
            god.address,
            deployerSigner
        );*/
    const governorOwnerSigner: JsonRpcSigner =
      (await getImpersonatedSignerFromJsonRpcProvider(
        god.address
      )) as JsonRpcSigner;

    await setBalance(governorOwnerSigner._address, ONE_RBTC);
    const timelockOwner = await ethers.getContract(
      "TimelockOwner",
      governorOwnerSigner
    );

    const timelockOwnerSigner: JsonRpcSigner =
      (await getImpersonatedSignerFromJsonRpcProvider(
        timelockOwner.address
      )) as JsonRpcSigner;
    await setBalance(timelockOwnerSigner._address, ONE_RBTC);

    const multisigSigner: JsonRpcSigner =
      (await getImpersonatedSignerFromJsonRpcProvider(
        (
          await deployments.get("MultiSigWallet")
        ).address
      )) as JsonRpcSigner;
    //
    return {
      deployer,
      deployerSigner,
      stakingProxy,
      stakingModulesProxy,
      governorOwner,
      governorOwnerSigner,
      timelockOwner,
      timelockOwnerSigner,
      multisigSigner,
    };
  });
  let snapshot: SnapshotRestorer;
  before(async () => {
    await reset("https://mainnet-dev.sovryn.app/rpc", 5942272);
    snapshot = await takeSnapshot();
  });
  async () => {
    await snapshot.restore();
  };

  it("SIP-Sov3564 is executable", async () => {
    if (!hre.network.tags["forked"]) return;
    const {
      deployer,
      deployerSigner,
      stakingProxy,
      governorOwner,
      timelockOwnerSigner,
      multisigSigner,
    } = await setupTest();
    // loadFixtureAfterEach = true;
    // CREATE PROPOSAL
    //console.log("deploying new contracts...");
    // await deployments.fixture(
    //   [
    //     "BasketManager",
    //     "MassetManager",
    //     "FeesManager",
    //     "FeesVault",
    //     "MocIntegration",
    //   ],
    //   {
    //     keepExistingDeployments: true,
    //   }
    // );
    //console.log("DONE deploying new contracts...");
    const sov = await ethers.getContract("SOV", timelockOwnerSigner);
    const whaleAmount = (await sov.totalSupply()).mul(ethers.BigNumber.from(5));
    await sov.mint(deployerSigner.address, whaleAmount);

    /*
            const quorumVotes = await governorOwner.quorumVotes();
            console.log('quorumVotes:', quorumVotes);
            */
    await sov
      .connect(deployerSigner)
      .approve(stakingProxy.address, whaleAmount);
    //const stakeABI = (await hre.artifacts.readArtifact("IStaking")).abi;
    const stakeABI = (await deployments.getArtifact("IStaking")).abi;
    // const stakeABI = (await ethers.getContractFactory("IStaking")).interface;
    // alternatively for stakeABI can be used human readable ABI:
    /*const stakeABI = [
                'function stake(uint96 amount,uint256 until,address stakeFor,address delegatee)',
                'function pauseUnpause(bool _pause)',
                'function paused() view returns (bool)'
            ];*/
    const staking = await ethers.getContractAt(
      stakeABI,
      stakingProxy.address,
      deployerSigner
    );
    /*const multisigSigner = await getImpersonatedSignerFromJsonRpcProvider(
                (
                    await get("MultiSigWallet")
                ).address
            );*/
    if (await staking.paused())
      await staking.connect(multisigSigner).pauseUnpause(false);
    const kickoffTS = await stakingProxy.kickoffTS();
    await staking.stake(
      whaleAmount,
      kickoffTS.add(MAX_DURATION),
      deployer,
      deployer
    );
    await mine();

    // CREATE PROPOSAL AND VERIFY
    const proposalIdBeforeSIP = await governorOwner.proposalCount();
    await hre.run("mynt-sips:create", {
      argsFunc: "SIPSOV3564",
    });
    const proposalId = await governorOwner.latestProposalIds(deployer);
    expect(
      proposalId.toNumber(),
      "Proposal was not created. Check the SIP creation is not commented out."
    ).equals(proposalIdBeforeSIP.toNumber() + 1);

    // VOTE FOR PROPOSAL
    console.log("voting for proposal");
    await mine();
    await governorOwner.connect(deployerSigner).castVote(proposalId, true);

    // QUEUE PROPOSAL
    let proposal = await governorOwner.proposals(proposalId);

    await mineUpTo(proposal.endBlock);
    await mine();

    await governorOwner.queue(proposalId);

    // EXECUTE PROPOSAL
    proposal = await governorOwner.proposals(proposalId);
    await time.increaseTo(proposal.eta);
    console.log("executing proposal");
    await expect(governorOwner.execute(proposalId))
      .to.emit(governorOwner, "ProposalExecuted")
      .withArgs(proposalId);

    // VALIDATE EXECUTION

    expect((await governorOwner.proposals(proposalId)).executed).to.be.true;

    const {
      deployments: { get },
    } = hre;
    const miProxyDeployment = await get("MocIntegration_Proxy");
    const miDeployment = await get("MocIntegration");

    const myntAdminProxy = await ethers.getContract("MyntAdminProxy");

    /** VALIDATE MOC NEW IMPLEMENTATION */
    expect(
      await myntAdminProxy.getProxyImplementation(miProxyDeployment.address)
    ).to.equal(miDeployment.implementation);
  });
});