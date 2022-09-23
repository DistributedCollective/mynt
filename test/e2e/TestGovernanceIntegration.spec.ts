import Logs from "node-logs";
import { deployments, network, run, web3 } from "hardhat";

import envSetup from "@utils/env_setup";
import { ZERO_ADDRESS } from "@utils/constants";
import { TransferOwnershipParams } from "scripts/tasks/transferOwnership";
import {
  blockTimestampSimple,
  mineBlock,
  wait,
  waitOrMineBlocks
} from "scripts/utils/time";
import { DeploymentTags } from "migrations/utils/DeploymentTags";
import { Instances, isDevelopmentNetwork } from "migrations/utils/addresses";
import {
  setNetwork,
  getDeployed,
  clearState,
  getInfo
} from "migrations/utils/state";
import { ERC20MintableInstance, StakingInstance } from "types/generated";

const Token = artifacts.require("Token");
const BasketManagerV3 = artifacts.require("BasketManagerV3");
const GovernorAlpha = artifacts.require("GovernorAlpha");
const Staking = artifacts.require("Staking");
const ERC20Mintable = artifacts.require("ERC20Mintable");
const Timelock = artifacts.require("Timelock");

const { expect } = envSetup.configure();
const logger = new Logs().showInConsole(true);

enum ProposalState {
  Pending,
  Active,
  Canceled,
  Defeated,
  Succeeded,
  Queued,
  Expired,
  Executed
}
const instance: Instances = "MYNT";

contract("Governance", async accounts => {
  const [owner, voter1, voter2] = accounts;

  let token: ERC20MintableInstance;
  let staking: StakingInstance;

  before("before all", async () => {
    setNetwork(network.name);

    if (isDevelopmentNetwork(network.name)) {
      // run migrations
      await clearState();
      await deployments.fixture(DeploymentTags.Migration);
      await deployments.fixture(DeploymentTags.MyntToken);
      await deployments.fixture(DeploymentTags.FishToken);
      await deployments.fixture(DeploymentTags.Governance);

      // set proper admin
      const setAdminEta = await getInfo(`${instance}_Timelock`, "setAdminEta");
      logger.info("Time travel to surpass delay");
      await mineBlock(network.provider, setAdminEta);

      await run("transferAdmin");

      // transfer ownership of selected contracts
      const contractsList: TransferOwnershipParams = {
        contracts: [`${instance}_BasketManagerV3`],
        instance
      };
      await run("transferOwnership", contractsList);
      // mint tokens for owner
      staking = await getDeployed(Staking, `${instance}_StakingProxy`);

      const tokenAddress = await staking.SOVToken();
      token = await ERC20Mintable.at(tokenAddress);

      await token.mint(owner, "10000000000000000", { from: owner });
    }
  });

  it("add new basset by voting", async () => {
    network.provider.send("evm_mine");

    const governorAlpha = await getDeployed(
      GovernorAlpha,
      `${instance}_GovernorAlpha`
    );
    const basketManager = await getDeployed(
      BasketManagerV3,
      `${instance}_BasketManagerV3`
    );
    const timelock = await getDeployed(Timelock, `${instance}_Timelock`);

    const votingDelay = await governorAlpha.votingDelay();
    const votingPeriod = await governorAlpha.votingPeriod();
    const timelockDelay = await timelock.delay();

    const stakeAddress: string = await getInfo(
      `${instance}_StakingProxy`,
      "address"
    );
    const basketManagerAddress: string = await getInfo(
      `${instance}_BasketManagerV3`,
      "address"
    );

    const stakeAmount = 1000000;
    const stakeUntilDate = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 * 3;

    const stake = async (address: string, amount: number): Promise<void> => {
      await token.transfer(address, amount, { from: owner });
      await token.approve(stakeAddress, amount, { from: address });
      await staking.stake(amount, stakeUntilDate, ZERO_ADDRESS, ZERO_ADDRESS, {
        from: address
      });
    };

    await token.approve(stakeAddress, stakeAmount);
    await staking.stake(
      stakeAmount,
      stakeUntilDate,
      ZERO_ADDRESS,
      ZERO_ADDRESS
    );

    await stake(voter1, stakeAmount / 500);
    await stake(voter2, stakeAmount);

    const targets = [basketManagerAddress];
    const values = [0];
    const newBasset = await Token.new("TEST", "TST", 18);
    const signatures = [
      "addBasset(address,int256,address,uint256,uint256,bool)"
    ];
    const calldatas = [
      web3.eth.abi.encodeParameters(
        ["address", "int256", "address", "uint256", "uint256", "bool"],
        [newBasset.address, 1, ZERO_ADDRESS, 0, 1000, false]
      )
    ];

    await governorAlpha.propose(
      targets,
      values,
      signatures,
      calldatas,
      "test propsal"
    );
    const latestProposal = await governorAlpha.latestProposalIds(owner);

    let proposalState = (await governorAlpha.state(latestProposal)).toNumber();
    expect(proposalState).to.eq(
      ProposalState.Pending,
      "proposal should be pending"
    );

    await waitOrMineBlocks(
      network.provider,
      web3,
      votingDelay.toNumber() + 1,
      isDevelopmentNetwork(network.name)
    );

    proposalState = (await governorAlpha.state(latestProposal)).toNumber();
    expect(proposalState).to.eq(
      ProposalState.Active,
      "proposal should be active"
    );

    await governorAlpha.castVote(latestProposal, true);
    await governorAlpha.castVote(latestProposal, true, { from: voter1 });
    await governorAlpha.castVote(latestProposal, false, { from: voter2 });

    const [
      ,
      startBlock,
      ,
      forVotes,
      againstVotes,
      ,
      ,
      ,
      startTime
    ] = await governorAlpha.proposals(latestProposal);
    const ownerForVotes = await staking.getPriorVotes(
      owner,
      startBlock,
      startTime
    );
    const voter1ForVotes = await staking.getPriorVotes(
      voter1,
      startBlock,
      startTime
    );
    const voter2AgainstVotes = await staking.getPriorVotes(
      voter2,
      startBlock,
      startTime
    );

    expect(forVotes).to.bignumber.eq(
      ownerForVotes.add(voter1ForVotes),
      "not a proper number of for votes"
    );
    expect(againstVotes).to.bignumber.eq(
      voter2AgainstVotes,
      "not a proper number of against votes"
    );

    proposalState = (await governorAlpha.state(latestProposal)).toNumber();
    expect(proposalState).to.eq(
      ProposalState.Active,
      "proposal should be active until the end of voting period"
    );

    await waitOrMineBlocks(
      network.provider,
      web3,
      votingPeriod.toNumber(),
      isDevelopmentNetwork(network.name)
    );

    proposalState = (await governorAlpha.state(latestProposal)).toNumber();
    expect(proposalState).to.eq(
      ProposalState.Succeeded,
      "proposal should be succeeded"
    );

    await governorAlpha.queue(latestProposal);

    proposalState = (await governorAlpha.state(latestProposal)).toNumber();
    expect(proposalState).to.eq(
      ProposalState.Queued,
      "proposal should be queued"
    );

    const delay = timelockDelay.toNumber();

    if (isDevelopmentNetwork(network.name)) {
      const currTimestamp = await blockTimestampSimple(web3);
      logger.info("Time travel to surpass delay");
      await mineBlock(network.provider, Number(currTimestamp) + delay);
    } else {
      logger.info(`Waiting ${delay} seconds to surpass delay`);
      await wait(delay * 1000);
    }

    await governorAlpha.execute(latestProposal);

    proposalState = (await governorAlpha.state(latestProposal)).toNumber();
    expect(proposalState).to.eq(
      ProposalState.Executed,
      "proposal should be executed"
    );

    const bassetsList = await basketManager.getBassets();

    expect(bassetsList.includes(newBasset.address)).to.eq(
      true,
      "new basset should be added"
    );

    logger.success("Test Completed!");
  });
});
