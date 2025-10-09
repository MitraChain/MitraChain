'use client'

import Container from '@/components/container'
import { useGetUser } from '@/features/auth/api/get-user'
import { useDebounce } from '@uidotdev/usehooks'
import { getErrorMessage } from '@workspace/lib/index'
import { Button } from '@workspace/ui/components/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@workspace/ui/components/dialog'
import { Input } from '@workspace/ui/components/input'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@workspace/ui/components/pagination'
import { useState } from 'react'
import { toast } from 'sonner'
import { PRODUCTS_PAGE_SIZE, useGetProducts } from '../api/get-products'
import ProductForm from './product-form'
import ProductItem from './product-item'
import { ProductItemSkeleton } from './product-item-skeleton'

export function ProductsView() {
  const { data: userData } = useGetUser()
  const [page, setPage] = useState(1)
  const [openCreate, setOpenCreate] = useState(false)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500)
  const { data, error, isLoading, isFetching } = useGetProducts({
    businessId: userData?.business?.id ?? '',
    page,
    search: debouncedSearch,
  })

  const products = data?.data ?? []
  const meta = data?.meta

  if (error) {
    return (
      <Container>
        <p className="text-muted-foreground text-sm">
          There was an error loading products. {String(error?.message || '')}
        </p>
      </Container>
    )
  }

  return (
    <Container>
      <div className="grid gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-pretty text-xl font-semibold">Products</h1>
          <Dialog open={openCreate} onOpenChange={setOpenCreate}>
            <DialogTrigger asChild>
              <Button>Add product</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>New product</DialogTitle>
              </DialogHeader>
              <ProductForm
                onSuccess={async () => {
                  setOpenCreate(false)
                  toast.success('Product created')
                }}
                onCancel={() => setOpenCreate(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
          />
        </div>
        {isLoading &&
          Array.from({ length: PRODUCTS_PAGE_SIZE }).map((_, index) => (
            <ProductItemSkeleton key={index} />
          ))}
        {!isLoading && !isFetching && error && <div>Error: {getErrorMessage(error)}</div>}
        {!isLoading && !isFetching && !error && products.length === 0 && (
          <div>No products found.</div>
        )}
        {!isLoading && !error && products.length > 0 && (
          <div className="grid gap-3">
            {products.map((p) => (
              <ProductItem key={p.id} product={p} />
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
    </Container>
  )
}
