'use client'

import { getUserQueryKey } from '@/features/auth/api/get-user'
import { schemaRegister, useRegister } from '@/features/auth/api/register'
import { createClient } from '@/lib/supabase/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
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
  const queryClient = useQueryClient()
  const supabase = createClient()
  const registerMutation = useRegister()
  const [isVerified, setIsVerified] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

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

  useEffect(() => {
    const checkExistingSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session) {
        router.push('/dashboard')
      } else {
        setIsCheckingAuth(false)
      }
    }

    checkExistingSession()
  }, [supabase, router])

  useEffect(() => {
    if (!registerMutation.isSuccess) return

    const checkAuthStatus = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session) {
        setIsVerified(true)

        // Invalidate user cache
        queryClient.invalidateQueries({ queryKey: getUserQueryKey() })

        setTimeout(() => {
          router.push('/onboarding')
        }, 1500)
      }
    }

    const interval = setInterval(checkAuthStatus, 2000)
    return () => clearInterval(interval)
  }, [registerMutation.isSuccess, supabase, router, queryClient])

  const onSubmit = async (values: RegisterFormValues) => {
    await registerMutation.mutateAsync(values)
  }

  const emailValue = watch('email')

  if (isCheckingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    )
  }

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
                Verifikasi berhasil! Mempersiapkan wallet Anda...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (registerMutation.isSuccess) {
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
                Email dikirim ke <strong className="text-foreground">{emailValue}</strong>
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
              <Button
                variant="link"
                size="sm"
                onClick={() => registerMutation.reset()}
                className="h-auto p-0"
              >
                Kirim ulang
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

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
                autoComplete="email"
                {...register('email')}
                disabled={isSubmitting}
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                'Daftar'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
