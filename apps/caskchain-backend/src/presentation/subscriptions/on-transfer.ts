import { CreateTransactionUseCase } from '../../domain/interfaces/use-cases/create-transaction-use-case'
import { UpdateOwnerNFTUseCase } from '../../domain/interfaces/use-cases/update-owner-nft-use-case'

export default function OnTransfer(
  updateOwnerNftUseCase: UpdateOwnerNFTUseCase,
  createTransactionUseCase: CreateTransactionUseCase
) {
  const handleOnTransfer = async (transaction: any, type: string) => {
    await updateOwnerNftUseCase.execute(transaction.tokenId, transaction.to)
    await createTransactionUseCase.execute(transaction.transactionHash, {
      from: transaction.from.toLowerCase(),
      to: transaction.to.toLowerCase(),
      date: new Date(),
      tokenId: transaction.tokenId,
      value: transaction?.price ?? 0,
      type: type ?? 'transfer',
    })
  }

  return handleOnTransfer
}
