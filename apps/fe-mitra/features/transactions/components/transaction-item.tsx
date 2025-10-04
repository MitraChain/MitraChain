'use client'

import { SafeDateTime } from '@/components/safe-date-time'
import { transformNumberToRupiahMask } from '@workspace/lib/index'
import { Transaction } from '@workspace/supabase/index'

type Props = {
  transaction: Transaction
}

function TransactionItem({ transaction }: Readonly<Props>) {
  return (
    <div className="bg-card text-card-foreground flex items-center justify-between rounded-lg border p-4">
      <div className="text-muted-foreground text-sm">
        <SafeDateTime date={transaction.created_at} />
      </div>
      <span className="text-pretty font-medium">
        {transformNumberToRupiahMask(transaction.total_amount)}
      </span>
    </div>
  )
}

export default TransactionItem
