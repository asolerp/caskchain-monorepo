// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface INftOffersStorage {
  struct Offer {
    // Current owner of NFT
    uint256 nftId;
    address seller;
    uint highestBid;
    address highestBidder;
  }

  // GETTERS
  function getPreviousBidderBidByTokenId(
    uint256 _tokenId,
    address _address
  ) external view returns (uint256);

  function getNftOfferByTokenId(
    uint256 _tokenId
  ) external view returns (Offer memory);

  function getBidFromBidderByTokenId(
    uint256 _tokenId
  ) external view returns (bool);

  function getOffersBidsFromTokenId(
    uint256 _tokenId,
    address _address
  ) external view returns (uint256);

  function getAddressFromTokenId(
    uint256 tokenId
  ) external view returns (address[] memory);

  function getIndexOfOfferBidsFromAddress(
    uint256 _tokenId,
    address _address
  ) external view returns (uint256);

  function getHighestBidByTokenId(
    uint256 _tokenId
  ) external view returns (uint256);

  function getPendingWithdrawalsByAddress(
    address _address
  ) external view returns (uint256);

  // SETTERS
  function setIndexOfOffersBidsFromAddress(
    uint256 _tokenId,
    address _address,
    uint256 _index
  ) external;

  function setHasBidFromTokenId(
    uint256 _tokenId,
    address _address,
    bool _hasBid
  ) external;

  function setOfferByTokenId(uint256 _tokenId, Offer memory _offer) external;

  function setTokenIdToOffer(
    uint256 _tokenId,
    uint256 _bid,
    address _bidder
  ) external;

  function setPendingWithdrawals(address _address, uint256 _amount) external;

  function setOfferBidFromTokenIdBySender(
    uint256 _tokenId,
    address _address,
    uint256 _bid
  ) external;

  function pushAddressFromTokenId(uint256 tokenId, address bidder) external;

  function updateAddrressFromTokenId(
    uint256 tokenId,
    uint256 index,
    address bidder
  ) external;

  function popAddressFromTokenId(uint256 tokenId) external;

  function deleteOffersBidsFromTokenId(
    uint256 _tokenId,
    address _address
  ) external;

  function deleteIndexOfOfferBidsFromAddress(
    uint256 _tokenId,
    address _address
  ) external;

  function deleteAddressFromBiddersByTokenIdAndIndex(
    uint256 tokenId,
    uint256 index
  ) external;

  function deleteTokenIdFromOffer(uint256 _tokenId) external;
}
