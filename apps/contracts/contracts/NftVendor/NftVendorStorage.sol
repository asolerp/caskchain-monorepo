// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NftVendorStorage is Ownable {
  using Counters for Counters.Counter;

  struct Listing {
    uint256 tokenId;
    uint256 price;
    address seller;
  }

  Listing internal _listing;

  uint256[] internal _allListedNfts;
  address[] internal _allERC20Tokens;

  Counters.Counter internal _listedItems;

  // Address => Boolean
  mapping(address => bool) public allowedAddresses;

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
  // GETTERS //
  /////////////////////

  function getIsExcluded() external view returns (bool) {
    bool isExcluded = s_excludedList[msg.sender] == true;
    return isExcluded;
  }

  function getPriceByToken(
    address tokenAddress,
    uint256 tokenId
  ) external view returns (uint256) {
    return s_priceTokens[tokenAddress][tokenId];
  }

  function getAcceptedERC20tokens() external view returns (address[] memory) {
    return _allERC20Tokens;
  }

  function getListing(uint256 tokenId) external view returns (Listing memory) {
    return s_listings[tokenId];
  }

  function getProcceds(address _address) external view returns (uint256) {
    return s_proceeds[_address];
  }

  function getAllListedNftsLength() external view returns (uint256) {
    return _allListedNfts.length;
  }

  function getListedNftsByIndex(
    uint256 index
  ) external view returns (uint256 tokenId) {
    return _allListedNfts[index];
  }

  function getAllListedNftsId() external view returns (uint256[] memory) {
    return _allListedNfts;
  }

  /////////////////////
  // SETTERS //
  /////////////////////

  function setAcceptedToken(
    address _tokenAddress,
    bool _accepted
  ) public onlyAllowed {
    s_acceptedTokens[_tokenAddress] = _accepted;
  }

  function setERC20PriceByTokenId(
    address _tokenAddress,
    uint256 _tokenId,
    uint256 _price
  ) public onlyAllowed {
    s_priceTokens[_tokenAddress][_tokenId] = _price;
  }

  function setListing(
    uint256 _tokenId,
    uint256 _price,
    address _seller
  ) public onlyAllowed {
    s_listings[_tokenId] = Listing(_tokenId, _price, _seller);
  }

  function setProcceds(address _address, uint256 _amount) public onlyAllowed {
    s_proceeds[_address] = _amount;
  }

  function setExcludedFromList(
    address _address,
    bool _excluded
  ) public onlyAllowed {
    s_excludedList[_address] = _excluded;
  }

  function pushToAllERC20Tokens(address _tokenAddress) public onlyAllowed {
    _allERC20Tokens.push(_tokenAddress);
  }

  function addTokenToAllTokensEnumeration(uint tokenId) public onlyAllowed {
    _idToNftIndex[tokenId] = _allListedNfts.length;
    incrementListedItems();
    _allListedNfts.push(tokenId);
  }

  function removeTokenFromAllListedTokensEnumeration(
    uint tokenId
  ) public onlyAllowed {
    uint lastTokenIndex = _allListedNfts.length - 1;
    uint tokenIndex = _idToNftIndex[tokenId];
    uint lastTokenId = _allListedNfts[lastTokenIndex];

    _allListedNfts[tokenIndex] = lastTokenId;
    _idToNftIndex[lastTokenId] = tokenIndex;
    decrementListedItems();

    delete _idToNftIndex[tokenId];
    _allListedNfts.pop();
  }

  function incrementListedItems() internal onlyAllowed {
    _listedItems.increment();
  }

  function decrementListedItems() internal onlyAllowed {
    _listedItems.decrement();
  }

  function deletePriceByTokenId(
    address _tokenAddress,
    uint256 _tokenId
  ) public onlyAllowed {
    delete s_priceTokens[_tokenAddress][_tokenId];
  }

  function deleteListing(uint256 _tokenId) public onlyAllowed {
    delete s_listings[_tokenId];
  }

  function getCurrentListedItemsCounter()
    public
    view
    onlyAllowed
    returns (uint256)
  {
    return _listedItems.current();
  }
}
