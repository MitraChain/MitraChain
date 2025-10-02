import { createClient } from '@/lib/supabase/client'
import { useMutation } from '@tanstack/react-query'
import { MutationConfig } from '@workspace/query-config'
import { toast } from 'sonner'
import { z } from 'zod'

export const schemaRegister = z.object({
  email: z.string().email({ message: 'Alamat email tidak valid.' }),
})

export type SchemaRegister = z.infer<typeof schemaRegister>

export const register = async (values: SchemaRegister) => {
  const supabase = createClient()

  const { data, error } = await supabase.auth.signInWithOtp({
    email: values.email,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  })

  if (error) {
    throw new Error(error.message || 'Gagal mengirim email verifikasi')
  }

  return { email: values.email, ...data }
}

export const useRegister = ({
  mutationConfig,
}: {
  mutationConfig?: MutationConfig<typeof register>
} = {}) => {
  const { onSuccess, onError, ...restConfig } = mutationConfig || {}

  return useMutation({
    mutationFn: register,
    onSuccess: (data, ...args) => {
      toast.success('Email verifikasi berhasil dikirim!')
      onSuccess?.(data, ...args)
    },
    onError: (error: Error, ...args) => {
      toast.error(error.message)
      onError?.(error, ...args)
    },
    ...restConfig,
  })
}
