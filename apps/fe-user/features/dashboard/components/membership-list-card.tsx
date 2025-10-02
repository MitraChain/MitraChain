import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card'
import { QrCode as QrCodeIcon } from 'lucide-react'

export function MembershipListCard() {
  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle>Member di UMKM</CardTitle>
        <CardDescription>Daftar UMKM tempat Anda menjadi member</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-muted-foreground py-12 text-center">
          <QrCodeIcon className="mx-auto mb-4 h-12 w-12 opacity-20" />
          <p className="font-medium">Anda belum terdaftar di UMKM manapun</p>
          <p className="mt-2 text-sm">
            Tunjukkan QR code di atas kepada kasir untuk mendaftar sebagai member
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
