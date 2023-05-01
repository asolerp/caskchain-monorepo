// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

interface ICCNftStorage {
  struct NftItem {
    uint256 tokenId;
    address creator;
  }

  // SETTERS
  function pushAllNfts(uint256 tokenId) external;

  function pushAddressFromTokenId(uint256 tokenId, address creator) external;

  function setAllNftsTokenIdByIndex(uint256 index, uint256 tokenId) external;

  function setTokenExtractionsByYear(
    uint256 tokenId,
    uint256 year,
    uint256 extractions
  ) external;

  function setIdToNftIndex(uint256 tokenId, uint256 index) external;

  function setIdToNftItem(uint256 tokenId, address creator) external;

  function setIdToNftCreator(uint256 tokenId, address creator) external;

  function setUsedTokenURI(string memory tokenURI) external;

  function setOwnedTokens(
    address owner,
    uint256 tokenId,
    uint256 index
  ) external;

  function setIdToOwnedIndex(uint256 tokenId, uint256 index) external;

  // GETTERS
  function getTokenIdOfOwnerByIndex(
    address owner,
    uint index
  ) external view returns (uint);

  function getAddressFromTokenId(
    uint256 tokenId
  ) external view returns (address[] memory);

  function getTokenByIndex(uint index) external view returns (uint);

  function getTotalSupply() external view returns (uint256);

  function getNftIndex(uint256 tokenId) external view returns (uint256);

  function getTokenIdByIndex(uint256 index) external view returns (uint256);

  function getIdToOwnedIndex(uint256 tokenId) external view returns (uint256);

  function getIdToNftItem(
    uint256 tokenId
  ) external view returns (NftItem memory);

  function getNftCreator(uint256 tokenId) external view returns (address);

  function getTokeURIUsed(string memory tokenURI) external view returns (bool);

  // DELETE
  function deleteIdToOwnedIndex(uint256 tokenId) external;

  function deleteIdToNftIndex(uint256 tokenId) external;

  function deleteOwnedTokens(address owner, uint256 tokenId) external;

  function popAllNfts() external;

  function popAddressFromTokenId(uint256 tokenId) external;
}
