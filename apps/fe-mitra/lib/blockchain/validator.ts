import plutusJson from './plutus.json'

export const batchValidator = {
  type: 'PlutusV3' as const,
  script: plutusJson.validators[0]!.compiledCode,
}

export type TransactionRecord = {
  tx_id: string
  amount: bigint
  timestamp: bigint
  customer_wallet: string
}

export type BatchDatum = {
  business_id: string
  batch_number: bigint
  transactions: TransactionRecord[]
  merkle_root: string
  total_amount: bigint
  recorded_at: bigint
}
