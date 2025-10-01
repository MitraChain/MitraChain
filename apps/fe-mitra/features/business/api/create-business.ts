import { createClient } from '@/lib/supabase/client'
import { useMutation } from '@tanstack/react-query'
import { MutationConfig } from '@workspace/query-config'
import type { Business, Database } from '@workspace/supabase'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { z } from 'zod'

type BusinessInsert = Database['public']['Tables']['businesses']['Insert']

export const schemaCreateBusiness = z.object({
  name: z.string().min(1, { message: 'Business name is required.' }),
  address: z.string().min(1, { message: 'Business address is required.' }),
})

export type SchemaCreateBusiness = z.infer<typeof schemaCreateBusiness>

export const createBusiness = async (values: SchemaCreateBusiness): Promise<Business> => {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('You must be logged in to create a business.')
  }

  const newBusiness: BusinessInsert = {
    name: values.name,
    address: values.address,
    owner_id: user.id,
  }

  const { data, error } = await supabase.from('businesses').insert(newBusiness).select().single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export const useCreateBusiness = ({
  mutationConfig,
}: {
  mutationConfig?: MutationConfig<typeof createBusiness>
} = {}) => {
  const router = useRouter()
  const { onSuccess, onError, ...restConfig } = mutationConfig || {}

  return useMutation({
    mutationFn: createBusiness,
    onSuccess: (data, ...args) => {
      toast.success(`Business "${data.name}" created successfully!`)
      router.refresh()
      onSuccess?.(data, ...args)
    },
    onError: (error: Error, ...args) => {
      toast.error(error.message)
      onError?.(error, ...args)
    },
    ...restConfig,
  })
}
