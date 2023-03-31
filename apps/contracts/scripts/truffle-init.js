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
<<<<<<< HEAD
    const user1 = "0x54Ca6E36FE4C534D89A1bFbbc5567F1C3dA78988";
=======
    const user1 = "0x915c94a3cc7ab4ef1d9829be509b1f816c838908";
>>>>>>> dev

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
