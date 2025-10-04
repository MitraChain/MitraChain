'use client'

import { useGetUser } from '@/features/auth/api/get-user'
import { PRODUCTS_PAGE_SIZE, useGetProducts } from '@/features/products/api/get-products'
import TransactionForm from '@/features/transactions/components/transaction-form'
import { Separator } from '@radix-ui/react-select'
import { transformNumberToRupiahMask } from '@workspace/lib/maskito'
import { Button } from '@workspace/ui/components/button'
import { Card, CardContent } from '@workspace/ui/components/card'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { TransactionItemSkeleton } from './transaction-item-skeleton'

function SelectItem() {
  const router = useRouter()
  const { data: userData, isPending: isPendingUser } = useGetUser()
  const [cart, setCart] = useState<Record<string, number>>({})
  const [showForm, setShowForm] = useState(false)

  const {
    data: productData,
    isPending: isPendingProducts,
    error,
  } = useGetProducts({
    businessId: userData?.business?.id ?? '',
  })

  const products = productData?.data ?? []

  const handleAdd = (id: string) => {
    setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }))
  }

  const handleRemove = (id: string) => {
    setCart((prev) => {
      const newQty = (prev[id] || 0) - 1
      if (newQty <= 0) {
        const { [id]: _, ...rest } = prev
        return rest
      }
      return { ...prev, [id]: newQty }
    })
  }

  const total = products.reduce((sum, p) => sum + (cart?.[p.id] ?? 0) * p.price, 0)

  const cartItems = Object.entries(cart).map(([productId, quantity]) => {
    const product = products.find((p) => p.id === productId)
    return {
      product_id: productId,
      quantity,
      price_at_purchase: product?.price ?? 0,
    }
  })

  const isLoading = isPendingProducts || isPendingUser

  if (showForm) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="mb-4 text-xl font-semibold">Complete Transaction</h1>
        <TransactionForm
          totalAmount={total}
          cartItems={cartItems}
          onSuccess={(tx) => {
            toast.success('Transaction created successfully!')
            router.push('/transactions')
          }}
          onCancel={() => setShowForm(false)}
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold">Create New Transaction</h1>

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
                <CardContent className="flex items-center justify-between">
                  <div>
                    <p>{product.name}</p>
                    <p className="text-muted-foreground text-sm">
                      {transformNumberToRupiahMask(product.price)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemove(product.id)}
                      disabled={!cart[product.id]}
                    >
                      -
                    </Button>
                    <span className="w-6 text-center">{cart[product.id] || 0}</span>
                    <Button variant="outline" size="sm" onClick={() => handleAdd(product.id)}>
                      +
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

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
                    if (Object.keys(cart).length === 0) {
                      toast.error('Please select at least one product.')
                      return
                    }
                    setShowForm(true)
                  }}
                  disabled={Object.keys(cart).length === 0}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default SelectItem
