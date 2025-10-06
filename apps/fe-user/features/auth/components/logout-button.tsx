'use client'

import { Button } from '@workspace/ui/components/button'
import { LogOut } from 'lucide-react'
import { useLogout } from '../api/logout'

export function LogoutButton({ className }: { className?: string }) {
  const { mutate, isPending } = useLogout()

  return (
    <Button
      variant="ghost"
      className={className}
      onClick={() => mutate(undefined)}
      disabled={isPending}
    >
      <LogOut className="mr-2 h-4 w-4" />
      {isPending ? 'Logging out...' : 'Logout'}
    </Button>
  )
}
