//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/utils/math/Math.sol';
import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/utils/math/SafeMath.sol';
import '@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol';
import '@openzeppelin/contracts-upgradeable/token/ERC721/utils/ERC721HolderUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol';

contract NftFractionToken is ERC20Upgradeable, ERC721HolderUpgradeable {
  using Address for address;
  using SafeMath for uint256;

  /// -----------------------------------
  /// -------- BASIC INFORMATION --------
  /// -----------------------------------

  /// @notice weth address
  address public constant weth = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;

  /// -----------------------------------
  /// -------- TOKEN INFORMATION --------
  /// -----------------------------------

  /// @notice the ERC721 token address of the vault's token
  address public token;

  /// @notice the ERC721 token ID of the vault's token
  uint256 public id;

  /// -------------------------------------
  /// -------- AUCTION INFORMATION --------
  /// -------------------------------------

  /// @notice reservePrice * votingTokens
  uint256 public reserveTotal;
  uint256 public price;
  /// -----------------------------------
  /// -------- VAULT INFORMATION --------
  /// -----------------------------------

  /// @notice the number of ownership tokens voting on the reserve price at any given time
  uint256 public votingTokens;

  /// @notice a mapping of users to their desired token price
  mapping(address => uint256) public userPrices;

  bool public forSale;
  bool public canRedeem;
  uint256 public fee;
  address public curator;

  /// ------------------------
  /// -------- EVENTS --------
  /// ------------------------

  /// @notice An event emitted when a user updates their price
  event PriceUpdate(address indexed user, uint price);

  /// @notice An event emitted when a curator updates de fee
  event FeeUpdate(address indexed user, uint price);

  /// @notice An event emitted when an auction starts
  event Start(address indexed buyer, uint price);

  /// @notice An event emitted when a bid is made
  event Bid(address indexed buyer, uint price);

  /// @notice An event emitted when an auction is won
  event Won(address indexed buyer, uint price);

  /// @notice An event emitted when someone redeems all tokens for the NFT
  event Redeem(address indexed redeemer);

  /// @notice An event emitted when someone cashes in ERC20 tokens for ETH from an ERC721 token sale
  event Cash(address indexed owner, uint256 shares);

  constructor() {}

  function initialize(
    address _curator,
    address _token,
    uint256 _id,
    uint256 _supply,
    uint256 _fee,
    uint256 _listPrice,
    string memory _name,
    string memory _symbol
  ) external initializer {
    // initialize inherited contracts
    __ERC20_init(_name, _symbol);
    __ERC721Holder_init();
    // set storage variables
    token = _token;
    id = _id;
    fee = _fee;
    price = _listPrice;
    curator = _curator;
    // reserveTotal = _listPrice * _supply;
    // votingTokens = _listPrice == 0 ? 0 : _supply;
    _mint(_curator, _supply);
  }

  function reservePrice() public view returns (uint256) {
    return price;
  }

  function updateSaleState(bool state) external {
    require(curator == msg.sender, 'You are not the curator');
    forSale = state;
  }

  function updateUserPrice(uint256 _new) external {
    require(curator == msg.sender, 'You are not the curator');
    price = _new;
    emit PriceUpdate(msg.sender, _new);
  }

  function updateFee(uint256 _newFee) external {
    require(curator == msg.sender, 'You are not the curator');
    fee = _newFee;
    emit FeeUpdate(msg.sender, _newFee);
  }

  function purchase() external payable {
    require(forSale, 'Not for sale');
    require(msg.value >= reservePrice(), 'Not enough ether sent');
    IERC721(token).transferFrom(address(this), msg.sender, id);
    forSale = false;
    canRedeem = true;
  }

  function redeem(uint256 _amount) external {
    require(canRedeem, 'Redemption not available');
    uint256 totalEther = address(this).balance;

    uint256 toRedeem = (_amount * totalEther) / totalSupply();
    uint256 percentageFee = (toRedeem.mul(fee)).div(10000);
    uint256 total = toRedeem.sub(percentageFee);

    _burn(msg.sender, _amount);

    payable(curator).transfer(percentageFee);
    payable(msg.sender).transfer(total);
  }

  function withdraw() public {
    require(curator == msg.sender, 'You are not the curator');
    uint256 ownerBalance = address(this).balance;
    require(ownerBalance > 0, 'No ETH present in Vendor');
    (bool sent, ) = msg.sender.call{value: address(this).balance}('');
    require(sent, 'Failed to withdraw');
  }
}
