// apps/fe-mitra/src/features/transactions/components/scan-member.tsx
'use client'

import { Button } from '@workspace/ui/components/button'
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card'
import { QrCode } from 'lucide-react'
import { useState } from 'react'
import { useMemberStore } from '../store/member-store'
import { useStepStore } from '../store/step-store'
import { ScanQRDialog } from './scan-qr-dialog'

export default function ScanMember() {
  const { setStep } = useStepStore()
  const { membership, setMembership } = useMemberStore()
  const [scanDialogOpen, setScanDialogOpen] = useState(false)

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      <div>
        <h1 className="text-2xl font-semibold">Scan Member</h1>
        <p className="text-muted-foreground text-sm">Scan customer QR to continue</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            Customer QR Code
          </CardTitle>
        </CardHeader>
        <CardContent>
          {membership ? (
            <div className="space-y-4">
              <div className="rounded-lg border bg-green-50 dark:bg-green-950">
                <p className="mb-2 text-sm font-medium text-green-900 dark:text-green-100">
                  Member Found
                </p>
                <div className="space-y-2 text-sm text-green-800 dark:text-green-200">
                  <p className="font-medium">Points: {membership.points}</p>
                  <p className="truncate text-xs">Wallet: {membership.wallet_address}</p>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setStep('select-items')}>
                  Back to Items
                </Button>
                <Button onClick={() => setStep('finalization')}>Continue to Payment</Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-muted-foreground text-sm">
                Scan the customer's MitraChain QR code to proceed with the transaction
              </p>
              <Button onClick={() => setScanDialogOpen(true)} className="w-full" size="lg">
                <QrCode className="mr-2 h-4 w-4" />
                Scan QR Code
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <ScanQRDialog
        open={scanDialogOpen}
        onOpenChange={setScanDialogOpen}
        onMemberScanned={(membershipData) => {
          setMembership(membershipData)
        }}
      />
    </div>
  )
}
