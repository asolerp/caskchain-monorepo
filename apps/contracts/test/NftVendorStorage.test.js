// const NftVendorStorage = artifacts.require("NftVendorStorage");

// contract("NftVendorStorage", function (accounts) {
//   let nftVendorStorage;
//   const [owner, addr1, addr2, addr3] = accounts;

//   beforeEach(async function () {
//     nftVendorStorage = await NftVendorStorage.new();
//   });

//   describe("Allowed Addresses Management", function () {
//     it("Should add allowed address", async function () {
//       await nftVendorStorage.addAllowedAddress(addr1);
//       assert.equal(await nftVendorStorage.isAllowedAddress(addr1), true);
//     });

//     it("Should remove allowed address", async function () {
//       await nftVendorStorage.addAllowedAddress(addr1);
//       await nftVendorStorage.removeAllowedAddress(addr1);
//       assert.equal(await nftVendorStorage.isAllowedAddress(addr1), false);
//     });

//     it("Should not remove allowed address if not owner", async function () {
//       try {
//         await nftVendorStorage.addAllowedAddress(addr1, { from: addr2 });
//         await nftVendorStorage.removeAllowedAddress(addr1, { from: addr2 });
//       } catch (error) {
//         assert(error.message.includes("Ownable: caller is not the owner"));
//       }
//     });
//   });

//   describe("Base URI Management", function () {
//     it("Should set base URI", async function () {
//       const newBaseURI = "https://myapi.com/metadata/";
//       await nftVendorStorage.setBaseURI(newBaseURI);
//       assert.equal(await nftVendorStorage.baseURI(), newBaseURI);
//     });

//     it("Should not set base URI if not allowed address", async function () {
//       const newBaseURI = "https://myapi.com/metadata/";
//       try {
//         await nftVendorStorage.setBaseURI(newBaseURI, { from: addr2 });
//       } catch (error) {
//         assert(error.message.includes("Caller is not allowed to set base URI"));
//       }
//     });
//   });

//   describe("Getter Functions Tests", function () {
//     it("Should return if address is excluded", async function () {
//       // Assuming there's a function to add an excluded address in the contract
//       await nftVendorStorage.addExcludedAddress(user1);
//       assert.equal(await nftVendorStorage.getIsExcluded({ from: user1 }), true);
//       assert.equal(
//         await nftVendorStorage.getIsExcluded({ from: user2 }),
//         false
//       );
//     });

//     it("Should return price by token address and tokenId", async function () {
//       // Assuming there's a function to set price for token and tokenId in the contract
//       await nftVendorStorage.setPriceByToken(user1, 1, 100);
//       assert.equal(await nftVendorStorage.getPriceByToken(user1, 1), 100);
//     });

//     it("Should return accepted ERC20 tokens", async function () {
//       // Assuming there's a function to add ERC20 tokens in the contract
//       await nftVendorStorage.addAcceptedERC20Token(user1);
//       await nftVendorStorage.addAcceptedERC20Token(user2);
//       const acceptedTokens = await nftVendorStorage.getAcceptedERC20tokens();
//       assert.deepEqual(acceptedTokens, [user1, user2]);
//     });

//     // Add similar test cases for other getter functions provided in the contract
//   });
// });
