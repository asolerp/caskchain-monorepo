// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "./NftFractionsVendor.sol";
import "./NftFractionsFactoryStorage.sol";

import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

import "./INftFractionsVendorStorage.sol";

contract NftFractionsVendor is
  Initializable,
  OwnableUpgradeable,
  UUPSUpgradeable
{
  event BuyTokens(address buyer, uint256 amountOfMATIC, uint256 amountOfTokens);

  INftFractionsVendorStorage private _storage;

  function initialize(address storageAddress) public initializer {
    __Ownable_init();
    __UUPSUpgradeable_init();
    _storage = INftFractionsVendorStorage(storageAddress);
  }

  function _authorizeUpgrade(address) internal override onlyOwner {}

  function updateTokenVendor(
    address tokenAddress,
    uint256 totalSupply,
    uint256 listingPrice,
    bool enableSell
  ) public onlyOwner {
    require(totalSupply > 0, "Token per eth must be higher than 0");
    require(listingPrice > 0, "Token per eth must be higher than 0");

    _storage.setToken(tokenAddress, totalSupply, listingPrice, enableSell);
  }

  function updateTokenVendorState(address tokenAddress, bool state) public {
    _storage.updateTokenVendorSellState(tokenAddress, state);
  }

  function updateStateAddress(
    address tokenAddress,
    bool state
  ) public onlyOwner {
    _storage.updateStateAddressVendor(tokenAddress, state);
  }

  function getTokenInfo(
    address tokenAddress
  ) external view returns (INftFractionsVendorStorage.TokenPaymentInfo memory) {
    INftFractionsVendorStorage.TokenPaymentInfo memory token = _storage
      .getTokenPaymentInfo(tokenAddress);
    return token;
  }

  function getUnitPrice(address tokenAddress) external view returns (uint256) {
    INftFractionsVendorStorage.TokenPaymentInfo memory token = _storage
      .getTokenPaymentInfo(tokenAddress);
    return token.totalSupply / token.listingPrice;
  }

  function buyTokens(
    address tokenAddress
  ) public payable returns (uint256 tokenAmount) {
    INftFractionsVendorStorage.TokenPaymentInfo memory token = _storage
      .getTokenPaymentInfo(tokenAddress);

    require(msg.value > 0, "You need to send some MATIC to proceed");
    require(token.enableSell == true, "Sell is not enabled");

    uint256 amountToBuy = (msg.value * token.totalSupply) / token.listingPrice;

    uint256 vendorBalance = ERC20Upgradeable(tokenAddress).balanceOf(
      address(this)
    );
    require(vendorBalance >= amountToBuy, "Vendor has insufficient tokens");

    bool sent = ERC20Upgradeable(tokenAddress).transfer(
      msg.sender,
      amountToBuy
    );
    require(sent, "Failed to transfer token to user");

    return amountToBuy;
  }

  function sellTokens(uint256 tokenAmountToSell, address tokenAddress) public {
    INftFractionsVendorStorage.TokenPaymentInfo memory token = _storage
      .getTokenPaymentInfo(tokenAddress);

    require(
      tokenAmountToSell > 0,
      "Specify an amount of token greater than zero"
    );
    require(token.enableSell == true, "Sell is not enabled");
    uint256 userBalance = ERC20Upgradeable(tokenAddress).balanceOf(msg.sender);
    require(userBalance >= tokenAmountToSell, "You have insufficient tokens");

    uint256 amountOfETHToTransfer = (tokenAmountToSell * token.listingPrice) /
      token.totalSupply;
    uint256 ownerETHBalance = address(this).balance;
    require(
      ownerETHBalance >= amountOfETHToTransfer,
      "Vendor has insufficient funds"
    );
    bool sent = ERC20Upgradeable(tokenAddress).transferFrom(
      msg.sender,
      address(this),
      tokenAmountToSell
    );
    require(sent, "Failed to transfer tokens from user to vendor");

    (sent, ) = msg.sender.call{ value: amountOfETHToTransfer }("");
    require(sent, "Failed to send ETH to the user");
  }

  function withdraw() public onlyOwner {
    uint256 ownerBalance = address(this).balance;
    require(ownerBalance > 0, "No ETH present in Vendor");
    (bool sent, ) = msg.sender.call{ value: address(this).balance }("");
    require(sent, "Failed to withdraw");
  }
}
