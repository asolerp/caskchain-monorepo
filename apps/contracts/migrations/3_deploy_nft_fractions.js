const { deployProxy } = require("@openzeppelin/truffle-upgrades");

const NftFractionsFactory = artifacts.require("NftFractionsFactory");
const NftFractionsVendor = artifacts.require("NftFractionsVendor");

module.exports = function (deployer) {
  deployer.then(async () => {
    await deployProxy(NftFractionsFactory, [], { deployer });
    await deployProxy(NftFractionsVendor, [], { deployer });
  });
};
