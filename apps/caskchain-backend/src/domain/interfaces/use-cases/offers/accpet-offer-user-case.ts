export interface AcceptOfferUseCase {
  execute(tokenId: string, bidder: string, bid: string): Promise<void>
}
