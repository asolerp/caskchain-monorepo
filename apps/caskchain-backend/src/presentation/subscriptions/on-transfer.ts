import { v4 as uuidv4 } from 'uuid'

import { CreateTransactionUseCase } from '../../domain/interfaces/use-cases/create-transaction-use-case'
import { UpdateOwnerNFTUseCase } from '../../domain/interfaces/use-cases/update-owner-nft-use-case'

export default function OnTransfer(
  updateOwnerNftUseCase: UpdateOwnerNFTUseCase,
  createTransactionUseCase: CreateTransactionUseCase
) {
  const handleOnTransfer = async (transaction: any, type: string) => {
    await updateOwnerNftUseCase.execute(transaction.tokenId, transaction.to)
    await createTransactionUseCase.execute(uuidv4(), {
      from: transaction.from.toLowerCase(),
      to: transaction.to.toLowerCase(),
      date: new Date(),
      tokenId: transaction.tokenId,
      value: transaction?.price ?? 0,
      txHash: transaction.transactionHash,
      type: type ?? 'transfer',
    })
  }

  return handleOnTransfer
}
