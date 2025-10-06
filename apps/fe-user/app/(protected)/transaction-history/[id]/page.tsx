import { TransactionDetailView } from '@/features/transaction-history/components/transaction-detail-page'

export default function TransactionDetailPage({ params }: { params: { id: string } }) {
  return <TransactionDetailView transactionId={params.id} />
}
