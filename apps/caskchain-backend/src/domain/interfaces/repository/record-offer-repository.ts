// domain/interfaces/repositories/contact-repository.ts
import { OfferRequestModel } from '../../model/Offer'

export interface RecordOfferRepository {
  recordNewOffer(id: string, offer: OfferRequestModel): Promise<void>
}
