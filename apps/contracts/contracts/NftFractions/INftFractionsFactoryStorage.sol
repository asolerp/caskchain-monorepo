// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

interface INftFractionsFactoryStorage {
  struct Vault {
    address vaultAddress;
    uint256 tokenId;
  }

  // SETTERS
  function setVaultExists(address _token, uint256 nftId) external;

  function setVault(address _vault, uint256 _tokenId) external;

  function pushTokenAddressCreated(address _vault) external;

  // GETTERS
  function getVaultCount() external view returns (uint256);

  function getAllCreatedVaults() external view returns (address[] memory);

  function getVault(uint256 index) external view returns (Vault memory);

  function vaultExists(
    address _token,
    uint256 nftId
  ) external view returns (bool);
}
