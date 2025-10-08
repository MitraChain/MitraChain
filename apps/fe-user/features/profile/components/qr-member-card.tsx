import { useGetUser } from '@/features/auth/api/get-user'
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
import { useMemo } from 'react'
import { toast } from 'sonner'

export function QRMemberCard() {
  const { data, isLoading } = useGetUser()

  const qrData = useMemo(() => {
    if (!data?.user?.id) return ''
    return data.user.id
  }, [data])

  const handleCopyUserId = () => {
    if (!data?.user?.id) return
    navigator.clipboard.writeText(data.user.id)
    toast.success('User ID copied to clipboard!')
  }

  const handleDownloadQR = () => {
    const canvas = document.getElementById('qr-canvas') as HTMLCanvasElement
    if (canvas && data?.user?.email) {
      const url = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.download = `mitrachain-member-${data.user.email.split('@')[0]}.png`
      link.href = url
      link.click()
      toast.success('QR Code downloaded successfully!')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCodeIcon className="h-5 w-5" />
          Your Member QR
        </CardTitle>
        <CardDescription>Show this QR when registering at businesses</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col items-center">
        {isLoading || !qrData ? (
          <div className="bg-muted flex h-64 w-64 items-center justify-center rounded-lg">
            <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
          </div>
        ) : (
          <>
            <div className="rounded-lg bg-white p-1">
              <QRCodeCanvas id="qr-canvas" value={qrData} size={240} level="H" includeMargin />
            </div>

            <div className="mt-4 flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCopyUserId}>
                <Copy className="mr-2 h-4 w-4" />
                Copy ID
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownloadQR}>
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
