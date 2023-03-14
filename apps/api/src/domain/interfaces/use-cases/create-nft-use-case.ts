import { NFTRequestModel } from "../../model/NFT";


export interface CreateNFTUseCase {
    execute(id: string, nft: NFTRequestModel): Promise<void>;
}