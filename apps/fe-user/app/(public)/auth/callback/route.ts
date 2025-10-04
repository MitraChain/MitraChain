import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { toast } from 'sonner'

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
      return NextResponse.redirect(`${requestUrl.origin}/register?error=auth_failed`)
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
        // User already has wallet → go to dashboard
        toast.success('Existing user with wallet, redirecting to dashboard')
        return NextResponse.redirect(`${requestUrl.origin}/dashboard`)
      }

      // New user without wallet → go to onboarding
      console.log('New user without wallet, redirecting to onboarding')
      return NextResponse.redirect(`${requestUrl.origin}/onboarding`)
    }
  }

  return NextResponse.redirect(`${requestUrl.origin}/register?error=no_code`)
}
