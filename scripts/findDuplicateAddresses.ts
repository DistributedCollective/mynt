/* eslint-disable no-continue */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-restricted-syntax */
import fs from "fs";
import Logs from "node-logs";
import readline from "readline";

const logger = new Logs().showInConsole(true);

type StakerInfo = Record<"address" | "power", string>;

const main = async (): Promise<void> => {
    const stakers: StakerInfo[] = [];
    const addresses: string[] = [];

    const fileStream = fs.createReadStream("addressList_joined");
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    for await (const line of rl) {
        const [address, power] = line.split(",");

        if (isLineValid(address, power)) {
            stakers.push({ address, power });
            addresses.push(address);
        }
    }

    const duplicateAddresses = findDuplicates(addresses);

    logger.error({ duplicateAddresses });
};

const  findDuplicates = (arr: string[]): string[] => arr.filter((item, index) => arr.indexOf(item) !== index);

const isLineValid = (address: string, power: string): boolean => {
    if (!address || !power) return false; // ignore empty lines
    if (address === "Address") return false; // ignore header

    return true;
};

main();
