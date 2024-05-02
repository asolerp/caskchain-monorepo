require("@nomiclabs/hardhat-waffle");
require("@nomicfoundation/hardhat-ethers");
require("@openzeppelin/hardhat-upgrades");

require("dotenv").config({ path: `../../.env` });

const { MNEMONIC, BLOCKCHAIN_URL, TARGET_CHAIN_ID } = process.env;

// Opcional, para agregar plugins como en Truffle, si hay equivalentes en Hardhat
// require("hardhat-plugin");

module.exports = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 31337,
    },
    development: {
      url: "http://127.0.0.1:8545",
      chainId: 1337,
    },
    amoy: {
      url: BLOCKCHAIN_URL,
      accounts: {
        mnemonic: MNEMONIC,
      },
      chainId: parseInt(TARGET_CHAIN_ID),
      gasPrice: 10000000000,
      gas: 6721975,
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  mocha: {
    timeout: 20000,
  },
};
