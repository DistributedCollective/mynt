/* eslint-disable no-continue */
/* eslint-disable no-restricted-syntax */
import fs, { promises as fsPromises } from "fs";
import Logs from "node-logs";
import readline from "readline";

const logger = new Logs().showInConsole(true);

type StakerInfo = Record<"address" | "power", string>;

let fd: fsPromises.FileHandle;
const newStakersJoined: string[] = [];

const main = async (): Promise<void> => {
  fd = await fsPromises.open("addressList_joined", "a+");
  const csvContent = await fd.readFile();
  if (csvContent.length === 0) {
    fd.write("Address,VotingPower\n");
    logger.info(`Initializing CSV`);
  }

  const newStakersInfo = await readNewAddresses();

  const fileStream = fs.createReadStream("addressList_2_unique_copy");
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    const [address, power] = line.split(",");

    if (isLineValid(address, power)) {
      await saveUpdatedStaker({ address, power }, newStakersInfo);
    }
  }

  const restOfStakers = newStakersInfo.filter(
    ({ address }) => !newStakersJoined.includes(address)
  );

  logger.success(`Found ${newStakersJoined.length} stakers to update`);
  logger.success(`Appending rest of ${restOfStakers.length} stakers`);

  await appendRestOfNewStakers(restOfStakers);
};

const readNewAddresses = async (): Promise<StakerInfo[]> => {
  const stakersInfo: StakerInfo[] = [];
  const fileStream = fs.createReadStream("addressList_extend_unique_copy");

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    const [address, power] = line.split(",");

    if (isLineValid(address, power)) {
      stakersInfo.push({ address, power });
    }
  }

  return stakersInfo;
};

const saveUpdatedStaker = async (
  oldData: StakerInfo,
  newStakers: StakerInfo[]
): Promise<void> => {
  const updatedStaker = newStakers.find(
    ({ address }) => address === oldData.address
  );

  if (updatedStaker) {
    if (!newStakersJoined.includes(updatedStaker.address)) {
      fd.write(`${updatedStaker.address},${updatedStaker.power}\n`);

      logger.warn(
        `Updating staker and adding old staker: ${updatedStaker.address}`
      );
      newStakersJoined.push(updatedStaker.address);
    } else {
      logger.err(`Duplacate: ${updatedStaker.address}`);
    }

    return;
  }

  fd.write(`${oldData.address},${oldData.power}\n`);
  logger.info(`Adding old staker: ${oldData.address}`);
};

const appendRestOfNewStakers = async (
  restOfStakers: StakerInfo[]
): Promise<void> => {
  for (const { address, power } of restOfStakers) {
    fd.write(`${address},${power}\n`);

    logger.warn(`Appending new staker: ${address}`);
  }
};

const isLineValid = (address: string, power: string): boolean => {
  if (!address || !power) return false; // ignore empty lines
  if (address === "Address") return false; // ignore header

  return true;
};

main();
