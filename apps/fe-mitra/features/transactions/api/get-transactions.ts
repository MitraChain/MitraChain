import { useGetUser } from '@/features/auth/api/get-user'
import { createClient } from '@/lib/supabase/client'
import { useQuery } from '@tanstack/react-query'
import { QueryConfig } from '@workspace/query-config'
import { PaginatedResponse, Transaction } from '@workspace/supabase/index'

export const TRANSACTIONS_PAGE_SIZE = 10

export const getTransaction = async ({
  page = 1,
  search = '',
  businessId,
}: {
  businessId: string
  page?: number
  search?: string
}): Promise<PaginatedResponse<Transaction>> => {
  const supabase = createClient()
  const from = (page - 1) * TRANSACTIONS_PAGE_SIZE
  const to = from + TRANSACTIONS_PAGE_SIZE - 1

  let query = supabase
    .from('transactions')
    .select(
      `
      *,
      memberships!inner (
        id,
        user_id,
        business_id,
        points
      )
    `,
      { count: 'exact' },
    )
    .eq('memberships.business_id', businessId)
    .range(from, to)
    .order('created_at', { ascending: false })

  if (search) {
    query = query.ilike('qris_tx_id', `%${search.trim()}%`)
  }

  const { data, error, count } = await query

  if (error) {
    console.error('❌ Query Error:', error)
    throw new Error(error.message || 'Failed to fetch transactions.')
  }

  const totalItems = count ?? 0
  const totalPages = Math.ceil(totalItems / TRANSACTIONS_PAGE_SIZE)

  return {
    data,
    meta: {
      totalItems,
      itemCount: data.length,
      itemsPerPage: TRANSACTIONS_PAGE_SIZE,
      totalPages,
      currentPage: page,
    },
  }
}

export const useGetTransactions = ({
  queryConfig,
  page,
  search,
}: {
  queryConfig?: QueryConfig<typeof getTransaction>
  page?: number
  search?: string
}) => {
  const { ...restConfig } = queryConfig || {}
  const { data } = useGetUser()
  const businessId = data?.business.id

  return useQuery({
    queryKey: ['transactions', businessId, { page, search }],
    queryFn: () => getTransaction({ page, search, businessId: businessId! }),
    enabled: !!data?.business.id,
    ...restConfig,
  })
}
