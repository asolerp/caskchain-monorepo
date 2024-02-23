import { UpdatePriceNftUseCase } from '../../domain/interfaces/use-cases/update-price-nft-use-case'

export default function OnListed(updatePriceNftUseCase: UpdatePriceNftUseCase) {
  const handleOnListed = async (cask: any) => {
    console.log('ERC20TOKEN', cask.erc20Token)

    await updatePriceNftUseCase.execute(
      cask.tokenId,
      cask.price,
      cask.erc20Token
    )
  }

  return handleOnListed
}
