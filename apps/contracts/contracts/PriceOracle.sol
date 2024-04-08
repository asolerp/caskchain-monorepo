// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PriceOracle {
  // Precio del dólar en términos de la criptomoneda base (por ejemplo, ETH)
  // 1 ETH = 2000 USD como ejemplo
  uint256 public priceOfDollarInETH = 2980;

  function setPrice(uint256 _newPrice) public {
    priceOfDollarInETH = _newPrice;
  }

  function getPriceOfDollarInETH() public view returns (uint256) {
    return priceOfDollarInETH;
  }
}
