'use client'

import { useGetUserMemberships } from '@/features/auth/api/get-user-memberships'
import { useIsMobile } from '@/hooks/use-mobile'
import { transformNumberToRupiahMask } from '@workspace/lib/maskito'
import { Button } from '@workspace/ui/components/button'
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card'
import { cn } from '@workspace/ui/lib/utils'
import { useAddTransaction } from '../api/create-transactions'
import { useCartStore } from '../store/cart-store'
import { useStepStore } from '../store/step-store'

export default function TransactionForm() {
  const isMobile = useIsMobile()
  const { setStep } = useStepStore()
  const { clearCart, items } = useCartStore()

  const cartItems = Array.from(items.values())
  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const { data: membershipsData } = useGetUserMemberships()

  const addMutation = useAddTransaction({
    mutationConfig: {
      onSuccess: () => {
        clearCart()
        setStep('select-items')
      },
    },
  })

  const handleConfirm = () => {
    const cartItemsForSubmit = cartItems.map((item) => ({
      product_id: item.id,
      quantity: item.quantity,
      price_at_purchase: item.price,
    }))

    addMutation.mutate({
      membership_id: membershipsData?.data[0]?.id ?? '',
      total_amount: totalAmount,
      cartItems: cartItemsForSubmit,
      qris_tx_id: `qris_${new Date().getTime()}`,
      onchain_proof_hash: `hash_${new Date().getTime()}`,
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Transaction Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Items Purchased */}
          <div>
            <h3 className="text-muted-foreground text-sm font-medium">Items</h3>
            <ul className="mt-2 divide-y rounded-md border">
              {cartItems.map((item) => (
                <li key={item.id} className="flex items-center justify-between p-3">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-muted-foreground text-sm">
                      {item.quantity} x {transformNumberToRupiahMask(item.price)}
                    </p>
                  </div>
                  <p className="font-medium">
                    {transformNumberToRupiahMask(item.price * item.quantity)}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* Total */}
          <div className="flex items-center justify-between border-t pt-4">
            <p className="text-lg font-semibold">Total Amount</p>
            <p className="text-lg font-semibold">{transformNumberToRupiahMask(totalAmount)}</p>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-end gap-3">
        <Button
          type="button"
          variant="ghost"
          onClick={() => setStep('select-items')}
          disabled={addMutation.isPending}
        >
          Back
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={addMutation.isPending}
          className={cn(isMobile && 'w-full')}
        >
          {addMutation.isPending ? 'Creating...' : 'Confirm & Create Transaction'}
        </Button>
      </div>
    </div>
  )
}
