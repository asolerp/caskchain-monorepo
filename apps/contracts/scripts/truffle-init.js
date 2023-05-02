const dotenv = require("dotenv");
dotenv.config();

const CCNft = artifacts.require("CCNft");
const NftOffers = artifacts.require("NftOffers");
const NftVendor = artifacts.require("NftVendor");
const CCNftStorage = artifacts.require("CCNftStorage");
const NftOffersStorage = artifacts.require("NftOffersStorage");

const CCNftContract = require("../build/contracts/CCNft.json");

module.exports = async function (callback) {
  try {
    // Fetch accounts from wallet - these are unlocked
    // const accounts = await web3.eth.getAccounts();

    // Fetch the deployed exchange
    const ccNftStorage = await CCNftStorage.deployed();
    const nftVendor = await NftVendor.deployed();
    const nftOffers = await NftOffers.deployed();
    const nftOffersStorage = await NftOffersStorage.deployed();

    const ccNft = await CCNft.at(CCNftContract.networks[4447].address);

    await ccNftStorage.addAllowedAddress(ccNft.address);
    await ccNftStorage.addAllowedAddress(nftOffers.address);
    await ccNftStorage.addAllowedAddress(nftVendor.address);

    await nftOffersStorage.addAllowedAddress(nftOffers.address);

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
