const dotenv = require("dotenv");
dotenv.config({ path: `../../../.env` });

const CCNft = artifacts.require("CCNft");

module.exports = async function (callback) {
  try {
    // Fetch accounts from wallet - these are unlocked
    // const accounts = await web3.eth.getAccounts();

    // Fetch the deployed exchange
    const ccNft = await CCNft.deployed();
    console.log("ccNft fetched", ccNft.address);

    // Set up exchange users
    const user1 = "0x0eb4b69f06aaffcfeb505d7cdee1aa8ec3f9d1dd";

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
