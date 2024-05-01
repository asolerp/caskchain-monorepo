// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

import "@openzeppelin/contracts-upgradeable/token/common/ERC2981Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

import "./ICCNftStorage.sol";

contract CCNft is
  Initializable,
  ERC721URIStorageUpgradeable,
  ERC2981Upgradeable,
  OwnableUpgradeable,
  UUPSUpgradeable
{
  using CountersUpgradeable for CountersUpgradeable.Counter;

  struct ERC20Token {
    address paytoken;
    uint256 costvalue;
  }

  address public txFeeToken;
  ICCNftStorage private _storage;

  uint256 constant SECONDS_PER_DAY = 24 * 60 * 60;
  int256 constant OFFSET19700101 = 2440588;

  CountersUpgradeable.Counter private _tokenIds;

  event Mint(address owner, uint256 tokenId, string tokenURI);
  event Burn(uint256 tokenId);

  event NftItemCreated(uint256 tokenId, address creator);

  function initialize(address storageAddress) public initializer {
    __ERC721_init("CasksNFT", "CSKNFT");
    __Ownable_init();
    __UUPSUpgradeable_init();
    _storage = ICCNftStorage(storageAddress);
  }

  function _authorizeUpgrade(address) internal override onlyOwner {}

  /////////////////////
  // Main Functions //
  /////////////////////

  function checkIfTokenURIExists(
    string memory tokenURI
  ) public view returns (bool) {
    return _storage.getTokeURIUsed(tokenURI);
  }

  function mintNFT(
    string memory _tokenURI
  ) external onlyOwner returns (uint256) {
    require(bytes(_tokenURI).length > 0, "Token URI must not be empty");
    require(!checkIfTokenURIExists(_tokenURI), "Token URI already exists");

    _tokenIds.increment();
    uint256 newItemId = _tokenIds.current();

    _safeMint(msg.sender, newItemId);
    _setTokenURI(newItemId, _tokenURI);

    uint256 year = getYear(block.timestamp);

    _storage.setTokenExtractionsByYear(newItemId, year, 0);
    _storage.setUsedTokenURI(_tokenURI);

    _createNftItem(newItemId);

    emit Mint(msg.sender, newItemId, _tokenURI);

    return newItemId;
  }

  function burn(uint256 tokenId) external onlyOwner {
    require(_exists(tokenId), "Token does not exist");
    require(
      ownerOf(tokenId) == _msgSender(),
      "Ownable: caller is not the owner"
    );
    _resetTokenRoyalty(tokenId);
    super._burn(tokenId);
    emit Burn(tokenId);
  }

  function getNftTotalSupply() external view returns (uint256) {
    return _storage.getTotalSupply();
  }

  function getNftInfo(
    uint256 tokenId
  ) external view returns (ICCNftStorage.NftItem memory) {
    ICCNftStorage.NftItem memory item = _storage.getIdToNftItem(tokenId);
    return item;
  }

  function getAllNFTs(
    uint256 page,
    uint256 pageSize
  ) external view returns (ICCNftStorage.NftItem[] memory) {
    uint256 totalItemsCount = _storage.getTotalSupply();
    uint256 totalPages = (totalItemsCount + pageSize - 1) / pageSize;

    if (page < 1 || page > totalPages) {
      revert("Invalid page number");
    }

    uint256 startIndex = (page - 1) * pageSize;
    uint256 endIndex = startIndex + pageSize > totalItemsCount
      ? totalItemsCount
      : startIndex + pageSize;

    uint256 itemsLength = endIndex - startIndex;
    ICCNftStorage.NftItem[] memory items = new ICCNftStorage.NftItem[](
      itemsLength
    );

    for (uint256 i = startIndex; i < endIndex; i++) {
      uint256 tokenId = _storage.getTokenByIndex(i);
      items[i - startIndex] = _storage.getIdToNftItem(tokenId);
    }

    return items;
  }

  function getAllNftsOnSale(
    uint256[] memory _tokensIds
  ) external view returns (ICCNftStorage.NftItem[] memory) {
    ICCNftStorage.NftItem[] memory items = new ICCNftStorage.NftItem[](
      _tokensIds.length
    );

    for (uint256 i = 0; i < _tokensIds.length; i++) {
      uint256 tokenId = _storage.getTokenIdByIndex(i);
      ICCNftStorage.NftItem memory item = _storage.getIdToNftItem(tokenId);
      items[i] = item;
    }

    return items;
  }

  function getCreatorNft(uint256 tokenId) external view returns (address) {
    address creator = _storage.getNftCreator(tokenId);
    return creator;
  }

  function getOwnedNfts() public view returns (ICCNftStorage.NftItem[] memory) {
    uint ownedItemsCount = ERC721Upgradeable.balanceOf(msg.sender);
    ICCNftStorage.NftItem[] memory items = new ICCNftStorage.NftItem[](
      ownedItemsCount
    );
    for (uint256 i = 0; i < ownedItemsCount; i++) {
      require(
        i < ERC721Upgradeable.balanceOf(msg.sender),
        "Index out of bounds"
      );
      uint256 tokenId = _storage.getTokenIdOfOwnerByIndex(msg.sender, i);
      ICCNftStorage.NftItem memory item = _storage.getIdToNftItem(tokenId);
      items[i] = item;
    }

    return items;
  }

  function supportsInterface(
    bytes4 interfaceId
  )
    public
    view
    virtual
    override(ERC721Upgradeable, ERC2981Upgradeable)
    returns (bool)
  {
    return super.supportsInterface(interfaceId);
  }

  function getYear(uint256 timestamp) internal pure returns (uint256 year) {
    (year, , ) = _daysToDate(timestamp / SECONDS_PER_DAY);
  }

  function _createNftItem(uint _tokenId) private {
    _storage.setIdToNftItem(_tokenId, msg.sender);
    _storage.setIdToNftCreator(_tokenId, msg.sender);

    emit NftItemCreated(_tokenId, msg.sender);
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
    uint index = ERC721Upgradeable.balanceOf(to);
    _storage.setOwnedTokens(to, tokenId, index);
    _storage.setIdToOwnedIndex(tokenId, index);
  }

  function _removeTokenFromOwnerEnumeration(
    address from,
    uint tokenId
  ) private {
    uint lastTokenIndex = ERC721Upgradeable.balanceOf(from) - 1;
    uint tokenIndex = _storage.getIdToOwnedIndex(tokenId);

    if (tokenIndex != lastTokenIndex) {
      uint lastTokenId = _storage.getTokenIdOfOwnerByIndex(
        from,
        lastTokenIndex
      );

      _storage.setOwnedTokens(from, lastTokenId, tokenIndex);
      _storage.setIdToOwnedIndex(lastTokenId, tokenIndex);
    }

    _storage.deleteIdToOwnedIndex(tokenId);
    _storage.deleteOwnedTokens(from, lastTokenIndex);
  }

  function _addTokenToAllTokensEnumeration(uint tokenId) private {
    uint256 index = _storage.getTotalSupply();
    _storage.setIdToNftIndex(tokenId, index);
    _storage.pushAllNfts(tokenId);
  }

  function _removeTokenFromAllTokensEnumeration(uint tokenId) private {
    uint lastTokenIndex = _storage.getTotalSupply() - 1;
    uint tokenIndex = _storage.getNftIndex(tokenId);
    uint lastTokenId = _storage.getTokenIdByIndex(lastTokenIndex);

    _storage.setAllNftsTokenIdByIndex(tokenIndex, lastTokenId);
    _storage.setIdToNftIndex(lastTokenId, tokenIndex);

    _storage.deleteIdToNftIndex(tokenId);
    _storage.popAllNfts();
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
