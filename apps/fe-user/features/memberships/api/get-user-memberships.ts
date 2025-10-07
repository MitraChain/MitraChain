import { useQuery } from '@tanstack/react-query'

import { useGetUser } from '@/features/auth/api/get-user'
import { createClient } from '@/lib/supabase/client'
import { Membership } from '@workspace/supabase'

export type MembershipWithBusiness = Membership & {
  businesses: {
    name: string | null
    address: string | null
  } | null
}

export const getUserMemberships = async (userId: string): Promise<MembershipWithBusiness[]> => {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('memberships')
    .select(
      `
      *,
      businesses ( name, address )
    `,
    )
    .eq('user_id', userId)
    .order('points', { ascending: false })

  if (error) {
    console.error('Error fetching memberships:', error)
    throw new Error(error.message || 'Failed to fetch memberships.')
  }

  return (data as MembershipWithBusiness[]) || []
}

// The custom hook that wraps useQuery
export const useGetUserMemberships = () => {
  const { data: authData } = useGetUser()
  const userId = authData?.user?.id

  return useQuery({
    queryKey: ['memberships', userId],
    queryFn: () => getUserMemberships(userId as string),
    enabled: !!userId,
  })
}
