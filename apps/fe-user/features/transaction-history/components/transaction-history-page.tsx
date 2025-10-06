'use client'

import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'

import Container from '@/components/container'
import {
  TRANSACTIONS_PAGE_SIZE,
  useGetUserTransactionsInfinite,
} from '../api/get-user-transactions-infinite'
import TransactionItem from './transaction-item'
import TransactionItemSkeleton from './transaction-item-skeleton'

export default function TransactionHistoryPage() {
  const { data, isLoading, isFetching, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetUserTransactionsInfinite()

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '400px',
  })

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

  const transactions = data?.pages.flatMap((page) => page.data) ?? []

  return (
    <Container>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Transaction History</h1>
        <p className="text-muted-foreground mt-1">A record of your recent activity.</p>
      </div>

      <div className="space-y-4">
        {isLoading &&
          Array.from({ length: TRANSACTIONS_PAGE_SIZE }).map((_, i) => (
            <TransactionItemSkeleton key={i} />
          ))}

        {!isLoading && error && <p className="text-center text-red-500">Error: {error.message}</p>}

        {!isLoading && isFetching && !error && transactions.length === 0 && (
          <p className="text-muted-foreground text-center">No transactions found.</p>
        )}

        {!isLoading &&
          !error &&
          transactions.length > 0 &&
          transactions.map((transaction) => (
            <TransactionItem key={transaction.id} transaction={transaction} />
          ))}
      </div>

      <div ref={ref} className="h-1" />
      {isFetchingNextPage && (
        <div className="mt-6 flex justify-center">
          <p className="text-muted-foreground text-sm">Loading more products...</p>
        </div>
      )}
    </Container>
  )
}
