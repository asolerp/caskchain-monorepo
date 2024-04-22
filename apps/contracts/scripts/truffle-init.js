const dotenv = require("dotenv");
dotenv.config({ path: `../../../.env` });

const CCNft = artifacts.require("CCNft");
const CCNftStorage = artifacts.require("CCNftStorage");
const NftOffersStorage = artifacts.require("NftOffersStorage");
const NftOffers = artifacts.require("NftOffers");
const NftVendor = artifacts.require("NftVendor");
const NftVendorStorage = artifacts.require("NftVendorStorage");
const NftFractionsFactory = artifacts.require("NftFractionsFactory");
const NftFractionsFactoryStorage = artifacts.require(
  "NftFractionsFactoryStorage"
);

const NftFractionsVendor = artifacts.require("NftFractionsVendor");
const NftFractionsVendorStorage = artifacts.require(
  "NftFractionsVendorStorage"
);

const MockUSDT = artifacts.require("MockUSDT");

const CCNftContract = require("../build/contracts/CCNft.json");
const CCNftStorageContract = require("../build/contracts/CCNftStorage.json");
const NftOffersContract = require("../build/contracts/NftOffers.json");
const NftOffersStorageContract = require("../build/contracts/NftOffersStorage.json");
const NftVendorContract = require("../build/contracts/NftVendor.json");
const NftVendorStorageContract = require("../build/contracts/NftVendorStorage.json");
const NftFractionsFactoryContract = require("../build/contracts/NftFractionsFactory.json");
const NftFractionsFactoryStorageContract = require("../build/contracts/NftFractionsFactoryStorage.json");
const NftFractionsVendorContract = require("../build/contracts/NftFractionsVendor.json");
const NftFractionsVendorStorageContract = require("../build/contracts/NftFractionsVendorStorage.json");
const MockUSDTContract = require("../build/contracts/MockUSDT.json");

module.exports = async function (callback) {
  try {
    const ccNft = await CCNft.at(
      CCNftContract.networks[process.env.NETWORK_ID].address
    );
    const mockUSDT = await MockUSDT.at(
      MockUSDTContract.networks[process.env.NETWORK_ID].address
    );
    const ccNftStorage = await CCNftStorage.at(
      CCNftStorageContract.networks[process.env.NETWORK_ID].address
    );
    const nftVendor = await NftVendor.at(
      NftVendorContract.networks[process.env.NETWORK_ID].address
    );

    const nftVendorStorage = await NftVendorStorage.at(
      NftVendorStorageContract.networks[process.env.NETWORK_ID].address
    );

    const nftOffers = await NftOffers.at(
      NftOffersContract.networks[process.env.NETWORK_ID].address
    );
    const nftOffersStorage = await NftOffersStorage.at(
      NftOffersStorageContract.networks[process.env.NETWORK_ID].address
    );

    const nftFractionsFactory = await NftFractionsFactory.at(
      NftFractionsFactoryContract.networks[process.env.NETWORK_ID].address
    );

    const nftFractionsFactoryStorage = await NftFractionsFactoryStorage.at(
      NftFractionsFactoryStorageContract.networks[process.env.NETWORK_ID]
        .address
    );

    const nftFractionsVendor = await NftFractionsVendor.at(
      NftFractionsVendorContract.networks[process.env.NETWORK_ID].address
    );

    const nftFractionsVendorStorage = await NftFractionsVendorStorage.at(
      NftFractionsVendorStorageContract.networks[process.env.NETWORK_ID].address
    );

    await ccNftStorage.addAllowedAddress(ccNft.address);
    await ccNftStorage.addAllowedAddress(nftOffers.address);
    await ccNftStorage.addAllowedAddress(nftVendor.address);

    await nftOffersStorage.addAllowedAddress(nftOffers.address);

    await nftVendorStorage.addAllowedAddress(nftVendor.address);

    await ccNftStorage.addAllowedAddress(nftVendor.address);

    await nftFractionsFactoryStorage.addAllowedAddress(
      nftFractionsFactory.address
    );

    await nftFractionsVendorStorage.addAllowedAddress(
      nftFractionsVendor.address
    );

    console.log("CCNft ADDRESS", ccNft.address);
    console.log("NftVendor ADDRESS", nftVendor.address);
    console.log("NftFractionsFactory ADDRESS", nftFractionsFactory.address);
    console.log("NftFractionsVendor ADDRESS", nftFractionsVendor.address);

    console.log("MOCK USDT ADDRESS", mockUSDT.address);

    await nftVendor.setExcludedFromList(process.env.PUBLIC_KEY, true);
    await nftVendor.addERC20Token(mockUSDT.address);

    mockUSDT.transfer(process.env.PUBLIC_KEY, "100000000000000000000000");

    console.log(`Init complete!`);
  } catch (error) {
    console.log(error);
  }

  callback();
};
