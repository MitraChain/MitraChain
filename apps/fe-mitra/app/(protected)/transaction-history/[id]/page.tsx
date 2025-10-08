import { TransactionDetailView } from '@/features/transactions/components/transaction-detail-page'

export default async function TransactionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <TransactionDetailView transactionId={id} />
}
