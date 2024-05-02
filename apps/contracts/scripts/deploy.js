// scripts/deploy.js

const { ethers, upgrades } = require("hardhat");
const { insertInEnvFile, convertEnvToVercel } = require("../utils/helpers");
const fs = require("fs").promises;

const originRoute = "/Users/alberto/Desktop/Proyectos/caskchain-monorepo/.env";
const destinyRoute =
  "/Users/alberto/Desktop/Proyectos/caskchain-monorepo/apps/functions/.env";

const frontendRoute =
  "/Users/alberto/Desktop/Proyectos/caskchain-monorepo/apps/caskchain-frontend/vercel.json";
const adminRoute =
  "/Users/alberto/Desktop/Proyectos/caskchain-monorepo/apps/caskchain-admin/vercel.json";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  console.log(
    "Account balance:",
    (await deployer.provider.getBalance(deployer.address)).toString()
  );

  // Deploy MockUSDT
  const MockUSDT = await ethers.getContractFactory("MockUSDT");
  const mockUSDT = await MockUSDT.deploy("10000000000000000000000000");
  await mockUSDT.waitForDeployment();
  console.log("MockUSDT deployed to:", await mockUSDT.getAddress());

  // Deploy PriceOracle
  const PriceOracle = await ethers.getContractFactory("PriceOracle");
  const priceOracle = await PriceOracle.deploy();
  await priceOracle.waitForDeployment();
  console.log("PriceOracle deployed to:", await priceOracle.getAddress());

  // Deploy CCNftStorage
  const CCNftStorage = await ethers.getContractFactory("CCNftStorage");
  const ccNftStorage = await CCNftStorage.deploy();
  await ccNftStorage.waitForDeployment();
  console.log("CCNftStorage deployed to:", await ccNftStorage.getAddress());

  // Deploy CCNft with proxy
  const CCNft = await ethers.getContractFactory("CCNft");
  const ccNft = await upgrades.deployProxy(CCNft, [
    await ccNftStorage.getAddress(),
  ]);
  await ccNft.waitForDeployment();
  console.log("CCNft deployed to:", await ccNft.getAddress());

  // Deploy NftVendorStorage
  const NftVendorStorage = await ethers.getContractFactory("NftVendorStorage");
  const nftVendorStorage = await NftVendorStorage.deploy();
  await nftVendorStorage.waitForDeployment();
  console.log(
    "NftVendorStorage deployed to:",
    await nftVendorStorage.getAddress()
  );

  // Deploy NftVendor with proxy
  const NftVendor = await ethers.getContractFactory("NftVendor");
  const nftVendor = await upgrades.deployProxy(NftVendor, [
    await ccNft.getAddress(),
    deployer.address,
    await nftVendorStorage.getAddress(),
    await priceOracle.getAddress(),
  ]);
  await nftVendor.waitForDeployment();
  console.log("NftVendor deployed to:", await nftVendor.getAddress());

  // Deploy NftOffersStorage
  const NftOffersStorage = await ethers.getContractFactory("NftOffersStorage");
  const nftOffersStorage = await NftOffersStorage.deploy();
  await nftOffersStorage.waitForDeployment();
  console.log(
    "NftOffersStorage deployed to:",
    await nftOffersStorage.getAddress()
  );

  // Deploy NftOffers with proxy
  const NftOffers = await ethers.getContractFactory("NftOffers");
  const nftOffers = await upgrades.deployProxy(NftOffers, [
    await ccNft.getAddress(),
    deployer.address,
    await nftVendor.getAddress(),
    await nftOffersStorage.getAddress(),
  ]);
  await nftOffers.waitForDeployment();
  console.log("NftOffers deployed to:", await nftOffers.getAddress());

  insertInEnvFile({
    params: {
      CCNFT_ADDRESS: await ccNft.getAddress(),
      NFT_VENDOR_ADDRESS: await nftVendor.getAddress(),
      NFT_OFFERS_ADDRESS: await nftOffers.getAddress(),
      USDT_CONTRACT_ADDRESS: await mockUSDT.getAddress(),
      CCNFT_STORAGE_ADDRESS: await ccNftStorage.getAddress(),
      NFT_OFFERS_STORAGE_ADDRESS: await nftOffersStorage.getAddress(),
    },
    route: originRoute,
  });

  await fs.copyFile(originRoute, destinyRoute);

  convertEnvToVercel(originRoute, frontendRoute);
  convertEnvToVercel(originRoute, adminRoute);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
