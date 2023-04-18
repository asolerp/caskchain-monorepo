import { RecordNewOfferUseCase } from '../../domain/interfaces/use-cases/record-new-offer-use-case'
import { v4 as uuidv4 } from 'uuid'

export default function OnOffer(recordNewOfferUseCase: RecordNewOfferUseCase) {
  const handleOnNewOffer = async (offer: any) => {
    await recordNewOfferUseCase.execute(uuidv4(), {
      createdAt: new Date(),
      owner: offer.owner.toLowerCase(),
      tokenId: offer.tokenId,
      bidder: offer.bidder.toLowerCase(),
      txHash: offer.transactionHash,
      bid: offer.bid,
      status: 'live',
    })
  }

  return handleOnNewOffer
}
