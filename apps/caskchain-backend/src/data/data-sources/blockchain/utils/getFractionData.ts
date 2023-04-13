import { Fraction } from '../Models/Fraction'
import CCNftContract from 'contracts/build/contracts/CCNft.json'

type getFractionDataProps = {
  tokenId: any
  NftFractionsFactory: any
  client: any
  NftFractionToken: any
  NftFractionsVendor: any
}

const getFractionData = async ({
  tokenId,
  NftFractionsFactory,
  client,
  NftFractionToken,
  NftFractionsVendor,
}: getFractionDataProps) => {
  let fractionData = null
  let fractionTokenContract = null
  let fractionTokenAddress = null
  let unitPrice = null

  // @ts-ignore
  const CCNftAddress = CCNftContract.networks[process.env.NETWORK_ID]
    .address as string

  const vaultExists = await NftFractionsFactory.methods
    .vaultExists(CCNftAddress, tokenId)
    .call()

  if (vaultExists) {
    fractionTokenAddress = await NftFractionsFactory.methods
      .getVaultContractByTokenId(tokenId)
      .call()

    const contract = new client.eth.Contract(
      NftFractionToken.abi as any,
      fractionTokenAddress
    )
    fractionTokenContract = new Fraction(
      contract,
      fractionTokenAddress,
      tokenId
    )

    const tokenInfoPrice = await NftFractionsVendor.methods
      ?.tokens(fractionTokenAddress)
      .call()

    unitPrice = tokenInfoPrice?.totalSupply / tokenInfoPrice?.listingPrice

    fractionData = await fractionTokenContract?.getFractionData()
  }

  return {
    vaultExists,
    fractionData,
    fractionTokenAddress,
    unitPrice,
  }
}

export default getFractionData
