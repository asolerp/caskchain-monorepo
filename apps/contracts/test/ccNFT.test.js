const CCNft = artifacts.require("CCNft");
const CCNftStorage = artifacts.require("CCNftStorage");

contract("CCNft", (accounts) => {
  const [owner, user1] = accounts;
  const tokenIdOne = "1";
  const tokenURI = "ipfs://tokenURI";
  const invalidTokenURI = "ipfs://invalidTokenURI";
  let instance;
  let storageMock;

  beforeEach(async () => {
    storageMock = await CCNftStorage.new();
    instance = await CCNft.new();
    await instance.initialize(storageMock.address);
    await storageMock.addAllowedAddress(instance.address);
  });

  describe("mintNFT", () => {
    it("successfully mints an NFT for the owner with a valid token URI", async () => {
      await instance.mintNFT(tokenURI, { from: owner });
      const ownerBalance = await instance.balanceOf(owner);
      assert.equal(ownerBalance.toString(), "1");
    });

    it("fails to mint an NFT with the same token URI", async () => {
      await instance.mintNFT(tokenURI, { from: owner });
      try {
        await instance.mintNFT(tokenURI, { from: owner });
      } catch (error) {
        assert.match(error.message, /Token URI already exists/);
      }
    });

    it("fails to mint an NFT with an empty token URI", async () => {
      try {
        await instance.mintNFT("", { from: owner });
      } catch (error) {
        assert.match(error.message, /Token URI must not be empty/);
      }
    });

    it("fails to mint an NFT if not called by the owner", async () => {
      try {
        await instance.mintNFT(tokenURI, { from: user1 });
      } catch (error) {
        assert.match(error.message, /Ownable: caller is not the owner/);
      }
    });
  });

  describe("burn", () => {
    beforeEach(async () => {
      await instance.mintNFT(tokenURI, { from: owner });
    });

    it("successfully burns a token", async () => {
      await instance.burn(tokenIdOne, { from: owner });
      const balance = await instance.balanceOf(owner);
      assert.equal(balance.toString(), "0");
    });

    it("fails to burn an invalid token", async () => {
      try {
        await instance.burn("999", { from: owner });
      } catch (error) {
        assert.match(error.message, /Token does not exist/);
      }
    });

    it("fails to burn if not called by the owner", async () => {
      try {
        await instance.burn(tokenIdOne, { from: user1 });
      } catch (error) {
        assert.match(error.message, /Ownable: caller is not the owner/);
      }
    });
  });

  describe("checkIfTokenURIExists", () => {
    it("returns true if token URI exists", async () => {
      await instance.mintNFT(tokenURI, { from: owner });
      const exists = await instance.checkIfTokenURIExists(tokenURI);
      assert.isTrue(exists);
    });

    it("returns false if token URI does not exist", async () => {
      const exists = await instance.checkIfTokenURIExists(invalidTokenURI);
      assert.isFalse(exists);
    });
  });

  describe("getCreatorNft", () => {
    it("returns correct creator for a given token Id", async () => {
      await instance.mintNFT(tokenURI, { from: owner });
      const creator = await instance.getCreatorNft(tokenIdOne);
      assert.equal(creator, owner);
    });
  });

  describe("getNftInfo", () => {
    it("returns valid info for a given token Id", async () => {
      await instance.mintNFT(tokenURI, { from: owner });
      const nftInfo = await instance.getNftInfo(tokenIdOne);
      const nftTokenURI = await instance.checkIfTokenURIExists(tokenURI);

      assert.equal(nftInfo.creator, owner);
      assert.equal(nftTokenURI, true);
    });
  });

  describe("ownedTokens", () => {
    beforeEach(async () => {
      await instance.mintNFT(tokenURI, { from: owner });
    });

    it("returns a token owned by an address", async () => {
      const ownedTokens = await instance.getOwnedNfts({ from: owner });
      assert.equal(ownedTokens[0].creator, owner);
    });

    it("returns no owned tokens for an address without owned tokens", async () => {
      const ownedTokens = await instance.getOwnedNfts({ from: user1 });
      assert.isEmpty(ownedTokens);
    });
  });

  describe("getNftTotalSupply", () => {
    it("returns total supply of NFTs", async () => {
      const initialTotalSupply = await instance.getNftTotalSupply();
      assert.equal(initialTotalSupply.toString(), "0");

      await instance.mintNFT(tokenURI, { from: owner });
      const newTotalSupply = await instance.getNftTotalSupply();
      assert.equal(newTotalSupply.toString(), "1");
    });
  });

  describe("getAllNFTs", () => {
    it("returns all NFTs", async () => {
      await instance.mintNFT(tokenURI, { from: owner });

      const allNFTs = await instance.getAllNFTs(1, 1);
      assert.equal(allNFTs[0].creator, owner);
    });
  });

  describe("getAllNftsOnSale", () => {
    beforeEach(async () => {
      await instance.mintNFT(tokenURI, { from: owner });
    });

    it("returns all NFTs on sale using token Ids", async () => {
      const nftsOnSale = await instance.getAllNftsOnSale([tokenIdOne]);
      assert.equal(nftsOnSale[0].creator, owner);
    });
  });
});
