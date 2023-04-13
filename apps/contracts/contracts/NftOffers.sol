// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./NftVendor.sol";
import "./CCNft.sol";

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
  // NFT Id => Address => bool
  mapping(uint256 => mapping(address => bool)) public hasBidFromTokenId;
  mapping(address => uint256) public pendingWithdrawals;

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

  event NewOffer(uint256 tokenId, address owner, address bidder, uint256 bid);
  event RemoveOffer(uint256 tokenId, address bidder, uint256 bid);
  event Withdraw(uint256 tokenId, address bidder, uint256 bid);
  event AcceptOffer(
    uint256 tokenId,
    address owner,
    address bidder,
    uint256 bid
  );

  constructor(address _collection, address _nftVendor) {
    collection = _collection;
    nftVendor = NftVendor(_nftVendor);
  }

  function makeOffer(uint256 _tokenId) public payable {
    // Ensure that the buyer is making a valid offer

    require(msg.value > 0, "Offer price must be greater than 0");

    IERC721 nft = IERC721(collection);
    require(nft.ownerOf(_tokenId) != address(0), "Invalid token ID");

    uint256 previousBid = offerBidsFromTokenId[_tokenId][msg.sender];
    if (previousBid > 0) {
      // Use a separate withdraw function to avoid reentrancy attacks
      pendingWithdrawals[msg.sender] += previousBid;
    }

    // if (offerBidsFromTokenId[_tokenId][msg.sender] > 0) {
    //   uint amount = offerBidsFromTokenId[_tokenId][msg.sender];
    //   payable(msg.sender).transfer(amount);
    // }

    // No offers made
    if (tokenIdToOffer[_tokenId].highestBid == 0) {
      _createNftOffer(_tokenId, msg.value, nft.ownerOf(_tokenId));
    } else {
      require(
        msg.value > tokenIdToOffer[_tokenId].highestBid,
        "Offer price is too low"
      );
      _setOffer(_tokenId, msg.value);
      tokenIdToOffer[_tokenId].highestBidder = msg.sender;
      tokenIdToOffer[_tokenId].highestBid = msg.value;
    }

    emit NewOffer(_tokenId, nft.ownerOf(_tokenId), msg.sender, msg.value);
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

  function withdrawOldOffers() external {
    uint256 amount = pendingWithdrawals[msg.sender];
    require(amount > 0, "No pending withdrawals");

    // IMPORTANT: set the pending amount to 0 before sending to prevent re-entrancy attacks
    pendingWithdrawals[msg.sender] = 0;

    (bool success, ) = msg.sender.call{ value: amount }("");
    require(success, "Withdrawal failed");
  }

  function withdraw(uint256 _tokenId) external returns (bool) {
    require(
      _tokenId > 0 && tokenIdToOffer[_tokenId].seller != address(0),
      "Invalid token ID"
    );
    require(
      offerBidsFromTokenId[_tokenId][msg.sender] > 0,
      "No active bid found"
    );

    uint256 amount = offerBidsFromTokenId[_tokenId][msg.sender];
    delete offerBidsFromTokenId[_tokenId][msg.sender];

    (bool success, ) = msg.sender.call{ value: amount }("");
    require(success, "Transfer failed");

    emit Withdraw(_tokenId, msg.sender, amount);

    _removeOffer(_tokenId, msg.sender);

    if (amount > 0 && tokenIdToOffer[_tokenId].highestBidder == msg.sender) {
      tokenIdToOffer[_tokenId].highestBid = 0;
      tokenIdToOffer[_tokenId].highestBidder = tokenIdToOffer[_tokenId].seller;

      for (uint256 i = 0; i < addressesFromTokenId[_tokenId].length; i++) {
        address bidder = addressesFromTokenId[_tokenId][i];
        uint256 bidAmount = offerBidsFromTokenId[_tokenId][bidder];
        if (bidAmount > tokenIdToOffer[_tokenId].highestBid) {
          tokenIdToOffer[_tokenId].highestBid = bidAmount;
          tokenIdToOffer[_tokenId].highestBidder = bidder;
        }
      }
    }

    return true;
  }

  function payRoyaltiesAndTransfer(
    uint256 _tokenId,
    uint256 highestBid
  ) private {
    require(_tokenId != 0, "Invalid token ID");
    require(highestBid > 0, "Invalid bid amount");

    CCNft nft = CCNft(collection);
    bool excluded = nftVendor.isExcluded();
    address payable seller = payable(msg.sender);
    address payable creator = payable(nft.getNftCreator(_tokenId));
    uint256 royalty = nftVendor.calculateRoyaltyForAcceptedOffer(
      _tokenId,
      highestBid
    );
    uint256 totalAmount = highestBid;

    if (!excluded) {
      require(creator != address(0), "Invalid creator address");
      totalAmount -= royalty;
      creator.transfer(royalty);
    }
    seller.transfer(totalAmount);
  }

  function acceptOffer(
    uint256 _tokenId
  ) public payable isOwner(_tokenId, msg.sender) hasOffers(_tokenId) {
    CCNft nft = CCNft(collection);
    require(
      nft.getApproved(_tokenId) == address(this),
      "NotApprovedForMarketplace"
    );

    Offer memory offer = tokenIdToOffer[_tokenId];
    address owner = nft.ownerOf(_tokenId);
    uint256 highestBid = offer.highestBid;
    address highestBidder = offer.highestBidder;

    payRoyaltiesAndTransfer(_tokenId, highestBid);

    nft.transferFrom(msg.sender, highestBidder, _tokenId);

    _removeOffer(_tokenId, highestBidder);
    delete tokenIdToOffer[_tokenId];

    emit AcceptOffer(_tokenId, owner, highestBidder, highestBid);
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
    require(
      _tokenId > 0 && tokenIdToOffer[_tokenId].seller != address(0),
      "Invalid token ID"
    );
    require(bidder != address(0), "Invalid bidder address");
    delete offerBidsFromTokenId[_tokenId][bidder];

    uint index = indexOfofferBidsFromAddress[_tokenId][bidder];
    uint lastIndex = addressesFromTokenId[_tokenId].length - 1;
    address lastBidder = addressesFromTokenId[_tokenId][lastIndex];

    indexOfofferBidsFromAddress[_tokenId][lastBidder] = index;
    delete indexOfofferBidsFromAddress[_tokenId][bidder];

    addressesFromTokenId[_tokenId][index] = lastBidder;
    addressesFromTokenId[_tokenId].pop();
    hasBidFromTokenId[_tokenId][msg.sender] = false;

    emit RemoveOffer(_tokenId, msg.sender, msg.value);
  }

  function _addAuction(uint256 _tokenId, Offer memory _offer) internal {
    tokenIdToOffer[_tokenId] = _offer;
  }

  function _setOffer(uint256 _tokenId, uint256 offer) private {
    offerBidsFromTokenId[_tokenId][msg.sender] = offer;
    if (!hasBidFromTokenId[_tokenId][msg.sender]) {
      indexOfofferBidsFromAddress[_tokenId][msg.sender] = addressesFromTokenId[
        _tokenId
      ].length;
      addressesFromTokenId[_tokenId].push(msg.sender);
      hasBidFromTokenId[_tokenId][msg.sender] = true;
    }
  }
}
