import { useQuery } from '@tanstack/react-query'

import { createClient } from '@/lib/supabase/client'
import { Business, Membership, RewardProgram } from '@workspace/supabase'

type BusinessWithRewards = Business & {
  reward_programs: RewardProgram[]
}

export type MembershipDetail = Membership & {
  businesses: BusinessWithRewards | null
}

export const getMembershipById = async (membershipId: string): Promise<MembershipDetail | null> => {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('memberships')
    .select(
      `
      *,
      businesses (
        *,
        reward_programs (*)
      )
    `,
    )
    .eq('id', membershipId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    console.error('Error fetching membership details:', error)
    throw new Error(error.message || 'Failed to fetch membership details.')
  }

  return data as MembershipDetail
}

export const useGetMembershipById = (membershipId: string) => {
  return useQuery({
    queryKey: ['membership', membershipId],
    queryFn: () => getMembershipById(membershipId),
    enabled: !!membershipId,
  })
}
