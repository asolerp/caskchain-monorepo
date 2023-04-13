export interface AcceptOfferRepository {
  acceptOffer(tokenId: string, bidder: string): Promise<void>
}
