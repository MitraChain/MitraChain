'use client'

import { cn } from '@workspace/ui/lib/utils'
import { History, User, WalletCards } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  {
    label: 'Memberships',
    href: '/memberships',
    icon: WalletCards,
  },
  {
    label: 'History',
    href: '/transaction-history',
    icon: History,
  },
  {
    label: 'Profile',
    href: '/profile',
    icon: User,
  },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="bg-card border-border fixed bottom-0 left-0 right-0 z-50 border-t">
      <div className="mx-auto flex h-16 max-w-lg items-center justify-around px-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex h-full flex-1 flex-col items-center justify-center gap-1 transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
