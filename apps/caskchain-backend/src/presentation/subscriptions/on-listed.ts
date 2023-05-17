import { UpdatePriceNftUseCase } from '../../domain/interfaces/use-cases/update-price-nft-use-case'

export default function OnListed(updatePriceNftUseCase: UpdatePriceNftUseCase) {
  const handleOnListed = async (cask: any) => {
    await updatePriceNftUseCase.execute(cask.tokenId, cask.price)
  }

  return handleOnListed
}
