import { RecordNewOfferUseCase } from '../../domain/interfaces/use-cases/record-new-offer-use-case'

export default function OnOffer(recordNewOfferUseCase: RecordNewOfferUseCase) {
  const handleOnNewOffer = async (offer: any) => {
    await recordNewOfferUseCase.execute(offer.transactionHash, {
      createdAt: new Date(),
      owner: offer.owner.toLowerCase(),
      tokenId: offer.tokenId,
      bidder: offer.bidder.toLowerCase(),
      bid: offer.bid,
      status: 'live',
    })
  }

  return handleOnNewOffer
}
