export interface RemoveOfferUseCase {
  execute(tokenId: string, bidder: string, bid: string): Promise<void>
}
