//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/security/Pausable.sol';
import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol';

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/utils/math/SafeMath.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import '@openzeppelin/contracts/utils/math/SafeMath.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';

import './InitializedProxy.sol';
import './NftFractionToken.sol';

contract NftFractionsFactory is Ownable, Pausable {
  /// @notice the number of ERC721 vaults
  uint256 public vaultCount;
  address[] public tokenAddressCreated;

  /// @notice the mapping of vault number to vault contract
  mapping(uint256 => address) public vaults;
  mapping(uint256 => address) public vaultByTokenId;

  /// @notice the TokenVault logic contract
  address public immutable logic;

  event Mint(
    address indexed token,
    uint256 id,
    uint256 price,
    address vault,
    uint256 vaultId
  );

  constructor() {
    logic = address(new NftFractionToken());
  }

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
    bytes memory _initializationCalldata = abi.encodeWithSignature(
      'initialize(address,address,uint256,uint256,uint256,uint256,string,string)',
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

    emit Mint(_token, _id, _listPrice, vault, vaultCount);

    IERC721(_token).safeTransferFrom(msg.sender, vault, _id);

    vaultByTokenId[_id] = vault;
    vaults[vaultCount] = vault;
    tokenAddressCreated.push(vault);

    vaultCount++;

    return vaultCount - 1;
  }

  function getVaultContractByTokenId(
    uint256 _tokenId
  ) external view returns (ERC20) {
    ERC20 vault = ERC20(vaultByTokenId[_tokenId]);
    return vault;
  }

  function getAllCreatedVaults() external view returns (address[] memory) {
    return tokenAddressCreated;
  }

  function getVaultContract(uint256 _id) external view returns (ERC20) {
    ERC20 vault = ERC20(vaults[_id]);
    return vault;
  }

  function pause() external onlyOwner {
    _pause();
  }

  function unpause() external onlyOwner {
    _unpause();
  }
}
