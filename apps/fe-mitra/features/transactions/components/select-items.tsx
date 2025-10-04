'use client'

import { useGetUser } from '@/features/auth/api/get-user'
import { useGetUserMemberships } from '@/features/auth/api/get-user-memberships'
import { useGetProducts } from '@/features/products/api/get-products'
import TransactionForm from '@/features/transactions/components/transaction-form'
import { Separator } from '@radix-ui/react-select'
import { Button } from '@workspace/ui/components/button'
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

function SelectItem() {
  const router = useRouter()
  const { data: userData } = useGetUser()
  const { data: memberships } = useGetUserMemberships()
  const [selectedBusiness, setSelectedBusiness] = useState<string | null>(null)
  const [cart, setCart] = useState<Record<string, number>>({}) 
  const [showForm, setShowForm] = useState(false)

  const businessId = memberships?.[0]?.business_id ?? null
  const { data: productData, isLoading } = useGetProducts({
    businessId: selectedBusiness || businessId || '',
  })

  useEffect(() => {
    if (businessId && !selectedBusiness) setSelectedBusiness(businessId)
  }, [businessId, selectedBusiness])

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

  const total = products.reduce((sum, p) => sum + ((cart?.[p.id] ?? 0) * p.price), 0)

  const cartItems = Object.entries(cart).map(([productId, quantity]) => {
    const product = products.find(p => p.id === productId)
    return {
      product_id: productId,
      quantity,
      price_at_purchase: product?.price ?? 0,
    }
  })

  if (!userData?.user) return <div className="p-6">Loading user...</div>

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

      {isLoading ? (
        <div>Loading products...</div>
      ) : (
        <div className="grid gap-4">
          {products.map((product) => (
            <Card key={product.id}>
              <CardHeader className="flex items-center justify-between">
                <CardTitle>{product.name}</CardTitle>
                <p className="text-muted-foreground text-sm">Rp{product.price.toLocaleString()}</p>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
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
                <p className="font-medium">
                  Subtotal: Rp
                  {(product.price * (cart[product.id] || 0)).toLocaleString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Separator className="my-12" />

      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground">Total Amount:</p>
          <p className="text-lg font-semibold">Rp{total.toLocaleString()}</p>
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
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

export default SelectItem