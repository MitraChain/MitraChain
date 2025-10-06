// apps/fe-mitra/app/api/redemptions/approve/route.ts
import { mintRewardNFT } from '@/lib/nmkr/client'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user: umkm },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !umkm) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { redemption_id, action } = body // action: 'approve' | 'reject'

    if (!redemption_id || !['approve', 'reject'].includes(action)) {
      return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 })
    }

    // Get redemption with all relations
    const { data: redemption, error: redemptionError } = await supabase
      .from('reward_redemptions')
      .select(
        `
        *,
        memberships(*, businesses!inner(owner_id)),
        reward_programs(*)
      `,
      )
      .eq('id', redemption_id)
      .single()

    if (redemptionError || !redemption) {
      return NextResponse.json({ success: false, error: 'Redemption not found' }, { status: 404 })
    }

    // Verify UMKM owns this business
    if (redemption.memberships.businesses.owner_id !== umkm.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized to manage this redemption' },
        { status: 403 },
      )
    }

    // Check status
    if (redemption.status !== 'pending') {
      return NextResponse.json(
        { success: false, error: 'Redemption already processed' },
        { status: 400 },
      )
    }

    if (action === 'reject') {
      // Reject redemption
      const { error: updateError } = await supabase
        .from('reward_redemptions')
        .update({
          status: 'rejected',
          rejected_at: new Date().toISOString(),
        })
        .eq('id', redemption_id)

      if (updateError) {
        return NextResponse.json(
          { success: false, error: 'Failed to reject redemption' },
          { status: 500 },
        )
      }

      return NextResponse.json({
        success: true,
        message: 'Redemption rejected',
      })
    }

    // APPROVE: Deduct points & mint NFT
    console.log('Approving redemption:', redemption_id)

    // Deduct points from membership
    const newPoints = redemption.memberships.points - redemption.points_spent

    if (newPoints < 0) {
      return NextResponse.json({ success: false, error: 'Insufficient points' }, { status: 400 })
    }

    const { error: pointsError } = await supabase
      .from('memberships')
      .update({ points: newPoints })
      .eq('id', redemption.membership_id)

    if (pointsError) {
      console.error('Points deduction error:', pointsError)
      return NextResponse.json(
        { success: false, error: 'Failed to deduct points' },
        { status: 500 },
      )
    }

    // Update redemption to approved
    await supabase
      .from('reward_redemptions')
      .update({
        status: 'approved',
        approved_at: new Date().toISOString(),
        approved_by: umkm.id,
      })
      .eq('id', redemption_id)

    // Mint NFT
    console.log('Minting NFT for reward...')

    try {
      const nftResult = await mintRewardNFT({
        walletAddress: redemption.memberships.wallet_address,
        displayName: redemption.reward_programs.name,
        points: redemption.points_spent,
        transactionId: redemption_id,
        totalAmount: 0,
        metadata: {
          reward_program: redemption.reward_programs.name,
          description: redemption.reward_programs.reward_description,
          redeemed_at: new Date().toISOString(),
        },
      })

      console.log('NFT minted:', nftResult.nftId)

      // Update redemption with NFT info
      await supabase
        .from('reward_redemptions')
        .update({
          status: 'completed',
          nft_id: nftResult.nftId,
          token_id: nftResult.tokenId,
          completed_at: new Date().toISOString(),
        })
        .eq('id', redemption_id)

      return NextResponse.json({
        success: true,
        data: {
          nft_id: nftResult.nftId,
          points_remaining: newPoints,
        },
        message: 'Redemption approved and NFT minted successfully',
      })
    } catch (mintError: any) {
      console.error('NFT minting failed:', mintError)

      // Mark as approved but without NFT
      await supabase
        .from('reward_redemptions')
        .update({
          status: 'approved',
        })
        .eq('id', redemption_id)

      return NextResponse.json(
        {
          success: false,
          error: 'Redemption approved but NFT minting failed. Please retry.',
        },
        { status: 500 },
      )
    }
  } catch (error: any) {
    console.error('Approve redemption error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 },
    )
  }
}
