const {
  BN,
  ether,
  expectEvent,
  expectRevert,
} = require("@openzeppelin/test-helpers");
const NftFractionToken = artifacts.require("NftFractionToken");
const CCNft = artifacts.require("CCNft");

contract("NftFractionToken", function ([curator, anotherAccount, buyer]) {
  const tokenURI1 = "https://ipfs.example.com/token1";
  const _name = "Fractional Token";
  const _symbol = "FTK";
  const _tokenId = new BN("1");
  const _totalSupply = ether("100");
  const _fee = new BN("1000"); // 10%
  const _listPrice = ether("1");

  beforeEach(async function () {
    this.token = await CCNft.new({ from: curator });
    this.fractionToken = await NftFractionToken.new();
    await this.fractionToken.initialize(
      curator,
      this.token.address,
      _tokenId,
      _totalSupply,
      _fee,
      _listPrice,
      _name,
      _symbol
    );

    await this.token.mintNFT(tokenURI1, { from: curator });
    await this.token.transferFrom(
      curator,
      this.fractionToken.address,
      _tokenId,
      { from: curator }
    );
  });

  it("should have correct curator", async function () {
    assert.equal(await this.fractionToken.curator(), curator);
  });

  it("should have correct ERC721 token", async function () {
    assert.equal(await this.fractionToken.token(), this.token.address);
  });

  it("should have correct token ID", async function () {
    const fractionTokenId = await this.fractionToken.id();
    assert.equal(fractionTokenId.toString(), _tokenId.toString());
  });

  it("should have correct name and symbol", async function () {
    assert.equal(await this.fractionToken.name(), _name);
    assert.equal(await this.fractionToken.symbol(), _symbol);
  });

  it("should have correct initial reserve price", async function () {
    const reservePrice = await this.fractionToken.reservePrice();
    assert.equal(reservePrice.toString(), _listPrice.toString());
  });

  it("should allow curator to update reserve price", async function () {
    const newPrice = ether("2");
    const receipt = await this.fractionToken.updateUserPrice(newPrice, {
      from: curator,
    });
    const reservePrice = await this.fractionToken.reservePrice();
    assert.equal(reservePrice.toString(), newPrice.toString());
    expectEvent(receipt, "PriceUpdate", { user: curator, price: newPrice });
  });

  it("should not allow non-curator to update reserve price", async function () {
    await expectRevert(
      this.fractionToken.updateUserPrice(ether("2"), { from: anotherAccount }),
      "You are not the curator"
    );
  });

  it("should allow curator to update fee", async function () {
    const newFee = new BN("500"); // 5%
    const receipt = await this.fractionToken.updateFee(newFee, {
      from: curator,
    });
    const fee = await this.fractionToken.fee();
    assert.equal(fee.toString(), newFee.toString());
    expectEvent(receipt, "FeeUpdate", { user: curator, price: newFee });
  });

  it("should not allow non-curator to update fee", async function () {
    await expectRevert(
      this.fractionToken.updateFee(new BN("500"), { from: anotherAccount }),
      "You are not the curator"
    );
  });

  it("should allow curator to update sale state", async function () {
    const newState = true;
    await this.fractionToken.updateSaleState(newState, { from: curator });
    assert.equal(await this.fractionToken.forSale(), newState);
  });

  it("should not allow non-curator to update sale state", async function () {
    await expectRevert(
      this.fractionToken.updateSaleState(true, { from: anotherAccount }),
      "You are not the curator"
    );
  });

  it("should allow purchase when for sale", async function () {
    await this.fractionToken.updateSaleState(true, { from: curator });
    await this.fractionToken.purchase({ from: buyer, value: _listPrice });
    assert.equal(await this.token.ownerOf(_tokenId), buyer);
    assert.equal(await this.fractionToken.forSale(), false);
    assert.equal(await this.fractionToken.canRedeem(), true);
  });

  it("should allow purchase when for sale", async function () {
    await this.fractionToken.updateSaleState(true, { from: curator });
    await this.fractionToken.purchase({ from: buyer, value: _listPrice });
    assert.equal(await this.token.ownerOf(_tokenId), buyer);
    assert.equal(await this.fractionToken.forSale(), false);
    assert.equal(await this.fractionToken.canRedeem(), true);
  });

  it("should not allow purchase with insufficient ether", async function () {
    await this.fractionToken.updateSaleState(true, { from: curator });
    await expectRevert(
      this.fractionToken.purchase({ from: buyer, value: ether("0.5") }),
      "Not enough ether sent"
    );
  });

  it("should allow redemption of tokens for ETH", async function () {
    await this.fractionToken.updateSaleState(true, { from: curator });
    await this.fractionToken.purchase({ from: buyer, value: _listPrice });
    const amountToRedeem = ether("20");
    await this.fractionToken.transfer(anotherAccount, amountToRedeem, {
      from: curator,
    });
    const initialBalance = await web3.eth.getBalance(anotherAccount);
    await this.fractionToken.redeem(amountToRedeem, {
      from: anotherAccount,
      gasPrice: 7,
    });

    const finalBalance = await web3.eth.getBalance(anotherAccount);
    const redeemedEther = new BN(finalBalance).sub(new BN(initialBalance));
    const expectedEther = amountToRedeem
      .mul(_listPrice)
      .div(_totalSupply)
      .mul(new BN("9"))
      .div(new BN("10")); // After 10% fee

    assert(
      redeemedEther.toString().substring(0, 3) -
        expectedEther.toString().substring(0, 3),
      1
    );
  });

  it("should not allow redemption of tokens for ETH when not allowed", async function () {
    await expectRevert(
      this.fractionToken.redeem(ether("20"), { from: anotherAccount }),
      "Redemption not available"
    );
  });

  it("should allow curator to withdraw ETH", async function () {
    await this.fractionToken.updateSaleState(true, { from: curator });
    await this.fractionToken.purchase({ from: buyer, value: _listPrice });
    const amountToRedeem = ether("20");
    await this.fractionToken.transfer(anotherAccount, amountToRedeem, {
      from: curator,
    });
    await this.fractionToken.redeem(amountToRedeem, {
      from: anotherAccount,
      gasPrice: 7,
    });

    const initialBalance = await web3.eth.getBalance(curator);
    await this.fractionToken.withdraw({ from: curator, gasPrice: 7 });

    const finalBalance = await web3.eth.getBalance(curator);
    const curatorEther = new BN(finalBalance).sub(new BN(initialBalance));
    const expectedEther = amountToRedeem
      .mul(_listPrice)
      .div(_totalSupply)
      .div(new BN("10")); // 10% fee

    assert(
      curatorEther.toString().substring(0, 3) -
        expectedEther.toString().substring(0, 3),
      1
    );
  });

  it("should not allow non-curator to withdraw ETH", async function () {
    await expectRevert(
      this.fractionToken.withdraw({ from: anotherAccount }),
      "You are not the curator"
    );
  });
});
