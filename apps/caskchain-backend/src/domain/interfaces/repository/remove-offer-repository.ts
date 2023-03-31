export interface RemoveOfferRepository {
  removeOffer(tokenId: string, bidder: string): Promise<void>
}
