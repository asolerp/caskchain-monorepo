// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
import "@openzeppelin/contracts/access/Ownable.sol";

contract CCNftStorage is Ownable {
  struct NftItem {
    uint256 tokenId;
    address creator;
  }

  NftItem private _nftItem;

  // Address => Boolean
  mapping(address => bool) public allowedAddresses;

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
  mapping(uint256 => address) public _idToNftCreator;

  uint256[] public _allNfts;

  /////////////////////
  // MODIFIERS //
  /////////////////////

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
  // SETTERS //
  /////////////////////

  function pushAllNfts(uint256 tokenId) public onlyAllowed {
    _allNfts.push(tokenId);
  }

  function setAllNftsTokenIdByIndex(
    uint256 index,
    uint256 tokenId
  ) public onlyAllowed {
    _allNfts[index] = tokenId;
  }

  function setTokenExtractionsByYear(
    uint256 tokenId,
    uint256 year,
    uint256 extractions
  ) public onlyAllowed {
    _tokensExtractionsByYear[tokenId][year] = extractions;
  }

  function setIdToNftIndex(uint256 tokenId, uint256 index) public onlyAllowed {
    _idToNftIndex[tokenId] = index;
  }

  function setIdToNftItem(uint256 tokenId, address creator) public onlyAllowed {
    _nftItem = NftItem(tokenId, creator);
    _idToNftItem[tokenId] = _nftItem;
  }

  function setIdToNftCreator(
    uint256 tokenId,
    address creator
  ) public onlyAllowed {
    _idToNftCreator[tokenId] = creator;
  }

  function setUsedTokenURI(string memory tokenURI) public onlyAllowed {
    _usedTokenURIs[tokenURI] = true;
  }

  function setOwnedTokens(
    address owner,
    uint256 tokenId,
    uint256 index
  ) public onlyAllowed {
    _ownedTokens[owner][index] = tokenId;
  }

  function setIdToOwnedIndex(
    uint256 tokenId,
    uint256 index
  ) public onlyAllowed {
    _idToOwnedIndex[tokenId] = index;
  }

  /////////////////////
  // GETTERS //
  /////////////////////

  function getTokenIdOfOwnerByIndex(
    address owner,
    uint index
  ) external view returns (uint) {
    return _ownedTokens[owner][index];
  }

  function getTotalSupply() public view returns (uint256) {
    return _allNfts.length;
  }

  function getTokenByIndex(uint index) external view returns (uint) {
    require(index < getTotalSupply(), "Index out of bounds");
    return _allNfts[index];
  }

  function getNftIndex(uint256 tokenId) external view returns (uint256) {
    return _idToNftIndex[tokenId];
  }

  function getTokenIdByIndex(uint256 index) external view returns (uint256) {
    return _allNfts[index];
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

  /////////////////////
  // DELETE //
  /////////////////////

  function deleteIdToOwnedIndex(uint256 tokenId) public onlyAllowed {
    delete _idToOwnedIndex[tokenId];
  }

  function deleteIdToNftIndex(uint256 tokenId) public onlyAllowed {
    delete _idToNftIndex[tokenId];
  }

  function deleteOwnedTokens(address owner, uint256 index) public onlyAllowed {
    delete _ownedTokens[owner][index];
  }

  function popAllNfts() public onlyAllowed {
    _allNfts.pop();
  }
}
