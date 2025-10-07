'use client'

import { useDebounce } from '@uidotdev/usehooks'
import { getErrorMessage } from '@workspace/lib/index'
import { Input } from '@workspace/ui/components/input'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@workspace/ui/components/pagination'
import { useState } from 'react'
import { TRANSACTIONS_PAGE_SIZE, useGetTransactions } from '../api/get-transactions'
import TransactionItem from './transaction-item'
import { TransactionItemSkeleton } from './transaction-item-skeleton'

export function TransactionsView() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500)
  const { data, error, isLoading, isFetching } = useGetTransactions({
    page,
    search: debouncedSearch,
  })

  const transactions = data?.data ?? []
  const meta = data?.meta

  if (error) {
    return (
      <div className="p-4">
        <p className="text-muted-foreground text-sm">
          There was an error loading transactions. {String(error?.message || '')}
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-pretty text-xl font-semibold">Transactions</h1>
      </div>

      <div className="flex items-center gap-2">
        <Input
          placeholder="Search transactions..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
        />
      </div>

      {isLoading &&
        Array.from({ length: TRANSACTIONS_PAGE_SIZE }).map((_, index) => (
          <TransactionItemSkeleton key={index} />
        ))}
      {!isLoading && !isFetching && error && <div>Error: {getErrorMessage(error)}</div>}
      {!isLoading && !isFetching && !error && transactions.length === 0 && (
        <div>No transactions found.</div>
      )}

      {!isLoading && !error && transactions.length > 0 && (
        <div className="grid gap-3">
          {transactions.map((t) => (
            <TransactionItem key={t.id} transaction={t} />
          ))}
        </div>
      )}

      {meta && meta.totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                className={meta.currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
            <PaginationItem>
              <span className="p-2 text-sm">
                Page {meta.currentPage} of {meta.totalPages}
              </span>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                onClick={() => setPage((prev) => Math.min(prev + 1, meta.totalPages))}
                className={
                  meta.currentPage === meta.totalPages ? 'pointer-events-none opacity-50' : ''
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}
