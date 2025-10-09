'use client'

import { transformNumberToRupiahMask } from '@workspace/lib/index'
import { Transaction } from '@workspace/supabase/index'
import { Button } from '@workspace/ui/components/button'
import { SafeDateTime } from '@workspace/ui/components/safe-date-time'
import { SquareArrowOutUpRight } from 'lucide-react'
import Link from 'next/link'

type Props = {
  transaction: Transaction
}

function TransactionItem({ transaction }: Readonly<Props>) {
  return (
    <div className="bg-card text-card-foreground flex items-center justify-between rounded-lg border p-4">
      <div className="text-muted-foreground flex flex-col gap-0.5 text-sm">
        <span>
          <a
            href={`https://preprod.cardanoscan.io/transaction/${transaction?.onchain_proof_hash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary flex items-center gap-1 font-mono text-xs text-white underline transition-colors"
          >
            {transaction?.onchain_proof_hash
              ? `${transaction.onchain_proof_hash.slice(0, 6)}...${transaction.onchain_proof_hash.slice(-12)}`
              : 'N/A'}
            {transaction?.onchain_proof_hash && <SquareArrowOutUpRight className="h-3.5 w-3.5" />}
          </a>
        </span>
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
