import { useQuery } from '@tanstack/react-query'

import { createClient } from '@/lib/supabase/client'
import { QueryConfig } from '@workspace/query-config'
import { PaginatedResponse, Product } from '@workspace/supabase/index'

export const PRODUCTS_PAGE_SIZE = 10

export const getProducts = async ({
  page = 1,
  search = '',
  businessId,
}: {
  businessId: string
  page?: number
  search?: string
}): Promise<PaginatedResponse<Product>> => {
  const supabase = createClient()
  const from = (page - 1) * PRODUCTS_PAGE_SIZE
  const to = from + PRODUCTS_PAGE_SIZE - 1

  let query = supabase
    .from('products')
    .select('*', { count: 'exact' })
    .eq('business_id', businessId)

  if (search) {
    query = query.ilike('name', `%${search.trim()}%`)
  }

  query = query.range(from, to).order('created_at', { ascending: false })

  const { data, error, count } = await query

  if (error) {
    throw new Error(error.message || 'Failed to fetch products.')
  }

  const totalItems = count ?? 0
  const totalPages = Math.ceil(totalItems / PRODUCTS_PAGE_SIZE)

  return {
    data: data || [],
    meta: {
      totalItems,
      itemCount: data?.length || 0,
      itemsPerPage: PRODUCTS_PAGE_SIZE,
      totalPages,
      currentPage: page,
    },
  }
}

export const useGetProducts = ({
  queryConfig,
  page,
  search,
  businessId,
}: {
  queryConfig?: QueryConfig<typeof getProducts>
  page?: number
  search?: string
  businessId: string
}) => {
  const { ...restConfig } = queryConfig || {}

  return useQuery({
    queryKey: ['products', businessId, { page, search }],
    queryFn: () => getProducts({ page, search, businessId }),
    enabled: !!businessId,
    ...restConfig,
  })
}
