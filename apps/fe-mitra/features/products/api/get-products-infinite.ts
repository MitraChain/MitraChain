import { useInfiniteQuery } from '@tanstack/react-query'

import { useGetUser } from '@/features/auth/api/get-user'
import { createClient } from '@/lib/supabase/client'
import { Product } from '@workspace/supabase/index'

export const PRODUCTS_PAGE_SIZE = 5

export const getInfiniteProducts = async ({
  pageParam = 0,
  search = '',
  businessId,
}: {
  pageParam?: number
  search?: string
  businessId: string
}): Promise<{ data: Product[]; nextPage: number | null }> => {
  const supabase = createClient()
  const from = pageParam * PRODUCTS_PAGE_SIZE
  const to = from + PRODUCTS_PAGE_SIZE - 1

  let query = supabase.from('products').select('*').eq('business_id', businessId)

  if (search) {
    query = query.ilike('name', `%${search.trim()}%`)
  }

  query = query.range(from, to).order('created_at', { ascending: false })

  const { data, error } = await query

  if (error) {
    throw new Error(error.message || 'Failed to fetch products.')
  }

  const nextPage = data.length === PRODUCTS_PAGE_SIZE ? pageParam + 1 : null

  return { data, nextPage }
}

export const useGetInfiniteProducts = ({ search }: { search?: string } = {}) => {
  const { data } = useGetUser()

  return useInfiniteQuery({
    queryKey: ['products-infinite', data?.business.id, { search }],
    queryFn: ({ pageParam }) =>
      getInfiniteProducts({ pageParam, search, businessId: data?.business.id! }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    enabled: !!data?.business.id,
  })
}
