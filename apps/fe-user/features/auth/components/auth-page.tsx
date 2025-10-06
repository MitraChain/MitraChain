'use client'

import { schemaRegister, useRegister } from '@/features/auth/api/auth'
import { getUserQueryKey } from '@/features/auth/api/get-user'

import { createClient } from '@/lib/supabase/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { AuthForm } from './auth-form'
import { AuthSuccess } from './auth-success'
import { AuthWaiting } from './auth-waiting'

type RegisterFormValues = z.infer<typeof schemaRegister>

export default function AuthPage() {
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
    reset,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(schemaRegister),
    defaultValues: { email: '' },
  })

  // Check existing session
  useEffect(() => {
    const checkExistingSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session) {
        router.push('/memberships')
      } else {
        setIsCheckingAuth(false)
      }
    }

    checkExistingSession()
  }, [supabase, router])

  // Poll for verification
  useEffect(() => {
    if (!registerMutation.isSuccess) return

    const checkAuthStatus = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session) {
        setIsVerified(true)
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

  const handleResend = () => {
    registerMutation.reset()
    reset()
  }

  const emailValue = watch('email')

  // Loading state
  if (isCheckingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (isVerified) {
    return <AuthSuccess />
  }

  if (registerMutation.isSuccess) {
    return <AuthWaiting email={emailValue} onResend={handleResend} />
  }

  return (
    <AuthForm
      register={register}
      emailError={errors.email?.message}
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit(onSubmit)}
    />
  )
}
