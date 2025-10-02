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
      return NextResponse.redirect(`${requestUrl.origin}/register?error=auth_failed`)
    }

    // Check apakah user sudah punya wallet
    if (user) {
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .single()

      // Jika user baru, redirect ke onboarding untuk create wallet
      if (!existingUser) {
        return NextResponse.redirect(`${requestUrl.origin}/onboarding`)
      }

      // Jika sudah ada, langsung ke dashboard
      return NextResponse.redirect(`${requestUrl.origin}/dashboard`)
    }
  }

  return NextResponse.redirect(`${requestUrl.origin}/register?error=no_code`)
}
