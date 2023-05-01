// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "./NftFractionsVendor.sol";
import "./NftFractionsStorage.sol";

import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract NftFractionsVendor is
  NftFractionsStorage,
  Initializable,
  OwnableUpgradeable,
  UUPSUpgradeable
{
  event BuyTokens(address buyer, uint256 amountOfMATIC, uint256 amountOfTokens);

  function initialize() public initializer {
    __Ownable_init();
    __UUPSUpgradeable_init();
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
    tokens[tokenAddress].tokenAddress = tokenAddress;
    tokens[tokenAddress].totalSupply = totalSupply;
    tokens[tokenAddress].listingPrice = listingPrice;
    tokens[tokenAddress].enableSell = enableSell;
  }

  function updateTokenVendorSellState(address tokenAddress, bool state) public {
    tokens[tokenAddress].enableSell = state;
  }

  function updateStateAddressVendor(
    address tokenAddress,
    bool state
  ) public onlyOwner {
    activeAddressVendor[tokenAddress] = state;
  }

  function getUnitPrice(address tokenAddress) external view returns (uint256) {
    return tokens[tokenAddress].totalSupply / tokens[tokenAddress].listingPrice;
  }

  function buyTokens(
    address tokenAddress
  ) public payable returns (uint256 tokenAmount) {
    require(msg.value > 0, "You need to send some MATIC to proceed");
    require(tokens[tokenAddress].enableSell == true, "Sell is not enabled");

    uint256 amountToBuy = (msg.value * tokens[tokenAddress].totalSupply) /
      tokens[tokenAddress].listingPrice;

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
    require(
      tokenAmountToSell > 0,
      "Specify an amount of token greater than zero"
    );
    require(tokens[tokenAddress].enableSell == true, "Sell is not enabled");
    uint256 userBalance = ERC20Upgradeable(tokenAddress).balanceOf(msg.sender);
    require(userBalance >= tokenAmountToSell, "You have insufficient tokens");

    uint256 amountOfETHToTransfer = (tokenAmountToSell *
      tokens[tokenAddress].listingPrice) / tokens[tokenAddress].totalSupply;
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
