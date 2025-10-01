import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { createClient } from '@/lib/supabase/client'
import { parseRupiahMaskToNumber } from '@workspace/lib/maskito'
import { MutationConfig } from '@workspace/query-config'
import { Product } from '@workspace/supabase/index'
import { Database } from '@workspace/supabase/types'
import { SchemaAddProduct } from './create-product'

type ProductUpdate = Database['public']['Tables']['products']['Update']

export const editProduct = async ({
  productId,
  values,
}: {
  productId: string
  values: SchemaAddProduct
}): Promise<Product> => {
  const supabase = createClient()
  const productData: ProductUpdate = { ...values, price: parseRupiahMaskToNumber(values.price) }

  const { data, error } = await supabase
    .from('products')
    .update(productData)
    .eq('id', productId)
    .select()
    .single()

  if (error) {
    throw new Error(error.message || 'Failed to update the product.')
  }

  return data
}

export const useEditProduct = ({
  mutationConfig,
}: {
  mutationConfig?: MutationConfig<typeof editProduct>
} = {}) => {
  const queryClient = useQueryClient()
  const { onSuccess, onError, ...restConfig } = mutationConfig || {}

  return useMutation({
    mutationFn: editProduct,
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toast.success(`Product "${data.name}" updated successfully!`)
      onSuccess?.(data, ...args)
    },
    onError: (error, ...args) => {
      toast.error(error.message)
      onError?.(error, ...args)
    },
    ...restConfig,
  })
}
