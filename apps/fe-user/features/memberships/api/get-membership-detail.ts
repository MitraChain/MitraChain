import { createClient } from '@/lib/supabase/client'
import { useQuery } from '@tanstack/react-query'

export const getMembershipById = async (membershipId: string) => {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('memberships')
    .select(
      `
      *,
      businesses (
        id,
        name,
        reward_programs (
          id,
          name,
          type,
          threshold,
          reward_description,
          is_active
        )
      )
    `,
    )
    .eq('id', membershipId)
    .single()

  if (error) throw error

  // Fetch pending redemptions separately
  const { data: pendingRedemptions } = await supabase
    .from('reward_redemptions')
    .select(
      `
      id,
      status,
      requested_at,
      points_spent,
      reward_programs (
        name
      )
    `,
    )
    .eq('membership_id', membershipId)
    .eq('status', 'pending')

  const { data: completedVouchers } = await supabase
    .from('reward_redemptions')
    .select(
      `
      id,
      nft_id,
      nft_redeemed,
      redeemed_by,
      completed_at,
      reward_programs (
        name,
        reward_description
      )
    `,
    )
    .eq('membership_id', membershipId)
    .eq('status', 'completed')

  return {
    ...data,
    pending_redemptions: pendingRedemptions || [],
    vouchers: completedVouchers || [],
  }
}

export const useGetMembershipById = (membershipId: string) => {
  return useQuery({
    queryKey: ['membership', membershipId],
    queryFn: () => getMembershipById(membershipId),
    enabled: !!membershipId,
  })
}
