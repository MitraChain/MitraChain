// apps/fe-mitra/src/features/transactions/components/transaction-form.tsx
'use client'

import { useGetUserMemberships } from '@/features/reward-programs/api/get-user-memberships'
import { useIsMobile } from '@/hooks/use-mobile'
import { transformNumberToRupiahMask } from '@workspace/lib/maskito'
import { Button } from '@workspace/ui/components/button'
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card'
import { Label } from '@workspace/ui/components/label'
import { RadioGroup, RadioGroupItem } from '@workspace/ui/components/radio-group'
import { cn } from '@workspace/ui/lib/utils'
import { Banknote, CreditCard } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { useCartStore } from '../store/cart-store'
import { useMemberStore } from '../store/member-store'
import { useStepStore } from '../store/step-store'

export default function TransactionForm() {
  const isMobile = useIsMobile()
  const { setStep } = useStepStore()
  const { clearCart, items } = useCartStore()
  const { membership, clearMembership } = useMemberStore()
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'qris'>('cash')
  const [isProcessing, setIsProcessing] = useState(false)

  const cartItems = Array.from(items.values())
  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const { data: membershipsData } = useGetUserMemberships()

  const handleConfirm = async () => {
    setIsProcessing(true)

    try {
      const cartItemsForSubmit = cartItems.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
        price_at_purchase: item.price,
      }))

      const membershipId = membership?.id || membershipsData?.data[0]?.id

      if (!membershipId) {
        toast.error('No membership found')
        setIsProcessing(false)
        return
      }

      // Single API call
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          membership_id: membershipId,
          total_amount: totalAmount,
          cartItems: cartItemsForSubmit,
          payment_method: paymentMethod,
        }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error)
      }

      if (paymentMethod === 'cash') {
        toast.success('Transaction created successfully!')
        clearCart()
        clearMembership()
        setStep('select-items')
      } else {
        // Open Midtrans payment
        window.open(data.data.payment_url, '_blank')
        toast.info('Payment window opened. Complete payment to continue.')
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to process transaction')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      <div>
        <h1 className="text-2xl font-semibold">Transaction Summary</h1>
        <p className="text-muted-foreground text-sm">Review and complete payment</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as any)}>
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="cash" id="cash" />
              <Label htmlFor="cash" className="flex flex-1 cursor-pointer items-center gap-3">
                <Banknote className="text-muted-foreground h-5 w-5" />
                <div>
                  <p className="font-medium">Cash</p>
                  <p className="text-muted-foreground text-sm">Pay with physical cash</p>
                </div>
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="qris" id="qris" />
              <Label htmlFor="qris" className="flex flex-1 cursor-pointer items-center gap-3">
                <CreditCard className="text-muted-foreground h-5 w-5" />
                <div>
                  <p className="font-medium">QRIS</p>
                  <p className="text-muted-foreground text-sm">Scan QR with e-wallet</p>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Order Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {membership && (
            <div>
              <h3 className="text-muted-foreground text-sm font-medium">Member</h3>
              <div className="mt-2 rounded-md border p-3">
                <p className="text-sm">Points: {membership.points}</p>
                <p className="text-sm">Stamps: {membership.stamps}</p>
              </div>
            </div>
          )}

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
          onClick={() => setStep('scan-member')}
          disabled={isProcessing}
        >
          Back
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={isProcessing}
          className={cn(isMobile && 'w-full')}
        >
          {isProcessing ? 'Processing...' : 'Confirm Payment'}
        </Button>
      </div>
    </div>
  )
}
