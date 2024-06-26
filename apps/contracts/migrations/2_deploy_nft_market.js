const dotenv = require("dotenv");
// const { insertInEnvFile } = require("../utils/helpers");
dotenv.config({ path: `../../../.env` });
const { deployProxy } = require("@openzeppelin/truffle-upgrades");

const MockUSDT = artifacts.require("MockUSDT");
const PriceOracle = artifacts.require("PriceOracle");

const CCNft = artifacts.require("CCNft");
const CCNftStorage = artifacts.require("CCNftStorage");

const NftVendor = artifacts.require("NftVendor");
const NftVendorStorage = artifacts.require("NftVendorStorage");

const NftOffers = artifacts.require("NftOffers");
const NftOffersStorage = artifacts.require("NftOffersStorage");

const CREATOR_ADDRESS = process.env.PUBLIC_KEY;

const timeout = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

module.exports = function (deployer) {
  deployer.then(async () => {
    await deployer.deploy(MockUSDT, "10000000000000000000000000");

    // const priceOracle = await deployer.deploy(PriceOracle);

    // await timeout(10000);

    const ccNftStorage = await deployer.deploy(CCNftStorage);

    const collection = await deployProxy(CCNft, [ccNftStorage.address], {
      deployer,
    });

    const nftVendorStorage = await deployer.deploy(NftVendorStorage);

    const nftVendor = await deployProxy(
      NftVendor,
      [
        collection.address,
        CREATOR_ADDRESS,
        nftVendorStorage.address,
        priceOracle.address,
      ],
      {
        deployer,
      }
    );

    const nftOffersStorage = await deployer.deploy(NftOffersStorage);

    await deployProxy(
      NftOffers,
      [
        collection.address,
        CREATOR_ADDRESS,
        nftVendor.address,
        nftOffersStorage.address,
      ],
      {
        deployer,
      }
    );
  });
};
