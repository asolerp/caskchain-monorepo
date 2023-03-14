// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import '@openzeppelin/contracts/token/ERC721/IERC721.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';
import '@openzeppelin/contracts/token/common/ERC2981.sol';
import '@openzeppelin/contracts/utils/Counters.sol';

// Check out https://github.com/Fantom-foundation/Artion-Contracts/blob/5c90d2bc0401af6fb5abf35b860b762b31dfee02/contracts/FantomMarketplace.sol
// For a full decentralized nft marketplace

error PriceNotMet(address nftAddress, uint256 tokenId, uint256 price);
error NotListed(address nftAddress, uint256 tokenId);
error AlreadyListed(address nftAddress, uint256 tokenId);
error NoProceeds();
error NotOwner();
error IsNotOwner();
error NotApprovedForMarketplace();
error PriceMustBeAboveZero();

// Error thrown for isNotOwner modifier
// error IsNotOwner()

contract NftVendor is ERC2981, ReentrancyGuard {
  using Counters for Counters.Counter;

  struct Listing {
    uint256 tokenId;
    uint256 price;
    address seller;
  }

  event ItemListed(
    address indexed seller,
    address indexed nftAddress,
    uint256 indexed tokenId,
    uint256 price
  );

  event ItemCanceled(
    address indexed seller,
    address indexed nftAddress,
    uint256 indexed tokenId
  );

  event ItemBought(
    address indexed buyer,
    address indexed nftAddress,
    uint256 indexed tokenId,
    uint256 price
  );

  address public collection;
  address public creator;
  uint256[] private _allListedNfts;

  Counters.Counter private _listedItems;

  mapping(uint256 => Listing) private s_listings;
  mapping(address => uint256) private s_proceeds;
  // NFT id => Index
  mapping(uint256 => uint256) private _idToNftIndex;
  // Address => Booelan
  mapping(address => bool) public s_excludedList;

  modifier notListed(uint256 tokenId) {
    Listing memory listing = s_listings[tokenId];
    if (listing.price > 0) {
      revert AlreadyListed(collection, tokenId);
    }
    _;
  }

  modifier isListed(uint256 tokenId) {
    Listing memory listing = s_listings[tokenId];
    if (listing.price <= 0) {
      revert NotListed(collection, tokenId);
    }
    _;
  }

  modifier isOwner(uint256 tokenId, address spender) {
    IERC721 nft = IERC721(collection);
    address owner = nft.ownerOf(tokenId);
    if (spender != owner) {
      revert NotOwner();
    }
    _;
  }

  // IsNotOwner Modifier - Nft Owner can't buy his/her NFT
  // Modifies buyItem function
  // Owner should only list, cancel listing or update listing
  modifier isNotOwner(uint256 tokenId, address spender) {
    IERC721 nft = IERC721(collection);
    address owner = nft.ownerOf(tokenId);
    if (spender == owner) {
      revert IsNotOwner();
    }
    _;
  }

  constructor(address _collection, address _creator) {
    collection = _collection;
    creator = _creator;
    _setDefaultRoyalty(msg.sender, 1000);
    s_excludedList[msg.sender] = true;
  }

  /////////////////////
  // Main Functions //
  /////////////////////
  /*
   * @notice Method for listing NFT
   * @param nftAddress Address of NFT contract
   * @param tokenId Token ID of NFT
   * @param price sale price for each item
   */
  function listItem(
    uint256 tokenId,
    uint256 price
  ) external notListed(tokenId) isOwner(tokenId, msg.sender) {
    if (price <= 0) {
      revert PriceMustBeAboveZero();
    }
    IERC721 nft = IERC721(collection);
    if (nft.getApproved(tokenId) != address(this)) {
      revert NotApprovedForMarketplace();
    }
    s_listings[tokenId] = Listing(tokenId, price, msg.sender);
    _addTokenToAllTokensEnumeration(tokenId);
    emit ItemListed(msg.sender, collection, tokenId, price);
  }

  /*
   * @notice Method for cancelling listing
   * @param collection Address of NFT contract
   * @param tokenId Token ID of NFT
   */
  function cancelListing(
    uint256 tokenId
  ) external isOwner(tokenId, msg.sender) isListed(tokenId) {
    delete (s_listings[tokenId]);
    _removeTokenFromAllListedTokensEnumeration(tokenId);
    emit ItemCanceled(msg.sender, collection, tokenId);
  }

  /*
   * @notice Method for buying listing
   * @notice The owner of an NFT could unapprove the marketplace,
   * which would cause this function to fail
   * Ideally you'd also have a `createOffer` functionality.
   * @param collection Address of NFT contract
   * @param tokenId Token ID of NFT
   */
  function buyItem(
    uint256 tokenId
  )
    external
    payable
    isListed(tokenId)
    isNotOwner(tokenId, msg.sender)
    nonReentrant
  {
    Listing memory listedItem = s_listings[tokenId];
    if (msg.value < listedItem.price) {
      revert PriceNotMet(collection, tokenId, listedItem.price);
    }

    uint256 royaltyAmount = getRoyalty(tokenId);
    bool isEscluded = isExcluded();

    if (isEscluded) {
      (bool success1, ) = payable(listedItem.seller).call{value: msg.value}('');
      require(success1);
    } else {
      _payTxFee(royaltyAmount);
      (bool success1, ) = payable(listedItem.seller).call{
        value: msg.value - royaltyAmount
      }('');
      require(success1);
    }

    delete (s_listings[tokenId]);
    IERC721(collection).safeTransferFrom(
      listedItem.seller,
      msg.sender,
      tokenId
    );
    _removeTokenFromAllListedTokensEnumeration(tokenId);
    emit ItemBought(msg.sender, collection, tokenId, listedItem.price);
  }

  /*
   * @notice Method for updating listing
   * @param collection Address of NFT contract
   * @param tokenId Token ID of NFT
   * @param newPrice Price in Wei of the item
   */
  function updateListing(
    uint256 tokenId,
    uint256 newPrice
  ) external isListed(tokenId) nonReentrant isOwner(tokenId, msg.sender) {
    //We should check the value of `newPrice` and revert if it's below zero (like we also check in `listItem()`)
    if (newPrice <= 0) {
      revert PriceMustBeAboveZero();
    }
    s_listings[tokenId].price = newPrice;
    emit ItemListed(msg.sender, collection, tokenId, newPrice);
  }

  /*
   * @notice Method for withdrawing proceeds from sales
   */
  function withdrawProceeds() external {
    uint256 proceeds = s_proceeds[msg.sender];
    if (proceeds <= 0) {
      revert NoProceeds();
    }
    s_proceeds[msg.sender] = 0;
    (bool sent, ) = msg.sender.call{value: proceeds}('');
    require(sent, 'Failed to withdraw');
  }

  function totalSupply() public view returns (uint256) {
    return _allListedNfts.length;
  }

  function tokenByIndex(uint index) public view returns (uint) {
    require(index < totalSupply(), 'Index out of bounds');
    return _allListedNfts[index];
  }

  /////////////////////
  // Getter Functions //
  /////////////////////

  function getListing(uint256 tokenId) external view returns (Listing memory) {
    return s_listings[tokenId];
  }

  function getAllListedNftsId() external view returns (uint256[] memory) {
    return _allListedNfts;
  }

  function getAllListedNFTs() external view returns (Listing[] memory) {
    uint allItemsCounts = _allListedNfts.length;
    uint currentIndex = 0;
    Listing[] memory items = new Listing[](_listedItems.current());

    for (uint i = 0; i < allItemsCounts; i++) {
      uint tokenId = tokenByIndex(i);
      Listing storage item = s_listings[tokenId];
      items[currentIndex] = item;
      currentIndex += 1;
    }

    return items;
  }

  function isExcluded() public view returns (bool) {
    bool isEscluded = s_excludedList[msg.sender] == true;
    return isEscluded;
  }

  function calculateRoyaltyForAcceptedOffer(
    uint256 _tokenId,
    uint256 _highestBid
  ) public view returns (uint256) {
    (, uint256 royalty) = royaltyInfo(_tokenId, _highestBid);
    return royalty;
  }

  function getRoyalty(uint256 _tokenId) public view returns (uint256) {
    Listing memory listedItem = s_listings[_tokenId];
    (, uint256 royalty) = royaltyInfo(_tokenId, listedItem.price);
    return royalty;
  }

  function getProceeds(address seller) external view returns (uint256) {
    return s_proceeds[seller];
  }

  function _payTxFee(uint256 royalty) public {
    (bool success1, ) = payable(creator).call{value: royalty}('');
    require(success1);
  }

  function _addTokenToAllTokensEnumeration(uint tokenId) private {
    _idToNftIndex[tokenId] = _allListedNfts.length;
    _listedItems.increment();
    _allListedNfts.push(tokenId);
  }

  function _removeTokenFromAllListedTokensEnumeration(uint tokenId) private {
    uint lastTokenIndex = _allListedNfts.length - 1;
    uint tokenIndex = _idToNftIndex[tokenId];
    uint lastTokenId = _allListedNfts[lastTokenIndex];

    _allListedNfts[tokenIndex] = lastTokenId;
    _idToNftIndex[lastTokenId] = tokenIndex;
    _listedItems.decrement();

    delete _idToNftIndex[tokenId];
    _allListedNfts.pop();
  }
}
