import { createClient } from '@/lib/supabase/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { MutationConfig } from '@workspace/query-config'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { z } from 'zod'

export const schemaSignin = z.object({
  email: z.string().email({ message: 'Alamat email tidak valid.' }),
  password: z.string().min(1, { message: 'Password tidak boleh kosong.' }),
})

export type SchemaSignin = z.infer<typeof schemaSignin>

export const signin = async (values: SchemaSignin) => {
  const supabase = createClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email: values.email,
    password: values.password,
  })

  if (error) {
    throw new Error(error.message || 'Wrong email and/or password')
  }

  return data
}

export const useSignin = ({
  mutationConfig,
}: {
  mutationConfig?: MutationConfig<typeof signin>
} = {}) => {
  const queryClient = useQueryClient()
  const router = useRouter()
  const { onSuccess, onError, ...restConfig } = mutationConfig || {}

  return useMutation({
    mutationFn: signin,
    onSuccess: (data, ...args) => {
      queryClient.clear()

      toast.success('Login Berhasil!')

      router.push('/')

      onSuccess?.(data, ...args)
    },
    onError: (error: Error, ...args) => {
      toast.error(error.message)
      onError?.(error, ...args)
    },
    ...restConfig,
  })
}
