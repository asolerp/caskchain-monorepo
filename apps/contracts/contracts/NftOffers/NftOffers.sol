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

  NftVendor public nftVendor;
  ICCNftStorage private _ccNftStorage;
  INftOffersStorage private _nftOffersStorage;

  modifier hasOffers(uint256 tokenId) {
    address[] memory addresses = _ccNftStorage.getAddressFromTokenId(tokenId);
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
    address _nftVendor,
    address ccNftStorageAddress,
    address nftOffersStorageAddress
  ) public initializer {
    __Ownable_init();
    __UUPSUpgradeable_init();
    collection = _collection;
    nftVendor = NftVendor(_nftVendor);
    _ccNftStorage = ICCNftStorage(ccNftStorageAddress);
    _nftOffersStorage = INftOffersStorage(nftOffersStorageAddress);
  }

  function _authorizeUpgrade(address) internal override onlyOwner {}

  function getHighestBid(uint256 _tokenId) external view returns (uint256) {
    return _nftOffersStorage.getHighestBidByTokenId(_tokenId);
  }

  function makeOffer(uint256 _tokenId) public payable {
    // Ensure that the buyer is making a valid offer

    require(msg.value > 0, "Offer price must be greater than 0");

    IERC721Upgradeable nft = IERC721Upgradeable(collection);
    require(nft.ownerOf(_tokenId) != address(0), "Invalid token ID");

    uint256 previousBid = _nftOffersStorage.getPreviousBidderBidByTokenId(
      _tokenId
    );
    if (previousBid > 0) {
      uint256 pending = _nftOffersStorage.getPendingWithdrawalsByAddress(
        msg.sender
      );
      // Use a separate withdraw function to avoid reentrancy attacks
      pending += previousBid;
      _nftOffersStorage.setPendingWithdrawals(msg.sender, pending);
    }

    // if (offerBidsFromTokenId[_tokenId][msg.sender] > 0) {
    //   uint amount = offerBidsFromTokenId[_tokenId][msg.sender];
    //   payable(msg.sender).transfer(amount);
    // }

    uint256 highestBid = _nftOffersStorage.getHighestBidByTokenId(_tokenId);
    INftOffersStorage.Offer memory offer = _nftOffersStorage
      .getNftOfferByTokenId(_tokenId);

    //No offers made
    if (highestBid == 0) {
      _createNftOffer(_tokenId, msg.value, nft.ownerOf(_tokenId));
    } else {
      require(msg.value > offer.highestBid, "Offer price is too low");
      _setOffer(_tokenId, msg.value);
      _nftOffersStorage.setTokenIdToOffer(_tokenId, msg.value, msg.sender);
    }

    emit NewOffer(_tokenId, nft.ownerOf(_tokenId), msg.sender, msg.value);
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
    address[] memory bidders = _ccNftStorage.getAddressFromTokenId(_tokenId);
    return bidders;
  }

  function getCountNftOffers(uint256 _tokenId) public view returns (uint256) {
    address[] memory addresses = _ccNftStorage.getAddressFromTokenId(_tokenId);
    return addresses.length;
  }

  function withdrawOldOffers() external {
    uint256 amount = _nftOffersStorage.getPendingWithdrawalsByAddress(
      msg.sender
    );
    require(amount > 0, "No pending withdrawals");

    // IMPORTANT: set the pending amount to 0 before sending to prevent re-entrancy attacks
    _nftOffersStorage.setPendingWithdrawals(msg.sender, 0);

    (bool success, ) = msg.sender.call{ value: amount }("");
    require(success, "Withdrawal failed");
  }

  function withdraw(uint256 _tokenId) external returns (bool) {
    INftOffersStorage.Offer memory offer = _nftOffersStorage
      .getNftOfferByTokenId(_tokenId);
    uint256 amount = _nftOffersStorage.getOffersBidsFromTokenId(
      _tokenId,
      msg.sender
    );

    require(_tokenId > 0 && offer.seller != address(0), "Invalid token ID");
    require(amount > 0, "No active bid found");

    _nftOffersStorage.deleteOffersBidsFromTokenId(_tokenId, msg.sender);

    (bool success, ) = msg.sender.call{ value: amount }("");
    require(success, "Transfer failed");

    emit Withdraw(_tokenId, msg.sender, amount);

    _removeOffer(_tokenId, msg.sender);

    if (amount > 0 && offer.highestBidder == msg.sender) {
      _nftOffersStorage.setTokenIdToOffer(_tokenId, 0, offer.seller);

      address[] memory addresses = _ccNftStorage.getAddressFromTokenId(
        _tokenId
      );

      for (uint256 i = 0; i < addresses.length; i++) {
        address bidder = addresses[i];
        uint256 bidAmount = _nftOffersStorage.getOffersBidsFromTokenId(
          _tokenId,
          bidder
        );
        if (bidAmount > offer.highestBid) {
          _nftOffersStorage.setTokenIdToOffer(_tokenId, bidAmount, bidder);
        }
      }
    }

    return true;
  }

  function getCreatorNft(uint256 tokenId) external view returns (address) {
    address creator = _ccNftStorage.getNftCreator(tokenId);
    return creator;
  }

  function payRoyaltiesAndTransfer(
    uint256 _tokenId,
    uint256 highestBid
  ) private {
    require(_tokenId != 0, "Invalid token ID");
    require(highestBid > 0, "Invalid bid amount");

    bool excluded = nftVendor.getIsExcluded();
    address payable seller = payable(msg.sender);
    address payable creator = payable(_ccNftStorage.getNftCreator(_tokenId));
    uint256 royalty = nftVendor.calculateRoyaltyForAcceptedOffer(
      _tokenId,
      highestBid
    );
    uint256 totalAmount = highestBid;

    if (!excluded) {
      require(creator != address(0), "Invalid creator address");
      totalAmount -= royalty;
      creator.transfer(royalty);
      nftVendor.emitTxFee(_tokenId, royalty);
    }
    seller.transfer(totalAmount);
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

  function _createNftOffer(
    uint256 _tokenId,
    uint256 _nftPrice,
    address _seller
  ) private {
    // Sanity check that no inputs overflow how many bits we've allocated
    // to store them in the auction struct.

    _setOffer(_tokenId, _nftPrice);

    INftOffersStorage.Offer memory offer = INftOffersStorage.Offer(
      _tokenId,
      _seller,
      _nftPrice,
      msg.sender
    );
    _addAuction(_tokenId, offer);
  }

  function _addAuction(
    uint256 _tokenId,
    INftOffersStorage.Offer memory _offer
  ) internal {
    _nftOffersStorage.setOfferByTokenId(_tokenId, _offer);
  }

  function _removeOffer(uint256 _tokenId, address bidder) internal {
    INftOffersStorage.Offer memory offer = _nftOffersStorage
      .getNftOfferByTokenId(_tokenId);

    require(_tokenId > 0 && offer.seller != address(0), "Invalid token ID");
    require(bidder != address(0), "Invalid bidder address");
    _nftOffersStorage.deleteOffersBidsFromTokenId(_tokenId, bidder);

    address[] memory addresses = _ccNftStorage.getAddressFromTokenId(_tokenId);

    uint index = _nftOffersStorage.getIndexOfOfferBidsFromAddress(
      _tokenId,
      bidder
    );
    uint lastIndex = addresses.length - 1;
    address lastBidder = addresses[lastIndex];

    _nftOffersStorage.setIndexOfOffersBidsFromAddress(
      _tokenId,
      lastBidder,
      index
    );
    _nftOffersStorage.deleteIndexOfOfferBidsFromAddress(_tokenId, bidder);

    addresses[index] = lastBidder;
    _ccNftStorage.popAddressFromTokenId(_tokenId);
    _nftOffersStorage.setHasBidFromTokenId(_tokenId, bidder, false);

    emit RemoveOffer(_tokenId, msg.sender, msg.value);
  }

  function _setOffer(uint256 _tokenId, uint256 offer) private {
    _nftOffersStorage.setOfferBidFromTokenId(_tokenId, offer);
    bool bidderHasBid = _nftOffersStorage.getBidFromBidderByTokenId(_tokenId);
    address[] memory addresses = _ccNftStorage.getAddressFromTokenId(_tokenId);
    if (!bidderHasBid) {
      _nftOffersStorage.setIndexOfOffersBidsFromAddress(
        _tokenId,
        msg.sender,
        addresses.length
      );
      _ccNftStorage.pushAddressFromTokenId(_tokenId, msg.sender);
      _nftOffersStorage.setHasBidFromTokenId(_tokenId, msg.sender, true);
    }
  }
}
