import SidebarLayout from '@/components/side-bar-layout'
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

  return <SidebarLayout>{children}</SidebarLayout>
}
