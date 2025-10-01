import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { PropsWithChildren } from 'react'

export default async function ProtectedLayout({ children }: PropsWithChildren) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/auth')
  }

  return children
}
