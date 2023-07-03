//SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
import "@openzeppelin/contracts/access/Ownable.sol";

contract NftFractionsFactoryStorage is Ownable {
  struct Vault {
    address vaultAddress;
    uint256 tokenId;
  }

  // Address => Boolean
  mapping(address => bool) public allowedAddresses;

  /// @notice the number of ERC721 vaults
  uint256 public vaultCount;
  address[] public tokenAddressCreated;

  /// @notice the mapping of vault number to vault contract
  mapping(uint256 => Vault) public vaults;
  mapping(address => mapping(uint256 => bool)) public nftToVault;

  /////////////////////
  // ALLOWED ADDRESSES MANAGEMENT //
  /////////////////////

  modifier onlyAllowed() {
    require(allowedAddresses[msg.sender], "Caller is not allowed");
    _;
  }

  function addAllowedAddress(address _address) public onlyOwner {
    allowedAddresses[_address] = true;
  }

  function removeAllowedAddress(address _address) public onlyOwner {
    allowedAddresses[_address] = false;
  }

  function isAllowedAddress(address _address) public view returns (bool) {
    return allowedAddresses[_address];
  }

  /////////////////////
  // GETTER //
  /////////////////////

  function getVaultCount() public view returns (uint256) {
    return vaultCount;
  }

  function getVault(uint256 index) public view returns (Vault memory) {
    return vaults[index];
  }

  function getAllCreatedVaults() public view returns (address[] memory) {
    return tokenAddressCreated;
  }

  function vaultExists(
    address _token,
    uint256 nftId
  ) public view returns (bool) {
    return nftToVault[_token][nftId];
  }

  /////////////////////
  // SETTER //
  /////////////////////

  function setVaultExists(address _token, uint256 nftId) public onlyAllowed {
    nftToVault[_token][nftId] = true;
  }

  function setVault(address _vault, uint256 _tokenId) public onlyAllowed {
    vaults[vaultCount] = Vault(_vault, _tokenId);
    vaultCount++;
  }

  function pushTokenAddressCreated(address _vault) public onlyAllowed {
    tokenAddressCreated.push(_vault);
  }
}
