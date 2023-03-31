import { RemoveOfferUseCase } from '../../domain/interfaces/use-cases/offers/remove-offer-use-case'
import { RemoveOfferRequestModel } from '../../domain/model/Offer'

export default function OnRemoveOffer(removeOfferUseCase: RemoveOfferUseCase) {
  const handleOnRemoveOffer = async (offer: RemoveOfferRequestModel) => {
    await removeOfferUseCase.execute(
      offer.tokenId,
      offer.bidder.toLowerCase(),
      offer.bid
    )
  }

  return handleOnRemoveOffer
}
