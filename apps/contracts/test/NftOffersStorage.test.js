const NftOffersStorage = artifacts.require("NftOffersStorage");
const { assert } = require("chai");

contract("NftOffersStorage", (accounts) => {
  let nftOffersStorage;
  const owner = accounts[0];
  const addr1 = accounts[1];
  const addr2 = accounts[2];

  beforeEach(async () => {
    nftOffersStorage = await NftOffersStorage.new({ from: owner });
  });

  describe("Allowed addresses management", () => {
    it("should add allowed address correctly", async () => {
      await nftOffersStorage.addAllowedAddress(addr1, { from: owner });
      assert.isTrue(await nftOffersStorage.allowedAddresses(addr1));
    });

    it("should remove allowed address correctly", async () => {
      await nftOffersStorage.addAllowedAddress(addr1, { from: owner });
      await nftOffersStorage.removeAllowedAddress(addr1, { from: owner });
      assert.isFalse(await nftOffersStorage.allowedAddresses(addr1));
    });

    it("should not allow non-owner to add or remove allowed address", async () => {
      try {
        await nftOffersStorage.addAllowedAddress(addr1, { from: addr2 });
        assert.fail("Expected error not thrown");
      } catch (error) {
        assert.include(error.message, "Ownable: caller is not the owner");
      }

      try {
        await nftOffersStorage.removeAllowedAddress(addr1, { from: addr2 });
        assert.fail("Expected error not thrown");
      } catch (error) {
        assert.include(error.message, "Ownable: caller is not the owner");
      }
    });
  });

  describe("NFT Offer and Bid Management", () => {
    const tokenId = 1;
    const sampleOffer = {
      nftId: tokenId,
      seller: addr1,
      highestBid: 100,
      highestBidder: addr2,
    };

    beforeEach(async () => {
      // Adding addr1 as an allowed address
      await nftOffersStorage.addAllowedAddress(addr1, { from: owner });
    });

    it("should set and get NFT offer correctly", async () => {
      await nftOffersStorage.setOfferByTokenId(tokenId, sampleOffer, {
        from: addr1,
      });

      const storedOffer = await nftOffersStorage.getNftOfferByTokenId(tokenId);
      assert.deepEqual(
        {
          nftId: storedOffer.nftId.toString(),
          seller: storedOffer.seller,
          highestBid: storedOffer.highestBid.toString(),
          highestBidder: storedOffer.highestBidder,
        },
        {
          nftId: sampleOffer.nftId.toString(),
          seller: sampleOffer.seller,
          highestBid: sampleOffer.highestBid.toString(),
          highestBidder: sampleOffer.highestBidder,
        },
        "The stored offer should match the sample offer"
      );
    });

    it("should set and get offer bids correctly", async () => {
      const bidAmount = 200;
      await nftOffersStorage.setOfferBidFromTokenIdBySender(
        tokenId,
        addr1,
        bidAmount,
        {
          from: addr1,
        }
      );

      const storedBid = await nftOffersStorage.getOffersBidsFromTokenId(
        tokenId,
        addr1
      );
      assert.equal(
        storedBid.toString(),
        bidAmount.toString(),
        "The stored bid should match the bid amount"
      );
    });

    it("should set and get index of offer bids from an address correctly", async () => {
      const index = 1;
      await nftOffersStorage.setIndexOfOffersBidsFromAddress(
        tokenId,
        addr1,
        index,
        { from: addr1 }
      );
      const storedIndex = await nftOffersStorage.getIndexOfOfferBidsFromAddress(
        tokenId,
        addr1
      );
      assert.equal(
        storedIndex.toString(),
        index.toString(),
        "The stored index should match the index"
      );
    });

    it("should set and get highest bid from NFT id correctly", async () => {
      const bidAmount = 200;
      await nftOffersStorage.setTokenIdToOffer(tokenId, bidAmount, addr1, {
        from: addr1,
      });

      const highestBid = await nftOffersStorage.getHighestBidByTokenId(
        tokenId,
        {
          from: addr1,
        }
      );
      assert.equal(
        highestBid.toString(),
        bidAmount.toString(),
        "The stored highest bid should match the bid amount"
      );
    });

    it("should delete offer bids and index of offer bids from an address correctly", async () => {
      const index = 1;
      const bidAmount = 200;

      await nftOffersStorage.setOfferBidFromTokenIdBySender(
        tokenId,
        addr1,
        bidAmount,
        {
          from: addr1,
        }
      );
      await nftOffersStorage.setIndexOfOffersBidsFromAddress(
        tokenId,
        addr1,
        index,
        { from: addr1 }
      );

      await nftOffersStorage.deleteOffersBidsFromTokenId(tokenId, addr1, {
        from: addr1,
      });
      await nftOffersStorage.deleteIndexOfOfferBidsFromAddress(tokenId, addr1, {
        from: addr1,
      });

      const storedBid = await nftOffersStorage.getOffersBidsFromTokenId(
        tokenId,
        addr1
      );
      assert.equal(
        storedBid.toString(),
        "0",
        "The stored bid should be 0 after deletion"
      );

      const storedIndex = await nftOffersStorage.getIndexOfOfferBidsFromAddress(
        tokenId,
        addr1
      );
      assert.equal(
        storedIndex.toString(),
        "0",
        "The stored index should be 0 after deletion"
      );
    });

    it("should delete token id from offer correctly", async () => {
      await nftOffersStorage.setOfferByTokenId(tokenId, sampleOffer, {
        from: addr1,
      });
      await nftOffersStorage.deleteTokenIdFromOffer(tokenId, { from: addr1 });

      const storedOffer = await nftOffersStorage.getNftOfferByTokenId(tokenId);
      assert.deepEqual(
        {
          nftId: storedOffer.nftId.toString(),
          seller: storedOffer.seller,
          highestBid: storedOffer.highestBid.toString(),
          highestBidder: storedOffer.highestBidder,
        },
        {
          nftId: "0",
          seller: "0x0000000000000000000000000000000000000000",
          highestBid: "0",
          highestBidder: "0x0000000000000000000000000000000000000000",
        }
      );
    });
    it("should allow adding and removing allowed addresses by owner", async () => {
      const allowedAddr = addr1;
      // add allowed address
      await nftOffersStorage.addAllowedAddress(allowedAddr, { from: owner });
      let isAllowed = await nftOffersStorage.isAllowedAddress(allowedAddr);
      assert.isTrue(isAllowed, "The address should be allowed");

      // remove allowed address
      await nftOffersStorage.removeAllowedAddress(allowedAddr, { from: owner });
      isAllowed = await nftOffersStorage.isAllowedAddress(allowedAddr);
      assert.isFalse(isAllowed, "The address should not be allowed");
    });
  });
});
