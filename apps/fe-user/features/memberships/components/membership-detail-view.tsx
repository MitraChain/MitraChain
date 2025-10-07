'use client'

import Container from '@/components/container'
import { Button } from '@workspace/ui/components/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card'
import { ArrowLeft, Star } from 'lucide-react'
import Link from 'next/link'
import { useGetMembershipById } from '../api/get-membership-detail'

export function MembershipDetailView({ membershipId }: { membershipId: string }) {
  const { data: membership, isLoading, error } = useGetMembershipById(membershipId)

  if (isLoading) {
    return <Container>Loading membership details...</Container>
  }

  if (error) {
    return <p className="text-center text-red-500">Error: {error.message}</p>
  }

  if (!membership) {
    return <p className="text-muted-foreground text-center">Membership not found.</p>
  }

  return (
    <Container>
      <Button asChild variant="outline" size="sm">
        <Link href="/memberships">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Memberships
        </Link>
      </Button>

      <header className="my-6">
        <h1 className="text-2xl font-bold">{membership.businesses?.name}</h1>
        <p className="text-muted-foreground mt-1">Your loyalty status and rewards.</p>
      </header>

      <div className="flex flex-col gap-6">
        <div className="bg-card flex flex-col items-center justify-center rounded-lg border p-4">
          <span className="text-3xl font-bold">{membership.points}</span>
          <span className="text-muted-foreground text-sm">Points</span>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Available Rewards</CardTitle>
            <CardDescription>Rewards you can claim with your points or stamps.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="divide-y">
              {membership.businesses?.reward_programs.map((program) => (
                <li key={program.id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-full">
                      <Star className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">{program.name}</p>
                      <p className="text-muted-foreground text-sm">{program.reward_description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="font-semibold">{program.threshold}</p>
                      <p className="text-muted-foreground text-sm capitalize">{program.type}</p>
                    </div>
                    {true ? <Button size="sm">Claim</Button> : <div className="h-1 w-[62px]" />}
                  </div>
                </li>
              ))}
              {membership.businesses?.reward_programs.length === 0 && (
                <p className="text-muted-foreground py-4 text-center text-sm">
                  No active reward programs at the moment.
                </p>
              )}
            </ul>
          </CardContent>
        </Card>
      </div>
    </Container>
  )
}
