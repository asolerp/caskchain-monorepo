export interface RecordPaymentsRequestModel {
  address?: string
  tokenId?: string
  paymentId?: string
  payment_status?: string
  amount_total?: number
  currency?: string
  createt_at?: Date
  updated_at?: Date
  nft_sent?: boolean
}

export interface RecordPaymentsResponseModel {
  id: string
  address: string
  tokenId: string
  paymentId: string
  status: string
}

export interface RecordPayments {
  _id: string
  address: string
  tokenId: string
  paymentId: string
  status: string
}
