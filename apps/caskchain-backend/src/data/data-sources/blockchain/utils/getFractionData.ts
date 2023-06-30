import { Fraction } from '../Models/Fraction'
import CCNftContract from 'contracts/build/contracts/CCNft.json'

interface GetFractionDataProps {
  tokenId: string
  NftFractionsFactory: any
  client: any
  NftFractionToken: any
  NftFractionsVendor: any
}

interface FractionDataResult {
  vaultExists: boolean
  fractionData: any | null
  fractionTokenAddress: string | null
  unitPrice: number | null
}

const getFractionData = async ({
  tokenId,
  NftFractionsFactory,
  client,
  NftFractionToken,
  NftFractionsVendor,
}: GetFractionDataProps): Promise<FractionDataResult> => {
  // @ts-ignore
  const CCNftAddress = CCNftContract.networks[process.env.NETWORK_ID!]
    .address as string

  const vaultExists = await NftFractionsFactory.methods
    .checkIfVaultExists(CCNftAddress, tokenId)
    .call()

  if (!vaultExists) {
    return {
      vaultExists: false,
      fractionData: null,
      fractionTokenAddress: null,
      unitPrice: null,
    }
  }

  const fractionTokenAddress = await NftFractionsFactory.methods
    .getVaultContractByTokenId(tokenId)
    .call()

  const contract = new client.eth.Contract(
    NftFractionToken.abi,
    fractionTokenAddress.vaultAddress
  )

  const fractionTokenContract = new Fraction(
    contract,
    fractionTokenAddress.vaultAddress,
    tokenId
  )

  const tokenInfoPrice = await NftFractionsVendor.methods
    .getTokenInfo(fractionTokenAddress.vaultAddress)
    .call()

  const unitPrice = tokenInfoPrice.totalSupply / tokenInfoPrice.listingPrice
  const fractionData = await fractionTokenContract.getFractionData()

  return {
    vaultExists: true,
    fractionData,
    fractionTokenAddress: fractionTokenAddress.vaultAddress,
    unitPrice,
  }
}

export default getFractionData
