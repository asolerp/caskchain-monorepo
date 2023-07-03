//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/utils/ERC721HolderUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

import "./INftFractionsFactoryStorage.sol";
import "./NftFractionToken.sol";
import "../InitializedProxy.sol";

contract NftFractionsFactory is
  Initializable,
  OwnableUpgradeable,
  PausableUpgradeable,
  UUPSUpgradeable
{
  /// @notice the TokenVault logic contract

  INftFractionsFactoryStorage private _storage;
  address public logic;

  event Mint(
    address indexed token,
    uint256 id,
    uint256 supply,
    uint256 price,
    address vault,
    uint256 vaultId
  );

  // constructor() {
  //   logic = address(new NftFractionToken());
  // }

  function initialize(address storageAddress) public initializer {
    __Ownable_init();
    __UUPSUpgradeable_init();
    logic = address(new NftFractionToken());
    _storage = INftFractionsFactoryStorage(storageAddress);
  }

  function _authorizeUpgrade(address) internal override onlyOwner {}

  /// @notice the function to mint a new vault
  /// @param _name the desired name of the vault
  /// @param _symbol the desired sumbol of the vault
  /// @param _token the ERC721 token address fo the NFT
  /// @param _id the uint256 ID of the token
  /// @param _supply is the initial total supply of the token
  /// @param _fee is the fee
  /// @param _listPrice the initial price of the NFT
  /// @return the ID of the vault
  function mint(
    string memory _name,
    string memory _symbol,
    address _token,
    uint256 _id,
    uint256 _supply,
    uint256 _fee,
    uint256 _listPrice
  ) external whenNotPaused returns (uint256) {
    require(
      !_storage.vaultExists(_token, _id),
      "NFT already locked in a vault"
    );
    // Check if the caller owns the token or is approved for transfer
    require(
      IERC721(_token).getApproved(_id) == address(this) ||
        IERC721(_token).ownerOf(_id) == msg.sender,
      "Caller must be approved or owner of token"
    );

    _storage.setVaultExists(_token, _id);

    bytes memory _initializationCalldata = abi.encodeWithSignature(
      "initialize(address,address,uint256,uint256,uint256,uint256,string,string)",
      msg.sender,
      _token,
      _id,
      _supply,
      _fee,
      _listPrice,
      _name,
      _symbol
    );

    address vault = address(
      new InitializedProxy(logic, _initializationCalldata)
    );

    _storage.setVault(vault, _id);
    _storage.pushTokenAddressCreated(vault);

    // Interact with external contracts after updating state
    IERC721(_token).safeTransferFrom(msg.sender, vault, _id);
    uint256 vaultCount = _storage.getVaultCount();
    emit Mint(_token, _id, _supply, _listPrice, vault, vaultCount);
    return vaultCount;
  }

  function checkIfVaultExists(
    address _vaultAddress,
    uint256 _tokenId
  ) external view returns (bool) {
    return _storage.vaultExists(_vaultAddress, _tokenId);
  }

  function getVaultContractByTokenId(
    uint256 _tokenId
  ) external view returns (INftFractionsFactoryStorage.Vault memory) {
    uint256 vaultCount = _storage.getVaultCount();
    for (uint256 i = 0; i < vaultCount; i++) {
      INftFractionsFactoryStorage.Vault memory vault = _storage.getVault(i);
      if (vault.tokenId == _tokenId) {
        return vault;
      }
    }
    revert("Vault not found");
  }

  function getAllVaultsAddresses() external view returns (address[] memory) {
    return _storage.getAllCreatedVaults();
  }

  function pause() external onlyOwner whenNotPaused {
    _pause();
    emit Paused(msg.sender);
  }

  function unpause() external onlyOwner whenPaused {
    _unpause();
    emit Unpaused(msg.sender);
  }

  fallback() external {
    revert("This contract does not accept ETH or tokens");
  }
}
