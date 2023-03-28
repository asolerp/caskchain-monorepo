export interface OfferRepository {
  getOffers(caskId: string): Promise<any>
  getReceivedOffers(address: string): Promise<any>
}
