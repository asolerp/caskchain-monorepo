// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/introspection/IERC165Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/common/ERC2981Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

import "./INftVendorStorage.sol";

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

contract NftVendor is
  Initializable,
  ERC2981Upgradeable,
  ReentrancyGuardUpgradeable,
  OwnableUpgradeable,
  UUPSUpgradeable
{
  INftVendorStorage private _vendorStorage;

  address public collection;
  address public creator;

  event ItemListed(
    address indexed from,
    address indexed nftAddress,
    uint256 indexed tokenId,
    uint256 price
  );

  event ItemPiceUpdated(
    address indexed from,
    address indexed nftAddress,
    uint256 indexed tokenId,
    uint256 price
  );

  event ItemSaleStateUpdated(
    address indexed from,
    address indexed nftAddress,
    uint256 indexed tokenId,
    bool state
  );

  event ItemCanceled(
    address indexed from,
    address indexed nftAddress,
    uint256 indexed tokenId
  );

  event ItemBought(
    address indexed to,
    address indexed from,
    uint256 indexed tokenId,
    bool isERC20,
    uint256 price
  );

  event TxFeePaid(uint256 indexed tokenId, uint256 royalty, bool isERC20);

  modifier notListed(uint256 tokenId) {
    INftVendorStorage.Listing memory listing = _vendorStorage.getListing(
      tokenId
    );
    if (listing.price > 0) {
      revert AlreadyListed(collection, tokenId);
    }
    _;
  }

  modifier isListed(uint256 tokenId) {
    INftVendorStorage.Listing memory listing = _vendorStorage.getListing(
      tokenId
    );
    if (listing.price <= 0) {
      revert NotListed(collection, tokenId);
    }
    _;
  }

  modifier isOwner(uint256 tokenId, address spender) {
    IERC721Upgradeable nft = IERC721Upgradeable(collection);
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
    IERC721Upgradeable nft = IERC721Upgradeable(collection);
    address owner = nft.ownerOf(tokenId);
    if (spender == owner) {
      revert IsNotOwner();
    }
    _;
  }

  function initialize(
    address _collection,
    address _creator,
    address _storageAddress
  ) public initializer {
    __Ownable_init();
    __UUPSUpgradeable_init();
    collection = _collection;
    creator = _creator;
    _vendorStorage = INftVendorStorage(_storageAddress);
    _setDefaultRoyalty(msg.sender, 1000);
  }

  function _authorizeUpgrade(address) internal override onlyOwner {}

  /////////////////////
  // Main Functions //
  /////////////////////
  /*
   * @notice Method for listing NFT
   * @param nftAddress Address of NFT contract
   * @param tokenId Token ID of NFT
   * @param price sale price for each item
   */

  /////////////////////
  // Getter Functions //
  /////////////////////

  function getIsExcluded() public view returns (bool) {
    return _vendorStorage.getIsExcluded();
  }

  function getIsOwnerSameAsCreator(
    uint256 tokenId
  ) external view returns (bool) {
    address owner = IERC721Upgradeable(collection).ownerOf(tokenId);
    return owner == creator;
  }

  function getPriceByToken(
    address tokenAddress,
    uint256 tokenId
  ) public view returns (uint256) {
    return _vendorStorage.getPriceByToken(tokenAddress, tokenId);
  }

  function getListing(
    uint256 _tokenId
  ) public view returns (INftVendorStorage.Listing memory) {
    return _vendorStorage.getListing(_tokenId);
  }

  function getAllListedNFTs()
    public
    view
    returns (INftVendorStorage.Listing[] memory)
  {
    uint allItemsCounts = _vendorStorage.getAllListedNftsLength();
    uint listedItemsCounter = _vendorStorage.getCurrentListedItemsCounter();
    uint currentIndex = 0;
    INftVendorStorage.Listing[] memory items = new INftVendorStorage.Listing[](
      listedItemsCounter
    );

    for (uint i = 0; i < allItemsCounts; i++) {
      uint tokenId = tokenByIndex(i);
      INftVendorStorage.Listing memory item = getListing(tokenId);
      items[currentIndex] = item;
      currentIndex += 1;
    }

    return items;
  }

  function getRoyalty(uint256 _tokenId) public view returns (uint256) {
    INftVendorStorage.Listing memory listedItem = getListing(_tokenId);
    (, uint256 royalty) = royaltyInfo(_tokenId, listedItem.price);
    return royalty;
  }

  function emitTxFee(
    uint256 tokenId,
    uint256 royaltyAmount,
    bool isERC20
  ) external {
    emit TxFeePaid(tokenId, royaltyAmount, isERC20);
  }

  function listItem(
    uint256 tokenId,
    uint256 price,
    bool activeSell
  ) external notListed(tokenId) isOwner(tokenId, msg.sender) {
    // Check the value of `price` and revert if it's zero (since it cannot be negative)
    require(price > 0, "Price must be above zero");

    IERC721Upgradeable nft = IERC721Upgradeable(collection);
    require(
      nft.getApproved(tokenId) == address(this),
      "Not approved for marketplace"
    );

    _vendorStorage.setListing(tokenId, price, msg.sender, activeSell);
    _vendorStorage.addTokenToAllTokensEnumeration(tokenId);
    emit ItemListed(msg.sender, collection, tokenId, price);
  }

  function updateStateForSale(
    uint256 _tokenId,
    bool state
  ) external isOwner(_tokenId, msg.sender) isListed(_tokenId) {
    _vendorStorage.updateSellState(_tokenId, state);
    emit ItemSaleStateUpdated(msg.sender, collection, _tokenId, state);
  }

  /*
   * @notice Method for cancelling listing
   * @param collection Address of NFT contract
   * @param tokenId Token ID of NFT
   */
  function cancelListing(
    uint256 tokenId
  ) external isOwner(tokenId, msg.sender) isListed(tokenId) {
    _vendorStorage.deleteListing(tokenId);
    _vendorStorage.removeTokenFromAllListedTokensEnumeration(tokenId);
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
    INftVendorStorage.Listing memory listedItem = _vendorStorage.getListing(
      tokenId
    );

    require(msg.value >= listedItem.price, "PriceNotMet");

    if (
      !getIsExcluded() &&
      IERC721Upgradeable(collection).ownerOf(tokenId) != creator
    ) {
      _payTxFee(tokenId, getRoyalty(tokenId));
    }

    (bool success, ) = payable(listedItem.seller).call{
      value: msg.value - getRoyalty(tokenId)
    }("");
    require(success, "Transfer failed");

    IERC721Upgradeable(collection).safeTransferFrom(
      listedItem.seller,
      msg.sender,
      tokenId
    );

    _vendorStorage.deleteListing(tokenId);
    _vendorStorage.removeTokenFromAllListedTokensEnumeration(tokenId);

    emit ItemBought(
      msg.sender,
      listedItem.seller,
      tokenId,
      false,
      listedItem.price
    );
  }

  function buyNFTWithERC20(
    uint256 tokenId,
    address erc20Token
  ) external isListed(tokenId) isNotOwner(tokenId, msg.sender) nonReentrant {
    INftVendorStorage.Listing memory listedItem = getListing(tokenId);
    uint256 nftPrice = getPriceByToken(erc20Token, tokenId);
    IERC20Upgradeable token = IERC20Upgradeable(erc20Token);
    uint256 royaltyAmount;

    require(
      token.allowance(msg.sender, address(this)) >= nftPrice,
      "Insufficient allowance."
    );

    if (!getIsExcluded()) {
      address owner = IERC721Upgradeable(collection).ownerOf(tokenId);
      if (owner != creator) {
        (, royaltyAmount) = royaltyInfo(tokenId, nftPrice);
        payERC20Royalties(erc20Token, tokenId, royaltyAmount);
      }
    }

    token.transferFrom(msg.sender, listedItem.seller, nftPrice - royaltyAmount);

    IERC721Upgradeable(collection).safeTransferFrom(
      listedItem.seller,
      msg.sender,
      tokenId
    );

    _vendorStorage.deleteListing(tokenId);
    _vendorStorage.setERC20PriceByTokenId(erc20Token, tokenId, 0);
    _vendorStorage.removeTokenFromAllListedTokensEnumeration(tokenId);

    emit ItemBought(
      msg.sender,
      listedItem.seller,
      tokenId,
      true,
      nftPrice - royaltyAmount
    );
  }

  function payERC20Royalties(
    address _erc20Token,
    uint256 _tokenId,
    uint256 _royalty
  ) private {
    IERC20Upgradeable token = IERC20Upgradeable(_erc20Token);
    token.transferFrom(msg.sender, creator, _royalty);
    emit TxFeePaid(_tokenId, _royalty, true);
  }

  /*
   * @notice Method for updating listing
   * @param collection Address of NFT contract
   * @param tokenId Token ID of NFT
   * @param newPrice Price in Wei of the item
   */
  function updateListingPrice(
    uint256 tokenId,
    uint256 newPrice
  ) external isListed(tokenId) nonReentrant isOwner(tokenId, msg.sender) {
    // Check the value of `newPrice` and revert if it's zero (since it cannot be negative)
    require(newPrice > 0, "Price must be above zero");

    IERC721Upgradeable nft = IERC721Upgradeable(collection);
    require(
      nft.getApproved(tokenId) == address(this),
      "Not approved for marketplace"
    );

    _vendorStorage.setListing(tokenId, newPrice, msg.sender, false);
    emit ItemPiceUpdated(msg.sender, collection, tokenId, newPrice);
  }

  function withdrawERC20(address erc20Token) external onlyOwner {
    IERC20Upgradeable token = IERC20Upgradeable(erc20Token);
    token.transferFrom(address(this), creator, token.balanceOf(address(this)));
  }

  /*
   * @notice Method for withdrawing proceeds from sales
   */
  function withdrawProceeds() external {
    uint256 proceeds = _vendorStorage.getProcceds(msg.sender);
    if (proceeds <= 0) {
      revert NoProceeds();
    }
    _vendorStorage.setProcceds(msg.sender, 0);
    (bool sent, ) = msg.sender.call{ value: proceeds }("");
    require(sent, "Failed to withdraw");
  }

  function totalSupply() public view returns (uint256) {
    return _vendorStorage.getAllListedNftsLength();
  }

  function tokenByIndex(uint index) public view returns (uint) {
    require(index < totalSupply(), "Index out of bounds");
    return _vendorStorage.getListedNftsByIndex(index);
  }

  function setExcludedFromList(
    address _address,
    bool _excluded
  ) external onlyOwner {
    _vendorStorage.setExcludedFromList(_address, _excluded);
  }

  function addERC20Token(address erc20Token) external onlyOwner {
    // Check if the given address is a valid ERC20 token contract
    // require(_isERC20(erc20Token), "Not a valid ERC20 token");

    _vendorStorage.setAcceptedToken(erc20Token, true);
    _vendorStorage.pushToAllERC20Tokens(erc20Token);
  }

  function removeERC20Token(address erc20Token) external onlyOwner {
    _vendorStorage.setAcceptedToken(erc20Token, false);
  }

  function updateERC20TokenPrice(
    uint256 tokenId,
    address erc20Token,
    uint256 price
  ) external isOwner(tokenId, msg.sender) {
    IERC721Upgradeable nft = IERC721Upgradeable(collection);
    require(
      nft.getApproved(tokenId) == address(this),
      "Not approved for marketplace"
    );
    _vendorStorage.setERC20PriceByTokenId(erc20Token, tokenId, price);
  }

  function calculateRoyaltyForAcceptedOffer(
    uint256 _tokenId,
    uint256 _highestBid
  ) public view returns (uint256) {
    (, uint256 royalty) = royaltyInfo(_tokenId, _highestBid);
    return royalty;
  }

  // function _isERC20(address erc20Token) private view returns (bool) {
  //   bytes4 expectedInterfaceId = 0x36372b07; // ERC20 interface ID: bytes4(keccak256("totalSupply()")) ^ bytes4(keccak256("balanceOf(address)")) ^ bytes4(keccak256("transfer(address,uint256)")) ^ bytes4(keccak256("allowance(address,address)")) ^ bytes4(keccak256("approve(address,uint256)")) ^ bytes4(keccak256("transferFrom(address,address,uint256)"))
  //   IERC165Upgradeable token = IERC165Upgradeable(erc20Token);
  //   return token.supportsInterface(expectedInterfaceId);
  // }

  function _payTxFee(uint256 tokenId, uint256 royalty) public {
    (bool success1, ) = payable(creator).call{ value: royalty }("");
    require(success1);
    emit TxFeePaid(tokenId, royalty, false);
  }
}
