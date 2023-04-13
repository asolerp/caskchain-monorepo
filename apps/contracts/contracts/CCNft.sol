// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CCNft is ERC721URIStorage, ERC2981, Ownable {
  using SafeMath for uint256;
  using Counters for Counters.Counter;

  struct ERC20Token {
    address paytoken;
    uint256 costvalue;
  }

  struct NftItem {
    uint256 tokenId;
    address creator;
  }

  address public txFeeToken;
  uint public bottlePrice = 0.013 ether;
  uint public _minimumFee = 0.02 ether;
  uint256 constant SECONDS_PER_DAY = 24 * 60 * 60;
  int256 constant OFFSET19700101 = 2440588;
  bool public paused = false;
  IERC721 private _nft;
  Counters.Counter private _tokenIds;

  // TokenURI => Bool (Is used?)
  mapping(string => bool) private _usedTokenURIs;
  // NFT id => NftItem
  mapping(uint256 => NftItem) private _idToNftItem;
  // NFT id => Index
  mapping(uint256 => uint256) private _idToNftIndex;
  // NFT id => ERC20 share
  mapping(uint256 => uint256) private _idToOwnedIndex;
  // Account address => NFT Id => Index
  mapping(address => mapping(uint256 => uint256)) private _ownedTokens;
  // NFT id => Year => Extractions
  mapping(uint256 => mapping(uint256 => uint256))
    private _tokensExtractionsByYear;
  // NFT id => Address[]
  mapping(uint256 => address) _idToNftCreator;
  // Address => Booelan
  mapping(uint256 => address[]) addressesFromTokenId;

  uint256[] private _allNfts;

  event Mint(address owner, uint256 tokenId, string tokenURI);

  event NftItemCreated(uint256 tokenId, address creator);

  constructor() ERC721("CasksNFT", "CSKNFT") {
    _nft = IERC721(address(this));
  }

  /////////////////////
  // Main Functions //
  /////////////////////

  function mintNFT(string memory _tokenURI) public onlyOwner returns (uint256) {
    require(bytes(_tokenURI).length > 0, "Token URI must not be empty");
    require(!_usedTokenURIs[_tokenURI], "Token URI already exists");

    _tokenIds.increment();
    uint256 newItemId = _tokenIds.current();

    _safeMint(msg.sender, newItemId);
    _setTokenURI(newItemId, _tokenURI);

    uint256 year = getYear(block.timestamp);
    _tokensExtractionsByYear[newItemId][year] = 0;

    _usedTokenURIs[_tokenURI] = true;
    _createNftItem(newItemId);

    emit Mint(msg.sender, newItemId, _tokenURI);

    return newItemId;
  }

  function burn(uint256 tokenId) public onlyOwner {
    require(_exists(tokenId), "Token does not exist");
    require(
      ownerOf(tokenId) == _msgSender(),
      "Ownable: caller is not the owner"
    );
    _resetTokenRoyalty(tokenId);
    super._burn(tokenId);
  }

  function getNftInfo(uint256 tokenId) external view returns (NftItem memory) {
    require(_nft.ownerOf(tokenId) != address(0), "NFT does not exist");
    NftItem memory item = _idToNftItem[tokenId];
    return item;
  }

  function getAllNFTs() external view returns (NftItem[] memory) {
    uint256 totalItemsCount = totalSupply();
    NftItem[] memory items = new NftItem[](totalItemsCount);

    for (uint256 i = 0; i < totalItemsCount; i++) {
      uint256 tokenId = tokenByIndex(i);
      items[i] = _idToNftItem[tokenId];
    }

    return items;
  }

  function getAllNftsOnSale(
    uint256[] memory _tokensIds
  ) external view returns (NftItem[] memory) {
    NftItem[] memory items = new NftItem[](_tokensIds.length);

    for (uint256 i = 0; i < _tokensIds.length; i++) {
      NftItem memory item = _idToNftItem[_tokensIds[i]];
      items[i] = item;
    }

    return items;
  }

  function getOwnedNfts() public view returns (NftItem[] memory) {
    uint ownedItemsCount = ERC721.balanceOf(msg.sender);
    NftItem[] memory items = new NftItem[](ownedItemsCount);

    for (uint256 i = 0; i < ownedItemsCount; i++) {
      uint256 tokenId = tokenOfOwnerByIndex(msg.sender, i);
      NftItem memory item = _idToNftItem[tokenId];
      items[i] = item;
    }

    return items;
  }

  function supportsInterface(
    bytes4 interfaceId
  ) public view virtual override(ERC721, ERC2981) returns (bool) {
    return super.supportsInterface(interfaceId);
  }

  function totalSupply() public view returns (uint256) {
    return _allNfts.length;
  }

  function tokenByIndex(uint index) public view returns (uint) {
    require(index < totalSupply(), "Index out of bounds");
    return _allNfts[index];
  }

  function tokenOfOwnerByIndex(
    address owner,
    uint index
  ) public view returns (uint) {
    require(index < ERC721.balanceOf(owner), "Index out of bounds");
    return _ownedTokens[owner][index];
  }

  function getYear(uint256 timestamp) internal pure returns (uint256 year) {
    (year, , ) = _daysToDate(timestamp / SECONDS_PER_DAY);
  }

  function _tokenURIExists(string memory tokenURI) private view returns (bool) {
    return _usedTokenURIs[tokenURI] == true;
  }

  function _createNftItem(uint _tokenId) private {
    _idToNftItem[_tokenId] = NftItem(_tokenId, msg.sender);
    _idToNftCreator[_tokenId] = msg.sender;

    emit NftItemCreated(_tokenId, msg.sender);
  }

  function getNftCreator(uint _tokenId) public view returns (address) {
    return _idToNftCreator[_tokenId];
  }

  function _beforeTokenTransfer(
    address from,
    address to,
    uint tokenId,
    uint256 batchSize
  ) internal virtual override {
    super._beforeTokenTransfer(from, to, tokenId, batchSize);

    if (from == address(0)) {
      // MINTING CASE
      _addTokenToAllTokensEnumeration(tokenId);
    } else if (from != to) {
      // TRANSFER CASE
      _removeTokenFromOwnerEnumeration(from, tokenId);
    }

    if (to == address(0)) {
      // BURNING CASE
      _removeTokenFromAllTokensEnumeration(tokenId);
    } else if (to != from) {
      // TRANSFER CASE
      _addTokenToOwnerEnumeration(to, tokenId);
    }
  }

  function _addTokenToOwnerEnumeration(address to, uint tokenId) private {
    uint length = ERC721.balanceOf(to);
    _ownedTokens[to][length] = tokenId;
    _idToOwnedIndex[tokenId] = length;
  }

  function _removeTokenFromOwnerEnumeration(
    address from,
    uint tokenId
  ) private {
    uint lastTokenIndex = ERC721.balanceOf(from) - 1;
    uint tokenIndex = _idToOwnedIndex[tokenId];

    if (tokenIndex != lastTokenIndex) {
      uint lastTokenId = _ownedTokens[from][lastTokenIndex];

      _ownedTokens[from][tokenIndex] = lastTokenId;
      _idToOwnedIndex[lastTokenId] = tokenIndex;
    }

    delete _idToOwnedIndex[tokenId];
    delete _ownedTokens[from][lastTokenIndex];
  }

  function _addTokenToAllTokensEnumeration(uint tokenId) private {
    _idToNftIndex[tokenId] = _allNfts.length;
    _allNfts.push(tokenId);
  }

  function _removeTokenFromAllTokensEnumeration(uint tokenId) private {
    uint lastTokenIndex = _allNfts.length - 1;
    uint tokenIndex = _idToNftIndex[tokenId];
    uint lastTokenId = _allNfts[lastTokenIndex];

    _allNfts[tokenIndex] = lastTokenId;
    _idToNftIndex[lastTokenId] = tokenIndex;

    delete _idToNftIndex[tokenId];
    _allNfts.pop();
  }

  function _daysToDate(
    uint256 _days
  ) internal pure returns (uint256 year, uint256 month, uint256 day) {
    unchecked {
      int256 __days = int256(_days);

      int256 L = __days + 68569 + OFFSET19700101;
      int256 N = (4 * L) / 146097;
      L = L - (146097 * N + 3) / 4;
      int256 _year = (4000 * (L + 1)) / 1461001;
      L = L - (1461 * _year) / 4 + 31;
      int256 _month = (80 * L) / 2447;
      int256 _day = L - (2447 * _month) / 80;
      L = _month / 11;
      _month = _month + 2 - 12 * L;
      _year = 100 * (N - 49) + _year + L;

      year = uint256(_year);
      month = uint256(_month);
      day = uint256(_day);
    }
  }
}
