const { deployProxy } = require("@openzeppelin/truffle-upgrades");

const NftVendor = artifacts.require("NftVendor");
const NftVendorStorage = artifacts.require("NftVendorStorage");
const CCNft = artifacts.require("CCNft");
const CCNftStorage = artifacts.require("CCNftStorage");
const MockUSDT = artifacts.require("MockUSDT");

contract("NftVendor", (accounts) => {
  const owner = accounts[0];
  const addr1 = accounts[1];
  const tokenURI1 = "https://ipfs.example.com/token1";
  const tokenId = 1;

  let nftVendor;
  let nftVendorStorage;
  let ccNft;
  let ccNftStorage;
  let usdtMockInstance;

  beforeEach(async () => {
    ccNftStorage = await CCNftStorage.new();
    nftVendorStorage = await NftVendorStorage.new();

    ccNft = await deployProxy(CCNft, [ccNftStorage.address]);

    usdtMockInstance = await MockUSDT.new(
      "Mock Token",
      "MTKN",
      web3.utils.toWei("2", "ether")
    );

    nftVendor = await deployProxy(NftVendor, [
      ccNft.address,
      owner,
      nftVendorStorage.address,
    ]);

    await ccNftStorage.addAllowedAddress(ccNft.address);
    await ccNftStorage.addAllowedAddress(nftVendor.address);

    await nftVendorStorage.addAllowedAddress(nftVendor.address);

    await ccNft.mintNFT(tokenURI1, { from: owner });
  });

  describe("listItem", () => {
    it("should list an NFT for sale", async () => {
      await ccNft.approve(nftVendor.address, tokenId, {
        from: owner,
      });
      await nftVendor.listItem(tokenId, web3.utils.toWei("1", "ether"), {
        from: owner,
      });
      const listing = await nftVendor.getListing(tokenId);
      assert.equal(listing.tokenId.toString(), tokenId.toString());
      assert.equal(listing.price.toString(), web3.utils.toWei("1", "ether"));
      assert.equal(listing.seller, owner);
    });
  });

  //   describe("cancelListing", () => {
  //     it("should cancel the listing of an NFT", async () => {
  //       await ccNftInstance.approve(nftVendorInstance.address, tokenId, {
  //         from: owner,
  //       });
  //       await nftVendorInstance.listItem(
  //         tokenId,
  //         web3.utils.toWei("1", "ether"),
  //         { from: owner }
  //       );

  //       await nftVendorInstance.cancelListing(tokenId, { from: owner });
  //       const listing = await nftVendorInstance.getListing(tokenId);
  //       assert.equal(listing.price.toString(), "0");
  //     });
  //   });

  //   describe("buyItem", () => {
  //     it("should allow a user to buy an NFT", async () => {
  //       await ccNftInstance.approve(nftVendorInstance.address, tokenId, {
  //         from: owner,
  //       });
  //       await nftVendorInstance.listItem(
  //         tokenId,
  //         web3.utils.toWei("1", "ether"),
  //         { from: owner }
  //       );

  //       await nftVendorInstance.buyItem(tokenId, {
  //         from: addr1,
  //         value: web3.utils.toWei("1", "ether"),
  //       });

  //       const newOwner = await ccNftInstance.ownerOf(tokenId);
  //       assert.equal(newOwner, addr1);
  //     });
  //   });

  //   describe("buyNFTWithERC20", () => {
  //     it("should allow a user to buy an NFT using ERC20 tokens", async () => {
  //       await ccNftInstance.approve(nftVendorInstance.address, tokenId, {
  //         from: owner,
  //       });
  //       await nftVendorInstance.listItem(
  //         tokenId,
  //         web3.utils.toWei("1", "ether"),
  //         { from: owner }
  //       );
  //       await usdtMockInstance.approve(
  //         nftVendorInstance.address,
  //         web3.utils.toWei("2", "ether"),
  //         { from: addr1 }
  //       );

  //       await nftVendorInstance.s_acceptedTokens(usdtMockInstance.address, {
  //         from: owner,
  //       });
  //       await nftVendorInstance.s_priceTokens(usdtMockInstance.address, tokenId, {
  //         from: owner,
  //       });
  //       await nftVendorInstance.buyNFTWithERC20(
  //         tokenId,
  //         usdtMockInstance.address,
  //         { from: addr1 }
  //       );

  //       const newOwner = await ccNftInstance.ownerOf(tokenId);
  //       assert.equal(newOwner, addr1);
  //     });
  //   });

  //   describe("updateListingPrice", () => {
  //     it("should allow the owner to update the price of a listed NFT", async () => {
  //       await ccNftInstance.approve(nftVendorInstance.address, tokenId, {
  //         from: owner,
  //       });
  //       await nftVendorInstance.listItem(
  //         tokenId,
  //         web3.utils.toWei("1", "ether"),
  //         { from: owner }
  //       );
  //       await nftVendorInstance.updateListingPrice(
  //         tokenId,
  //         web3.utils.toWei("2", "ether"),
  //         { from: owner }
  //       );

  //       const listing = await nftVendorInstance.getListing(tokenId);
  //       assert.equal(listing.price.toString(), web3.utils.toWei("2", "ether"));
  //     });
  //   });
});
