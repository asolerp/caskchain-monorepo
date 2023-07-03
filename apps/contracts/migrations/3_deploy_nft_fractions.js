const { deployProxy } = require("@openzeppelin/truffle-upgrades");

const NftFractionsFactory = artifacts.require("NftFractionsFactory");
const NftFractionsFactoryStorage = artifacts.require(
  "NftFractionsFactoryStorage"
);
const NftFractionsVendor = artifacts.require("NftFractionsVendor");
const NftFractionsVendorStorage = artifacts.require(
  "NftFractionsVendorStorage"
);
const NftFractionToken = artifacts.require("NftFractionToken");

module.exports = function (deployer) {
  deployer.then(async () => {
    const nftFractionsFactoryStorage = await deployer.deploy(
      NftFractionsFactoryStorage
    );

    await deployProxy(
      NftFractionsFactory,
      [nftFractionsFactoryStorage.address],
      { deployer }
    );
    const nftFractionsVendorStorage = await deployer.deploy(
      NftFractionsVendorStorage
    );
    await deployProxy(NftFractionsVendor, [nftFractionsVendorStorage.address], {
      deployer,
    });

    await deployer.deploy(NftFractionToken);
  });
};
