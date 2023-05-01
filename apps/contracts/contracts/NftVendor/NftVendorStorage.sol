// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";

contract NftVendorStorage {
  using CountersUpgradeable for CountersUpgradeable.Counter;

  struct Listing {
    uint256 tokenId;
    uint256 price;
    address seller;
  }

  address internal collection;
  address internal creator;
  uint256[] internal _allListedNfts;
  address[] internal _allERC20Tokens;

  CountersUpgradeable.Counter internal _listedItems;

  mapping(uint256 => Listing) internal s_listings;
  mapping(address => uint256) internal s_proceeds;
  // NFT id => Index
  mapping(uint256 => uint256) internal _idToNftIndex;
  // Address => Booelan
  mapping(address => bool) internal s_excludedList;
  // Accepted ERC20 Tokens
  mapping(address => bool) internal s_acceptedTokens;
  // Price ERC20 Tokens
  mapping(address => mapping(uint256 => uint256)) internal s_priceTokens;

  function incrementListedItems() internal {
    _listedItems.increment();
  }

  function decrementListedItems() internal {
    _listedItems.decrement();
  }

  function getCurrentListedItemsCounter() internal view returns (uint256) {
    return _listedItems.current();
  }
}
