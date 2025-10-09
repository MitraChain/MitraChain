'use client'

import { MitrachainLogo } from '@/features/landing-page/components/mitrachain-logo'
import { Button } from '@workspace/ui/components/button'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { ChevronDown, UserCircle, CreditCard, FileText, LogOut } from 'lucide-react'

export function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }

    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setIsDropdownOpen(false)
  }

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-[#0a0f1e]/80 backdrop-blur-xl">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <MitrachainLogo className="h-10 w-10" />
          <span className="text-xl font-bold tracking-tight">
            <span style={{ color: '#0b4a8f' }}>Mitra</span>
            <span style={{ color: '#00c7c7' }}>chain</span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <Link
            href="/auth"
            className="text-sm font-medium text-gray-300 transition-colors hover:text-[#00c7c7]"
          >
            Get Started
          </Link>
          <Link
            href="#about"
            className="text-sm font-medium text-gray-300 transition-colors hover:text-[#00c7c7]"
          >
            About
          </Link>
          <Link
            href="#features"
            className="text-sm font-medium text-gray-300 transition-colors hover:text-[#00c7c7]"
          >
            Features
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#00c7c7] to-[#3a9cff] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
              >
                <UserCircle className="h-4 w-4" />
                <span>{user.email?.split('@')[0]}</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-lg border border-white/10 bg-[#0a0f1e] shadow-xl">
                  <div className="p-2">
                    <Link
                      href="/memberships"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-gray-300 transition-colors hover:bg-white/5 hover:text-[#00c7c7]"
                    >
                      <CreditCard className="h-4 w-4" />
                      Memberships
                    </Link>
                    <Link
                      href="/profile"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-gray-300 transition-colors hover:bg-white/5 hover:text-[#00c7c7]"
                    >
                      <UserCircle className="h-4 w-4" />
                      Profile
                    </Link>
                    <Link
                      href="/transaction-history"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-gray-300 transition-colors hover:bg-white/5 hover:text-[#00c7c7]"
                    >
                      <FileText className="h-4 w-4" />
                      Transaction History
                    </Link>
                    <div className="my-1 border-t border-white/10" />
                    <button
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-gray-300 transition-colors hover:bg-white/5 hover:text-red-400"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link href="/auth">
              <Button
                size="sm"
                className="bg-gradient-to-r from-[#00c7c7] to-[#3a9cff] text-white hover:opacity-90"
              >
                Login/Register
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}