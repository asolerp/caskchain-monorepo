import { v4 as uuidv4 } from 'uuid'
import { CreateTransactionUseCase } from '../../domain/interfaces/use-cases/create-transaction-use-case'
import { AcceptOfferUseCase } from '../../domain/interfaces/use-cases/offers/accpet-offer-user-case'

export default function OnAcceptOffer(
  acceptOfferUseCase: AcceptOfferUseCase,
  createTransactionUseCase: CreateTransactionUseCase
) {
  const handleOnRemoveOffer = async (offer: any) => {
    await createTransactionUseCase.execute(uuidv4(), {
      from: offer.owner.toLowerCase(),
      to: offer.bidder.toLowerCase(),
      date: new Date(),
      tokenId: offer.tokenId,
      value: offer?.bid ?? 0,
      txHash: offer.transactionHash,
      type: 'accept-offer',
    })
    await acceptOfferUseCase.execute(
      offer.tokenId,
      offer.bidder.toLowerCase(),
      offer.bid
    )
  }

  return handleOnRemoveOffer
}
