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

      // TODO: Step 2 - Call edge function untuk create wallet via NMKR
      // const response = await fetch('/api/create-wallet', { method: 'POST' })
      // const data = await response.json()

      // Sementara simulasi loading 2 detik
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Redirect ke dashboard setelah wallet created
      router.push('/dashboard')
    } catch (err) {
      setError('Gagal membuat wallet. Silakan coba lagi.')
      setIsCreating(false)
    }
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Terjadi Kesalahan</CardTitle>
            <CardDescription>{error}</CardDescription>
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
          <CardDescription>Sedang membuat wallet dan kartu member digital...</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
          <p className="text-muted-foreground text-sm">Mohon tunggu sebentar</p>
        </CardContent>
      </Card>
    </div>
  )
}
