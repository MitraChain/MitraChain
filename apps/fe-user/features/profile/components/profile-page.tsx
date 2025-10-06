'use client'

import { useGetUser } from '@/features/auth/api/get-user'
import { LogoutButton } from '@/features/auth/components/logout-button'
import { QRMemberCard } from './qr-member-card'
import { WalletInfoCard } from './wallet-info-card'

const ProfilePage = () => {
  const { data } = useGetUser()

  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Profile</h1>
          <p className="text-muted-foreground mt-1">Hello, {data?.user.email}</p>
        </div>
        <LogoutButton />
      </div>

      <div className="space-y-6 md:grid md:grid-cols-2 md:gap-6 md:space-y-0">
        <QRMemberCard />
        <WalletInfoCard walletAddress={data?.walletAddress} />
      </div>
    </div>
  )
}

export default ProfilePage
