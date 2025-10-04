import SidebarLayout from '@/components/side-bar-layout'
import { CreateBusinessForm } from '@/features/business/components/create-business-form'
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

  const { data: business } = await supabase
    .from('businesses')
    .select('id, name')
    .eq('owner_id', user?.id)
    .single()

  if (!business) {
    return (
      <div className="flex h-full min-h-screen items-center justify-center">
        <CreateBusinessForm />
      </div>
    )
  }

  return <SidebarLayout>{children}</SidebarLayout>
}
