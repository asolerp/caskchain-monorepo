import { UpdateSaleStateUseCase } from '../../domain/interfaces/use-cases/update-sale-state-use-case'

export default function OnSaleStateChanged(
  updateSaleStateUseCase: UpdateSaleStateUseCase
) {
  const handleOnSaleStateChanged = async (cask: any) => {
    await updateSaleStateUseCase.execute(cask.tokenId, cask.state)
  }

  return handleOnSaleStateChanged
}
