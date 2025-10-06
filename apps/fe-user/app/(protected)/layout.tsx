import { BottomNav } from '@/components/bottom-nav'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { PropsWithChildren } from 'react'

const ProtectedLayout = async ({ children }: PropsWithChildren) => {
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

  if (!walletData?.wallet_address) {
    return redirect('/onboarding')
  }

  return (
    <>
      <main className="h-0 min-h-screen pb-20">{children}</main>
      <BottomNav />
    </>
  )
}

export default ProtectedLayout
