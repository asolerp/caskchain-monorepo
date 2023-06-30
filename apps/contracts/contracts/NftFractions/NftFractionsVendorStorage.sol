//SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
import "@openzeppelin/contracts/access/Ownable.sol";

contract NftFractionsVendorStorage is Ownable {
  struct TokenPaymentInfo {
    address tokenAddress;
    uint totalSupply;
    uint listingPrice;
    bool enableSell;
  }

  // Address => Boolean
  mapping(address => bool) public allowedAddresses;

  mapping(address => TokenPaymentInfo) public tokens;
  mapping(address => bool) public activeAddressVendor;

  modifier onlyAllowed() {
    require(allowedAddresses[msg.sender], "Caller is not allowed");
    _;
  }

  /////////////////////
  // ALLOWED ADDRESSES MANAGEMENT //
  /////////////////////

  function addAllowedAddress(address _address) public onlyOwner {
    allowedAddresses[_address] = true;
  }

  function removeAllowedAddress(address _address) public onlyOwner {
    allowedAddresses[_address] = false;
  }

  function isAllowedAddress(address _address) public view returns (bool) {
    return allowedAddresses[_address];
  }

  /////////////////////
  // GETTER //
  /////////////////////

  function getTokenPaymentInfo(
    address tokenAddress
  ) public view returns (TokenPaymentInfo memory) {
    return tokens[tokenAddress];
  }

  /////////////////////
  // SETTER //
  /////////////////////

  function updateTokenVendorSellState(
    address tokenAddress,
    bool state
  ) public onlyAllowed {
    tokens[tokenAddress].enableSell = state;
  }

  function updateStateAddressVendor(
    address tokenAddress,
    bool state
  ) public onlyAllowed {
    activeAddressVendor[tokenAddress] = state;
  }

  function setToken(
    address _token,
    uint _totalSupply,
    uint _listingPrice,
    bool _enableSell
  ) public onlyAllowed {
    tokens[_token] = TokenPaymentInfo(
      _token,
      _totalSupply,
      _listingPrice,
      _enableSell
    );
  }
}
