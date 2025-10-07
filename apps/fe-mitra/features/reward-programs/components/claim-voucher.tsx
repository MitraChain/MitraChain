// apps/fe-mitra/app/redemptions/page.tsx
'use client'

import { Badge } from '@workspace/ui/components/badge'
import { Button } from '@workspace/ui/components/button'
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card'
import { Separator } from '@workspace/ui/components/separator'
import { Check, Coins, Loader2, Ticket, User, X } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { useGetRedemptions } from '../api/get-redemptions'

export default function RedemptionsPage() {
  const { data, isLoading, refetch } = useGetRedemptions()
  const [processingId, setProcessingId] = useState<string | null>(null)

  const handleApprove = async (redemptionId: string) => {
    setProcessingId(redemptionId)
    try {
      const response = await fetch('/api/redemptions/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          redemption_id: redemptionId,
          action: 'approve',
        }),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error)
      }

      toast.success('Redemption approved and NFT minted!')
      refetch()
    } catch (error: any) {
      toast.error(error.message || 'Failed to approve redemption')
    } finally {
      setProcessingId(null)
    }
  }

  const handleReject = async (redemptionId: string) => {
    setProcessingId(redemptionId)
    try {
      const response = await fetch('/api/redemptions/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          redemption_id: redemptionId,
          action: 'reject',
        }),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error)
      }

      toast.success('Redemption rejected')
      refetch()
    } catch (error: any) {
      toast.error(error.message || 'Failed to reject redemption')
    } finally {
      setProcessingId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  const pendingRedemptions = data?.data?.filter((r: any) => r.status === 'pending') || []

  console.log(pendingRedemptions)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Redemption Requests</h1>
        <p className="text-muted-foreground">Review and approve customer voucher redemptions</p>
      </div>

      {pendingRedemptions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Ticket className="text-muted-foreground mb-4 h-12 w-12" />
            <p className="text-muted-foreground">No pending redemption requests</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {pendingRedemptions.map((redemption: any) => (
            <Card key={redemption.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      <Ticket className="h-5 w-5" />
                      {redemption.reward_programs?.name || 'Unknown Reward'}
                    </CardTitle>
                    <p className="text-muted-foreground mt-1 text-sm">
                      {redemption.reward_programs?.reward_description || 'No description'}
                    </p>
                  </div>
                  <Badge variant="outline">{redemption.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Customer Info */}
                  <div className="bg-muted rounded-lg p-4">
                    <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                      <User className="h-4 w-4" />
                      Customer Information
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">User ID:</span>
                        <span className="font-mono text-xs">
                          {redemption.user_id?.slice(0, 8)}...
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Membership ID:</span>
                        <span className="font-mono text-xs">
                          {redemption.membership_id?.slice(0, 8)}...
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Current Points:</span>
                        <span className="font-medium">
                          {redemption.memberships?.points || 0} points
                        </span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Redemption Details */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-muted-foreground mb-1 flex items-center gap-2">
                        <Coins className="h-4 w-4" />
                        <span className="text-xs">Points Required</span>
                      </div>
                      <p className="text-lg font-semibold">{redemption.points_spent} points</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1 text-xs">Reward Threshold</p>
                      <p className="text-lg font-semibold">
                        {redemption.reward_programs?.threshold || '-'} points
                      </p>
                    </div>
                  </div>

                  {/* Validation Check */}
                  {redemption.memberships?.points >= redemption.points_spent ? (
                    <div className="rounded-lg bg-green-50 p-3 dark:bg-green-950">
                      <p className="text-sm text-green-800 dark:text-green-200">
                        Customer has sufficient points for this redemption
                      </p>
                    </div>
                  ) : (
                    <div className="rounded-lg bg-red-50 p-3 dark:bg-red-950">
                      <p className="text-sm text-red-800 dark:text-red-200">
                        Warning: Customer points ({redemption.memberships?.points}) is less than
                        required ({redemption.points_spent})
                      </p>
                    </div>
                  )}

                  {/* Timestamps */}
                  <div className="text-muted-foreground text-xs">
                    <p>
                      Requested:{' '}
                      {new Date(redemption.requested_at).toLocaleString('id-ID', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </p>
                  </div>

                  <Separator />

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleApprove(redemption.id)}
                      disabled={
                        processingId === redemption.id ||
                        redemption.memberships?.points < redemption.points_spent
                      }
                      className="flex-1"
                    >
                      {processingId === redemption.id ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Minting NFT...
                        </>
                      ) : (
                        <>
                          <Check className="mr-2 h-4 w-4" />
                          Approve & Mint NFT
                        </>
                      )}
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleReject(redemption.id)}
                      disabled={processingId === redemption.id}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Reject
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
