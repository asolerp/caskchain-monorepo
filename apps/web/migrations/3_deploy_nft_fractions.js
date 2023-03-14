const NftFractionsFactory = artifacts.require('NftFractionsFactory')
const NftFractionToken = artifacts.require('NftFractionToken')
const NftFractionsVendor = artifacts.require('NftFractionsVendor')

module.exports = function (deployer) {
  deployer.then(async () => {
    await deployer.deploy(NftFractionsFactory)
    await deployer.deploy(NftFractionToken)
    await deployer.deploy(NftFractionsVendor)
  })
}
