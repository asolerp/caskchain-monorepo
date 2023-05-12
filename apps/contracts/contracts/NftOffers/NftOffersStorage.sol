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
    internal indexOfOfferBidsFromAddress;
  // Address => Booelan
  mapping(uint256 => address[]) public addressesFromTokenId;

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
    uint256 _tokenId,
    address _address
  ) public view returns (uint256) {
    return offerBidsFromTokenId[_tokenId][_address];
  }

  function getNftOfferByTokenId(
    uint256 _tokenId
  ) external view returns (Offer memory) {
    return tokenIdToOffer[_tokenId];
  }

  function getOffersBidsFromTokenId(
    uint256 _tokenId,
    address _address
  ) public view returns (uint256) {
    return offerBidsFromTokenId[_tokenId][_address];
  }

  function getAddressFromTokenId(
    uint256 tokenId
  ) public view returns (address[] memory) {
    return addressesFromTokenId[tokenId];
  }

  function getIndexOfOfferBidsFromAddress(
    uint256 _tokenId,
    address _address
  ) public view returns (uint256) {
    return indexOfOfferBidsFromAddress[_tokenId][_address];
  }

  function getHighestBidByTokenId(
    uint256 _tokenId
  ) public view returns (uint256) {
    return tokenIdToOffer[_tokenId].highestBid;
  }

  // SETTERS

  function setIndexOfOffersBidsFromAddress(
    uint256 _tokenId,
    address _address,
    uint256 _index
  ) public onlyAllowed {
    indexOfOfferBidsFromAddress[_tokenId][_address] = _index;
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

  function setOfferBidFromTokenIdBySender(
    uint256 _tokenId,
    address _address,
    uint256 _bid
  ) public onlyAllowed {
    offerBidsFromTokenId[_tokenId][_address] = _bid;
  }

  function updateAddrressFromTokenId(
    uint256 tokenId,
    uint256 index,
    address bidder
  ) public onlyAllowed {
    addressesFromTokenId[tokenId][index] = bidder;
  }

  function pushAddressFromTokenId(
    uint256 tokenId,
    address creator
  ) public onlyAllowed {
    addressesFromTokenId[tokenId].push(creator);
  }

  function deleteOffersBidsFromTokenId(
    uint256 _tokenId,
    address _address
  ) public onlyAllowed {
    delete offerBidsFromTokenId[_tokenId][_address];
  }

  function popAddressFromTokenId(uint256 tokenId) public onlyAllowed {
    addressesFromTokenId[tokenId].pop();
  }

  // function deleteAddressFromBiddersByTokenIdAndIndex(
  //   uint256 tokenId,
  //   uint256 index
  // ) public onlyAllowed {
  //   addressesWithBidsFromTokenId[tokenId][index] = addressesWithBidsFromTokenId[
  //     tokenId
  //   ][addressesWithBidsFromTokenId[tokenId].length - 1];
  //   addressesWithBidsFromTokenId[tokenId].pop();
  // }

  function deleteIndexOfOfferBidsFromAddress(
    uint256 _tokenId,
    address _address
  ) public onlyAllowed {
    delete indexOfOfferBidsFromAddress[_tokenId][_address];
  }

  function deleteTokenIdFromOffer(uint256 _tokenId) public onlyAllowed {
    delete tokenIdToOffer[_tokenId];
  }
}
