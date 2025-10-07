// apps/fe-mitra/src/features/redemptions/api/get-redemptions.ts
import { createClient } from '@/lib/supabase/client'
import { useQuery } from '@tanstack/react-query'

export const getRedemptions = async () => {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('reward_redemptions')
    .select(
      `
      *,
      memberships(user_id, points),
      reward_programs(name, reward_description, threshold)
    `,
    )
    .order('created_at', { ascending: false })

  if (error) throw error
  return { data }
}

export const useGetRedemptions = () => {
  return useQuery({
    queryKey: ['redemptions'],
    queryFn: getRedemptions,
  })
}
