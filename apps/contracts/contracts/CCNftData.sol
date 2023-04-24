// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract CCNftData is OwnableUpgradeable {
  address private _owner;

  struct NftItem {
    uint256 tokenId;
    address creator;
  }

  NftItem public _nftItem;

  // TokenURI => Bool (Is used?)
  mapping(string => bool) public _usedTokenURIs;
  // NFT id => NftItem
  mapping(uint256 => NftItem) public _idToNftItem;
  // NFT id => Index
  mapping(uint256 => uint256) public _idToNftIndex;
  // NFT id => ERC20 share
  mapping(uint256 => uint256) public _idToOwnedIndex;
  // Account address => NFT Id => Index
  mapping(address => mapping(uint256 => uint256)) public _ownedTokens;
  // NFT id => Year => Extractions
  mapping(uint256 => mapping(uint256 => uint256))
    public _tokensExtractionsByYear;
  // NFT id => Address[]
  mapping(uint256 => address) _idToNftCreator;
  // Address => Booelan
  mapping(uint256 => address[]) addressesFromTokenId;

  uint256[] public _allNfts;

  constructor() {
    _owner = msg.sender;
  }

  function pushAllNfts(uint256 tokenId) external onlyOwner {
    _allNfts.push(tokenId);
  }

  function setAllNftsTokenIdByIndex(
    uint256 index,
    uint256 tokenId
  ) external onlyOwner {
    _allNfts[index] = tokenId;
  }

  function setTokenExtractionsByYear(
    uint256 tokenId,
    uint256 year,
    uint256 extractions
  ) external onlyOwner {
    _tokensExtractionsByYear[tokenId][year] = extractions;
  }

  function setIdToNftIndex(uint256 tokenId, uint256 index) external onlyOwner {
    _idToNftIndex[tokenId] = index;
  }

  function setIdToNftItem(uint256 tokenId, address creator) external onlyOwner {
    _nftItem = NftItem(tokenId, creator);
    _idToNftItem[tokenId] = _nftItem;
  }

  function setIdToNftCreator(
    uint256 tokenId,
    address creator
  ) external onlyOwner {
    _idToNftCreator[tokenId] = creator;
  }

  function setUsedTokenURI(string memory tokenURI) external onlyOwner {
    _usedTokenURIs[tokenURI] = true;
  }

  function setOwnedTokens(
    address owner,
    uint256 tokenId,
    uint256 index
  ) external onlyOwner {
    _ownedTokens[owner][tokenId] = index;
  }

  function setIdToOwnedIndex(
    uint256 tokenId,
    uint256 index
  ) external onlyOwner {
    _idToOwnedIndex[tokenId] = index;
  }

  function getAllNFTsLength() external view returns (uint256) {
    return _allNfts.length;
  }

  function getNftIndex(uint256 tokenId) external view returns (uint256) {
    return _idToNftIndex[tokenId];
  }

  function getTokenIdByIndex(uint256 index) external view returns (uint256) {
    return _allNfts[index];
  }

  function getOwnedTokens(
    address owner,
    uint256 tokenId
  ) external view returns (uint256) {
    return _ownedTokens[owner][tokenId];
  }

  function getIdToOwnedIndex(uint256 tokenId) external view returns (uint256) {
    return _idToOwnedIndex[tokenId];
  }

  function getIdToNftItem(
    uint256 tokenId
  ) external view returns (NftItem memory) {
    return _idToNftItem[tokenId];
  }

  function getNftCreator(uint256 tokenId) external view returns (address) {
    return _idToNftCreator[tokenId];
  }

  function getTokeURIUsed(string memory tokenURI) external view returns (bool) {
    return _usedTokenURIs[tokenURI];
  }

  function deleteIdToOwnedIndex(uint256 tokenId) external onlyOwner {
    delete _idToOwnedIndex[tokenId];
  }

  function deleteIdToNftIndex(uint256 tokenId) external onlyOwner {
    delete _idToNftIndex[tokenId];
  }

  function deleteOwnedTokens(
    address owner,
    uint256 tokenId
  ) external onlyOwner {
    delete _ownedTokens[owner][tokenId];
  }

  function popAllNfts() external onlyOwner {
    _allNfts.pop();
  }

  function getNftInfo(uint256 tokenId) external view returns (NftItem memory) {
    NftItem memory item = _idToNftItem[tokenId];
    return item;
  }

  function tokenOfOwnerByIndex(
    address owner,
    uint index
  ) public view returns (uint) {
    return _ownedTokens[owner][index];
  }

  function getTokenByIndex(uint index) public view returns (uint) {
    require(index < getTotalSupply(), "Index out of bounds");
    return _allNfts[index];
  }

  function getTotalSupply() public view returns (uint256) {
    return _allNfts.length;
  }
}
