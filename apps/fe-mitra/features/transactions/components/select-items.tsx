'use client'

import Container from '@/components/container'
import { useGetUser } from '@/features/auth/api/get-user'
import { PRODUCTS_PAGE_SIZE } from '@/features/products/api/get-products'
import { useGetInfiniteProducts } from '@/features/products/api/get-products-infinite'
import { Separator } from '@radix-ui/react-select'
import { useDebounce } from '@uidotdev/usehooks'
import { transformNumberToRupiahMask } from '@workspace/lib/maskito'
import { Button } from '@workspace/ui/components/button'
import { Card, CardContent } from '@workspace/ui/components/card'
import { Input } from '@workspace/ui/components/input'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { toast } from 'sonner'
import { useCartStore } from '../store/cart-store'
import { useStepStore } from '../store/step-store'
import { TransactionItemSkeleton } from './transaction-item-skeleton'

function ProductQuantity({ productId }: { productId: string }) {
  const quantity = useCartStore((state) => state.items.get(productId)?.quantity ?? 0)
  return <span className="w-6 text-center">{quantity}</span>
}

function SelectItems() {
  const { setStep } = useStepStore()
  const { isPending: isPendingUser } = useGetUser()
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500)

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '200px',
  })

  const {
    data: productData,
    isLoading: isPendingProducts,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetInfiniteProducts({
    search: debouncedSearch,
  })
  const products = productData?.pages.flatMap((page) => page.data) ?? []

  const { addToCart, removeFromCart } = useCartStore()

  const total = useCartStore((state) =>
    Array.from(state.items.values()).reduce((sum, item) => sum + item.price * item.quantity, 0),
  )
  const isCartEmpty = useCartStore((state) => state.items.size === 0)

  const isLoading = isPendingProducts || isPendingUser

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

  return (
    <Container>
      <h1 className="mb-6 text-2xl font-semibold">Create New Transaction</h1>

      <Input
        placeholder="Search products..."
        value={search}
        className="mb-4"
        onChange={(e) => {
          setSearch(e.target.value)
        }}
      />

      {isLoading && (
        <div className="flex flex-col gap-3">
          {Array.from({ length: PRODUCTS_PAGE_SIZE }).map((_, index) => (
            <TransactionItemSkeleton key={index} />
          ))}
        </div>
      )}
      {!isLoading && !error && products.length === 0 && <div>No products found.</div>}

      {!isLoading && !error && products.length > 0 && (
        <>
          <div className="grid gap-4">
            {products.map((product) => (
              <Card key={product.id}>
                <CardContent className="flex items-center justify-between py-0">
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-muted-foreground text-sm">
                      {transformNumberToRupiahMask(product.price)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => removeFromCart(product.id)}>
                      -
                    </Button>
                    <ProductQuantity productId={product.id} />
                    <Button variant="outline" size="sm" onClick={() => addToCart(product)}>
                      +
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div ref={ref} className="h-1" />

          {isFetchingNextPage && (
            <div className="mt-6 flex justify-center">
              <p className="text-muted-foreground text-sm">Loading more products...</p>
            </div>
          )}

          <Separator className="mt-12" />

          <div className="sticky bottom-6 rounded-xl border bg-transparent p-4 backdrop-blur-xl">
            <div className="mx-auto flex max-w-3xl items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Total Amount:</p>
                <p className="text-lg font-semibold">{transformNumberToRupiahMask(total)}</p>
              </div>
              <div className="flex items-center gap-3">
                <Link href="/transactions">
                  <Button variant="ghost">Cancel</Button>
                </Link>
                <Button
                  onClick={() => {
                    if (isCartEmpty) {
                      toast.error('Please select at least one product.')
                      return
                    }
                    setStep('scan-member')
                  }}
                  disabled={isCartEmpty}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </Container>
  )
}

export default SelectItems
