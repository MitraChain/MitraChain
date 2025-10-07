// apps/fe-mitra/src/features/transactions/components/transaction-form.tsx
// apps/fe-mitra/src/features/transactions/components/transaction-form.tsx
'use client'

import { useGetUserMemberships } from '@/features/reward-programs/api/get-user-memberships'
import { useIsMobile } from '@/hooks/use-mobile'
import { transformNumberToRupiahMask } from '@workspace/lib/maskito'
import { Button } from '@workspace/ui/components/button'
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card'
import { Checkbox } from '@workspace/ui/components/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@workspace/ui/components/dialog'
import { Label } from '@workspace/ui/components/label'
import { RadioGroup, RadioGroupItem } from '@workspace/ui/components/radio-group'
import { cn } from '@workspace/ui/lib/utils'
import { Banknote, CheckCircle, CreditCard, Loader2, Ticket } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { useCartStore } from '../store/cart-store'
import { useMemberStore } from '../store/member-store'
import { useStepStore } from '../store/step-store'

export default function TransactionForm() {
  const isMobile = useIsMobile()
  const router = useRouter()
  const { setStep } = useStepStore()
  const { clearCart, items } = useCartStore()
  const { membership, clearMembership } = useMemberStore()
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'qris'>('cash')
  const [isProcessing, setIsProcessing] = useState(false)
  const [successDialogOpen, setSuccessDialogOpen] = useState(false)
  const [selectedVouchers, setSelectedVouchers] = useState<string[]>([])

  const cartItems = Array.from(items.values())
  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const { data: membershipsData } = useGetUserMemberships()

  const availableVouchers = membership?.nft_vouchers || []

  const toggleVoucher = (voucherId: string) => {
    setSelectedVouchers((prev) =>
      prev.includes(voucherId) ? prev.filter((id) => id !== voucherId) : [...prev, voucherId],
    )
  }

  const handleSuccess = () => {
    setSuccessDialogOpen(false)
    clearCart()
    clearMembership()
    setStep('select-items')
    router.push('/create-transaction')
  }

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

      // Create transaction
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          membership_id: membershipId,
          total_amount: totalAmount,
          cartItems: cartItemsForSubmit,
          payment_method: paymentMethod,
          used_vouchers: selectedVouchers,
        }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error)
      }

      if (paymentMethod === 'cash') {
        setSuccessDialogOpen(true)
        setIsProcessing(false)
      } else {
        // QRIS payment flow...
        const paymentWindow = window.open(data.data.payment_url, '_blank')
        toast.info('Complete payment in the new window')

        const orderId = data.data.transaction.qris_tx_id
        const pollInterval = setInterval(async () => {
          try {
            const statusRes = await fetch('/api/check-payment-status', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ order_id: orderId }),
            })

            const statusData = await statusRes.json()

            if (statusData.is_paid) {
              clearInterval(pollInterval)
              if (paymentWindow && !paymentWindow.closed) {
                paymentWindow.close()
              }
              setSuccessDialogOpen(true)
              setIsProcessing(false)
            }
          } catch (error) {
            console.error('Polling error:', error)
          }
        }, 3000)

        setTimeout(() => {
          clearInterval(pollInterval)
          if (!successDialogOpen) {
            setIsProcessing(false)
            toast.error('Payment timeout. Please check transaction status.')
          }
        }, 300000)
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to process transaction')
      setIsProcessing(false)
    }
  }

  return (
    <>
      <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
        <div>
          <h1 className="text-2xl font-semibold">Transaction Summary</h1>
          <p className="text-muted-foreground text-sm">Review and complete payment</p>
        </div>

        {/* Voucher Selection */}
        {availableVouchers.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ticket className="h-5 w-5" />
                Use NFT Vouchers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {availableVouchers.map((voucher: any) => (
                <div
                  key={voucher.id}
                  className="hover:bg-muted flex items-start gap-3 rounded-lg border p-3"
                >
                  <Checkbox
                    id={voucher.id}
                    checked={selectedVouchers.includes(voucher.id)}
                    onCheckedChange={() => toggleVoucher(voucher.id)}
                  />
                  <div className="flex-1">
                    <Label htmlFor={voucher.id} className="cursor-pointer font-semibold">
                      {voucher.reward_program_name}
                    </Label>
                    <p className="text-muted-foreground text-sm">{voucher.reward_description}</p>
                  </div>
                </div>
              ))}
              {selectedVouchers.length > 0 && (
                <p className="text-sm text-green-600">
                  {selectedVouchers.length} voucher(s) will be used
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Payment Method Card */}
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

        {/* Order Details */}
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
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {paymentMethod === 'qris' ? 'Waiting for payment...' : 'Processing...'}
              </>
            ) : (
              'Confirm Payment'
            )}
          </Button>
        </div>
      </div>

      {/* Success Dialog */}
      <Dialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <DialogTitle className="text-center">Payment Successful!</DialogTitle>
            <DialogDescription className="text-center">
              Transaction completed
              {selectedVouchers.length > 0 && ` and ${selectedVouchers.length} voucher(s) redeemed`}
              .
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Amount:</span>
              <span className="font-medium">{transformNumberToRupiahMask(totalAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Points Earned:</span>
              <span className="font-medium">{Math.floor(totalAmount / 10000)} points</span>
            </div>
            {selectedVouchers.length > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Vouchers Used:</span>
                <span className="font-medium">{selectedVouchers.length}</span>
              </div>
            )}
          </div>
          <Button onClick={handleSuccess} className="w-full">
            Create New Transaction
          </Button>
        </DialogContent>
      </Dialog>
    </>
  )
}
