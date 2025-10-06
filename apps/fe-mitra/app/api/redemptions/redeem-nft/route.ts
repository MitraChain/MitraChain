// apps/fe-mitra/app/api/redemptions/redeem-nft/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user: kasir },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !kasir) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { redemption_id } = body

    if (!redemption_id) {
      return NextResponse.json({ success: false, error: 'Redemption ID required' }, { status: 400 })
    }

    // Get redemption with relations
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

    // Verify kasir owns this business
    if (redemption.memberships.businesses.owner_id !== kasir.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized to redeem this NFT' },
        { status: 403 },
      )
    }

    // Check if NFT already redeemed
    if (redemption.nft_redeemed) {
      return NextResponse.json(
        {
          success: false,
          error: 'NFT already redeemed',
          redeemed_at: redemption.nft_redeemed_at,
        },
        { status: 400 },
      )
    }

    // Check if redemption completed (NFT already minted)
    if (redemption.status !== 'completed' || !redemption.nft_id) {
      return NextResponse.json(
        { success: false, error: 'NFT not yet minted or redemption not completed' },
        { status: 400 },
      )
    }

    // Mark NFT as redeemed
    const { error: updateError } = await supabase
      .from('reward_redemptions')
      .update({
        nft_redeemed: true,
        nft_redeemed_at: new Date().toISOString(),
        redeemed_by: kasir.id,
      })
      .eq('id', redemption_id)

    if (updateError) {
      console.error('Failed to mark NFT as redeemed:', updateError)
      return NextResponse.json({ success: false, error: 'Failed to redeem NFT' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'NFT redeemed successfully. Customer can receive their reward.',
      data: {
        reward_name: redemption.reward_programs.name,
        reward_description: redemption.reward_programs.reward_description,
      },
    })
  } catch (error: any) {
    console.error('Redeem NFT error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 },
    )
  }
}
