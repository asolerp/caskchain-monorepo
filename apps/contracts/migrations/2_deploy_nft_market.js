const dotenv = require("dotenv");
const { insertInEnvFile } = require("../utils/helpers");
dotenv.config({ path: `../../../.env` });

const CCNft = artifacts.require("CCNft");
const MockUSDT = artifacts.require("MockUSDT");
const NftVendor = artifacts.require("NftVendor");
const NftOffers = artifacts.require("NftOffers");

const CREATOR_ADDRESS = process.env.PUBLIC_KEY;

module.exports = function (deployer) {
  deployer.then(async () => {
    await deployer.deploy(MockUSDT, "USDT", "USDT", "1000000");
    const collection = await deployer.deploy(CCNft);
    const nftVendor = await deployer.deploy(
      NftVendor,
      collection.address,
      CREATOR_ADDRESS
    );
    await deployer.deploy(NftOffers, collection.address, nftVendor.address);
  });
};
