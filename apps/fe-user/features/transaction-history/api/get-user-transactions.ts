import { useGetUser } from '@/features/auth/api/get-user'
import { createClient } from '@/lib/supabase/client'
import { useQuery } from '@tanstack/react-query'
import { QueryConfig } from '@workspace/query-config'
import { PaginatedResponse, Transaction } from '@workspace/supabase/index'

export const TRANSACTIONS_PAGE_SIZE = 10

export const getTransaction = async ({
  page = 1,
  search = '',
  userId,
}: {
  userId: string
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
        points,
        stamps
      )
    `,
      { count: 'exact' },
    )
    .eq('memberships.user_id', userId)
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

  let transactionsWithUsers = data || []
  if (data && data.length > 0) {
    const userIds = [...new Set(data.map((t) => t.memberships?.user_id).filter(Boolean))]

    if (userIds.length > 0) {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, email')
        .in('id', userIds)

      const emailMap = new Map(profiles?.map((p) => [p.id, p.email]) || [])

      transactionsWithUsers = data.map((t) => ({
        ...t,
        user: {
          id: t.memberships?.user_id,
          email: emailMap.get(t.memberships?.user_id) || 'N/A',
        },
      }))
    }
  }

  const totalItems = count ?? 0
  const totalPages = Math.ceil(totalItems / TRANSACTIONS_PAGE_SIZE)

  return {
    data: transactionsWithUsers,
    meta: {
      totalItems,
      itemCount: transactionsWithUsers.length,
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
  const userId = data?.user.id

  return useQuery({
    queryKey: ['transactions', userId, { page, search }],
    queryFn: () => getTransaction({ page, search, userId: userId! }),
    enabled: !!userId,
    ...restConfig,
  })
}
