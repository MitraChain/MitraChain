import { useGetUser } from '@/features/auth/api/get-user'
import { createClient } from '@/lib/supabase/client'
import { useQuery } from '@tanstack/react-query'
import { QueryConfig } from '@workspace/query-config'
import { PaginatedResponse, RewardProgram } from '@workspace/supabase/index'

export const REWARD_PROGRAMS_PAGE_SIZE = 10

export const getRewardPrograms = async ({
  page = 1,
  search = '',
  businessId,
}: {
  page?: number
  search?: string
  businessId: string
}): Promise<PaginatedResponse<RewardProgram>> => {
  const supabase = createClient()
  const from = (page - 1) * REWARD_PROGRAMS_PAGE_SIZE
  const to = from + REWARD_PROGRAMS_PAGE_SIZE - 1

  let query = supabase
    .from('reward_programs')
    .select('*', { count: 'exact' })
    .eq('business_id', businessId)

  if (search) {
    query = query.ilike('name', `%${search.trim()}%`)
  }

  query = query.range(from, to).order('created_at', { ascending: false })

  const { data, error, count } = await query

  if (error) {
    throw new Error(error.message || 'Failed to fetch reward programs.')
  }

  const totalItems = count ?? 0
  const totalPages = Math.ceil(totalItems / REWARD_PROGRAMS_PAGE_SIZE)

  return {
    data: data || [],
    meta: {
      totalItems,
      itemCount: data?.length || 0,
      itemsPerPage: REWARD_PROGRAMS_PAGE_SIZE,
      totalPages,
      currentPage: page,
    },
  }
}

export const useGetRewardPrograms = ({
  queryConfig,
  page,
  search,
}: {
  queryConfig?: QueryConfig<typeof getRewardPrograms>
  page: number
  search: string
}) => {
  const { data: authSession } = useGetUser()
  const businessId = authSession?.business?.id

  const { ...restConfig } = queryConfig || {}

  return useQuery({
    queryKey: ['reward-programs', { page, search, businessId }],
    queryFn: () => getRewardPrograms({ page, search, businessId: businessId! }),
    ...restConfig,
  })
}
