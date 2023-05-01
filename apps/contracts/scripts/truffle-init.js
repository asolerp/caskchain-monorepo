const dotenv = require("dotenv");
dotenv.config({ path: `../../../.env` });

const CCNft = artifacts.require("CCNft");
const NftOffers = artifacts.require("NftOffers");
const NftVendor = artifacts.require("NftVendor");
const CCNftStorage = artifacts.require("CCNftStorage");
const NftOffersStorage = artifacts.require("NftOffersStorage");

const CCNftContract = require("../build/contracts/CCNft.json");
const NftOffersContract = require("../build/contracts/NftOffers.json");
const NftVendorContract = require("../build/contracts/NftVendor.json");
const CCNftStorageContract = require("../build/contracts/CCNftStorage.json");
const NftOffersStorageContract = require("../build/contracts/NftOffersStorage.json");

module.exports = async function (callback) {
  try {
    // Fetch accounts from wallet - these are unlocked
    // const accounts = await web3.eth.getAccounts();

    // Fetch the deployed exchange
    const ccNftStorage = await CCNftStorage.at(
      CCNftStorageContract.networks[80001].address
    );
    const nftVendor = await NftVendor.at(
      NftVendorContract.networks[80001].address
    );
    const nftOffers = await NftOffers.at(
      NftOffersContract.networks[80001].address
    );
    const nftOffersStorage = await NftOffersStorage.at(
      NftOffersStorageContract.networks[80001].address
    );

    const ccNft = await CCNft.at(CCNftContract.networks[80001].address);

    await ccNftStorage.addAllowedAddress(ccNft.address);
    await ccNftStorage.addAllowedAddress(nftOffers.address);
    await ccNftStorage.addAllowedAddress(nftVendor.address);

    await nftOffersStorage.addAllowedAddress(nftOffers.address);

    console.log("ccNft fetched", ccNft.address);

    // Set up exchange users
    const user1 = "0x7fa312b2e1ba41b0258497612c7594021774711e";

    // User 1 Deposits Ether
    await ccNft.mintNFT(
      "https://ivory-worthy-sparrow-388.mypinata.cloud/ipfs/QmRaEHHk53Ra9bmQ1q3LJ4t2UUs1NmGenDa1Vn4Bx7WNW1",
      { from: user1 }
    );
    await ccNft.mintNFT(
      "https://ivory-worthy-sparrow-388.mypinata.cloud/ipfs/QmSSU68Aqkwi1uWUs9SbppsjEmGyA7k2wjR8LFUpAyjWDQ",
      { from: user1 }
    );

    console.log(`Minted NFTs from ${user1}`);
  } catch (error) {
    console.log(error);
  }

  callback();
};
