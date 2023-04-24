// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

import "@openzeppelin/contracts-upgradeable/token/common/ERC2981Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

import "./CCNftData.sol";

contract CCNft is
  Initializable,
  ERC721URIStorageUpgradeable,
  ERC2981Upgradeable,
  UUPSUpgradeable,
  OwnableUpgradeable
{
  using SafeMathUpgradeable for uint256;
  using CountersUpgradeable for CountersUpgradeable.Counter;
  CCNftData private _ccNftData;

  struct ERC20Token {
    address paytoken;
    uint256 costvalue;
  }

  address public txFeeToken;

  uint256 constant SECONDS_PER_DAY = 24 * 60 * 60;
  int256 constant OFFSET19700101 = 2440588;

  IERC721Upgradeable private _nft;
  CountersUpgradeable.Counter private _tokenIds;

  event Mint(address owner, uint256 tokenId, string tokenURI);

  event NftItemCreated(uint256 tokenId, address creator);

  // constructor() ERC721("CasksNFT", "CSKNFT") {
  //   _nft = IERC721(address(this));
  // }

  function initialize(address nftStorageAddress) public initializer {
    __ERC721_init("CasksNFT", "CSKNFT");
    __UUPSUpgradeable_init();
    __Ownable_init();
    _ccNftData = CCNftData(nftStorageAddress);
  }

  function _authorizeUpgrade(address) internal override onlyOwner {}

  /////////////////////
  // Main Functions //
  /////////////////////

  function mintNFT(string memory _tokenURI) public onlyOwner returns (uint256) {
    require(bytes(_tokenURI).length > 0, "Token URI must not be empty");
    require(!checkIfTokenURIExists(_tokenURI), "Token URI already exists");

    _tokenIds.increment();
    uint256 newItemId = _tokenIds.current();

    _safeMint(msg.sender, newItemId);
    _setTokenURI(newItemId, _tokenURI);

    uint256 year = getYear(block.timestamp);

    _ccNftData.setTokenExtractionsByYear(newItemId, year, 0);
    _ccNftData.setUsedTokenURI(_tokenURI);

    _createNftItem(newItemId);

    emit Mint(msg.sender, newItemId, _tokenURI);

    return newItemId;
  }

  function checkIfTokenURIExists(
    string memory tokenURI
  ) public view returns (bool) {
    return _ccNftData.getTokeURIUsed(tokenURI);
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

  function getNftInfo(
    uint256 tokenId
  ) external view returns (CCNftData.NftItem memory) {
    require(_nft.ownerOf(tokenId) != address(0), "NFT does not exist");
    CCNftData.NftItem memory item = _ccNftData.getNftInfo(tokenId);
    return item;
  }

  function getAllNFTs() external view returns (CCNftData.NftItem[] memory) {
    uint256 totalItemsCount = _ccNftData.getTotalSupply();
    CCNftData.NftItem[] memory items = new CCNftData.NftItem[](totalItemsCount);

    for (uint256 i = 0; i < totalItemsCount; i++) {
      uint256 tokenId = _ccNftData.getTokenByIndex(i);
      items[i] = _ccNftData.getIdToNftItem(tokenId);
    }

    return items;
  }

  function getAllNftsOnSale(
    uint256[] memory _tokensIds
  ) external view returns (CCNftData.NftItem[] memory) {
    CCNftData.NftItem[] memory items = new CCNftData.NftItem[](
      _tokensIds.length
    );

    for (uint256 i = 0; i < _tokensIds.length; i++) {
      uint256 tokenId = _ccNftData.getTokenIdByIndex(i);
      CCNftData.NftItem memory item = _ccNftData.getIdToNftItem(tokenId);
      items[i] = item;
    }

    return items;
  }

  function getOwnedNfts(
    uint256 ownedItemsCount
  ) public view returns (CCNftData.NftItem[] memory) {
    CCNftData.NftItem[] memory items = new CCNftData.NftItem[](ownedItemsCount);

    for (uint256 i = 0; i < ownedItemsCount; i++) {
      uint256 tokenId = tokenOfOwnerByIndex(msg.sender, i);
      CCNftData.NftItem memory item = _ccNftData.getIdToNftItem(tokenId);
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

  function tokenOfOwnerByIndex(
    address owner,
    uint index
  ) public view returns (uint) {
    require(index < ERC721Upgradeable.balanceOf(owner), "Index out of bounds");
    return _ccNftData.tokenOfOwnerByIndex(owner, index);
  }

  function getYear(uint256 timestamp) internal pure returns (uint256 year) {
    (year, , ) = _daysToDate(timestamp / SECONDS_PER_DAY);
  }

  function _createNftItem(uint _tokenId) private {
    _ccNftData.setIdToNftItem(_tokenId, msg.sender);
    _ccNftData.setIdToNftCreator(_tokenId, msg.sender);

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
    _ccNftData.setOwnedTokens(to, tokenId, index);
    _ccNftData.setIdToOwnedIndex(tokenId, index);
  }

  function _removeTokenFromOwnerEnumeration(
    address from,
    uint tokenId
  ) private {
    uint lastTokenIndex = ERC721Upgradeable.balanceOf(from) - 1;
    uint tokenIndex = _ccNftData.getIdToOwnedIndex(tokenId);

    if (tokenIndex != lastTokenIndex) {
      uint lastTokenId = _ccNftData.getOwnedTokens(from, lastTokenIndex);

      _ccNftData.setOwnedTokens(from, lastTokenId, tokenIndex);
      _ccNftData.setIdToOwnedIndex(lastTokenId, tokenIndex);
    }

    _ccNftData.deleteIdToOwnedIndex(tokenId);
    _ccNftData.deleteOwnedTokens(from, lastTokenIndex);
  }

  function _addTokenToAllTokensEnumeration(uint tokenId) private {
    uint256 index = _ccNftData.getAllNFTsLength();
    _ccNftData.setIdToNftIndex(tokenId, index);
    _ccNftData.pushAllNfts(tokenId);
  }

  function _removeTokenFromAllTokensEnumeration(uint tokenId) private {
    uint lastTokenIndex = _ccNftData.getAllNFTsLength() - 1;
    uint tokenIndex = _ccNftData.getNftIndex(tokenId);
    uint lastTokenId = _ccNftData.getTokenIdByIndex(lastTokenIndex);

    _ccNftData.setAllNftsTokenIdByIndex(tokenIndex, lastTokenId);
    _ccNftData.setIdToNftIndex(lastTokenId, tokenIndex);

    _ccNftData.deleteIdToNftIndex(tokenId);
    _ccNftData.popAllNfts();
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
