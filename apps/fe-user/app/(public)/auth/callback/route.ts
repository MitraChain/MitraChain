import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = await createClient()

    const {
      data: { user },
      error,
    } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error('Auth callback error:', error)
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/auth?error=auth_failed`)
    }

    if (user) {
      const { data: walletData, error: walletError } = await supabase
        .from('user_wallets')
        .select('wallet_address')
        .eq('user_id', user.id)
        .maybeSingle()

      if (walletError) {
        console.error('Error checking wallet:', walletError)
      }

      if (walletData && walletData.wallet_address) {
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/memberships`)
      }

      // New user without wallet → go to onboarding
      console.log('New user without wallet, redirecting to onboarding')
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/onboarding`)
    }
  }

  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/auth?error=no_code`)
}
