const CCNftStorage = artifacts.require("CCNftStorage");

contract("CCNftStorage", (accounts) => {
  let ccNftStorage;

  beforeEach(async () => {
    ccNftStorage = await CCNftStorage.new({ from: accounts[0] });
  });

  describe("allowedAddresses", () => {
    it("should add allowed address", async () => {
      const allowedAddress = accounts[1];
      await ccNftStorage.addAllowedAddress(allowedAddress);
      const isAllowedAddress = await ccNftStorage.isAllowedAddress(
        allowedAddress
      );
      assert.equal(isAllowedAddress, true);
    });

    it("should remove allowed address", async () => {
      const allowedAddress = accounts[1];
      await ccNftStorage.addAllowedAddress(allowedAddress);
      await ccNftStorage.removeAllowedAddress(allowedAddress);
      const isAllowedAddress = await ccNftStorage.isAllowedAddress(
        allowedAddress
      );
      assert.equal(isAllowedAddress, false);
    });
  });

  describe("allNfts", () => {
    it("should push all NFTs", async () => {
      const tokenId = 1;
      await ccNftStorage.addAllowedAddress(accounts[0]);
      await ccNftStorage.pushAllNfts(tokenId);
      const totalSupply = await ccNftStorage.getTotalSupply();
      const token = await ccNftStorage.getTokenByIndex(0);
      assert.equal(totalSupply, 1);
      assert.equal(token, tokenId);
    });

    it("should set all NFTs by index", async () => {
      const tokenId1 = 1;
      const tokenId2 = 2;
      await ccNftStorage.addAllowedAddress(accounts[0]);
      await ccNftStorage.pushAllNfts(tokenId1);
      await ccNftStorage.pushAllNfts(tokenId2);
      await ccNftStorage.setAllNftsTokenIdByIndex(0, tokenId2);
      const token1 = await ccNftStorage.getTokenByIndex(0);
      const token2 = await ccNftStorage.getTokenByIndex(1);
      assert.equal(token1, tokenId2);
      assert.equal(token2, tokenId2);
    });
  });

  describe("idToNftIndex", () => {
    it("should set NFT index", async () => {
      const tokenId = 1;
      const index = 0;
      await ccNftStorage.addAllowedAddress(accounts[0]);
      await ccNftStorage.setIdToNftIndex(tokenId, index);
      const nftIndex = await ccNftStorage.getNftIndex(tokenId);
      assert.equal(nftIndex, index);
    });

    it("should delete NFT index", async () => {
      const tokenId = 1;
      const index = 0;
      await ccNftStorage.addAllowedAddress(accounts[0]);
      await ccNftStorage.setIdToNftIndex(tokenId, index);
      await ccNftStorage.deleteIdToNftIndex(tokenId);
      const nftIndex = await ccNftStorage.getNftIndex(tokenId);
      assert.equal(nftIndex.toString(), 0);
    });
  });

  describe("idToNftItem", () => {
    it("should set NFT item", async () => {
      const tokenId = 1;
      const creator = accounts[0];
      await ccNftStorage.addAllowedAddress(accounts[0]);
      await ccNftStorage.setIdToNftItem(tokenId, creator);
      const nftItem = await ccNftStorage.getIdToNftItem(tokenId);
      assert.equal(nftItem.tokenId, tokenId);
      assert.equal(nftItem.creator, creator);
    });
  });

  describe("idToOwnedIndex", () => {
    it("should set owned index", async () => {
      const tokenId = 1;
      const index = 0;
      await ccNftStorage.addAllowedAddress(accounts[0]);
      await ccNftStorage.setIdToOwnedIndex(tokenId, index);
      const ownedIndex = await ccNftStorage.getIdToOwnedIndex(tokenId);
      assert.equal(ownedIndex, index);
    });

    it("should delete owned index", async () => {
      const tokenId = 1;
      const index = 0;
      await ccNftStorage.addAllowedAddress(accounts[0]);
      await ccNftStorage.setIdToOwnedIndex(tokenId, index);
      await ccNftStorage.deleteIdToOwnedIndex(tokenId);
      const ownedIndex = await ccNftStorage.getIdToOwnedIndex(tokenId);
      assert.equal(ownedIndex.toString(), 0);
    });
  });

  describe("idToNftCreator", () => {
    it("should set NFT creator", async () => {
      const tokenId = 1;
      const creator = accounts[0];
      await ccNftStorage.addAllowedAddress(accounts[0]);
      await ccNftStorage.setIdToNftCreator(tokenId, creator);
      const nftCreator = await ccNftStorage.getNftCreator(tokenId);
      assert.equal(nftCreator, creator);
    });
  });

  describe("ownedTokens", () => {
    it("should set owned token", async () => {
      const owner = accounts[0];
      const tokenId = 1;
      const index = 0;
      await ccNftStorage.addAllowedAddress(accounts[0]);
      await ccNftStorage.setOwnedTokens(owner, tokenId, index);
      const ownedTokenId = await ccNftStorage.getTokenIdOfOwnerByIndex(
        owner,
        index
      );
      assert.equal(ownedTokenId, tokenId);
    });
    it("should delete owned token", async () => {
      const owner = accounts[0];
      const tokenId = 1;
      const index = 0;
      await ccNftStorage.addAllowedAddress(accounts[0]);
      await ccNftStorage.setOwnedTokens(owner, tokenId, index);
      await ccNftStorage.deleteOwnedTokens(owner, index);
      const ownedTokenId = await ccNftStorage.getTokenIdOfOwnerByIndex(
        owner,
        index
      );
      console.log("OWNED TOKEN ID: ", ownedTokenId.toString());
      assert.equal(ownedTokenId.toString(), 0);
    });
  });

  describe("tokensExtractionsByYear", () => {
    it("should set token extractions by year", async () => {
      const tokenId = 1;
      const year = 2023;
      const extractions = 1;
      await ccNftStorage.addAllowedAddress(accounts[0]);
      await ccNftStorage.setTokenExtractionsByYear(tokenId, year, extractions);
      const tokenExtractions = await ccNftStorage._tokensExtractionsByYear(
        tokenId,
        year
      );
      assert.equal(tokenExtractions, extractions);
    });
  });

  describe("usedTokenURIs", () => {
    it("should set used token URI", async () => {
      const tokenURI = "http://example.com/token/1";
      await ccNftStorage.addAllowedAddress(accounts[0]);
      await ccNftStorage.setUsedTokenURI(tokenURI);
      const isTokenURIUsed = await ccNftStorage.getTokeURIUsed(tokenURI);
      assert.equal(isTokenURIUsed, true);
    });
  });
});
