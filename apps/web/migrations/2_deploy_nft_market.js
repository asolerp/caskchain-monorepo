const CCNft = artifacts.require('CCNft')
const NftVendor = artifacts.require('NftVendor')
const NftOffers = artifacts.require('NftOffers')

const CREATOR_ADDRESS = '0x4c8b04e45535D73739c8FeF12Dd18AB6b6Aac1Fb'

module.exports = function (deployer) {
  deployer.then(async () => {
    const collection = await deployer.deploy(CCNft)
    const nftVendor = await deployer.deploy(
      NftVendor,
      collection.address,
      CREATOR_ADDRESS
    )
    await deployer.deploy(NftOffers, collection.address, nftVendor.address)
  })
}
