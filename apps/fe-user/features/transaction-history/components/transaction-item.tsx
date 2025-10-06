import { transformNumberToRupiahMask } from '@workspace/lib/index'
import { Card, CardContent } from '@workspace/ui/components/card'
import { SafeDateTime } from '@workspace/ui/components/safe-date-time'
import Link from 'next/link'
import { UserTransaction } from '../api/get-user-transactions-infinite'

const TransactionItem = ({ transaction }: { transaction: UserTransaction }) => {
  return (
    <Link href={`/transaction-history/${transaction.id}`} prefetch={false}>
      <Card className="cursor-pointer">
        <CardContent className="flex items-center justify-between py-0">
          <div className="flex flex-col gap-1">
            <p className="font-semibold">
              {transaction.memberships?.businesses?.name || 'Unknown Business'}
            </p>
            <p className="text-muted-foreground text-sm">
              <SafeDateTime date={transaction.created_at} />
            </p>
          </div>
          <div className="text-right">
            <p className="font-semibold">{transformNumberToRupiahMask(transaction.total_amount)}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export default TransactionItem
