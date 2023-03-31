import { v4 as uuidv4 } from 'uuid'

import { RecordNewOfferUseCase } from '../../domain/interfaces/use-cases/record-new-offer-use-case'
import { OfferRequestModel } from '../../domain/model/Offer'

export default function OnOffer(recordNewOfferUseCase: RecordNewOfferUseCase) {
  const handleOnNewOffer = async (offer: OfferRequestModel) => {
    await recordNewOfferUseCase.execute(uuidv4(), {
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
