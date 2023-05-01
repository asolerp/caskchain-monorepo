const dotenv = require("dotenv");
// const { insertInEnvFile } = require("../utils/helpers");
dotenv.config({ path: `../../../.env` });
const { deployProxy } = require("@openzeppelin/truffle-upgrades");

const CCNft = artifacts.require("CCNft");
const CCNftStorage = artifacts.require("CCNftStorage");

const MockUSDT = artifacts.require("MockUSDT");
const NftVendor = artifacts.require("NftVendor");

const NftOffers = artifacts.require("NftOffers");
const NftOffersStorage = artifacts.require("NftOffersStorage");

const CREATOR_ADDRESS = process.env.PUBLIC_KEY;

module.exports = function (deployer) {
  deployer.then(async () => {
    const ccNftStorage = await deployer.deploy(CCNftStorage);
    await deployer.deploy(MockUSDT, "USDT", "USDT", "1000000");
    const collection = await deployProxy(CCNft, [ccNftStorage.address], {
      deployer,
    });
    const nftVendor = await deployProxy(
      NftVendor,
      [collection.address, CREATOR_ADDRESS],
      {
        deployer,
      }
    );

    const nftOffersStorage = await deployer.deploy(NftOffersStorage);

    await deployProxy(
      NftOffers,
      [
        collection.address,
        nftVendor.address,
        ccNftStorage.address,
        nftOffersStorage.address,
      ],
      {
        deployer,
      }
    );
  });
};
