import { v4 as uuidv4 } from 'uuid'
import { NewFractionUseCase } from '../../domain/interfaces/use-cases/new-fraction-use-case'

export default function OnNewFraction(newFraction: NewFractionUseCase) {
  const handleNewFraction = async (fraction: any) => {
    await newFraction.execute(uuidv4(), {
      createdAt: new Date(),
      tokenId: fraction.tokenId,
      supply: fraction.supply,
      price: fraction.price,
    })
  }

  return handleNewFraction
}
