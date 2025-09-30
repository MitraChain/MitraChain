import { useQuery } from '@tanstack/react-query'

import { createClient } from '@/lib/supabase/client'
import { QueryConfig } from '@workspace/query-config'

export const getProducts = async () => {
  const supabase = createClient()
  const { data, error } = await supabase.from('products').select('*')

  if (error) {
    throw new Error(error.message || 'Failed to fetch products.')
  }

  return data || []
}

export const useGetProducts = ({
  queryConfig,
}: {
  queryConfig?: QueryConfig<typeof getProducts>
} = {}) => {
  const { ...restConfig } = queryConfig || {}

  return useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
    ...restConfig,
  })
}
