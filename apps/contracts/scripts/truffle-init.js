const dotenv = require("dotenv");
dotenv.config();

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
    const ccNft = await CCNft.at(CCNftContract.networks[80001].address);

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

    await ccNftStorage.addAllowedAddress(ccNft.address);
    await ccNftStorage.addAllowedAddress(nftOffers.address);
    await ccNftStorage.addAllowedAddress(nftVendor.address);

    await nftOffersStorage.addAllowedAddress(nftOffers.address);

    // // Set up exchange users
    // const user1 = "0x7fa312b2e1ba41b0258497612c7594021774711e";

    // // User 1 Deposits Ether
    // await ccNft.mintNFT(
    //   "https://ivory-worthy-sparrow-388.mypinata.cloud/ipfs/QmdKPYuk7CoDoz6hSo8ZM6icG9sZYgCtPkxEeQeZKgr966?pinataGatewayToken=s_pCLBusA0GJxHX5F6DmiHij0U33q-GXZvLcNlkI35Sg6fiD1q4D9FbL1qJJ6aNa&_gl=1*1dak5lw*rs_ga*OWNhMWQ1ZmUtODBkMC00MDVmLTk0MGMtOWY4ZDZmNmE1NWY5*rs_ga_5RMPXG14TE*MTY4MzExMTAwMi42LjAuMTY4MzExMTAwMi42MC4wLjA.",
    //   { from: user1 }
    // );

    console.log(`Init complete!`);
  } catch (error) {
    console.log(error);
  }

  callback();
};
