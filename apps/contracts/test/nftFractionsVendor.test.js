const { expectRevert, ether, balance } = require("@openzeppelin/test-helpers");

const NftFractionsVendor = artifacts.require("NftFractionsVendor");
const MockUSDT = artifacts.require("MockUSDT");

contract("NftFractionsVendor", function ([_, owner, buyer]) {
  beforeEach(async function () {
    this.vendor = await NftFractionsVendor.new({ from: owner });
    this.token = await MockUSDT.new("Mock Token", "MTK", ether("10000"), {
      from: owner,
    });

    // Constants
    this.totalSupply = ether("10000");
    this.listingPrice = ether("1");
  });

  describe("updateTokenVendor", function () {
    it("should update the token vendor", async function () {
      await this.vendor.updateTokenVendor(
        this.token.address,
        this.totalSupply,
        this.listingPrice,
        true,
        {
          from: owner,
        }
      );

      const tokenInfo = await this.vendor.tokens(this.token.address);
      assert.equal(tokenInfo.tokenAddress, this.token.address);
      assert(tokenInfo.totalSupply.eq(this.totalSupply));
      assert(tokenInfo.listingPrice.eq(this.listingPrice));
      assert.equal(tokenInfo.enableSell, true);
    });

    it("should not allow a non-owner to update the token vendor", async function () {
      await expectRevert(
        this.vendor.updateTokenVendor(
          this.token.address,
          this.totalSupply,
          this.listingPrice,
          true,
          {
            from: buyer,
          }
        ),
        "Ownable: caller is not the owner"
      );
    });
  });

  describe("buyTokens", function () {
    beforeEach(async function () {
      await this.vendor.updateTokenVendor(
        this.token.address,
        this.totalSupply,
        this.listingPrice,
        true,
        {
          from: owner,
        }
      );
      await this.token.transfer(this.vendor.address, ether("5000"), {
        from: owner,
      });
    });

    it("should allow buying tokens with MATIC", async function () {
      const initialBuyerBalance = await this.token.balanceOf(buyer);
      const sentMaticAmount = ether("0.5");
      const expectedTokenAmount = sentMaticAmount
        .mul(this.totalSupply)
        .div(this.listingPrice);

      await this.vendor.buyTokens(this.token.address, {
        from: buyer,
        value: sentMaticAmount,
      });

      const finalBuyerBalance = await this.token.balanceOf(buyer);
      assert(
        finalBuyerBalance.sub(initialBuyerBalance).eq(expectedTokenAmount)
      );
    });

    it("should not allow buying tokens when sell is disabled", async function () {
      await this.vendor.updateTokenVendorSellState(this.token.address, false, {
        from: owner,
      });

      await expectRevert(
        this.vendor.buyTokens(this.token.address, {
          from: buyer,
          value: ether("0.5"),
        }),
        "Sell is not enabled"
      );
    });
  });

  describe("sellTokens", function () {
    beforeEach(async function () {
      await this.vendor.updateTokenVendor(
        this.token.address,
        this.totalSupply,
        this.listingPrice,
        true,
        {
          from: owner,
        }
      );
      await this.token.transfer(this.vendor.address, ether("5000"), {
        from: owner,
      });
      await this.vendor.buyTokens(this.token.address, {
        from: buyer,
        value: ether("0.5"),
      });
    });

    it("should allow selling tokens for MATIC", async function () {
      const initialBuyerTokenBalance = await this.token.balanceOf(buyer);

      const tokenAmountToSell = ether("2500");

      // Approve the vendor to spend buyer's tokens
      await this.token.approve(this.vendor.address, tokenAmountToSell, {
        from: buyer,
      });

      await this.vendor.sellTokens(tokenAmountToSell, this.token.address, {
        from: buyer,
      });

      const finalBuyerTokenBalance = await this.token.balanceOf(buyer);

      assert(
        initialBuyerTokenBalance
          .sub(finalBuyerTokenBalance)
          .eq(tokenAmountToSell)
      );
    });
    it("should not allow selling tokens when sell is disabled", async function () {
      await this.vendor.updateTokenVendorSellState(this.token.address, false, {
        from: owner,
      });
      await expectRevert(
        this.vendor.sellTokens(ether("2500"), this.token.address, {
          from: buyer,
        }),
        "Sell is not enabled"
      );
    });
  });

  describe("withdraw", function () {
    beforeEach(async function () {
      await this.vendor.updateTokenVendor(
        this.token.address,
        this.totalSupply,
        this.listingPrice,
        true,
        {
          from: owner,
        }
      );
      await this.token.transfer(this.vendor.address, ether("5000"), {
        from: owner,
      });
      await this.vendor.buyTokens(this.token.address, {
        from: buyer,
        value: ether("0.5"),
      });
    });

    it("should allow the owner to withdraw", async function () {
      const initialOwnerBalance = await balance.current(owner);
      await this.vendor.withdraw({ from: owner });

      const finalOwnerBalance = await balance.current(owner);
      assert(finalOwnerBalance.gt(initialOwnerBalance));
    });

    it("should not allow a non-owner to withdraw", async function () {
      await expectRevert(
        this.vendor.withdraw({ from: buyer }),
        "Ownable: caller is not the owner"
      );
    });
  });
});
