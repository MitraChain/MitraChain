import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { createClient } from '@/lib/supabase/client'
import { MutationConfig } from '@workspace/query-config'
import { Product } from '@workspace/supabase/index'

export const deleteProduct = async (productId: string) => {
  const supabase = createClient()
  const { error } = await supabase.from('products').delete().eq('id', productId)

  if (error) {
    throw new Error(error.message || 'Failed to delete the product.')
  }

  return true
}

export const useDeleteProduct = ({
  mutationConfig,
}: {
  mutationConfig?: MutationConfig<typeof deleteProduct>
} = {}) => {
  const queryClient = useQueryClient()
  const { onSuccess, onError, onMutate, ...restConfig } = mutationConfig || {}

  return useMutation({
    mutationFn: deleteProduct,

    onMutate: async (deletedProductId) => {
      await queryClient.cancelQueries({ queryKey: ['products'] })

      const previousProducts = queryClient.getQueryData<Product[]>(['products'])

      // Optimistically update to the new value
      queryClient.setQueryData<Product[]>(['products'], (oldData = []) =>
        oldData.filter((product) => product.id !== deletedProductId),
      )

      return { previousProducts }
    },

    onError: (...args) => {
      if (args[2]?.previousProducts) {
        queryClient.setQueryData(['products'], args[2].previousProducts)
      }
      toast.error(args[0].message)
      onError?.(...args)
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },

    onSuccess: (...args) => {
      toast.success('Product deleted successfully!')
      onSuccess?.(...args)
    },
    ...restConfig,
  })
}
