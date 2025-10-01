import { createClient } from '@/lib/supabase/server'

import { LogoutButton } from '@/features/auth/components/logout-button'
import { CreateBusinessForm } from '@/features/business/components/create-business-form'
import Hello from '@/features/dashboard/components/hello'

export default async function Page() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: business } = await supabase
    .from('businesses')
    .select('id, name')
    .eq('owner_id', user?.id)
    .single()

  if (!business) {
    return <CreateBusinessForm />
  }

  return (
    <>
      <Hello />
      <div className="fixed bottom-6 left-6">
        <LogoutButton />
      </div>
    </>
  )
}
