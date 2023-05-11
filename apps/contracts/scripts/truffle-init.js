const dotenv = require("dotenv");
dotenv.config({ path: `../../../.env` });

const CCNft = artifacts.require("CCNft");
const NftOffers = artifacts.require("NftOffers");
const NftVendor = artifacts.require("NftVendor");
const NftVendorStorage = artifacts.require("NftVendorStorage");
const CCNftStorage = artifacts.require("CCNftStorage");
const NftOffersStorage = artifacts.require("NftOffersStorage");
const MockUSDT = artifacts.require("MockUSDT");

const CCNftContract = require("../build/contracts/CCNft.json");
const NftOffersContract = require("../build/contracts/NftOffers.json");
const NftVendorContract = require("../build/contracts/NftVendor.json");
const NftVendorStorageContract = require("../build/contracts/NftVendorStorage.json");
const CCNftStorageContract = require("../build/contracts/CCNftStorage.json");
const NftOffersStorageContract = require("../build/contracts/NftOffersStorage.json");
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

    await ccNftStorage.addAllowedAddress(ccNft.address);
    await ccNftStorage.addAllowedAddress(nftOffers.address);
    await ccNftStorage.addAllowedAddress(nftVendor.address);

    await nftOffersStorage.addAllowedAddress(nftOffers.address);

    await nftVendorStorage.addAllowedAddress(nftVendor.address);

    console.log("MOCK USDT ADDRESS", mockUSDT.address);

    await nftVendor.setExcludedFromList(process.env.PUBLIC_KEY, true);
    await nftVendor.addERC20Token(mockUSDT.address);

    mockUSDT.transfer(process.env.PUBLIC_KEY, "1000000");

    await ccNft.mintNFT(
      "https://gateway.pinata.cloud/ipfs/QmexW73eDDgJstGgJ47bibwYFLW3Y6EmWURTaoWoVQnvjN",
      { from: process.env.PUBLIC_KEY }
    );

    // await nftVendor.listItem("1", web3.utils.toWei("2", "ether"), {
    //   from: process.env.PUBLIC_KEY,
    // });

    console.log(`Init complete!`);
  } catch (error) {
    console.log(error);
  }

  callback();
};
