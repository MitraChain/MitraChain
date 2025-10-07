import { useGetUser } from '@/features/auth/api/get-user'
import { createClient } from '@/lib/supabase/client'
import { useInfiniteQuery } from '@tanstack/react-query'
import { QueryConfig } from '@workspace/query-config'
import { Transaction } from '@workspace/supabase/index'

type MembershipWithBusiness = {
  businesses: {
    name: string | null
  } | null
}

export type UserTransaction = Transaction & {
  memberships: MembershipWithBusiness | null
}

export const TRANSACTIONS_PAGE_SIZE = 10

export const getTransaction = async ({
  page = 1,
  search = '',
  userId,
}: {
  userId: string
  page?: number
  search?: string
}): Promise<{ data: UserTransaction[]; nextPage: number | null }> => {
  const supabase = createClient()
  const from = page * TRANSACTIONS_PAGE_SIZE
  const to = from + TRANSACTIONS_PAGE_SIZE - 1

  let query = supabase
    .from('transactions')
    .select(
      `
      *,
      memberships!inner (
        businesses ( name )
      )
    `,
    )
    .eq('memberships.user_id', userId)
    .range(from, to)
    .order('created_at', { ascending: false })

  if (search) {
    query = query.ilike('qris_tx_id', `%${search.trim()}%`)
  }

  const { data, error } = await query

  if (error) {
    console.error('❌ Query Error:', error)
    throw new Error(error.message || 'Failed to fetch transactions.')
  }

  const nextPage = data.length === TRANSACTIONS_PAGE_SIZE ? page + 1 : null

  return { data: (data as UserTransaction[]) || [], nextPage }
}

export const useGetUserTransactionsInfinite = ({
  queryConfig,
  page,
  search,
}: {
  queryConfig?: QueryConfig<typeof getTransaction>
  page?: number
  search?: string
} = {}) => {
  const { ...restConfig } = queryConfig || {}
  const { data } = useGetUser()
  const userId = data?.user.id

  return useInfiniteQuery({
    queryKey: ['user-transactions-infinite', userId, { search }],
    queryFn: ({ pageParam }) => getTransaction({ page: pageParam, search, userId: userId! }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    enabled: !!userId,
    ...restConfig,
  })
}
