'use client'

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
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function OnboardingPage() {
  const router = useRouter()
  const [isCreating, setIsCreating] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    createWallet()
  }, [])

  const createWallet = async () => {
    try {
      setIsCreating(true)
      setError(null)

      const response = await fetch('/api/create-wallet', {
        method: 'POST',
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Gagal membuat wallet')
      }

      // Simpan wallet address
      localStorage.setItem('wallet_address', data.data.wallet.walletAddress)

      toast.success('Wallet berhasil dibuat!')

      setTimeout(() => {
        router.push('/dashboard')
      }, 1000)
    } catch (err: any) {
      console.error('Create wallet error:', err)
      setError(err.message || 'Gagal membuat wallet. Silakan coba lagi.')
      setIsCreating(false)
      toast.error(err.message)
    }
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="border-destructive w-full max-w-md">
          <CardHeader>
            <CardTitle>Terjadi Kesalahan</CardTitle>
            <CardDescription className="text-destructive">{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={createWallet} className="w-full">
              Coba Lagi
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Mempersiapkan Akun Anda</CardTitle>
          <CardDescription>Sedang membuat wallet Cardano Anda...</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4 py-8">
          <Loader2 className="text-primary h-12 w-12 animate-spin" />
          <div className="space-y-1 text-center">
            <p className="text-sm font-medium">Mohon tunggu sebentar</p>
            <p className="text-muted-foreground text-xs">
              Proses ini biasanya memakan waktu 5-10 detik
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
