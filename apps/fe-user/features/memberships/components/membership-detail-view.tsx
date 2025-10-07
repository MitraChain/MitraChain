'use client'

import Container from '@/components/container'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@workspace/ui/components/alert-dialog'
import { Badge } from '@workspace/ui/components/badge'
import { Button } from '@workspace/ui/components/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card'
import { ArrowLeft, CheckCircle, Loader2, Star } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { useClaimReward } from '../api/claim-reward'
import { useGetMembershipById } from '../api/get-membership-detail'

export function MembershipDetailView({ membershipId }: { membershipId: string }) {
  const { data: membership, isLoading, error } = useGetMembershipById(membershipId)
  const claimMutation = useClaimReward()
  const [selectedReward, setSelectedReward] = useState<any>(null)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)

  console.log(membership?.vouchers)

  if (isLoading) {
    return (
      <Container>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </Container>
    )
  }

  if (error) {
    return (
      <Container>
        <p className="text-center text-red-500">Error: {error.message}</p>
      </Container>
    )
  }

  if (!membership) {
    return (
      <Container>
        <p className="text-muted-foreground text-center">Membership not found.</p>
      </Container>
    )
  }

  const handleClaimClick = (program: any) => {
    setSelectedReward(program)
    setConfirmDialogOpen(true)
  }

  const handleConfirmClaim = () => {
    if (!selectedReward) return

    claimMutation.mutate({
      membership_id: membershipId,
      reward_program_id: selectedReward.id,
      points_required: selectedReward.threshold,
    })

    setConfirmDialogOpen(false)
    setSelectedReward(null)
  }

  const canClaimReward = (threshold: number) => {
    return membership.points >= threshold
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
        {/* Points Display */}
        <div className="flex flex-col items-center justify-center rounded-lg border bg-gradient-to-br from-blue-50 to-blue-100 p-8 dark:from-blue-950 dark:to-blue-900">
          <span className="text-5xl font-bold text-blue-600 dark:text-blue-400">
            {membership.points}
          </span>
          <span className="text-muted-foreground mt-2 text-sm">Available Points</span>
        </div>

        {/* Rewards Card */}
        <Card>
          <CardHeader>
            <CardTitle>Available Rewards</CardTitle>
            <CardDescription>
              Claim rewards with your points. Requests will be approved by the merchant.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {membership.businesses?.reward_programs.length > 0 ? (
              <ul className="divide-y">
                {membership.businesses.reward_programs.map((program: any) => {
                  const canClaim = canClaimReward(program.threshold)
                  const pointsNeeded = program.threshold - membership.points

                  return (
                    <li key={program.id} className="flex items-center justify-between py-4">
                      <div className="flex items-center gap-4">
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-full ${
                            canClaim
                              ? 'bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {canClaim ? (
                            <CheckCircle className="h-6 w-6" />
                          ) : (
                            <Star className="h-6 w-6" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{program.name}</p>
                          <p className="text-muted-foreground text-sm">
                            {program.reward_description}
                          </p>
                          {!canClaim && pointsNeeded > 0 && (
                            <p className="mt-1 text-xs text-orange-600 dark:text-orange-400">
                              Need {pointsNeeded} more points
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-semibold">{program.threshold}</p>
                          <p className="text-muted-foreground text-xs capitalize">{program.type}</p>
                        </div>

                        <Button
                          size="sm"
                          disabled={!canClaim || claimMutation.isPending}
                          onClick={() => handleClaimClick(program)}
                        >
                          {claimMutation.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Claiming...
                            </>
                          ) : (
                            'Claim'
                          )}
                        </Button>
                      </div>
                    </li>
                  )
                })}
              </ul>
            ) : (
              <div className="py-8 text-center">
                <Star className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                <p className="text-muted-foreground text-sm">
                  No active reward programs at the moment.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* User’s Owned Vouchers */}
        {membership.vouchers && membership.vouchers.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Owned Vouchers</CardTitle>
              <CardDescription>Redeemed rewards you can use at the merchant.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="divide-y">
                {membership.vouchers.map((voucher: any) => (
                  <li key={voucher.id} className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium">
                        {voucher.reward_programs?.name || 'Reward Voucher'}
                      </p>
                      {voucher.reward_programs?.reward_description && (
                        <p className="text-muted-foreground text-sm">
                          {voucher.reward_programs.reward_description}
                        </p>
                      )}
                      <p className="text-muted-foreground text-xs">
                        NFT ID: {voucher.nft_id || '-'}
                      </p>
                    </div>
                    <Badge
                      variant={voucher.nft_redeemed ? 'secondary' : 'default'}
                      className={
                        voucher.nft_redeemed ? 'bg-gray-500 text-white' : 'bg-green-500 text-white'
                      }
                    >
                      {voucher.nft_redeemed ? 'Used' : 'Active'}
                    </Badge>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Pending Redemptions */}
        {membership.pending_redemptions && membership.pending_redemptions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Pending Claims</CardTitle>
              <CardDescription>Waiting for merchant approval</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="divide-y">
                {membership.pending_redemptions.map((redemption: any) => (
                  <li key={redemption.id} className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium">{redemption.reward_programs?.name}</p>
                      <p className="text-muted-foreground text-xs">
                        Requested: {new Date(redemption.requested_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant="outline">{redemption.status}</Badge>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Reward Claim</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to claim <strong>{selectedReward?.name}</strong>?
              <br />
              <br />
              This will cost <strong>{selectedReward?.threshold} points</strong> and requires
              merchant approval.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmClaim}>Confirm Claim</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Container>
  )
}
