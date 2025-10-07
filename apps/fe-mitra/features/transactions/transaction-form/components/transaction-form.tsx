'use client'

import { useGetUserMemberships } from '@/features/reward-programs/api/get-user-memberships'
import { useIsMobile } from '@/hooks/use-mobile'
import { Button } from '@workspace/ui/components/button'
import { cn } from '@workspace/ui/lib/utils'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { useCartStore } from '../../store/cart-store'
import { useMemberStore } from '../../store/member-store'
import { useStepStore } from '../../store/step-store'
import OrderDetails from './order-details'
import PaymentMethodSelector from './payment-method-selector'
import SuccessDialog from './success-dialog'
import VoucherSelection from './voucher-selection'

export default function TransactionForm() {
  const router = useRouter()
  const isMobile = useIsMobile()
  const { clearCart, items } = useCartStore()
  const { membership, clearMembership } = useMemberStore()
  const { setStep } = useStepStore()
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'qris'>('cash')
  const [selectedVouchers, setSelectedVouchers] = useState<string[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [successDialogOpen, setSuccessDialogOpen] = useState(false)

  const { data: membershipsData } = useGetUserMemberships()
  const availableVouchers = membership?.nft_vouchers || []
  const cartItems = Array.from(items.values())
  const totalAmount = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0)

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
      const membershipId = membership?.id || membershipsData?.data[0]?.id
      if (!membershipId) throw new Error('No membership found')

      const cartItemsForSubmit = cartItems.map((i) => ({
        product_id: i.id,
        quantity: i.quantity,
        price_at_purchase: i.price,
      }))

      const res = await fetch('/api/transactions', {
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
      const data = await res.json()
      if (!data.success) throw new Error(data.error)

      if (paymentMethod === 'cash') {
        setSuccessDialogOpen(true)
        setIsProcessing(false)
        return
      }

      // === QRIS flow ===
      const orderId = data.data.transaction.qris_tx_id
      const paymentWindow = window.open(data.data.payment_url, '_blank')
      toast.info('Complete payment in the opened QR window')

      // Poll every 3s until paid or timeout
      let stopPolling = false
      const interval = setInterval(async () => {
        if (stopPolling) return
        try {
          const statusRes = await fetch('/api/check-payment-status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ order_id: orderId }),
          })
          const statusData = await statusRes.json()
          if (statusData.is_paid) {
            stopPolling = true
            clearInterval(interval)
            if (paymentWindow && !paymentWindow.closed) paymentWindow.close()
            setSuccessDialogOpen(true)
            setIsProcessing(false)
          }
        } catch (err) {
          console.error('Polling error:', err)
        }
      }, 3000)

      setTimeout(() => {
        if (!stopPolling) {
          clearInterval(interval)
          setIsProcessing(false)
          toast.error('Payment timeout. Please check transaction status.')
        }
      }, 180000) // 3 minutes timeout
    } catch (err: any) {
      toast.error(err.message || 'Transaction failed')
      setIsProcessing(false)
    }
  }

  return (
    <>
      <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
        <VoucherSelection
          vouchers={availableVouchers}
          selected={selectedVouchers}
          setSelected={setSelectedVouchers}
        />
        <PaymentMethodSelector value={paymentMethod} onChange={setPaymentMethod} />
        <OrderDetails membership={membership} cartItems={cartItems} totalAmount={totalAmount} />

        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setStep('scan-member')} disabled={isProcessing}>
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

      <SuccessDialog
        open={successDialogOpen}
        onOpenChange={setSuccessDialogOpen}
        totalAmount={totalAmount}
        vouchersCount={selectedVouchers.length}
        onConfirm={handleSuccess}
      />
    </>
  )
}
