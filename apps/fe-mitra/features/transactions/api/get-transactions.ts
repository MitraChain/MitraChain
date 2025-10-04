import { createClient } from '@/lib/supabase/client'
import { useQuery } from '@tanstack/react-query'
import { QueryConfig } from '@workspace/query-config'
import { PaginatedResponse, Transaction } from '@workspace/supabase/index'

export const TRANSACTIONS_PAGE_SIZE = 10

export const getTransaction = async ({
  page = 1,
  search = '',
  ownerId,
}: {
  ownerId: string
  page?: number
  search?: string
}): Promise<PaginatedResponse<Transaction>> => {
  const supabase = createClient()
  const from = (page - 1) * TRANSACTIONS_PAGE_SIZE
  const to = from + TRANSACTIONS_PAGE_SIZE - 1

  console.log('🔍 Debug - ownerId:', ownerId)

  // 1. Cek businesses
  const { data: businesses, error: businessError } = await supabase
    .from('businesses')
    .select('id')
    .eq('owner_id', ownerId)

  console.log('🏢 Businesses:', businesses)
  console.log('❌ Business Error:', businessError)

  const businessIds = businesses?.map((b) => b.id) || []

  if (businessIds.length === 0) {
    console.log('⚠️ No businesses found for owner')
    return {
      data: [],
      meta: {
        totalItems: 0,
        itemCount: 0,
        itemsPerPage: TRANSACTIONS_PAGE_SIZE,
        totalPages: 0,
        currentPage: page,
      },
    }
  }

  console.log('🔑 Business IDs:', businessIds)

  // 2. Cek memberships dulu (tanpa join transactions)
  const { data: testMemberships } = await supabase
    .from('memberships')
    .select('*')
    .in('business_id', businessIds)

  console.log('👥 Memberships:', testMemberships)

  // 3. Cek transactions
  const { data: testTransactions } = await supabase
    .from('transactions')
    .select('*, memberships!inner(*)')
    .in('memberships.business_id', businessIds)

  console.log('💰 Transactions with memberships:', testTransactions)

  // 4. Query utama
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
      { count: 'exact' }
    )
    .in('memberships.business_id', businessIds)
    .range(from, to)
    .order('created_at', { ascending: false })

  if (search) {
    query = query.ilike('qris_tx_id', `%${search.trim()}%`)
  }

  const { data, error, count } = await query

  console.log('📊 Final query result:', { data, error, count })

  if (error) {
    console.error('❌ Query Error:', error)
    throw new Error(error.message || 'Failed to fetch transactions.')
  }

  console.log(data);

  // 3. Ambil email users dari profiles (query terpisah)
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
  ownerId,
}: {
  queryConfig?: QueryConfig<typeof getTransaction>
  page?: number
  search?: string
  ownerId: string
}) => {
  const { ...restConfig } = queryConfig || {}

  return useQuery({
    queryKey: ['transactions', ownerId, { page, search }],
    queryFn: () => getTransaction({ page, search, ownerId }),
    enabled: !!ownerId,
    ...restConfig,
  })
}