const {
  BN,
  ether,
  expectEvent,
  expectRevert,
} = require("@openzeppelin/test-helpers");

const CCNft = artifacts.require("CCNft");

contract("CCNft", function (accounts) {
  const [owner, account1] = accounts;
  const tokenURI1 = "https://ipfs.example.com/token1";
  const tokenURI2 = "https://ipfs.example.com/token2";
  const tokenURI3 = "https://ipfs.example.com/token3";

  beforeEach(async function () {
    this.contract = await CCNft.new({ from: owner });
  });

  describe("mintNFT", function () {
    it("should mint a new NFT with given tokenURI", async function () {
      const receipt = await this.contract.mintNFT(tokenURI1, { from: owner });
      expectEvent(receipt, "Mint", {
        owner: owner,
        tokenId: new BN("1"),
        tokenURI: tokenURI1,
      });

      const tokenId = await this.contract.tokenByIndex(0);
      assert.equal(tokenId.toString(), "1");

      const nftItem = await this.contract.getNftInfo(tokenId);
      assert.equal(nftItem.tokenId.toString(), "1");
      assert.equal(nftItem.creator, owner);
    });

    it("should revert when trying to mint NFT with existing tokenURI", async function () {
      await this.contract.mintNFT(tokenURI1, { from: owner });
      await expectRevert(
        this.contract.mintNFT(tokenURI1, { from: owner }),
        "Token URI already exists"
      );
    });

    it("should revert when trying to mint NFT by non-owner", async function () {
      await expectRevert(
        this.contract.mintNFT(tokenURI1, { from: account1 }),
        "Ownable: caller is not the owner"
      );
    });
  });

  describe("burn", function () {
    beforeEach(async function () {
      await this.contract.mintNFT(tokenURI1, { from: owner });
    });

    it("should burn NFT successfully", async function () {
      await this.contract.burn(1, { from: owner });

      await expectRevert(
        this.contract.getNftInfo(1),
        "ERC721: invalid token ID"
      );
    });

    it("should revert when trying to burn NFT by non-owner", async function () {
      await expectRevert(
        this.contract.burn(1, { from: account1 }),
        "Ownable: caller is not the owner"
      );
    });
  });

  describe("getAllNFTs", function () {
    it("should burn NFT successfully", async function () {
      const expected = [];
      const actual = await this.contract.getAllNFTs();
      assert.deepEqual(actual, expected, "Should return an empty array");
    });

    it("should return all NFTs when there are some", async function () {
      // Mint some NFTs
      await this.contract.mintNFT(tokenURI3, { from: owner });

      // Get the expected result
      const expected = [["1", "0xFfDaCbFA3F4E227c482275b54B4c815154f0100a"]];

      // Get the actual result
      const actual = await this.contract.getAllNFTs();
      // Compare the actual and expected results
      assert.deepEqual(actual, expected, "Should return all NFTs");
    });
  });

  describe("getNftInfo", function () {
    beforeEach(async function () {
      await this.contract.mintNFT(tokenURI1, { from: owner });
    });

    it("should return NFT item information correctly", async function () {
      const nftItem = await this.contract.getNftInfo(1);

      assert.equal(nftItem.tokenId.toString(), "1");
      assert.equal(nftItem.creator, owner);
    });

    it("should revert when getting information of nonexistent NFT", async function () {
      await expectRevert(
        this.contract.getNftInfo(2),
        "ERC721: invalid token ID"
      );
    });
  });

  describe("totalSupply", function () {
    beforeEach(async function () {
      await this.contract.mintNFT(tokenURI1, { from: owner });
      await this.contract.mintNFT(tokenURI2, { from: owner });
    });

    it("should return the correct total supply", async function () {
      const totalSupply = await this.contract.totalSupply();

      assert.equal(totalSupply.toString(), "2");
    });
  });

  describe("tokenByIndex", function () {
    beforeEach(async function () {
      await this.contract.mintNFT(tokenURI1, { from: owner });
      await this.contract.mintNFT(tokenURI2, { from: owner });
    });

    it("should return the correct token ID by index", async function () {
      const tokenId1 = await this.contract.tokenByIndex(0);
      const tokenId2 = await this.contract.tokenByIndex(1);

      assert.equal(tokenId1.toString(), "1");
      assert.equal(tokenId2.toString(), "2");
    });

    it("should revert when trying to get token ID by an out of bounds index", async function () {
      await expectRevert(this.contract.tokenByIndex(2), "Index out of bounds");
    });
  });

  describe("tokenOfOwnerByIndex", function () {
    beforeEach(async function () {
      await this.contract.mintNFT(tokenURI1, { from: owner });
      await this.contract.mintNFT(tokenURI2, { from: owner });
    });

    it("should return the correct token ID by index for the owner", async function () {
      const tokenId1 = await this.contract.tokenOfOwnerByIndex(owner, 0);
      const tokenId2 = await this.contract.tokenOfOwnerByIndex(owner, 1);

      assert.equal(tokenId1.toString(), "1");
      assert.equal(tokenId2.toString(), "2");
    });

    it("should revert when trying to get token ID by an out of bounds index for the owner", async function () {
      await expectRevert(
        this.contract.tokenOfOwnerByIndex(owner, 2),
        "Index out of bounds"
      );
    });
  });

  describe("_beforeTokenTransfer", function () {
    it("should mint a new token and add it to owner and all tokens enumeration", async function () {
      await this.contract.mintNFT(tokenURI1, { from: owner });

      const balance = await this.contract.balanceOf(owner);
      assert.equal(balance.toString(), "1");

      const totalSupply = await this.contract.totalSupply();
      assert.equal(totalSupply.toString(), "1");
    });

    it("should transfer a token and update owner and all tokens enumeration", async function () {
      await this.contract.mintNFT(tokenURI1, { from: owner });
      await this.contract.transferFrom(owner, account1, 1, { from: owner });

      const balanceOwner = await this.contract.balanceOf(owner);
      assert.equal(balanceOwner.toString(), "0");

      const balanceAccount1 = await this.contract.balanceOf(account1);
      assert.equal(balanceAccount1.toString(), "1");
    });

    it("should burn a token and remove it from owner and all tokens enumeration", async function () {
      await this.contract.mintNFT(tokenURI1, { from: owner });
      await this.contract.burn(1, { from: owner });

      const balance = await this.contract.balanceOf(owner);
      assert.equal(balance.toString(), "0");

      const totalSupply = await this.contract.totalSupply();
      assert.equal(totalSupply.toString(), "0");
    });
  });
});
