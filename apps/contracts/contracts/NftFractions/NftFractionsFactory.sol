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

import "./NftFractionsStorage.sol";
import "../InitializedProxy.sol";
import "./NftFractionToken.sol";

contract NftFractionsFactory is
  NftFractionsStorage,
  Initializable,
  OwnableUpgradeable,
  PausableUpgradeable,
  UUPSUpgradeable
{
  /// @notice the TokenVault logic contract
  address public logic;

  event Mint(
    address indexed token,
    uint256 id,
    uint256 price,
    address vault,
    uint256 vaultId
  );

  // constructor() {
  //   logic = address(new NftFractionToken());
  // }

  function initialize() public initializer {
    __Ownable_init();
    __UUPSUpgradeable_init();
    logic = address(new NftFractionToken());
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
    require(!nftToVault[_token][_id], "NFT already locked in a vault");
    // Check if the caller owns the token or is approved for transfer
    require(
      IERC721(_token).getApproved(_id) == address(this) ||
        IERC721(_token).ownerOf(_id) == msg.sender,
      "Caller must be approved or owner of token"
    );

    nftToVault[_token][_id] = true;

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

    vaults[vaultCount] = Vault(vault, vaultCount);
    tokenAddressCreated.push(vault);
    vaultCount++;

    // Interact with external contracts after updating state
    IERC721(_token).safeTransferFrom(msg.sender, vault, _id);

    emit Mint(_token, _id, _listPrice, vault, vaultCount);

    return vaultCount - 1;
  }

  function vaultExists(
    address _token,
    uint256 nftId
  ) public view returns (bool) {
    return nftToVault[_token][nftId];
  }

  function getVaultIndexByAddress(
    address _vaultAddress
  ) internal view returns (uint256) {
    for (uint256 i = 0; i < vaultCount; i++) {
      if (vaults[i].vaultAddress == _vaultAddress) {
        return i;
      }
    }
    revert("Vault not found");
  }

  function getVaultContractByTokenId(
    uint256 _tokenId
  ) external view returns (Vault memory) {
    address vaultAddress = vaults[_tokenId].vaultAddress;
    require(vaultAddress != address(0), "Invalid Token ID");
    return vaults[getVaultIndexByAddress(vaultAddress)];
  }

  function getAllCreatedVaults() external view returns (address[] memory) {
    return tokenAddressCreated;
  }

  function getVaultContract(uint256 _id) external view returns (Vault memory) {
    Vault memory vault = vaults[_id];
    return vault;
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
