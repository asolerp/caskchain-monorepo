import { NFTRepository } from "../../interfaces/repository/nft-repository";
import { CreateNFTUseCase } from "../../interfaces/use-cases/create-nft-use-case";
import { NFTRequestModel } from "../../model/NFT";


export class CreateNFT implements CreateNFTUseCase {
    nftRepository: NFTRepository
    constructor(nftRepository: NFTRepository) {
        this.nftRepository = nftRepository
    }

    async execute(id: string, nft: NFTRequestModel) {
        await this.nftRepository.createNFT(id, nft)
    }
}