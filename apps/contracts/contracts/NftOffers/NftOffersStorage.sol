// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";

contract NftOffersStorage is Ownable {
  struct Offer {
    // Current owner of NFT
    uint256 nftId;
    address seller;
    uint highestBid;
    address highestBidder;
  }

  Offer internal _offer;

  // Address => Boolean
  mapping(address => bool) public allowedAddresses;
  // Map from token ID to their corresponding auction.
  mapping(uint256 => Offer) tokenIdToOffer;
  // NFT Id => Account Address => Bid
  mapping(uint256 => mapping(address => uint256)) internal offerBidsFromTokenId;
  // NFT Id => Account Address => Index
  mapping(uint256 => mapping(address => uint256))
    internal indexOfofferBidsFromAddress;
  // NFT Id => Address => bool
  mapping(uint256 => mapping(address => bool)) internal hasBidFromTokenId;
  mapping(address => uint256) internal pendingWithdrawals;

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

  // GETTERES
  function getPreviousBidderBidByTokenId(
    uint256 _tokenId
  ) public view returns (uint256) {
    return offerBidsFromTokenId[_tokenId][msg.sender];
  }

  function getNftOfferByTokenId(
    uint256 _tokenId
  ) external view returns (Offer memory) {
    return tokenIdToOffer[_tokenId];
  }

  function getBidFromBidderByTokenId(
    uint256 _tokenId
  ) public view returns (bool) {
    return hasBidFromTokenId[_tokenId][msg.sender];
  }

  function getOffersBidsFromTokenId(
    uint256 _tokenId,
    address _address
  ) public view returns (uint256) {
    return offerBidsFromTokenId[_tokenId][_address];
  }

  function getIndexOfOfferBidsFromAddress(
    uint256 _tokenId,
    address _address
  ) public view returns (uint256) {
    return indexOfofferBidsFromAddress[_tokenId][_address];
  }

  function getHighestBidByTokenId(
    uint256 _tokenId
  ) public view returns (uint256) {
    return tokenIdToOffer[_tokenId].highestBid;
  }

  function getPendingWithdrawalsByAddress(
    address _address
  ) public view returns (uint256) {
    return pendingWithdrawals[_address];
  }

  // SETTERS

  function setIndexOfOffersBidsFromAddress(
    uint256 _tokenId,
    address _address,
    uint256 _index
  ) public onlyAllowed {
    indexOfofferBidsFromAddress[_tokenId][_address] = _index;
  }

  function setHasBidFromTokenId(
    uint256 _tokenId,
    address _address,
    bool _hasBid
  ) public onlyAllowed {
    hasBidFromTokenId[_tokenId][_address] = _hasBid;
  }

  function setOfferByTokenId(
    uint256 _tokenId,
    Offer memory offer
  ) public onlyAllowed {
    tokenIdToOffer[_tokenId] = offer;
  }

  function setTokenIdToOffer(
    uint256 _tokenId,
    uint256 _bid,
    address _bidder
  ) public onlyAllowed {
    tokenIdToOffer[_tokenId].highestBidder = _bidder;
    tokenIdToOffer[_tokenId].highestBid = _bid;
  }

  function setPendingWithdrawals(
    address _address,
    uint256 _amount
  ) public onlyAllowed {
    pendingWithdrawals[_address] = _amount;
  }

  function setOfferBidFromTokenId(
    uint256 _tokenId,
    uint256 _bid
  ) public onlyAllowed {
    offerBidsFromTokenId[_tokenId][msg.sender] = _bid;
  }

  function deleteOffersBidsFromTokenId(
    uint256 _tokenId,
    address _address
  ) public onlyAllowed {
    delete offerBidsFromTokenId[_tokenId][_address];
  }

  function deleteIndexOfOfferBidsFromAddress(
    uint256 _tokenId,
    address _address
  ) public onlyAllowed {
    delete indexOfofferBidsFromAddress[_tokenId][_address];
  }

  function deleteTokenIdFromOffer(uint256 _tokenId) public onlyAllowed {
    delete tokenIdToOffer[_tokenId];
  }
}
