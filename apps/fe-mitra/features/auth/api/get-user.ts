import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { useQuery } from '@tanstack/react-query'
import { QueryConfig } from '@workspace/query-config'

export const getUser = async (): Promise<User | null> => {
  const supabase = createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error) {
    console.error('Error fetching user:', error.message)
    return null
  }

  return data.user
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
