import { createClient } from '@/lib/supabase/server'

import { LogoutButton } from '@/features/auth/components/logout-button'
import { CreateBusinessForm } from '@/features/business/components/create-business-form'
import { Button } from '@workspace/ui/components/button'
import Link from 'next/link'

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
      <div className="flex min-h-svh items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-4">
          <h1 className="text-2xl font-bold">Hello, {business.name}!</h1>
          <p className="text-muted-foreground">This is your Merchant Home.</p>
          <Button size="sm" asChild>
            <Link href="/products">View Products</Link>
          </Button>
        </div>
      </div>
      <div className="fixed bottom-6 left-6">
        <LogoutButton />
      </div>
    </>
  )
}
