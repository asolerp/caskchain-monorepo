const { deployProxy } = require("@openzeppelin/truffle-upgrades");
const truffleAssert = require("truffle-assertions");

const CCNft = artifacts.require("CCNft");
const NftOffers = artifacts.require("NftOffers");
const NftVendor = artifacts.require("NftVendor");
const CCNftStorage = artifacts.require("CCNftStorage");
const NftOffersStorage = artifacts.require("NftOffersStorage");
const NftVendorStorage = artifacts.require("NftVendorStorage");

contract("NftOffers", (accounts) => {
  const [owner, user1, user2] = accounts;
  let ccNft;
  let nftOffers;
  let nftVendor;
  let ccNftStorage;
  let nftOffersStorage;
  let nftVendorStorage;
  const tokenURI1 = "ipfs://tokenURI";
  const tokenURI2 = "ipfs://tokenURI2";
  const tokenURI3 = "ipfs://tokenURI3";

  beforeEach(async () => {
    ccNftStorage = await CCNftStorage.new();
    nftOffersStorage = await NftOffersStorage.new();
    nftVendorStorage = await NftVendorStorage.new();
    ccNft = await deployProxy(CCNft, [ccNftStorage.address]);
    nftVendor = await deployProxy(NftVendor, [
      ccNft.address,
      owner,
      nftVendorStorage.address,
    ]);
    nftOffers = await deployProxy(NftOffers, [
      ccNft.address,
      nftVendor.address,
      ccNftStorage.address,
      nftOffersStorage.address,
    ]);

    await ccNftStorage.addAllowedAddress(ccNft.address);
    await ccNftStorage.addAllowedAddress(nftOffers.address);
    await ccNftStorage.addAllowedAddress(nftVendor.address);

    await nftOffersStorage.addAllowedAddress(nftOffers.address);
  });

  describe("initialize()", () => {
    it("should set up owner of the contract", async () => {
      const owner = await nftOffers.owner();
      assert.equal(owner, accounts[0]);
    });
  });

  describe("makeOffer()", () => {
    let tokenId;
    beforeEach(async () => {
      await ccNft.mintNFT(tokenURI1, { from: owner });
      tokenId = 1;
    });

    it("Ensure that the buyer is making a valid offer", async function () {
      const value = web3.utils.toWei("2", "ether");
      await truffleAssert.reverts(
        nftOffers.makeOffer(tokenId, {
          from: user1,
          value: 0,
        }),
        "Offer price must be greater than 0"
      );

      const result = await nftOffers.makeOffer(tokenId, {
        from: user1,
        value,
      });

      const event = result.logs[0];
      assert.equal(event.event, "NewOffer");
    });

    it("Offer price too low comparison to the highest bid", async function () {
      const offer1 = web3.utils.toWei("2", "ether");
      const offer2 = web3.utils.toWei("1", "ether");

      await nftOffers.makeOffer(tokenId, {
        from: user1,
        value: offer1,
      });

      await truffleAssert.reverts(
        nftOffers.makeOffer(tokenId, {
          from: user2,
          value: offer2,
        }),
        "Offer price is too low"
      );
    });
  });

  describe("cancelOffer()", () => {
    it("should cancel an offer and refund the bidder", async function () {
      // mint a token
      let tokenId = 1;
      await ccNft.mintNFT(tokenURI2, { from: owner });
      // addr1 makes an offer
      await nftOffers.makeOffer(tokenId, {
        from: user1,
        value: web3.utils.toWei("1", "ether"),
      });

      // addr2 makes an offer
      await nftOffers.makeOffer(tokenId, {
        from: user2,
        value: web3.utils.toWei("2", "ether"),
      });
      // addr1 cancels the offer
      const result = await nftOffers.cancelOffer(tokenId, {
        from: user1,
      });

      const event = result.logs[0];
      assert.equal(event.event, "RemoveOffer");

      // Check that addr1's bid has been removed
      const address = await nftOffers.getAddressesBids(tokenId);
      assert.equal(address[0], user2);

      // Check that addr2 is now the highest bidder
      const offer = await nftOffers.getNftOffer(tokenId);

      expect(offer.highestBidder).to.equal(user2);
      expect(offer.highestBid).to.equal(web3.utils.toWei("2", "ether"));
    });
  });

  describe("getNftOffer()", () => {
    it("should return the right offer details", async () => {
      let tokenId = 1;
      await ccNft.mintNFT(tokenURI3, { from: owner });
      await nftOffers.makeOffer(tokenId, {
        from: user1,
        value: web3.utils.toWei("1", "ether"),
      });

      const offer = await nftOffers.getNftOffer(tokenId);

      assert.equal(offer.nftId, tokenId);
      assert.equal(offer.highestBid, web3.utils.toWei("1", "ether"));
      assert.equal(offer.highestBidder, user1);
    });
  });
});
