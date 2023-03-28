// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import '@openzeppelin/contracts/token/common/ERC2981.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/utils/math/SafeMath.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import '@openzeppelin/contracts/utils/math/SafeMath.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';
import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

import './NftFraction.sol';

contract NftMarket is ERC721URIStorage, ERC2981, ReentrancyGuard, Ownable {
  using SafeMath for uint256;
  using Counters for Counters.Counter;

  struct ERC20Token {
    address paytoken;
    uint256 costvalue;
  }

  struct NftOffer {
    uint256 date;
    uint256 offer;
    address from;
  }

  struct NftItem {
    uint256 tokenId;
    uint256 price;
    address creator;
    address owner;
    bool isLocked;
    bool isListed;
  }

  struct Offer {
    // Current owner of NFT
    uint256 nftId;
    address seller;
    uint lowerBid;
    uint highestBid;
    address highestBidder;
  }

  address public txFeeToken;
  uint public listingPrice = 0.025 ether;
  uint public bottlePrice = 0.013 ether;
  uint public _minimumFee = 0.02 ether;
  uint256 constant SECONDS_PER_DAY = 24 * 60 * 60;
  int256 constant OFFSET19700101 = 2440588;
  bool public paused = false;

  Counters.Counter private _tokenIds;
  Counters.Counter private _listedItems;

  // TokenURI => Bool (Is used?)
  mapping(string => bool) private _usedTokenURIs;
  // NFT ID => NftItem
  mapping(uint256 => NftItem) private _idToNftItem;
  // NFT ID => NftOffers[]
  mapping(uint256 => NftOffer[]) private _idToNftsOffers;
  // NFT ID => ERC20 Address => Price in ERC20 Token
  mapping(uint256 => mapping(address => uint256)) private _tokenIDpriceByErc20;
  // Account address => NFT Id => Index
  mapping(address => mapping(uint256 => uint256)) private _ownedTokens;
  // NFT Id => Year => Extractions
  mapping(uint256 => mapping(uint256 => uint256))
    private _tokensExtractionsByYear;
  // Map from token ID to their corresponding auction.
  mapping(uint256 => Offer) tokenIdToOffer;
  // NFT Id => Account Address => Bid
  mapping(uint256 => mapping(address => uint256)) offerBidsFromTokenId;
  // NFT Id => Account Address => Index
  mapping(uint256 => mapping(address => uint256)) indexOfofferBidsFromAddress;
  // NFT Id => Address[]
  mapping(uint256 => address[]) addressesFromTokenId;
  // Address => Booelan
  mapping(address => bool) public excludedList;
  // NFT id => ERC20 share
  mapping(uint256 => uint256) private _idToOwnedIndex;
  // NFT id => Index
  mapping(uint256 => uint256) private _idToNftIndex;

  // SHARES

  // NFT ID => share value
  mapping(uint256 => uint256) public idToShareValue;
  // NFT id => ERC20 share
  mapping(uint256 => ERC20) public idToShare;
  // ERC20 ==> uint256
  mapping(ERC20 => uint256) public fTokenAvailableShares;

  uint256[] private _allNfts;

  event Mint(address owner, uint256 tokenId, uint256 value, string tokenURI);
  event Sale(
    address indexed from,
    address indexed to,
    uint256 tokenId,
    uint256 value
  );

  event Start();
  event End(address highestBidder, uint highestBid);
  event Bid(address indexed sender, uint amount);
  event Withdraw(address indexed bidder, uint amount);

  event NftItemCreated(
    uint256 tokenId,
    uint256 price,
    address creator,
    address owner,
    bool isListed
  );

  constructor() ERC721('CasksNFT', 'CSKNFT') {
    _setDefaultRoyalty(msg.sender, 1000);
    excludedList[msg.sender] = true;
  }

  function burn(uint256 tokenId) public onlyOwner {
    super._burn(tokenId);
    _resetTokenRoyalty(tokenId);
  }

  function mintNFT(
    string memory tokenURI,
    uint256 price,
    ERC20Token[] memory tokens
  ) public onlyOwner returns (uint256) {
    require(!tokenURIExists(tokenURI), 'Token URI already exists');

    _listedItems.increment();
    _tokenIds.increment();

    uint256 newItemId = _tokenIds.current();
    uint256 year = getYear(block.timestamp);

    _safeMint(msg.sender, newItemId);

    _setTokenURI(newItemId, tokenURI);
    _createNftItem(newItemId, price);
    _usedTokenURIs[tokenURI] = true;
    _tokensExtractionsByYear[newItemId][year] = 0;

    for (uint i = 0; i < tokens.length; i++) {
      addUpdateNFTERC20Price(
        newItemId,
        tokens[i].paytoken,
        tokens[i].costvalue
      );
    }

    // _createNftOffer(newItemId, price, msg.sender);

    emit Mint(msg.sender, newItemId, price, tokenURI);

    return newItemId;
  }

  // function getBalanceOfUserShares(
  //   address from,
  //   uint256 _tokenId
  // ) public view returns (uint256 shares) {
  //   ERC20 fToken = idToShare[_tokenId];
  //   return fToken.balanceOf(from);
  // }

  // function getAvailableFractionalizedSharesByTokenId(
  //   uint256 _tokenId
  // ) public view returns (uint256 shares) {
  //   ERC20 fToken = idToShare[_tokenId];
  //   return fTokenAvailableShares[fToken];
  // }

  // function getFractionalizedSharesByTokenId(
  //   uint256 _tokenId
  // ) public view returns (uint256 shares) {
  //   ERC20 fToken = idToShare[_tokenId];
  //   return fToken.totalSupply();
  // }

  // function getERC20FractionalizeAddress(
  //   uint256 _tokenId
  // ) public view returns (ERC20 ftoken) {
  //   return idToShare[_tokenId];
  // }

  // // lock NFT in fractional contract
  // function lockNFT(uint256 _tokenID, uint256 _sharesAmount) public {
  //   // transfer NFT to contract
  //   transferFrom(msg.sender, address(this), _tokenID);

  //   // mint & transfer ERC20 to contract
  //   // set name of new token
  //   string memory tokenID = Strings.toString(_tokenID);
  //   string memory _tokenName = 'FractionCaskNFT';
  //   string memory tokenName = string(abi.encodePacked(_tokenName, tokenID));

  //   // set symbol of new token
  //   string memory _tokenSymbol = 'FCNFT';
  //   string memory tokenSymbol = string(abi.encodePacked(_tokenSymbol, tokenID));

  //   // create new token
  //   ERC20 fToken = new NftFraction(tokenName, tokenSymbol, _sharesAmount);

  //   // transfer tokens to this contract address
  //   fToken.transfer(address(this), _sharesAmount);
  //   // update mapping
  //   idToShare[_tokenID] = fToken;
  //   fTokenAvailableShares[fToken] = _sharesAmount;
  //   // update share valueusing SafeMath for uint256;
  //   uint256 _price = _idToNftItem[_tokenID].price;
  //   _idToNftItem[_tokenID].isLocked = true;
  //   idToShareValue[_tokenID] = _price.div(_sharesAmount);
  // }

  // function buyFractionalShares(
  //   uint256 _tokenID,
  //   uint256 _totalShares
  // ) public payable {
  //   require(msg.value > 0, 'Insufficient funds');
  //   require(_totalShares > 0, 'Insufficient shares');
  //   require(
  //     msg.value >= idToShareValue[_tokenID].mul(_totalShares),
  //     'Insufficient funds'
  //   );

  //   require(
  //     _totalShares <= fTokenAvailableShares[idToShare[_tokenID]],
  //     'Insuffiecient shares'
  //   );

  //   // user sends ETH to owner
  //   address payable nftCreator = payable(_idToNftItem[_tokenID].creator);
  //   uint256 _amount = idToShareValue[_tokenID].mul(_totalShares);
  //   nftCreator.transfer(_amount);

  //   ERC20 fToken = idToShare[_tokenID];

  //   fTokenAvailableShares[fToken] =
  //     fTokenAvailableShares[fToken] -
  //     _totalShares;

  //   fToken.transfer(msg.sender, _totalShares);
  // }

  function addUpdateNFTERC20Price(
    uint256 tokenId,
    address token,
    uint256 price
  ) public onlyOwner {
    _tokenIDpriceByErc20[tokenId][token] = price;
  }

  // function buyNFT(uint256 tokenId) public payable {
  //   address owner = ERC721.ownerOf(tokenId);
  //   uint256 price = _idToNftItem[tokenId].price;
  //   address creator = _idToNftItem[tokenId].creator;

  //   require(msg.sender != owner, 'You already own this NFT');
  //   require(msg.value == price, 'Please submit the asking price');

  //   (, uint256 royaltyAmount) = royaltyInfo(tokenId, price);

  //   if (excludedList[msg.sender] == false && owner != creator) {
  //     _payTxFee(tokenId, royaltyAmount);
  //     payable(owner).transfer(msg.value - royaltyAmount);
  //   } else {
  //     payable(owner).transfer(msg.value);
  //   }

  //   _idToNftItem[tokenId].isListed = false;
  //   _idToNftItem[tokenId].owner = msg.sender;

  //   _listedItems.decrement();

  //   _transfer(owner, msg.sender, tokenId);
  //   _updateOfferWithNewBuyer(tokenId, msg.sender);

  //   emit Sale(owner, msg.sender, tokenId, msg.value);
  // }

  // function buyNFTWithERC20(uint256 _tokenId, address _erc20Token) public {
  //   IERC20 token = IERC20(_erc20Token);
  //   address owner = ERC721.ownerOf(_tokenId);
  //   require(
  //     _idToNftItem[_tokenId].isListed == true,
  //     'Token must be on sale first'
  //   );
  //   uint256 nftPrice = getNFTCost(_tokenId, _erc20Token);
  //   require(
  //     token.allowance(msg.sender, address(this)) >= nftPrice,
  //     'Insufficient allowance.'
  //   );
  //   require(token.balanceOf(msg.sender) >= nftPrice, 'Insufficient balance.');

  //   token.transferFrom(msg.sender, owner, nftPrice);
  //   // transfer the nft to buyer as well... I've not implemented that
  //   _idToNftItem[_tokenId].isListed = false;
  //   _idToNftItem[_tokenId].owner = msg.sender;
  //   _listedItems.decrement();

  //   emit Sale(owner, msg.sender, _tokenId, nftPrice);

  //   _transfer(owner, msg.sender, _tokenId);
  // }

  // function getTokenExtractionsByYear(
  //   uint256 tokenId,
  //   uint256 year
  // ) public view returns (uint256 extractions) {
  //   return _tokensExtractionsByYear[tokenId][year];
  // }

  // function getNFTCost(
  //   uint256 tokenId,
  //   address _erc20Token
  // ) public view virtual returns (uint256) {
  //   uint256 cost;
  //   cost = _tokenIDpriceByErc20[tokenId][_erc20Token];
  //   return cost;
  // }

  function getAllNFTs() external view returns (NftItem[] memory) {
    uint allItemsCounts = totalSupply();
    uint currentIndex = 0;
    NftItem[] memory items = new NftItem[](_tokenIds.current());

    for (uint i = 0; i < allItemsCounts; i++) {
      uint tokenId = tokenByIndex(i);
      NftItem storage item = _idToNftItem[tokenId];
      items[currentIndex] = item;
      currentIndex += 1;
    }

    return items;
  }

  function getAllLockedNfts() external view returns (NftItem[] memory) {
    uint allItemsCounts = totalSupply();
    uint currentIndex = 0;
    NftItem[] memory items = new NftItem[](_listedItems.current());

    for (uint i = 0; i < allItemsCounts; i++) {
      uint tokenId = tokenByIndex(i);
      NftItem storage item = _idToNftItem[tokenId];

      if (item.isListed == true) {
        items[currentIndex] = item;
        currentIndex += 1;
      }
    }

    return items;
  }

  function getAllNftsOnSale() external view returns (NftItem[] memory) {
    uint allItemsCounts = totalSupply();
    uint currentIndex = 0;
    NftItem[] memory items = new NftItem[](_listedItems.current());

    for (uint i = 0; i < allItemsCounts; i++) {
      uint tokenId = tokenByIndex(i);
      NftItem storage item = _idToNftItem[tokenId];

      if (item.isListed == true) {
        items[currentIndex] = item;
        currentIndex += 1;
      }
    }

    return items;
  }

  function getOwnedNfts() public view returns (NftItem[] memory) {
    uint ownedItemsCount = ERC721.balanceOf(msg.sender);
    NftItem[] memory items = new NftItem[](ownedItemsCount);

    for (uint i = 0; i < ownedItemsCount; i++) {
      uint tokenId = tokenOfOwnerByIndex(msg.sender, i);
      NftItem storage item = _idToNftItem[tokenId];
      items[i] = item;
    }

    return items;
  }

  function getNftItem(uint tokenId) public view returns (NftItem memory) {
    return _idToNftItem[tokenId];
  }

  // function getNftListedItemsCount() public view returns (uint) {
  //   return _listedItems.current();
  // }

  function orderBottle(
    uint256 numberOfBottles,
    uint256 tokenId,
    string memory tokenURI
  ) public payable {
    require(numberOfBottles > 0, 'You cannot order 0 bottles');

    uint256 year = getYear(block.timestamp);
    uint256 yearExtractedBottles = _tokensExtractionsByYear[tokenId][year];
    address creator = payable(_idToNftItem[tokenId].creator);

    payable(creator).transfer(numberOfBottles * bottlePrice);

    _tokensExtractionsByYear[tokenId][year] =
      yearExtractedBottles +
      numberOfBottles;

    _setTokenURI(tokenId, tokenURI);
  }

  // function setListingPrice(uint256 newListingPrice) external onlyOwner {
  //   require(newListingPrice > 0, 'Price must be at least 1 wei');
  //   listingPrice = newListingPrice;
  // }

  // function placeNftOnSale(uint256 tokenId, uint256 newPrice) public {
  //   require(
  //     ERC721.ownerOf(tokenId) == msg.sender,
  //     'You are not the owner of this nft'
  //   );
  //   require(
  //     _idToNftItem[tokenId].isListed == false,
  //     'Items is already on sale'
  //   );

  //   _idToNftItem[tokenId].isListed = true;
  //   _idToNftItem[tokenId].price = newPrice;
  //   _listedItems.increment();
  // }

  function totalSupply() public view returns (uint256) {
    return _allNfts.length;
  }

  function tokenByIndex(uint index) public view returns (uint) {
    require(index < totalSupply(), 'Index out of bounds');
    return _allNfts[index];
  }

  function tokenOfOwnerByIndex(
    address owner,
    uint index
  ) public view returns (uint) {
    require(index < ERC721.balanceOf(owner), 'Index out of bounds');
    return _ownedTokens[owner][index];
  }

  function supportsInterface(
    bytes4 interfaceId
  ) public view virtual override(ERC721, ERC2981) returns (bool) {
    return super.supportsInterface(interfaceId);
  }

  function tokenURIExists(string memory tokenURI) public view returns (bool) {
    return _usedTokenURIs[tokenURI] == true;
  }

  function getYear(uint256 timestamp) internal pure returns (uint256 year) {
    (year, , ) = _daysToDate(timestamp / SECONDS_PER_DAY);
  }

  function setExcluded(address excluded, bool status) external onlyOwner {
    excludedList[excluded] = status;
  }

  function transferFrom(
    address from,
    address to,
    uint256 tokenId
  ) public payable override {
    require(
      _isApprovedOrOwner(_msgSender(), tokenId),
      'ERC721: transfer caller is not owner nor approved'
    );

    uint256 royalty;

    if (msg.value > 0) {
      (, royalty) = royaltyInfo(tokenId, msg.value);

      if (excludedList[from] == false) {
        _payTxFee(tokenId, royalty);
        (bool successPayWithRoyalty, ) = payable(to).call{
          value: msg.value - royalty
        }('');
        require(successPayWithRoyalty);
      } else {
        (bool successPayWithoutRoyalty, ) = payable(to).call{value: msg.value}(
          ''
        );
        require(successPayWithoutRoyalty);
      }
    }

    if (_idToNftItem[tokenId].isListed == true) {
      _listedItems.decrement();
      _idToNftItem[tokenId].isListed = false;
    }

    _idToNftItem[tokenId].owner = to;

    _transfer(from, to, tokenId);

    emit Sale(from, to, tokenId, msg.value);
  }

  function safeTransferFrom(
    address from,
    address to,
    uint256 tokenId
  ) public payable override {
    uint256 royalty;

    if (msg.value > 0) {
      (, royalty) = royaltyInfo(tokenId, msg.value);

      if (excludedList[from] == false) {
        _payTxFee(tokenId, royalty);
        (bool successPayWithRoyalty, ) = payable(to).call{
          value: msg.value - royalty
        }('');
        require(successPayWithRoyalty);
      } else {
        (bool successPayWithoutRoyalty, ) = payable(to).call{value: msg.value}(
          ''
        );
        require(successPayWithoutRoyalty);
      }
    }

    if (_idToNftItem[tokenId].isListed == true) {
      _listedItems.decrement();
      _idToNftItem[tokenId].isListed = false;
    }

    _idToNftItem[tokenId].owner = to;

    safeTransferFrom(from, to, tokenId, '');

    emit Sale(from, to, tokenId, msg.value);
  }

  function safeTransferFrom(
    address from,
    address to,
    uint256 tokenId,
    bytes memory _data
  ) public payable override {
    require(
      _isApprovedOrOwner(_msgSender(), tokenId),
      'ERC721: transfer caller is not owner nor approved'
    );

    uint256 royalty;

    if (msg.value > 0) {
      (, royalty) = royaltyInfo(tokenId, msg.value);

      if (excludedList[from] == false) {
        _payTxFee(tokenId, royalty);
        (bool successPayWithRoyalty, ) = payable(to).call{
          value: msg.value - royalty
        }('');
        require(successPayWithRoyalty);
      } else {
        (bool successPayWithoutRoyalty, ) = payable(to).call{value: msg.value}(
          ''
        );
        require(successPayWithoutRoyalty);
      }
    }

    if (_idToNftItem[tokenId].isListed == true) {
      _listedItems.decrement();
      _idToNftItem[tokenId].isListed = false;
    }

    _idToNftItem[tokenId].owner = to;
    _safeTransfer(from, to, tokenId, _data);

    emit Sale(from, to, tokenId, msg.value);
  }

  // function getNftOffer(uint256 _tokenId) public view returns (Offer memory) {
  //   Offer memory offer = tokenIdToOffer[_tokenId];
  //   return offer;
  // }

  // function makeOffer(uint256 _tokenId) public payable {
  //   // Ensure that the buyer is making a valid offer
  //   require(
  //     _idToNftItem[_tokenId].isListed == false,
  //     'The nft is listed to buy it'
  //   );
  //   require(
  //     msg.value > tokenIdToOffer[_tokenId].highestBid,
  //     'Offer price is too low'
  //   );

  //   Offer memory offer;

  //   offer = getNftOffer(_tokenId);

  //   if (offerBidsFromTokenId[_tokenId][msg.sender] > 0) {
  //     uint amount = offerBidsFromTokenId[_tokenId][msg.sender];
  //     payable(msg.sender).transfer(amount);
  //   }

  //   // Save the offer details
  //   _setOffer(_tokenId, msg.value);
  //   tokenIdToOffer[_tokenId].highestBidder = msg.sender;
  //   tokenIdToOffer[_tokenId].highestBid = msg.value;
  // }

  // function _updateOfferWithNewBuyer(uint256 _tokenId, address buyer) private {
  //   require(_owns(buyer, _tokenId));
  //   tokenIdToOffer[_tokenId].highestBid = tokenIdToOffer[_tokenId].lowerBid;
  //   tokenIdToOffer[_tokenId].highestBidder = buyer;
  //   tokenIdToOffer[_tokenId].seller = buyer;
  // }

  // function _createNftOffer(
  //   uint256 _tokenId,
  //   uint256 _nftPrice,
  //   address _seller
  // ) private {
  //   // Sanity check that no inputs overflow how many bits we've allocated
  //   // to store them in the auction struct.
  //   require(_owns(msg.sender, _tokenId));

  //   _setOffer(_tokenId, _nftPrice);

  //   Offer memory offer = Offer(
  //     _tokenId,
  //     _seller,
  //     _nftPrice,
  //     _nftPrice,
  //     msg.sender
  //   );

  //   _addAuction(_tokenId, offer);
  // }

  // function acceptOffer(uint256 _tokenId) public payable {
  //   require(_owns(msg.sender, _tokenId), 'Only owner can accept the offer');
  //   address payable seller = payable(tokenIdToOffer[_tokenId].seller);
  //   uint256 highestBid = tokenIdToOffer[_tokenId].highestBid;
  //   address highestBidder = tokenIdToOffer[_tokenId].highestBidder;
  //   uint256 royalty;

  //   (, royalty) = royaltyInfo(_tokenId, highestBid);

  //   if (excludedList[highestBidder] == false) {
  //     _payTxFee(_tokenId, royalty);
  //   }

  //   seller.transfer(highestBid - royalty);
  //   ERC721.transferFrom(msg.sender, highestBidder, _tokenId);

  //   _removeOffer(_tokenId, highestBidder);
  //   _updateOfferWithNewBuyer(_tokenId, highestBidder);

  //   _idToNftItem[_tokenId].owner = highestBidder;
  // }

  // function getBidAddressesByTokenId(
  //   uint256 _tokenId
  // ) external view returns (address[] memory) {
  //   return addressesFromTokenId[_tokenId];
  // }

  // function withdraw(uint256 _tokenId) external payable returns (bool) {
  //   require(
  //     offerBidsFromTokenId[_tokenId][msg.sender] > 0,
  //     'You must have a bid to be able to witdraw'
  //   );

  //   uint amount = offerBidsFromTokenId[_tokenId][msg.sender];
  //   payable(msg.sender).transfer(amount);

  //   _removeOffer(_tokenId, msg.sender);

  //   if (tokenIdToOffer[_tokenId].highestBidder == msg.sender) {
  //     tokenIdToOffer[_tokenId].highestBid = tokenIdToOffer[_tokenId].lowerBid;
  //     tokenIdToOffer[_tokenId].highestBidder = tokenIdToOffer[_tokenId].seller;
  //     for (uint i = 0; i < addressesFromTokenId[_tokenId].length; i++) {
  //       if (
  //         offerBidsFromTokenId[_tokenId][addressesFromTokenId[_tokenId][i]] >
  //         tokenIdToOffer[_tokenId].highestBid
  //       ) {
  //         tokenIdToOffer[_tokenId].highestBid = offerBidsFromTokenId[_tokenId][
  //           addressesFromTokenId[_tokenId][i]
  //         ];
  //         tokenIdToOffer[_tokenId].highestBidder = addressesFromTokenId[
  //           _tokenId
  //         ][i];
  //       }
  //     }
  //   }

  //   return true;
  // }

  // function _owns(
  //   address _claimant,
  //   uint256 _tokenId
  // ) internal view returns (bool) {
  //   return (ERC721.ownerOf(_tokenId) == _claimant);
  // }

  // function _addAuction(uint256 _tokenId, Offer memory _offer) internal {
  //   tokenIdToOffer[_tokenId] = _offer;
  // }

  // function _setOffer(uint256 _tokenId, uint256 offer) private {
  //   offerBidsFromTokenId[_tokenId][msg.sender] = offer;
  //   indexOfofferBidsFromAddress[_tokenId][msg.sender] = addressesFromTokenId[
  //     _tokenId
  //   ].length;
  //   addressesFromTokenId[_tokenId].push(msg.sender);
  // }

  // function _removeOffer(uint256 _tokenId, address bidder) public {
  //   delete offerBidsFromTokenId[_tokenId][bidder];

  //   uint index = indexOfofferBidsFromAddress[_tokenId][bidder];
  //   uint lastIndex = addressesFromTokenId[_tokenId].length - 1;
  //   address lastBidder = addressesFromTokenId[_tokenId][lastIndex];

  //   indexOfofferBidsFromAddress[_tokenId][lastBidder] = index;
  //   delete indexOfofferBidsFromAddress[_tokenId][bidder];

  //   addressesFromTokenId[_tokenId][index] = lastBidder;
  //   addressesFromTokenId[_tokenId].pop();
  // }

  function _createNftItem(uint tokenId, uint price) private {
    require(price > 0, 'Price must be at least 1 wei');

    _idToNftItem[tokenId] = NftItem(
      tokenId,
      price,
      msg.sender,
      msg.sender,
      false,
      true
    );

    emit NftItemCreated(tokenId, price, msg.sender, msg.sender, true);
  }

  // function _isOwnerCreator(uint tokenId) private view returns (bool) {
  //   address owner = ERC721.ownerOf(tokenId);
  //   return _idToNftItem[tokenId].creator == owner;
  // }

  function _payTxFeeWithERC20(
    uint256 tokenId,
    address _erc20Token,
    uint256 royalty
  ) internal {
    IERC20 token = IERC20(_erc20Token);
    address creator = _idToNftItem[tokenId].creator;
    token.transferFrom(msg.sender, creator, royalty);
  }

  function _payTxFee(uint256 tokenId, uint256 royalty) internal {
    address creator = payable(_idToNftItem[tokenId].creator);
    (bool success1, ) = payable(creator).call{value: royalty}('');
    require(success1);
  }

  function _beforeTokenTransfer(
    address from,
    address to,
    uint tokenId,
    uint256 batchSize
  ) internal virtual override {
    super._beforeTokenTransfer(from, to, tokenId, batchSize);

    if (from == address(0)) {
      // MINTING CASE
      _addTokenToAllTokensEnumeration(tokenId);
    } else if (from != to) {
      // TRANSFER CASE
      _removeTokenFromOwnerEnumeration(from, tokenId);
    }

    if (to == address(0)) {
      // BURNING CASE
      _removeTokenFromAllTokensEnumeration(tokenId);
    } else if (to != from) {
      // TRANSFER CASE
      _addTokenToOwnerEnumeration(to, tokenId);
    }
  }

  function _addTokenToAllTokensEnumeration(uint tokenId) private {
    _idToNftIndex[tokenId] = _allNfts.length;
    _allNfts.push(tokenId);
  }

  function _addTokenToOwnerEnumeration(address to, uint tokenId) private {
    uint length = ERC721.balanceOf(to);
    _ownedTokens[to][length] = tokenId;
    _idToOwnedIndex[tokenId] = length;
  }

  function _removeTokenFromOwnerEnumeration(
    address from,
    uint tokenId
  ) private {
    uint lastTokenIndex = ERC721.balanceOf(from) - 1;
    uint tokenIndex = _idToOwnedIndex[tokenId];

    if (tokenIndex != lastTokenIndex) {
      uint lastTokenId = _ownedTokens[from][lastTokenIndex];

      _ownedTokens[from][tokenIndex] = lastTokenId;
      _idToOwnedIndex[lastTokenId] = tokenIndex;
    }

    delete _idToOwnedIndex[tokenId];
    delete _ownedTokens[from][lastTokenIndex];
  }

  function _removeTokenFromAllTokensEnumeration(uint tokenId) private {
    uint lastTokenIndex = _allNfts.length - 1;
    uint tokenIndex = _idToNftIndex[tokenId];
    uint lastTokenId = _allNfts[lastTokenIndex];

    _allNfts[tokenIndex] = lastTokenId;
    _idToNftIndex[lastTokenId] = tokenIndex;
    _listedItems.decrement();

    delete _idToNftIndex[tokenId];
    _allNfts.pop();
  }

  function _daysToDate(
    uint256 _days
  ) internal pure returns (uint256 year, uint256 month, uint256 day) {
    unchecked {
      int256 __days = int256(_days);

      int256 L = __days + 68569 + OFFSET19700101;
      int256 N = (4 * L) / 146097;
      L = L - (146097 * N + 3) / 4;
      int256 _year = (4000 * (L + 1)) / 1461001;
      L = L - (1461 * _year) / 4 + 31;
      int256 _month = (80 * L) / 2447;
      int256 _day = L - (2447 * _month) / 80;
      L = _month / 11;
      _month = _month + 2 - 12 * L;
      _year = 100 * (N - 49) + _year + L;

      year = uint256(_year);
      month = uint256(_month);
      day = uint256(_day);
    }
  }
}
