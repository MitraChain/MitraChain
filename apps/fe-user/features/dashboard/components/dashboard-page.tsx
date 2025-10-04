'use client'

import { useGetUser } from '@/features/auth/api/get-user'
import { MembershipListCard } from '@/features/dashboard/components/membership-list-card'
import { QRMemberCard } from '@/features/dashboard/components/qr-member-card'
import { WalletInfoCard } from '@/features/dashboard/components/wallet-info-card'
import { Button } from '@workspace/ui/components/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const router = useRouter()
  const { data, isLoading, error } = useGetUser()

  if (isLoading) {
    return (
      <div className="container mx-auto flex min-h-screen items-center justify-center p-8">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto flex min-h-screen items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>Failed to load user data</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/register')} className="w-full">
              Back to Register
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome, {data.user.email}</p>
      </div>

      <div className="gap-6 md:grid md:grid-cols-2">
        <QRMemberCard />
        <WalletInfoCard walletAddress={data.walletAddress} />
        <MembershipListCard />
      </div>
    </div>
  )
}
