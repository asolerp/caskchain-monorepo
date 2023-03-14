// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import '@openzeppelin/contracts/token/common/ERC2981.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/utils/math/SafeMath.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';

contract NftOffers is Ownable {
  struct Offer {
    // Current owner of NFT
    uint256 nftId;
    address seller;
    uint lowerBid;
    uint highestBid;
    address highestBidder;
  }

  event Start();
  event End(address highestBidder, uint highestBid);
  event Bid(address indexed sender, uint amount);
  event Withdraw(address indexed bidder, uint amount);

  // Map from token ID to their corresponding auction.
  mapping(uint256 => Offer) tokenIdToOffer;

  mapping(uint256 => mapping(address => uint256)) offerBidsFromTokenId;
  mapping(uint256 => mapping(address => uint256)) indexOfofferBidsFromTokenId;
  mapping(uint256 => address[]) addressesFromTokenId;

  ERC721 public nonFungibleContract;

  mapping(address => uint) public bids;

  constructor(ERC721 _nonFungibleContract) {
    nonFungibleContract = _nonFungibleContract;
  }

  function createNftOffer(
    uint256 _tokenId,
    uint256 _nftPrice,
    address _seller
  ) external onlyOwner {
    // Sanity check that no inputs overflow how many bits we've allocated
    // to store them in the auction struct.
    require(_owns(msg.sender, _tokenId));

    _setOffer(_tokenId, _nftPrice);

    Offer memory offer = Offer(
      _tokenId,
      _seller,
      _nftPrice,
      _nftPrice,
      msg.sender
    );

    _addAuction(_tokenId, offer);
  }

  function acceptOffer(uint256 _tokenId) public payable {
    Offer memory offer = tokenIdToOffer[_tokenId];
    require(msg.sender == offer.seller, 'Only seller can accept the offer');
    (bool sent, ) = offer.seller.call{value: offer.highestBid}('');
    nonFungibleContract.safeTransferFrom(
      msg.sender,
      offer.highestBidder,
      _tokenId
    );
    require(sent, 'Could not pay seller!');
  }

  function getBidAddressesByTokenId(
    uint256 _tokenId
  ) external view returns (address[] memory) {
    return addressesFromTokenId[_tokenId];
  }

  function makeOffer(uint256 _tokenId) public payable {
    // Ensure that the buyer is making a valid offer
    require(
      msg.value >= tokenIdToOffer[_tokenId].highestBid,
      'Offer price is too low'
    );

    if (offerBidsFromTokenId[_tokenId][msg.sender] > 0) {
      uint amount = offerBidsFromTokenId[_tokenId][msg.sender];
      payable(msg.sender).transfer(amount);
    }

    // Save the offer details
    _setOffer(_tokenId, msg.value);
    tokenIdToOffer[_tokenId].highestBidder = msg.sender;
    tokenIdToOffer[_tokenId].highestBid = msg.value;
  }

  function withdraw(uint256 _tokenId) external payable returns (bool) {
    require(
      offerBidsFromTokenId[_tokenId][msg.sender] > 0,
      'You must have a bid to be able to witdraw'
    );

    uint amount = offerBidsFromTokenId[_tokenId][msg.sender];
    payable(msg.sender).transfer(amount);

    _removeOffer(_tokenId);

    if (tokenIdToOffer[_tokenId].highestBidder == msg.sender) {
      tokenIdToOffer[_tokenId].highestBid = tokenIdToOffer[_tokenId].lowerBid;
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

    return true;
  }

  function getNftOffer(uint256 _tokenId) external view returns (Offer memory) {
    Offer memory offer = tokenIdToOffer[_tokenId];
    return offer;
  }

  function _owns(
    address _claimant,
    uint256 _tokenId
  ) internal view returns (bool) {
    return (nonFungibleContract.ownerOf(_tokenId) == _claimant);
  }

  function _addAuction(uint256 _tokenId, Offer memory _offer) internal {
    tokenIdToOffer[_tokenId] = _offer;
  }

  function _setOffer(uint256 _tokenId, uint256 offer) private {
    offerBidsFromTokenId[_tokenId][msg.sender] = offer;
    indexOfofferBidsFromTokenId[_tokenId][msg.sender] = addressesFromTokenId[
      _tokenId
    ].length;
    addressesFromTokenId[_tokenId].push(msg.sender);
  }

  function _removeOffer(uint256 _tokenId) public {
    delete offerBidsFromTokenId[_tokenId][msg.sender];

    uint index = indexOfofferBidsFromTokenId[_tokenId][msg.sender];
    uint lastIndex = addressesFromTokenId[_tokenId].length - 1;
    address lastBidder = addressesFromTokenId[_tokenId][lastIndex];

    indexOfofferBidsFromTokenId[_tokenId][lastBidder] = index;
    delete indexOfofferBidsFromTokenId[_tokenId][msg.sender];

    addressesFromTokenId[_tokenId][index] = lastBidder;
    addressesFromTokenId[_tokenId].pop();
  }

  // function _transfer(address _receiver, uint256 _tokenId) internal {
  //     // it will throw if transfer fails
  //     nonFungibleContract.transfer(_receiver, _tokenId);
  // }
}
