import { createClient } from '@/lib/supabase/client'
import { useQuery } from '@tanstack/react-query'

export const getUserQueryKey = () => ['user'] as const

export const getUser = async () => {
  const supabase = createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error) throw error
  if (!user) throw new Error('No user found')

  // Get wallet from localStorage
  const walletAddress = localStorage.getItem('wallet_address') || ''

  return {
    user,
    walletAddress,
  }
}

export const useGetUser = () => {
  return useQuery({
    queryKey: getUserQueryKey(),
    queryFn: getUser,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
