'use client'

import Container from '@/components/container'
import { useGetUserMemberships } from '../api/get-user-memberships'
import { MembershipCard } from './membership-card'
import { MembershipCardSkeleton } from './membership-card-skeleton'

export default function MembershipsPage() {
  const { data: memberships, isPending, error } = useGetUserMemberships()

  return (
    <Container>
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">My Memberships</h1>
        <p className="text-muted-foreground mt-1">All your loyalty cards in one place.</p>
      </header>

      {isPending && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <MembershipCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Error State */}
      {!isPending && error && <p className="text-center text-red-500">Error: {error.message}</p>}

      {/* Empty State */}
      {!isPending && !error && memberships?.length === 0 && (
        <p className="text-muted-foreground text-center">
          You haven't joined any loyalty programs yet.
        </p>
      )}

      {/* Data Display */}
      {!isPending && !error && memberships && memberships.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {memberships.map((membership) => (
            <MembershipCard key={membership.id} membership={membership} />
          ))}
        </div>
      )}
    </Container>
  )
}
