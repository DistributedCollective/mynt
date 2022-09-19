import Logs from "node-logs";

const logger = new Logs().showInConsole(true);

export default (condition: boolean, message?: string): void => {
    if (!condition) {
        const errorMessage = message || "Assertion failed";

        logger.err(`err: ${errorMessage}`);
        throw new Error(errorMessage);
    }
};
