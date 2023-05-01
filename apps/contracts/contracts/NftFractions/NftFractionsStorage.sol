pragma solidity ^0.8.7;

contract NftFractionsStorage {
  struct Vault {
    address vaultAddress;
    uint256 count;
  }

  struct TokenPaymentInfo {
    address tokenAddress;
    uint totalSupply;
    uint listingPrice;
    bool enableSell;
  }

  mapping(address => TokenPaymentInfo) public tokens;
  mapping(address => bool) public activeAddressVendor;

  /// @notice the number of ERC721 vaults
  uint256 public vaultCount;
  address[] public tokenAddressCreated;

  /// @notice the mapping of vault number to vault contract
  mapping(uint256 => Vault) public vaults;

  mapping(address => mapping(uint256 => bool)) public nftToVault;
}
