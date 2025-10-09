'use client'

import { transformNumberToRupiahMask } from '@workspace/lib/index'
import { Transaction } from '@workspace/supabase/index'
import { Button } from '@workspace/ui/components/button'
import { SafeDateTime } from '@workspace/ui/components/safe-date-time'
import Link from 'next/link'

type Props = {
  transaction: Transaction
}

function TransactionItem({ transaction }: Readonly<Props>) {
  return (
    <div className="bg-card text-card-foreground flex items-center justify-between rounded-lg border p-4">
      <div className="text-muted-foreground flex flex-col gap-0.5 text-sm">
        <span>{transaction.onchain_proof_hash}</span>
        <SafeDateTime date={transaction.created_at} />
      </div>

      <div className="flex flex-col items-end gap-2">
        <span className="text-pretty font-medium">
          {transformNumberToRupiahMask(transaction.total_amount)}
        </span>
        <Link href={`/transaction-history/${transaction.id}`} prefetch={false}>
          <Button size={'sm'}>Detail</Button>
        </Link>
      </div>
    </div>
  )
}

export default TransactionItem
