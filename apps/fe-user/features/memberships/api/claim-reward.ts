import { createClient } from '@/lib/supabase/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

interface ClaimRewardInput {
  membership_id: string
  reward_program_id: string
  points_required: number
}

async function claimReward(input: ClaimRewardInput) {
  const supabase = createClient()

  // Get current user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error('You must be logged in to claim rewards')
  }

  // Check if membership belongs to user
  const { data: membership, error: membershipError } = await supabase
    .from('memberships')
    .select('points, user_id')
    .eq('id', input.membership_id)
    .single()

  if (membershipError) {
    throw new Error('Membership not found')
  }

  if (membership.user_id !== user.id) {
    throw new Error('This membership does not belong to you')
  }

  // Check if user has enough points
  if (membership.points < input.points_required) {
    throw new Error(
      `Insufficient points. You need ${input.points_required} points but only have ${membership.points}`,
    )
  }

  // Create redemption request
  const { data: redemption, error: redemptionError } = await supabase
    .from('reward_redemptions')
    .insert({
      user_id: user.id,
      membership_id: input.membership_id,
      reward_program_id: input.reward_program_id,
      points_spent: input.points_required,
      status: 'pending',
      requested_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (redemptionError) {
    throw new Error(`Failed to create redemption request: ${redemptionError.message}`)
  }

  return redemption
}

export function useClaimReward() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: claimReward,
    onSuccess: () => {
      toast.success('Reward claimed successfully! Waiting for approval.')
      queryClient.invalidateQueries({ queryKey: ['membership'] })
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}
