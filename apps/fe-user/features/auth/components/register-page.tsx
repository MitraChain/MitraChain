'use client'

import { schemaRegister, useRegister } from '@/features/auth/api/register'
import { createClient } from '@/lib/supabase/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@workspace/ui/components/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card'
import { Input } from '@workspace/ui/components/input'
import { Label } from '@workspace/ui/components/label'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

type RegisterFormValues = z.infer<typeof schemaRegister>

export default function RegisterPage() {
  const router = useRouter()
  const supabase = createClient()
  const registerMutation = useRegister()
  const [isVerified, setIsVerified] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(schemaRegister),
    defaultValues: {
      email: '',
    },
  })

  // Polling untuk check apakah user sudah verify email
  useEffect(() => {
    if (!registerMutation.isSuccess) return

    const checkAuthStatus = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session) {
        setIsVerified(true)
        // Auto redirect ke dashboard setelah 2 detik
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
      }
    }

    // Check setiap 2 detik
    const interval = setInterval(checkAuthStatus, 2000)

    // Cleanup
    return () => clearInterval(interval)
  }, [registerMutation.isSuccess, supabase, router])

  const onSubmit = async (values: RegisterFormValues) => {
    await registerMutation.mutateAsync(values)
  }

  const emailValue = watch('email')

  // State: Email sudah diverifikasi
  if (isVerified) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
              <CardTitle>Email Terverifikasi!</CardTitle>
            </div>
            <CardDescription>Akun Anda berhasil dibuat</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border bg-green-50 p-4 dark:bg-green-950">
              <p className="text-sm text-green-800 dark:text-green-200">
                Verifikasi berhasil! Anda akan dialihkan ke dashboard...
              </p>
            </div>
            <Button onClick={() => router.push('/dashboard')} className="w-full">
              Lanjut ke Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // State: Menunggu verifikasi email
  if (registerMutation.isSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Cek Email Anda</CardTitle>
            <CardDescription>Kami telah mengirimkan link verifikasi ke email Anda</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted rounded-lg border p-4">
              <p className="text-muted-foreground text-sm">
                Silakan cek email <strong className="text-foreground">{emailValue}</strong> dan klik
                link untuk melanjutkan registrasi.
              </p>
            </div>

            {/* Loading indicator - menunggu verifikasi */}
            <div className="flex items-center justify-center gap-2 rounded-lg border border-dashed p-4">
              <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />
              <p className="text-muted-foreground text-sm">Menunggu verifikasi email...</p>
            </div>

            <div className="text-center">
              <p className="text-muted-foreground text-xs">
                Belum menerima email?{' '}
                <button
                  onClick={() => registerMutation.reset()}
                  className="text-primary hover:underline"
                >
                  Kirim ulang
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // State: Form registrasi
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Daftar MitraChain</CardTitle>
          <CardDescription>Buat akun untuk mendapatkan kartu member digital Anda</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nama@email.com"
                {...register('email')}
                disabled={isSubmitting}
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Memproses...' : 'Daftar'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
