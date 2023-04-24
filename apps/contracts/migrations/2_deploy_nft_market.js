const dotenv = require("dotenv");
const { deployProxy } = require("@openzeppelin/truffle-upgrades");
const { insertInEnvFile } = require("../utils/helpers");
dotenv.config({ path: `../../../.env` });

const CCNft = artifacts.require("CCNft");
const CCNftData = artifacts.require("CCNftData");

const MockUSDT = artifacts.require("MockUSDT");
const NftVendor = artifacts.require("NftVendor");
const NftOffers = artifacts.require("NftOffers");

const CREATOR_ADDRESS = process.env.PUBLIC_KEY;

module.exports = function (deployer) {
  deployer.then(async () => {
    await deployer.deploy(MockUSDT, "USDT", "USDT", "1000000");
    const ccNftData = await deployer.deploy(CCNftData);
    const collection = await deployProxy(CCNft, [ccNftData.address], {
      deployer,
    });
    const nftVendor = await deployer.deploy(
      NftVendor,
      collection.address,
      CREATOR_ADDRESS
    );
    await deployer.deploy(
      NftOffers,
      ccNftData.address,
      collection.address,
      nftVendor.address
    );
  });
};
