// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import '@openzeppelin/contracts/token/ERC721/IERC721.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';
import '@openzeppelin/contracts/token/common/ERC2981.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import './NftVendor.sol';

// Check out https://github.com/Fantom-foundation/Artion-Contracts/blob/5c90d2bc0401af6fb5abf35b860b762b31dfee02/contracts/FantomMarketplace.sol
// For a full decentralized nft marketplace

// Error thrown for isNotOwner modifier
// error IsNotOwner()
error NotOffers();

contract NftOffers is ReentrancyGuard {
  struct Offer {
    // Current owner of NFT
    uint256 nftId;
    address seller;
    uint highestBid;
    address highestBidder;
  }

  address public collection;
  NftVendor public nftVendor;

  // Map from token ID to their corresponding auction.
  mapping(uint256 => Offer) tokenIdToOffer;
  // NFT Id => Account Address => Bid
  mapping(uint256 => mapping(address => uint256)) public offerBidsFromTokenId;
  // NFT Id => Account Address => Index
  mapping(uint256 => mapping(address => uint256)) indexOfofferBidsFromAddress;
  // NFT Id => Address[]
  mapping(uint256 => address[]) public addressesFromTokenId;

  modifier hasOffers(uint256 tokenId) {
    if (addressesFromTokenId[tokenId].length == 0) {
      revert NotOffers();
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

  event NewOffer(uint256 tokenId, address bidder, uint256 bid);
  event Withdraw(uint256 tokenId, address bidder, uint256 bid);
  event AcceptOffer(uint256 tokenId, address bidder, uint256 bid);

  constructor(address _collection, address _nftVendor) {
    collection = _collection;
    nftVendor = NftVendor(_nftVendor);
  }

  function makeOffer(uint256 _tokenId) public payable {
    // Ensure that the buyer is making a valid offer

    require(msg.value > 0, 'Offer price is too low');

    if (offerBidsFromTokenId[_tokenId][msg.sender] > 0) {
      uint amount = offerBidsFromTokenId[_tokenId][msg.sender];
      payable(msg.sender).transfer(amount);
    }

    // No offers made
    if (tokenIdToOffer[_tokenId].highestBid == 0) {
      IERC721 nft = IERC721(collection);
      address owner = nft.ownerOf(_tokenId);
      _createNftOffer(_tokenId, msg.value, owner);
    } else {
      require(
        msg.value > tokenIdToOffer[_tokenId].highestBid,
        'Offer price is too low'
      );
      _setOffer(_tokenId, msg.value);
      tokenIdToOffer[_tokenId].highestBidder = msg.sender;
      tokenIdToOffer[_tokenId].highestBid = msg.value;
    }

    emit NewOffer(_tokenId, msg.sender, msg.value);
  }

  function getAddressesBids(
    uint256 _tokenId
  ) public view returns (address[] memory) {
    address[] memory bidders = addressesFromTokenId[_tokenId];
    return bidders;
  }

  function getNftOffer(uint256 _tokenId) public view returns (Offer memory) {
    Offer memory offer = tokenIdToOffer[_tokenId];
    return offer;
  }

  function getCountNftOffers(uint256 _tokenId) public view returns (uint256) {
    return addressesFromTokenId[_tokenId].length;
  }

  function withdraw(uint256 _tokenId) external payable returns (bool) {
    require(
      offerBidsFromTokenId[_tokenId][msg.sender] > 0,
      'You must have a bid to be able to witdraw'
    );

    uint amount = offerBidsFromTokenId[_tokenId][msg.sender];
    payable(msg.sender).transfer(amount);

    _removeOffer(_tokenId, msg.sender);

    if (tokenIdToOffer[_tokenId].highestBidder == msg.sender) {
      tokenIdToOffer[_tokenId].highestBid = 0;
      tokenIdToOffer[_tokenId].highestBidder = tokenIdToOffer[_tokenId].seller;
      for (uint i = 0; i < addressesFromTokenId[_tokenId].length; i++) {
        if (
          offerBidsFromTokenId[_tokenId][addressesFromTokenId[_tokenId][i]] >
          tokenIdToOffer[_tokenId].highestBid
        ) {
          tokenIdToOffer[_tokenId].highestBid = offerBidsFromTokenId[_tokenId][
            addressesFromTokenId[_tokenId][i]
          ];
          tokenIdToOffer[_tokenId].highestBidder = addressesFromTokenId[
            _tokenId
          ][i];
        }
      }
    }

    emit Withdraw(_tokenId, msg.sender, amount);

    return true;
  }

  function acceptOffer(
    uint256 _tokenId
  ) public payable isOwner(_tokenId, msg.sender) hasOffers(_tokenId) {
    IERC721 nft = IERC721(collection);
    if (nft.getApproved(_tokenId) != address(this)) {
      revert NotApprovedForMarketplace();
    }

    address payable seller = payable(msg.sender);
    uint256 highestBid = tokenIdToOffer[_tokenId].highestBid;
    address highestBidder = tokenIdToOffer[_tokenId].highestBidder;
    uint256 royalty;
    bool excluded = nftVendor.isExcluded();

    royalty = nftVendor.calculateRoyaltyForAcceptedOffer(_tokenId, highestBid);

    if (excluded) {
      seller.transfer(highestBid);
    } else {
      nftVendor._payTxFee(royalty);
      seller.transfer(highestBid - royalty);
    }

    IERC721(collection).transferFrom(msg.sender, highestBidder, _tokenId);

    _removeOffer(_tokenId, highestBidder);
    delete tokenIdToOffer[_tokenId];

    emit AcceptOffer(_tokenId, highestBidder, highestBid);
  }

  function _createNftOffer(
    uint256 _tokenId,
    uint256 _nftPrice,
    address _seller
  ) private {
    // Sanity check that no inputs overflow how many bits we've allocated
    // to store them in the auction struct.

    _setOffer(_tokenId, _nftPrice);

    Offer memory offer = Offer(_tokenId, _seller, _nftPrice, msg.sender);

    _addAuction(_tokenId, offer);
  }

  function _removeOffer(uint256 _tokenId, address bidder) internal {
    delete offerBidsFromTokenId[_tokenId][bidder];

    uint index = indexOfofferBidsFromAddress[_tokenId][bidder];
    uint lastIndex = addressesFromTokenId[_tokenId].length - 1;
    address lastBidder = addressesFromTokenId[_tokenId][lastIndex];

    indexOfofferBidsFromAddress[_tokenId][lastBidder] = index;
    delete indexOfofferBidsFromAddress[_tokenId][bidder];

    addressesFromTokenId[_tokenId][index] = lastBidder;
    addressesFromTokenId[_tokenId].pop();
  }

  function _addAuction(uint256 _tokenId, Offer memory _offer) internal {
    tokenIdToOffer[_tokenId] = _offer;
  }

  function _setOffer(uint256 _tokenId, uint256 offer) private {
    offerBidsFromTokenId[_tokenId][msg.sender] = offer;
    indexOfofferBidsFromAddress[_tokenId][msg.sender] = addressesFromTokenId[
      _tokenId
    ].length;
    addressesFromTokenId[_tokenId].push(msg.sender);
  }
}
