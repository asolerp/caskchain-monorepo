// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

contract VaultVendor is Ownable {
  mapping(address => uint256) public tokens;

  event BuyTokens(address buyer, uint256 amountOfMATIC, uint256 amountOfTokens);

  constructor() {}

  function updateTokenVendor(
    address tokenAddress,
    uint256 tokenPerETH
  ) public onlyOwner {
    require(tokenPerETH > 0, 'Token per eth must be higher than 0');
    tokens[tokenAddress] = tokenPerETH;
  }

  function buyTokens(
    address tokenAddress
  ) public payable returns (uint256 tokenAmount) {
    require(msg.value > 0, 'You need to send some MATIC to proceed');

    uint256 amountToBuy = msg.value * tokens[tokenAddress];

    uint256 vendorBalance = ERC20(tokenAddress).balanceOf(address(this));
    require(vendorBalance >= amountToBuy, 'Vendor has insufficient tokens');

    bool sent = ERC20(tokenAddress).transfer(msg.sender, amountToBuy);
    require(sent, 'Failed to transfer token to user');

    return amountToBuy;
  }

  function sellTokens(uint256 tokenAmountToSell, address tokenAddress) public {
    require(
      tokenAmountToSell > 0,
      'Specify an amount of token greater than zero'
    );

    uint256 userBalance = ERC20(tokenAddress).balanceOf(msg.sender);
    require(userBalance >= tokenAmountToSell, 'You have insufficient tokens');

    uint256 amountOfETHToTransfer = tokenAmountToSell / tokens[tokenAddress];
    uint256 ownerETHBalance = address(this).balance;
    require(
      ownerETHBalance >= amountOfETHToTransfer,
      'Vendor has insufficient funds'
    );
    bool sent = ERC20(tokenAddress).transferFrom(
      msg.sender,
      address(this),
      tokenAmountToSell
    );
    require(sent, 'Failed to transfer tokens from user to vendor');

    (sent, ) = msg.sender.call{value: amountOfETHToTransfer}('');
    require(sent, 'Failed to send ETH to the user');
  }

  function withdraw() public onlyOwner {
    uint256 ownerBalance = address(this).balance;
    require(ownerBalance > 0, 'No ETH present in Vendor');
    (bool sent, ) = msg.sender.call{value: address(this).balance}('');
    require(sent, 'Failed to withdraw');
  }
}
