import { NFTRepository } from "../../interfaces/repository/nft-repository"
import { SendBougthNFTUseCase } from "../../interfaces/use-cases/send-bought-nft"


export class SendBougthNFT implements SendBougthNFTUseCase {
    web3Repository: NFTRepository
    constructor(web3Repository: NFTRepository) {
        this.web3Repository = web3Repository
    }

    async execute(toAddress: string, tokenId: string, index: number) {
        await this.web3Repository.transferNFT(toAddress, tokenId, index)
    }
}