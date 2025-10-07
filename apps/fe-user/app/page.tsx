import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

const RootPage = async () => {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/auth')
  }

  const { data: walletData } = await supabase
    .from('user_wallets')
    .select('wallet_address')
    .eq('user_id', user.id)
    .maybeSingle()

  if (walletData?.wallet_address) {
    return redirect('/memberships')
  }

  return redirect('/onboarding')
}

export default RootPage
