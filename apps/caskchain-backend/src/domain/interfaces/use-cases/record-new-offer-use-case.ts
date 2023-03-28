import { OfferRequestModel } from '../../model/Offer'

export interface RecordNewOfferUseCase {
  execute(id: string, offer: OfferRequestModel): Promise<void>
}
