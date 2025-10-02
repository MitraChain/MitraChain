'use client'

import { useGetUser } from '@/features/auth/api/get-user'
import { MembershipListCard } from '@/features/dashboard/components/membership-list-card'
import { QRMemberCard } from '@/features/dashboard/components/qr-member-card'
import { WalletInfoCard } from '@/features/dashboard/components/wallet-info-card'
import { Button } from '@workspace/ui/components/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'
import { toast } from 'sonner'

export default function DashboardPage() {
  const router = useRouter()
  const { data, isLoading, error } = useGetUser()

  const qrData = useMemo(() => {
    if (!data) return ''

    return JSON.stringify({
      user_id: data.user.id,
      email: data.user.email,
      wallet_address: data.walletAddress,
      type: 'mitrachain_member',
    })
  }, [data])

  const handleCopyUserId = () => {
    if (!data) return
    navigator.clipboard.writeText(data.user.id)
    toast.success('User ID disalin ke clipboard!')
  }

  const handleCopyAddress = () => {
    if (!data) return
    navigator.clipboard.writeText(data.walletAddress)
    toast.success('Wallet address disalin ke clipboard!')
  }

  const handleDownloadQR = () => {
    const canvas = document.getElementById('qr-canvas') as HTMLCanvasElement
    if (canvas && data) {
      const url = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.download = `mitrachain-member-${data.user.email?.split('@')[0]}.png`
      link.href = url
      link.click()
      toast.success('QR Code berhasil diunduh!')
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto flex min-h-screen items-center justify-center p-8">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto flex min-h-screen items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>Gagal memuat data pengguna</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/register')} className="w-full">
              Kembali ke Register
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Selamat datang, {data.user.email}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <QRMemberCard
          qrData={qrData}
          isLoading={isLoading}
          onCopyUserId={handleCopyUserId}
          onDownload={handleDownloadQR}
        />

        <WalletInfoCard walletAddress={data.walletAddress} onCopyAddress={handleCopyAddress} />

        <MembershipListCard />
      </div>
    </div>
  )
}
