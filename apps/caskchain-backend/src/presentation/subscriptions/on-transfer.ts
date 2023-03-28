import { v4 as uuidv4 } from 'uuid'

import { CreateTransactionUseCase } from '../../domain/interfaces/use-cases/create-transaction-use-case'

export default function OnTransfer(
  createTransactionUseCase: CreateTransactionUseCase
) {
  const handleOnTransfer = async (transaction: any, type: string) => {
    await createTransactionUseCase.execute(uuidv4(), {
      from: transaction.seller,
      to: transaction.buyer,
      date: new Date(),
      tokenId: transaction.tokenId,
      value: transaction?.price || 0,
      type,
    })
  }

  return handleOnTransfer
}
