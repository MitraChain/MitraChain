import { createClient } from '@/lib/supabase/client'
import { useMutation } from '@tanstack/react-query'
import { MutationConfig } from '@workspace/query-config'
import { Database } from '@workspace/supabase/types'
import { toast } from 'sonner'
import { z } from 'zod'

export const schemaSignup = z.object({
  email: z.string().email({ message: 'Alamat email tidak valid.' }),
  password: z.string().min(6, { message: 'Password minimal 6 karakter.' }),
})

type BusinessCreate = Database['public']['Tables']['businesses']['Insert']

export type SchemaSignup = z.infer<typeof schemaSignup>

export const signup = async (values: SchemaSignup) => {
  const supabase = createClient()

  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: values.email,
    password: values.password,
  })

  if (signUpError) {
    throw new Error(signUpError.message)
  }
  if (!signUpData.user) {
    throw new Error('Error when signing up user. Please try again.')
  }

  return signUpData
}

export const useSignup = ({
  mutationConfig,
}: {
  mutationConfig?: MutationConfig<typeof signup>
} = {}) => {
  const { onSuccess, onError, ...restConfig } = mutationConfig || {}

  return useMutation({
    mutationFn: signup,
    onSuccess: (data, ...args) => {
      toast.success('Signup Success! Please log in to continue.')
      onSuccess?.(data, ...args)
    },
    onError: (error: Error, ...args) => {
      toast.error(error.message)
      onError?.(error, ...args)
    },
    ...restConfig,
  })
}
