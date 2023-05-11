// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/common/ERC2981Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

import "../NftVendor/NftVendor.sol";
import "../CCNft/ICCNftStorage.sol";
import "./INftOffersStorage.sol";

// Check out https://github.com/Fantom-foundation/Artion-Contracts/blob/5c90d2bc0401af6fb5abf35b860b762b31dfee02/contracts/FantomMarketplace.sol
// For a full decentralized nft marketplace

// Error thrown for isNotOwner modifier
// error IsNotOwner()
error NotOffers();

contract NftOffers is
  Initializable,
  ReentrancyGuardUpgradeable,
  OwnableUpgradeable,
  UUPSUpgradeable
{
  address public collection;
  address public creator;

  NftVendor public nftVendor;
  ICCNftStorage private _ccNftStorage;
  INftOffersStorage private _nftOffersStorage;

  modifier hasOffers(uint256 tokenId) {
    address[] memory addresses = _nftOffersStorage.getAddressFromTokenId(
      tokenId
    );
    if (addresses.length == 0) {
      revert NotOffers();
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

  event NewOffer(
    uint256 indexed tokenId,
    address owner,
    address bidder,
    uint256 bid
  );
  event RemoveOffer(uint256 indexed tokenId, address bidder, uint256 bid);
  event Withdraw(uint256 indexed tokenId, address bidder, uint256 bid);
  event AcceptOffer(
    uint256 indexed tokenId,
    address owner,
    address bidder,
    uint256 bid
  );

  function initialize(
    address _collection,
    address _creator,
    address _nftVendor,
    address nftOffersStorageAddress
  ) public initializer {
    __Ownable_init();
    __UUPSUpgradeable_init();
    collection = _collection;
    creator = _creator;
    nftVendor = NftVendor(_nftVendor);

    _nftOffersStorage = INftOffersStorage(nftOffersStorageAddress);
  }

  function _authorizeUpgrade(address) internal override onlyOwner {}

  function getHighestBid(uint256 _tokenId) external view returns (uint256) {
    return _nftOffersStorage.getHighestBidByTokenId(_tokenId);
  }

  function getNftOffer(
    uint256 _tokenId
  ) external view returns (INftOffersStorage.Offer memory) {
    INftOffersStorage.Offer memory offer = _nftOffersStorage
      .getNftOfferByTokenId(_tokenId);
    return offer;
  }

  function getAddressesBids(
    uint256 _tokenId
  ) public view returns (address[] memory) {
    address[] memory bidders = _nftOffersStorage.getAddressFromTokenId(
      _tokenId
    );
    return bidders;
  }

  function payRoyaltiesAndTransfer(
    uint256 _tokenId,
    uint256 highestBid
  ) private {
    require(_tokenId != 0, "Invalid token ID");
    require(highestBid > 0, "Invalid bid amount");

    bool excluded = nftVendor.getIsExcluded();
    address payable sellerAddress = payable(msg.sender);
    address payable creatorAddress = payable(creator);
    uint256 royalty = nftVendor.calculateRoyaltyForAcceptedOffer(
      _tokenId,
      highestBid
    );
    uint256 totalAmount = highestBid;

    if (!excluded) {
      require(creator != address(0), "Invalid creator address");
      totalAmount -= royalty;
      creatorAddress.transfer(royalty);
      nftVendor.emitTxFee(_tokenId, royalty, false);
    }
    sellerAddress.transfer(totalAmount);
  }

  function getPrevious(uint256 _tokenId) external view returns (uint256) {
    return _nftOffersStorage.getPreviousBidderBidByTokenId(_tokenId);
  }

  function makeOffer(uint256 _tokenId) public payable {
    // Ensure that the buyer is making a valid offer

    require(msg.value > 0, "Offer price must be greater than 0");

    IERC721Upgradeable nft = IERC721Upgradeable(collection);
    require(nft.ownerOf(_tokenId) != address(0), "Invalid token ID");

    uint256 previousBid = _nftOffersStorage.getPreviousBidderBidByTokenId(
      _tokenId
    );

    require(previousBid == 0, "You must withdraw your previous bid first");

    uint256 highestBid = _nftOffersStorage.getHighestBidByTokenId(_tokenId);

    //No offers made
    if (highestBid == 0) {
      _createNftOffer(_tokenId, msg.value, nft.ownerOf(_tokenId));
    } else {
      require(msg.value > highestBid, "Offer price is too low");
      _setOffer(_tokenId, msg.value);
    }

    emit NewOffer(_tokenId, nft.ownerOf(_tokenId), msg.sender, msg.value);
  }

  function acceptOffer(
    uint256 _tokenId
  ) public payable isOwner(_tokenId, msg.sender) hasOffers(_tokenId) {
    IERC721Upgradeable nft = IERC721Upgradeable(collection);
    require(
      nft.getApproved(_tokenId) == address(this),
      "NotApprovedForMarketplace"
    );

    INftOffersStorage.Offer memory offer = _nftOffersStorage
      .getNftOfferByTokenId(_tokenId);

    address owner = nft.ownerOf(_tokenId);
    uint256 highestBid = offer.highestBid;
    address highestBidder = offer.highestBidder;

    payRoyaltiesAndTransfer(_tokenId, highestBid);

    nft.transferFrom(msg.sender, highestBidder, _tokenId);

    _removeOffer(_tokenId, highestBidder);
    _nftOffersStorage.deleteTokenIdFromOffer(_tokenId);

    emit AcceptOffer(_tokenId, owner, highestBidder, highestBid);
  }

  function cancelOffer(uint256 _tokenId) external {
    uint256 lastOffer = _nftOffersStorage.getPreviousBidderBidByTokenId(
      _tokenId
    );

    require(lastOffer > 0, "No active bid found");

    // Get the offer
    INftOffersStorage.Offer memory offer = _nftOffersStorage
      .getNftOfferByTokenId(_tokenId);

    // Get last bid from the user
    uint256 amount = _nftOffersStorage.getPreviousBidderBidByTokenId(_tokenId);

    require(_tokenId > 0 && offer.seller != address(0), "Invalid token ID");
    require(amount > 0, "No active bid found");

    (bool success, ) = msg.sender.call{ value: amount }("");
    require(success, "Transfer failed");

    // _removeOffer(_tokenId, msg.sender);

    if (offer.highestBidder == msg.sender) {
      address[] memory addresses = _nftOffersStorage.getAddressFromTokenId(
        _tokenId
      );

      for (uint256 i = 0; i < addresses.length; i++) {
        address bidder = addresses[i];
        uint256 bidderBid = _nftOffersStorage.getOffersBidsFromTokenId(
          _tokenId,
          bidder
        );
        if (bidderBid > offer.highestBid) {
          _nftOffersStorage.setTokenIdToOffer(_tokenId, bidderBid, bidder);
        }
      }
    }

    // emit RemoveOffer(_tokenId, msg.sender, amount);
  }

  function _createNftOffer(
    uint256 _tokenId,
    uint256 _nftPrice,
    address _seller
  ) private {
    _setOffer(_tokenId, _nftPrice);

    INftOffersStorage.Offer memory offer = INftOffersStorage.Offer(
      _tokenId,
      _seller,
      _nftPrice,
      msg.sender
    );

    _nftOffersStorage.setOfferByTokenId(_tokenId, offer);
  }

  function _setOffer(uint256 _tokenId, uint256 bid) private {
    _nftOffersStorage.setOfferBidFromTokenIdBySender(_tokenId, bid);
    address[] memory addresses = _nftOffersStorage.getAddressFromTokenId(
      _tokenId
    );
    _nftOffersStorage.setIndexOfOffersBidsFromAddress(
      _tokenId,
      msg.sender,
      addresses.length
    );
    _nftOffersStorage.pushAddressToTokenId(_tokenId, msg.sender);
  }

  function _removeOffer(uint256 _tokenId, address bidder) internal {
    _nftOffersStorage.deleteOffersBidsFromTokenId(_tokenId, bidder);

    uint256 index = _nftOffersStorage.getIndexOfOfferBidsFromAddress(
      _tokenId,
      bidder
    );
    _nftOffersStorage.deleteAddressFromBiddersByTokenIdAndIndex(
      _tokenId,
      index
    );
    _nftOffersStorage.deleteIndexOfOfferBidsFromAddress(_tokenId, bidder);
  }
}
