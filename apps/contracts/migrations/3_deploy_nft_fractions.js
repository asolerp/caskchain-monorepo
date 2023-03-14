const NftFractionsFactory = artifacts.require("NftFractionsFactory");
const NftFractionsVendor = artifacts.require("NftFractionsVendor");

module.exports = function (deployer) {
  deployer.then(async () => {
    await deployer.deploy(NftFractionsFactory);
    await deployer.deploy(NftFractionsVendor);
  });
};
