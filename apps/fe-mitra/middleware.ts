import { updateSession } from '@/lib/supabase/middleware'
import { type NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  // Skip middleware untuk webhook dan cron routes
  if (
    request.nextUrl.pathname.startsWith('/api/midtrans-notification') ||
    request.nextUrl.pathname.startsWith('/api/webhook-test') ||
    request.nextUrl.pathname.startsWith('/api/cron')
  ) {
    return NextResponse.next()
  }

  return await updateSession(request)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
