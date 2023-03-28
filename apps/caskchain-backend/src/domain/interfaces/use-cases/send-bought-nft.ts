export interface SendBougthNFTUseCase {
    execute(toAddress: string, tokenId: string, index: number): Promise<void>;
}