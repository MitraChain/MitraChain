'use client'

import { Button } from '@workspace/ui/components/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@workspace/ui/components/dialog'
import { Label } from '@workspace/ui/components/label'
import { Textarea } from '@workspace/ui/components/textarea'
import { Loader2, QrCode } from 'lucide-react'
import { useState } from 'react'
import { useScanMember } from '../api/scan-member'

interface ScanQRDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onMemberScanned: (membership: any) => void
}

export function ScanQRDialog({ open, onOpenChange, onMemberScanned }: ScanQRDialogProps) {
  const [qrData, setQrData] = useState('')
  const scanMutation = useScanMember({
    mutationConfig: {
      onSuccess: (data) => {
        onMemberScanned(data.membership)
        onOpenChange(false)
        setQrData('')
      },
    },
  })

  const handleScan = () => {
    if (!qrData.trim()) return
    scanMutation.mutate(qrData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            Scan Member QR
          </DialogTitle>
          <DialogDescription>Paste the QR data from customer's MitraChain app</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="qr-data">QR Data</Label>
            <Textarea
              id="qr-data"
              placeholder="Paste QR data here..."
              value={qrData}
              onChange={(e) => setQrData(e.target.value)}
              rows={6}
              disabled={scanMutation.isPending}
              className="font-mono text-xs"
            />
          </div>

          <Button
            onClick={handleScan}
            disabled={scanMutation.isPending || !qrData.trim()}
            className="w-full"
          >
            {scanMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Scan & Continue'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
