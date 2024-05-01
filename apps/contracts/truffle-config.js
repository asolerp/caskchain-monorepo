const dotenv = require("dotenv");
dotenv.config({ path: `../../.env` });

const { MNEMONIC, BLOCKCHAIN_URL, PUBLIC_KEY, TARGET_CHAIN_ID } = process.env;

const HDWalletProvider = require("@truffle/hdwallet-provider");

module.exports = {
  plugins: ["truffle-contract-size"],
  contracts_build_directory: "./build/contracts",
  networks: {
    development: {
      host: "127.0.0.1", // Localhost (default: none)
      port: 8545, // Standard Ethereum port (default: none)
      network_id: "*", // Any network (default: none)
    },
    amoi: {
      provider: () => new HDWalletProvider(MNEMONIC, BLOCKCHAIN_URL),
      from: PUBLIC_KEY,
      network_id: TARGET_CHAIN_ID,
      gasPrice: 10000000000,
      gas: 6721975,
    },
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.17", // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      settings: {
        // See the solidity docs for advice about optimization and evmVersion
        optimizer: {
          enabled: true,
          runs: 200,
        },
        //  evmVersion: "byzantium"
      },
    },
  },
};
