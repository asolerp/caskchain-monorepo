// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

interface INftVendorStorage {
  struct Listing {
    uint256 tokenId;
    uint256 price;
    address seller;
  }

  function addAllowedAddress(address _address) external;

  function removeAllowedAddress(address _address) external;

  function isAllowedAddress(address _address) external view returns (bool);

  function getCollection() external view returns (address);

  function getCreator() external view returns (address);

  function getPriceByToken(
    address tokenAddress,
    uint256 tokenId
  ) external view returns (uint256);

  function getAcceptedERC20tokens() external view returns (address[] memory);

  function getListing(uint256 tokenId) external view returns (Listing memory);

  function getProcceds(address _address) external view returns (uint256);

  function getAllListedNftsLength() external view returns (uint256);

  function getAllListedNftsId() external view returns (uint256[] memory);

  function getListedNftsByIndex(
    uint256 index
  ) external view returns (uint256 tokenId);

  function getIsExcluded() external view returns (bool);

  function setCollection(address _collection) external;

  function setCreator(address _creator) external;

  function setListing(
    uint256 _tokenId,
    uint256 _price,
    address _seller
  ) external;

  function setProcceds(address _address, uint256 _amount) external;

  function setAcceptedToken(address _tokenAddress, bool _accepted) external;

  function setExcludedFromList(address _address, bool _excluded) external;

  function setERC20PriceByTokenId(
    address _tokenAddress,
    uint256 _tokenId,
    uint256 _price
  ) external;

  function pushToAllERC20Tokens(address _tokenAddress) external;

  function addTokenToAllTokensEnumeration(uint tokenId) external;

  function removeTokenFromAllListedTokensEnumeration(uint tokenId) external;

  function incrementListedItems() external;

  function decrementListedItems() external;

  function deleteListing(uint256 _tokenId) external;

  function deletePriceByTokenId(
    address _tokenAddress,
    uint256 _tokenId
  ) external;

  function getCurrentListedItemsCounter() external view returns (uint256);
}
