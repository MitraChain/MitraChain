import { Button } from '@workspace/ui/components/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card'
import { Loader2 } from 'lucide-react'

interface RegisterWaitingProps {
  email: string
  onResend: () => void
}

export function RegisterWaiting({ email, onResend }: RegisterWaitingProps) {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Cek Email Anda</CardTitle>
          <CardDescription>Kami telah mengirimkan link verifikasi</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted rounded-lg border p-4">
            <p className="text-muted-foreground text-sm">
              Email dikirim ke <strong className="text-foreground">{email}</strong>
            </p>
            <p className="text-muted-foreground mt-2 text-xs">
              Klik link di email untuk melanjutkan
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 rounded-lg border border-dashed p-4">
            <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />
            <p className="text-muted-foreground text-sm">Menunggu verifikasi...</p>
          </div>

          <div className="text-muted-foreground space-y-2 text-center text-xs">
            <p>Belum menerima email?</p>
            <Button variant="link" size="sm" onClick={onResend} className="h-auto p-0">
              Kirim ulang
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
