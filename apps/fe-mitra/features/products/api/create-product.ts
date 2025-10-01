import { createClient } from '@/lib/supabase/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { parseRupiahMaskToNumber } from '@workspace/lib/maskito'
import { MutationConfig } from '@workspace/query-config'
import { Product } from '@workspace/supabase/index'
import { Database } from '@workspace/supabase/types'
import { toast } from 'sonner'
import { z } from 'zod'

type ProductInsert = Database['public']['Tables']['products']['Insert']

export const schemaAddProduct = z.object({
  name: z.string().min(1, { message: 'Product name is required.' }),
  price: z
    .string()
    .min(1, { message: 'Product price is required.' })
    .refine(
      (value) => {
        const numericString = parseRupiahMaskToNumber(value)
        return numericString > 0
      },
      {
        message: 'Price must contain a valid number.',
      },
    ),
})

export type SchemaAddProduct = z.infer<typeof schemaAddProduct>

export const addProduct = async (values: SchemaAddProduct): Promise<Product> => {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('You must be logged in to add a product.')
  }

  const productData: ProductInsert = {
    ...values,
    price: parseRupiahMaskToNumber(values.price),
    merchant_id: user.id,
  }

  const { data, error } = await supabase.from('products').insert(productData).select().single()

  if (error) {
    throw new Error(error.message || 'Failed to create the product.')
  }

  return data
}

export const useAddProduct = ({
  mutationConfig,
}: {
  mutationConfig?: MutationConfig<typeof addProduct>
} = {}) => {
  const queryClient = useQueryClient()
  const { onSuccess, onError, ...restConfig } = mutationConfig || {}

  return useMutation({
    mutationFn: addProduct,
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toast.success(`Product "${data.name}" created successfully!`)
      onSuccess?.(data, ...args)
    },
    onError: (error, ...args) => {
      toast.error(error.message)
      onError?.(error, ...args)
    },
    ...restConfig,
  })
}
