export interface OfferRepository {
  getOffers(caskId: string): Promise<any>
  getSentOffers(address: string): Promise<any>
  getReceivedOffers(address: string): Promise<any>
}
