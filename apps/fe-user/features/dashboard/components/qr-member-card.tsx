import { Button } from '@workspace/ui/components/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card'
import { Copy, Download, Loader2, QrCode as QrCodeIcon } from 'lucide-react'
import { QRCodeCanvas } from 'qrcode.react'

interface QRMemberCardProps {
  qrData: string
  isLoading?: boolean
  onCopyUserId: () => void
  onDownload: () => void
}

export function QRMemberCard({ qrData, isLoading, onCopyUserId, onDownload }: QRMemberCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCodeIcon className="h-5 w-5" />
          QR Member Anda
        </CardTitle>
        <CardDescription>Tunjukkan QR ini saat mendaftar di UMKM</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        {isLoading || !qrData ? (
          <div className="bg-muted flex h-64 w-64 items-center justify-center rounded-lg">
            <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
          </div>
        ) : (
          <>
            <div className="rounded-lg bg-white p-4">
              <QRCodeCanvas id="qr-canvas" value={qrData} size={200} level="H" includeMargin />
            </div>

            <div className="mt-4 flex gap-2">
              <Button variant="outline" size="sm" onClick={onCopyUserId}>
                <Copy className="mr-2 h-4 w-4" />
                Copy ID
              </Button>
              <Button variant="outline" size="sm" onClick={onDownload}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
