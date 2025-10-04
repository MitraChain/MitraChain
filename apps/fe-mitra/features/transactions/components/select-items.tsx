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
import { useCartItems, useCartStore } from '../store/cart-store'
import { TransactionItemSkeleton } from './transaction-item-skeleton'

function ProductQuantity({ productId }: { productId: string }) {
  const quantity = useCartStore((state) => state.items.get(productId)?.quantity ?? 0)
  return <span className="w-6 text-center">{quantity}</span>
}

function SelectItem() {
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)

  const { data: userData, isPending: isPendingUser } = useGetUser()

  const {
    data: productData,
    isPending: isPendingProducts,
    error,
  } = useGetProducts({
    businessId: userData?.business?.id ?? '',
  })
  const products = productData?.data ?? []

  const { addToCart, removeFromCart, clearCart } = useCartStore()
  const items = useCartItems()
  const total = useCartStore((state) =>
    Array.from(state.items.values()).reduce((sum, item) => sum + item.price * item.quantity, 0),
  )
  const isCartEmpty = useCartStore((state) => state.items.size === 0)

  const cartItemsForSubmit = Array.from(items.values()).map((item) => ({
    product_id: item.id,
    quantity: item.quantity,
    price_at_purchase: item.price,
  }))

  const isLoading = isPendingProducts || isPendingUser

  if (showForm) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="mb-4 text-xl font-semibold">Complete Transaction</h1>
        <TransactionForm
          totalAmount={total}
          cartItems={cartItemsForSubmit}
          onSuccess={(tx) => {
            toast.success('Transaction created successfully!')
            clearCart()
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
                    setShowForm(true)
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
    </div>
  )
}

export default SelectItem
