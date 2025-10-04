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

    if (user) {
      const userCreatedAt = new Date(user.created_at)
      const now = new Date()
      const diffInMinutes = (now.getTime() - userCreatedAt.getTime()) / 1000 / 60

      if (diffInMinutes < 5) {
        return NextResponse.redirect(`${requestUrl.origin}/onboarding`)
      }

      return NextResponse.redirect(`${requestUrl.origin}/dashboard`)
    }
  }

  return NextResponse.redirect(`${requestUrl.origin}/register?error=no_code`)
}
