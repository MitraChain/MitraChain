'use client'

import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { useQuery } from '@tanstack/react-query'
import { QueryConfig } from '@workspace/query-config'
import { Business } from '@workspace/supabase/index'

export const getUser = async (): Promise<{ user: User | null; business: Business }> => {
  const supabase = createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error) {
    throw new Error(error.message || 'Error fetching user')
  }

  const { data: business, error: businessError } = await supabase
    .from('businesses')
    .select('*')
    .eq('owner_id', user?.id)
    .single()

  if (businessError) {
    console.error('Error fetching business:', businessError.message)
  }

  return { user: user, business }
}

type QueryFnType = typeof getUser

export const useGetUser = ({
  queryConfig,
}: {
  queryConfig?: QueryConfig<QueryFnType>
} = {}) => {
  return useQuery({
    queryKey: ['auth-user'],
    queryFn: getUser,
    ...queryConfig,
  })
}
