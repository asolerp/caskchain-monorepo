const NftVendor = artifacts.require("NftVendor");
const CCNft = artifacts.require("CCNft");
const NftOffers = artifacts.require("NftOffers");

contract("NftOffers", (accounts) => {
  const owner = accounts[0];
  const addr1 = accounts[1];
  const tokenURI1 = "https://ipfs.example.com/token1";
  const tokenURI2 = "https://ipfs.example.com/token2";
  const tokenURI3 = "https://ipfs.example.com/token3";

  const tokenId = 1;
  let nftVendorInstance;
  let ccNftInstance;
  let nftOffersInstance;

  beforeEach(async () => {
    ccNftInstance = await CCNft.new();
    nftVendorInstance = await NftVendor.new(ccNftInstance.address, owner);
    nftOffersInstance = await NftOffers.new(
      ccNftInstance.address,
      nftVendorInstance.address
    );
  });

  describe("makeOffer", () => {
    it("should create a new offer for a token", async () => {
      await ccNftInstance.mintNFT(tokenURI1, { from: owner });
      await ccNftInstance.approve(nftOffersInstance.address, tokenId, {
        from: owner,
      });
      await nftOffersInstance.makeOffer(tokenId, {
        from: addr1,
        value: web3.utils.toWei("1", "ether"),
      });
      const offer = await nftOffersInstance.getNftOffer(tokenId);
      assert.equal(offer.highestBidder, addr1);
      assert.equal(offer.highestBid.toString(), web3.utils.toWei("1", "ether"));
    });
  });

  describe("withdraw", () => {
    it("should allow a bidder to withdraw their offer", async () => {
      await ccNftInstance.mintNFT(tokenURI2, { from: owner });
      await ccNftInstance.approve(nftOffersInstance.address, tokenId, {
        from: owner,
      });

      await nftOffersInstance.makeOffer(tokenId, {
        from: addr1,
        value: web3.utils.toWei("1", "ether"),
      });

      await nftOffersInstance.withdraw(tokenId, { from: addr1 });
      const offer = await nftOffersInstance.getNftOffer(tokenId);

      assert.equal(offer.highestBid, 0);
      assert.equal(offer.highestBidder, offer.seller);
    });
  });

  describe("acceptOffer", () => {
    it("should allow the owner to accept an offer", async () => {
      await ccNftInstance.mintNFT(tokenURI3, { from: owner });
      await ccNftInstance.approve(nftOffersInstance.address, tokenId, {
        from: owner,
      });

      await nftOffersInstance.makeOffer(tokenId, {
        from: addr1,
        value: web3.utils.toWei("1", "ether"),
      });

      await nftOffersInstance.acceptOffer(tokenId, { from: owner });
      const newOwner = await ccNftInstance.ownerOf(tokenId);

      assert.equal(newOwner, addr1);
    });
  });
});
