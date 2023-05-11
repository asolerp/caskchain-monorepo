import { v4 as uuidv4 } from 'uuid'
import { SaveRoyaltyUseCase } from '../../domain/interfaces/use-cases/save-royalty-use-case'

export default function OnRoyalty(saveNewRoyalty: SaveRoyaltyUseCase) {
  const handelNewRoyalty = async (royaltyInfo: any) => {
    await saveNewRoyalty.execute(uuidv4(), {
      createdAt: new Date(),
      tokenId: royaltyInfo.tokenId,
      royalty: royaltyInfo.royalty,
      isERC20: royaltyInfo.isERC20,
    })
  }

  return handelNewRoyalty
}
