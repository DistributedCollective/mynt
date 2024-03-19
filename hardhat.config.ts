import { HardhatUserConfig, task, extendEnvironment } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

import * as dotenv from "dotenv";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "@nomiclabs/hardhat-web3";
import "@nomicfoundation/hardhat-chai-matchers";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-truffle5";

import "hardhat-deploy";
import "tsconfig-paths/register";
import "@typechain/hardhat";
import "hardhat-docgen";
import "hardhat-contract-sizer";
import "@openzeppelin/hardhat-upgrades";
import "@nomiclabs/hardhat-solhint";

import "./tasks";

//@todo - resolve conflicts in "sovrynsmartcontracts": "git+https://github.com/DistributedCollective/Sovryn-smart-contracts.git"
// install the package
// uncomment the line below to use multisig scripts from the core repo
// import "node_modules/sovrynsmartcontracts/hardhat/tasks/multisig";

/*
 * Test hardhat forking with patched hardhat
 *
 * If you get this error:
 * InvalidResponseError: Invalid JSON-RPC response's result.
 * Errors: Invalid value null supplied to : RpcBlockWithTransactions | null/transactions: RpcTransaction Array/2:
 * RpcTransaction/v: QUANTITY, Invalid value null supplied to : RpcBlockWithTransactions | null/transactions:
 * RpcTransaction Array/2: RpcTransaction/r: QUANTITY, Invalid value null supplied to :
 * RpcBlockWithTransactions | null/transactions: RpcTransaction Array/2: RpcTransaction/s: QUANTITY
 *
 * Then the forking doesn't work correctly (ie. hardhat was not properly patched)
 */

task("check-fork-patch", "Check Hardhat Fork Patch by Rainer").setAction(
  async (taskArgs, hre) => {
    await hre.network.provider.request({
      method: "hardhat_reset",
      params: [
        {
          forking: {
            jsonRpcUrl: "https://mainnet-dev.sovryn.app/rpc",
            blockNumber: 4272658,
          },
        },
      ],
    });
    // const xusd = await IERC20.at("0xb5999795BE0EbB5bAb23144AA5FD6A02D080299F");
    const xusd = await hre.ethers.getContractAt(
      "ERC20",
      "0xb5999795BE0EbB5bAb23144AA5FD6A02D080299F"
    );
    const totalSupply = await xusd.totalSupply();
    if (totalSupply.toString() === "12346114443582774719512874")
      console.log("Hardhat mainnet forking works properly!");
    else console.log("Hardhat mainnet forking does NOT work properly!");
  }
);

dotenv.config();
require("cryptoenv").parse();

const testnetAccounts: any = process.env.TESTNET_DEPLOYER_PRIVATE_KEY
  ? [
      process.env.TESTNET_DEPLOYER_PRIVATE_KEY,
      process.env.TESTNET_SIGNER_PRIVATE_KEY,
      process.env.TESTNET_SIGNER_PRIVATE_KEY_2,
    ]
  : [];
const mainnetAccounts: any = process.env.MAINNET_DEPLOYER_PRIVATE_KEY
  ? [
      process.env.MAINNET_DEPLOYER_PRIVATE_KEY,
      process.env.PROPOSAL_CREATOR_PRIVATE_KEY,
    ]
  : [];

const config: HardhatUserConfig = {
  namedAccounts: {
    deployer: {
      default: 0,
    },
    signer: {
      default: 1,
    },
    signerShared: {
      default: 2,
    },
  },
  networks: {
    development: {
      url: "http://127.0.0.1:8545",
      allowUnlimitedContractSize: true,
      initialBaseFeePerGas: 0,
      blockGasLimit: 6800000,
      // saveDeployments: false
    },
    hardhat: {
      live: false,
      chainId: 31337,
      blockGasLimit: 6800000,
      allowUnlimitedContractSize: true,
      initialBaseFeePerGas: 0,
      gas: 6800000,
      gasPrice: 660000010, // ~66GWei,
    },
    localhost: {
      timeout: 1e6,
    },
    rskDev: {
      from: "0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826",
      url: "http://localhost:4444",
      chainId: 33,
      gasPrice: 2,
      timeout: 1e9,
      gas: 6800000,
    },
    rskSovrynTestnet: {
      chainId: 31,
      accounts: testnetAccounts,
      url: "https://testnet.sovryn.app/rpc",
      gasPrice: 66000010, // 66GWei,
      timeout: 1e9,
      tags: ["testnet"],
    },
    rskTestnet: {
      chainId: 31,
      accounts: testnetAccounts,
      url: "https://public-node.testnet.rsk.co/",
      gasPrice: 66000010, // 66GWei,
      timeout: 1e9,
      tags: ["testnet"],
    },
    rskForkedTestnet: {
      // npx hardhat node --fork https://testnet.sovryn.app/rpc --no-deploy --fork-block-number 3495000
      accounts: testnetAccounts,
      url: "http://127.0.0.1:8545/",
      gas: 6800000,
      tags: ["testnet", "forked"],
    },
    rskSovrynMainnet: {
      chainId: 30,
      accounts: mainnetAccounts,
      url: "https://mainnet-dev.sovryn.app/rpc ",
      gasPrice: 66000010, // ~66GWei,
      blockGasLimit: 6800000,
      timeout: 1e6,
      tags: ["mainnet"],
    },
    rskMainnet: {
      chainId: 30,
      accounts: mainnetAccounts,
      url: "https://public-node.rsk.co/",
      gasPrice: 66000010, // ~66GWei,
      blockGasLimit: 6800000,
      timeout: 1e6,
      tags: ["mainnet"],
    },
    rskForkedMainnet: {
      // npx hardhat node --fork https://mainnet-dev.sovryn.app/rpc --no-deploy --fork-block-number 4929553
      chainId: 31337,
      accounts: mainnetAccounts.length !== 0 ? mainnetAccounts : "remote",
      url: "http://127.0.0.1:8545",
      gas: 6800000,
      gasPrice: 660000010, // ~66GWei,
      tags: ["mainnet", "forked"],
      timeout: 1e6,
    },
    coverage: {
      url: "http://127.0.0.1:7546",
      gas: 0xfffffffffff, // <-- Use this high gas value
      gasPrice: 0x01, // <-- Use this low gas price
    },
    ropsten: {
      accounts: {
        mnemonic:
          "seek danger physical menu pen arrest clutch blade weird detect digital frog",
        initialIndex: 0,
        count: 3,
      },
      url: `https://ropsten.infura.io/v3/42af85fbc97845a0974cbbf003834c28`,
      chainId: 3,
      gasPrice: 1000000000, // 100 GWei,
      gas: 70000000,
      timeout: 160000,
    },
    rinkeby: {
      accounts: {
        mnemonic:
          "seek danger physical menu pen arrest clutch blade weird detect digital frog",
        initialIndex: 0,
        count: 3,
      },
      url: "https://rinkeby.infura.io/v3/4326f844557341a89a24bdcfc571fc10",
      chainId: 4,
      gasPrice: 1000000000, // 100 GWei,
      gas: 2000000,
      timeout: 160000,
    },
    kovan: {
      accounts: {
        mnemonic:
          "seek danger physical menu pen arrest clutch blade weird detect digital frog",
        initialIndex: 0,
        count: 42,
      },
      url: "wss://kovan.infura.io/ws/v3/42af85fbc97845a0974cbbf003834c28",
      chainId: 42,
      gasPrice: 20000000000, // 20 GWei,
      gas: 2000000,
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.5.17",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.8.17",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
          outputSelection: {
            "*": {
              "*": ["storageLayout"],
            },
          },
        },
      },
    ],
  },
  paths: {
    sources: "./contracts",
    tests: "./tests",
    deploy: "./deployment/deploy",
    deployments: "./deployment/deployments",
  },
  gasReporter: {
    currency: "USD",
    gasPrice: 30,
  },
  mocha: {
    timeout: 240000, // 4 min timeout
  },
  typechain: {
    outDir: "types/generated",
    target: "ethers-v5",
    externalArtifacts: ["external/artifacts/*.sol/!(*.dbg.json)"], // optional array of glob patterns with external artifacts to process (for example external libs from node_modules)
  },
  external: {
    contracts: [
      {
        artifacts: "external/artifacts/*.sol/!(*.dbg.json)",
        // deploy: "node_modules/@cartesi/arbitration/export/deploy",
      },
      {
        artifacts: "external/artifacts",
        // deploy: "node_modules/@cartesi/arbitration/export/deploy",
      },
      /* {
        artifacts: "node_modules/someotherpackage/artifacts",
      }, */
    ],
    deployments: {
      rskSovrynTestnet: ["external/deployments/rskTestnet"],
      rskTestnet: [
        "external/deployments/rskTestnet",
        "deployment/deployments/rskSovrynTestnet",
      ],
      rskForkedTestnet: [
        "external/deployments/rskTestnet",
        "deployment/deployments/rskSovrynTestnet",
      ],
      rskSovrynMainnet: ["external/deployments/rskMainnet"],
      rskMainnet: [
        "external/deployments/rskMainnet",
        "deployment/deployments/rskSovrynMainnet",
      ],
      rskForkedMainnet: [
        "external/deployments/rskMainnet",
        "deployment/deployments/rskSovrynMainnet",
      ],
    },
  },
  /* tenderly: {
    username: "mStable",
    project: "mStable-contracts",
  }, */
  contractSizer: {
    alphaSort: true,
    disambiguatePaths: false,
  },
  docgen: {
    path: "./docs",
    clear: true,
    runOnCompile: true,
  },
};

export default config;
