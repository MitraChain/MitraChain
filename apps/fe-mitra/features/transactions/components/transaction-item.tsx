'use client'

import { transformNumberToRupiahMask } from '@workspace/lib/index'
import { Database } from '@workspace/supabase/types'
// import TransactionForm from './transaction-form'

type Transaction = Database['public']['Tables']['transactions']['Row']

type Props = {
  transaction: Transaction
}

function TransactionItem({ transaction }: Readonly<Props>) {
  return (
    <div className="bg-card text-card-foreground flex items-center justify-between rounded-lg border p-4">
      <div className="min-w-0">
        <div className="text-pretty font-medium">
          {transformNumberToRupiahMask(transaction.total_amount)}
        </div>
        <div className="text-muted-foreground text-sm">
          {new Date(transaction.created_at).toLocaleDateString()} -{' '}
          {new Date(transaction.created_at).toLocaleTimeString()}
        </div>
        {transaction.qris_tx_id && (
          <div className="text-muted-foreground text-xs">QRIS ID: {transaction.qris_tx_id}</div>
        )}
      </div>
    </div>
  )
}

export default TransactionItem
