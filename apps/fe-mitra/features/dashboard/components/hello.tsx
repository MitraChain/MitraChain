'use client'

import { useGetUser } from '@/features/auth/api/get-user'
import { Button } from '@workspace/ui/components/button'
import Link from 'next/link'

const Hello = () => {
  const { data } = useGetUser()

  return (
    <div className="flex min-h-svh items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Hello, {data?.business.name}!</h1>
        <p className="text-muted-foreground">This is your Merchant Home.</p>
        <Button size="sm" asChild>
          <Link href="/products">View Products</Link>
        </Button>
      </div>
    </div>
  )
}

export default Hello
