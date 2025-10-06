'use client'

import Container from '@/components/container'
import { transformNumberToRupiahMask } from '@workspace/lib'
import { Button } from '@workspace/ui/components/button'
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card'
import { SafeDateTime } from '@workspace/ui/components/safe-date-time'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useGetTransactionById } from '../api/get-transaction-by-id'

export function TransactionDetailView({ transactionId }: { transactionId: string }) {
  const { data: transaction, isPending, error } = useGetTransactionById(transactionId)

  if (isPending) {
    return <Container>Loading transaction details...</Container>
  }

  if (error) {
    return <p className="text-center text-red-500">Error loading details: {error.message}</p>
  }

  return (
    <Container>
      <Button asChild variant="outline" size="sm">
        <Link href="/transaction-history">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Transaction History
        </Link>
      </Button>
      <div className="mt-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Transaction Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Business</span>
              <span className="font-medium">
                {transaction?.memberships?.businesses?.name || 'N/A'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date</span>
              <span className="font-medium">
                <SafeDateTime date={transaction?.created_at} />
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">QRIS ID</span>
              <span className="font-mono text-xs">{transaction?.qris_tx_id || 'N/A'}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Items Purchased</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-y">
              {transaction?.transaction_items.map((item) => (
                <li key={item.id} className="flex justify-between py-3">
                  <div>
                    <p className="font-medium">{item.products?.name || 'Unknown Product'}</p>
                    <p className="text-muted-foreground text-sm">
                      {item.quantity} x {transformNumberToRupiahMask(item.price_at_purchase)}
                    </p>
                  </div>
                  <p className="font-medium">
                    {transformNumberToRupiahMask(item.price_at_purchase * item.quantity)}
                  </p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <div className="flex justify-end border-t pt-4">
          <div className="text-right">
            <p className="text-muted-foreground">Total Amount</p>
            <p className="text-2xl font-bold">
              {transformNumberToRupiahMask(transaction?.total_amount)}
            </p>
          </div>
        </div>
      </div>
    </Container>
  )
}
