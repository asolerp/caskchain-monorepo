import { Nft } from '../../../../types/nft'

type generateNftProps = {
  nft: Nft
  fraction: any
  unitPrice: number | undefined
  owner: any
  offer: any
  hasOffer: boolean
  price: any
  bidders: any
  meta: any
}
const generateNft = async ({
  nft,
  fraction,
  unitPrice,
  owner,
  offer,
  hasOffer,
  price,
  bidders,
  meta,
}: generateNftProps) => {
  return {
    tokenId: nft.tokenId,
    creator: nft.creator,
    fractions: fraction.fractionTokenContract
      ? {
          ...fraction.fractionData,
          tokenAddress: fraction.fractionTokenAddress,
          unitPrice,
        }
      : null,
    owner: {
      address: owner.address,
      nickname: owner?.nickname || '',
    },
    price,
    offer: hasOffer
      ? {
          bid: offer?.highestBid?.toString(),
          highestBidder: offer?.highestBidder,
          bidders,
        }
      : null,
    meta,
  }
}

export default generateNft
