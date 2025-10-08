import { TransactionDetailView } from '@/features/transactions/components/transaction-detail-page'

export default function TransactionDetailPage({ params }: { params: { id: string } }) {
  return <TransactionDetailView transactionId={params.id} />
}
