// scripts/initialize.js
require("dotenv").config({ path: `../../../.env` });
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Running initialization with account:", deployer.address);
  console.log(
    "Account balance:",
    (await deployer.provider.getBalance(deployer.address)).toString()
  );

  // Direcciones de los contratos desplegados almacenadas en variables de entorno
  const ccNftAddress = process.env.CCNFT_ADDRESS;
  const nftVendorAddress = process.env.NFT_VENDOR_ADDRESS;
  const mockUSDTAddress = process.env.USDT_CONTRACT_ADDRESS;
  const ccNftStorageAddress = process.env.CCNFT_STORAGE_ADDRESS;
  const nftOffersAddress = process.env.NFT_OFFERS_ADDRESS;
  const nftOffersStorageAddress = process.env.NFT_OFFERS_STORAGE_ADDRESS;

  const CCNft = await ethers.getContractFactory("CCNft");
  const ccNft = CCNft.attach(ccNftAddress);

  const CCNftStorage = await ethers.getContractFactory("CCNftStorage");
  const ccNftStorage = CCNftStorage.attach(ccNftStorageAddress);

  const MockUSDT = await ethers.getContractFactory("MockUSDT");
  const mockUSDT = MockUSDT.attach(mockUSDTAddress);

  const NftVendor = await ethers.getContractFactory("NftVendor");
  const nftVendor = NftVendor.attach(nftVendorAddress);

  const NftOffers = await ethers.getContractFactory("NftOffers");
  const nftOffers = NftOffers.attach(nftOffersAddress);

  const NftOffersStorage = await ethers.getContractFactory("NftOffersStorage");
  const nftOffersStorage = NftOffersStorage.attach(nftOffersStorageAddress);

  const price = (await deployer.provider.getFeeData()).gasPrice;

  const increasedGasPrice = (price * BigInt(110)) / BigInt(100);

  // Ejemplo de configuración inicial con manejo de nonces y gas price
  const nonce = await deployer.getNonce();

  await ccNftStorage.addAllowedAddress(await ccNft.getAddress(), {
    nonce: nonce,
    gasPrice: increasedGasPrice,
  });
  await ccNftStorage.addAllowedAddress(await nftOffers.getAddress(), {
    nonce: nonce + 1,
    gasPrice: increasedGasPrice,
  });
  await ccNftStorage.addAllowedAddress(await nftVendor.getAddress(), {
    nonce: nonce + 2,
    gasPrice: increasedGasPrice,
  });

  await nftOffersStorage.addAllowedAddress(await nftOffers.getAddress(), {
    nonce: nonce + 3,
    gasPrice: increasedGasPrice,
  });

  console.log("Initialization complete!");
  console.log(`CCNft Address: ${await ccNft.getAddress()}`);
  console.log(`CCNftStorage Address: ${await ccNftStorage.getAddress()}`);
  console.log(`NftVendor Address: ${await nftVendor.getAddress()}`);
  console.log(`NftOffers Address: ${await nftOffers.getAddress()}`);
  console.log(
    `NftOffersStorage Address: ${await nftOffersStorage.getAddress()}`
  );
  console.log(`Mock USDT Address: ${await mockUSDT.getAddress()}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
