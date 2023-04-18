export interface GetNFTLatestOffersUserCase {
  execute(tokenId: string): Promise<void>
}
