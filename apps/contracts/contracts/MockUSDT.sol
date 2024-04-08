// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockUSDT is ERC20 {
  constructor(uint256 initialSupply) ERC20("Test USDC", "TUSDC") {
    _mint(msg.sender, initialSupply);
  }

  function faucet(address recipient, uint256 amount) public {
    _mint(recipient, amount);
  }
}
