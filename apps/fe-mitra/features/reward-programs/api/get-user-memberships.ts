import { useGetUser } from '@/features/auth/api/get-user'
import { createClient } from '@/lib/supabase/client'
import { useQuery } from '@tanstack/react-query'
import { QueryConfig } from '@workspace/query-config'

export const getUserMemberships = async ({ businessId }: { businessId: string }) => {
  const supabase = createClient()

  // Get memberships for those businesses
  const { data: memberships, error: membershipError } = await supabase
    .from('memberships')
    .select(
      `
      id,
      business_id,
      user_id,
      wallet_address,
      businesses:business_id (
        id,
        name
      )
    `,
    )
    .eq('business_id', businessId)

  if (membershipError) {
    throw new Error('Failed to fetch memberships')
  }

  return { data: memberships }
}

export const useGetUserMemberships = ({
  queryConfig,
}: {
  queryConfig?: QueryConfig<typeof getUserMemberships>
} = {}) => {
  const { data: authSession } = useGetUser()
  const businessId = authSession?.business?.id

  const { ...restConfig } = queryConfig || {}

  return useQuery({
    queryKey: ['user-memberships', { businessId }],
    queryFn: () => getUserMemberships({ businessId: businessId! }),
    ...restConfig,
  })
}
