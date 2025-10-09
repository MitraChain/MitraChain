'use client'

import { transformNumberToRupiahMask } from '@workspace/lib/maskito'
import { Button } from '@workspace/ui/components/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@workspace/ui/components/dialog'
import { CheckCircle } from 'lucide-react'

export default function SuccessDialog({
  open,
  onOpenChange,
  totalAmount,
  vouchersCount,
  onConfirm,
}: any) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <DialogTitle className="text-center">Payment Successful!</DialogTitle>
          <DialogDescription className="text-center">
            Transaction completed
            {vouchersCount > 0 && ` and ${vouchersCount} voucher(s) redeemed`}.
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
          {vouchersCount > 0 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Vouchers Used:</span>
              <span className="font-medium">{vouchersCount}</span>
            </div>
          )}
        </div>
        <Button onClick={onConfirm} className="w-full">
          Create New Transaction
        </Button>
      </DialogContent>
    </Dialog>
  )
}
