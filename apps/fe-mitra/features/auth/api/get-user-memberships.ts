import { createClient } from '@/lib/supabase/client'
import { useQuery } from '@tanstack/react-query'

export const getUserMemberships = async () => {
  const supabase = createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  // Get businesses owned by current user
  const { data: businesses, error: businessError } = await supabase
    .from('businesses')
    .select('id')
    .eq('owner_id', user.id)

  if (businessError) {
    throw new Error('Failed to fetch businesses')
  }

  if (!businesses || businesses.length === 0) {
    return []
  }

  const businessIds = businesses.map((b) => b.id)

  // Get memberships for those businesses
  const { data: memberships, error: membershipError } = await supabase
    .from('memberships')
    .select(`
      id,
      business_id,
      user_id,
      wallet_address,
      businesses:business_id (
        id,
        name
      )
    `)
    .in('business_id', businessIds)

  if (membershipError) {
    throw new Error('Failed to fetch memberships')
  }

  return memberships || []
}

export const useGetUserMemberships = () => {
  return useQuery({
    queryKey: ['user-memberships'],
    queryFn: getUserMemberships,
  })
}