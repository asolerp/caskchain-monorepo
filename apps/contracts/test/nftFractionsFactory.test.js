// const NftFractionsFactory = artifacts.require("NftFractionsFactory");
// const NftFractionToken = artifacts.require("NftFractionToken");
// const CCNft = artifacts.require("CCNft");

// contract("NftFractionsFactory", (accounts) => {
//   let nftFractionsFactory;
//   const [owner] = accounts;
//   const tokenURI1 = "https://ipfs.example.com/token1";

//   beforeEach(async function () {
//     nftFractionsFactory = await NftFractionsFactory.new({ from: owner });
//     nftFractionToken = await NftFractionToken.new({ from: owner });
//     this.contract = await CCNft.new({ from: owner });
//     await this.contract.mintNFT(tokenURI1, { from: owner });
//   });

//   describe("Deployment", function () {
//     it("Should set the right owner", async function () {
//       const factoryOwner = await nftFractionsFactory.owner();
//       expect(factoryOwner).to.equal(owner);
//     });

//     it("Should initialize with zero vaults", async function () {
//       const vaultCount = await nftFractionsFactory.vaultCount();
//       expect(vaultCount.toNumber()).to.equal(0);
//     });
//   });

//   describe("mint", function () {
//     beforeEach(async function () {
//       await this.contract.approve(nftFractionsFactory.address, 1, {
//         from: owner,
//       });
//       await nftFractionsFactory.mint(
//         "TestVault",
//         "TV",
//         this.contract.address,
//         1,
//         1000,
//         10,
//         200,
//         { from: owner }
//       );
//     });

//     it("Should create a new vault and update the vault count", async function () {
//       const vaultCount = await nftFractionsFactory.vaultCount();
//       expect(vaultCount.toNumber()).to.equal(1);
//     });

//     it("Should return all created vaults", async function () {
//       const vaults = await nftFractionsFactory.getAllCreatedVaults();
//       expect(vaults.length).to.equal(1);
//     });

//     it("Should return vault details by tokenId", async function () {
//       const vault = await nftFractionsFactory.getVaultContractByTokenId(0);
//       expect(vault.vaultAddress).to.not.equal(
//         "0x0000000000000000000000000000000000000000"
//       );
//     });

//     it("Should return vault details by id", async function () {
//       const vault = await nftFractionsFactory.getVaultContract(0);
//       expect(vault.vaultAddress).to.not.equal(
//         "0x0000000000000000000000000000000000000000"
//       );
//     });
//   });

//   describe("pause and unpause", function () {
//     it("Should pause the contract", async function () {
//       await nftFractionsFactory.pause();
//       const paused = await nftFractionsFactory.paused();
//       expect(paused).to.equal(true);
//     });

//     it("Should unpause the contract", async function () {
//       await nftFractionsFactory.pause();
//       await nftFractionsFactory.unpause();
//       const paused = await nftFractionsFactory.paused();
//       expect(paused).to.equal(false);
//     });
//   });
// });
