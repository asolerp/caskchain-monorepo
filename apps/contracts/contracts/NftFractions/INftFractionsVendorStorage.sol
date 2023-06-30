// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

interface INftFractionsVendorStorage {
  struct TokenPaymentInfo {
    address tokenAddress;
    uint totalSupply;
    uint listingPrice;
    bool enableSell;
  }

  function getTokenPaymentInfo(
    address tokenAddress
  ) external view returns (TokenPaymentInfo memory);

  function setToken(
    address _token,
    uint _totalSupply,
    uint _listingPrice,
    bool _enableSell
  ) external;

  function updateTokenVendorSellState(
    address tokenAddress,
    bool state
  ) external;

  function updateStateAddressVendor(address tokenAddress, bool state) external;
}
