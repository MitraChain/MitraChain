import { createClient } from '@/lib/supabase/client'
import { useQuery } from '@tanstack/react-query'

export const getUserQueryKey = () => ['user'] as const

export const getUser = async () => {
  const supabase = createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError) throw authError
  if (!user) throw new Error('No user found')

  const { data: walletData, error: walletError } = await supabase
    .from('user_wallets')
    .select('wallet_address, wallet_name, network')
    .eq('user_id', user.id)
    .maybeSingle()

  if (walletError) {
    console.error('Error fetching wallet:', walletError)
  }

  const walletAddress = walletData?.wallet_address || ''

  return {
    user,
    walletAddress,
    walletName: walletData?.wallet_name,
    network: walletData?.network,
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
