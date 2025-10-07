// apps/fe-mitra/app/api/scan-member/route.ts
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
      console.error('Auth error:', authError)
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { qr_data } = body

    if (!qr_data) {
      return NextResponse.json({ success: false, error: 'QR data required' }, { status: 400 })
    }

    let qrPayload
    try {
      qrPayload = JSON.parse(qr_data)
    } catch (e) {
      console.error('QR parse error:', e)
      return NextResponse.json({ success: false, error: 'Invalid QR format' }, { status: 400 })
    }

    if (qrPayload.type !== 'mitrachain_member') {
      return NextResponse.json({ success: false, error: 'Invalid QR type' }, { status: 400 })
    }

    const { data: business, error: businessError } = await supabase
      .from('businesses')
      .select('id, name')
      .eq('owner_id', kasir.id)
      .single()

    if (businessError || !business) {
      return NextResponse.json(
        {
          success: false,
          error: 'Business not found. Please create a business first.',
        },
        { status: 404 },
      )
    }

    // Check membership existing
    const { data: existingMembership, error: checkError } = await supabase
      .from('memberships')
      .select('*')
      .eq('user_id', qrPayload.user_id)
      .eq('business_id', business.id)
      .maybeSingle()

    if (checkError) {
      console.error('Check membership error:', checkError)
    }

    let membershipData = existingMembership

    if (!existingMembership) {
      // Auto register member baru
      const { data: newMembership, error: insertError } = await supabase
        .from('memberships')
        .insert({
          user_id: qrPayload.user_id,
          business_id: business.id,
          wallet_address: qrPayload.wallet_address,
          nft_id: '',
          points: 0,
          stamps: 0,
        })
        .select()
        .single()

      if (insertError) {
        console.error('Insert membership error:', insertError)
        return NextResponse.json(
          {
            success: false,
            error: `Failed to create membership: ${insertError.message}`,
          },
          { status: 500 },
        )
      }

      membershipData = newMembership
    }

    // Fetch NFT vouchers (completed redemptions yang belum di-redeem)
    const { data: nftVouchers, error: vouchersError } = await supabase
      .from('reward_redemptions')
      .select(
        `
    id,
    nft_id,
    nft_redeemed,
    reward_program_id,
    reward_programs (
      id,
      name,
      type,
      threshold,
      reward_description
    )
  `,
      )
      .eq('membership_id', membershipData.id)
      .eq('status', 'completed')
      .eq('nft_redeemed', false)
      .order('created_at', { ascending: false })

    if (vouchersError) {
      console.error('Error fetching vouchers:', vouchersError)
    }

    console.log(nftVouchers)

    // Format vouchers data
    const formattedVouchers =
      nftVouchers?.map((voucher) => ({
        id: voucher.id,
        nft_id: voucher.nft_id,
        nft_redeemed: voucher.nft_redeemed,
        reward_program_id: voucher.reward_program_id,
        reward_program_name: voucher.reward_programs?.name || 'Unknown',
        reward_program_type: voucher.reward_programs?.type || 'point',
        reward_threshold: voucher.reward_programs?.threshold || 0,
        reward_description: voucher.reward_programs?.reward_description || '',
      })) || []

    return NextResponse.json({
      success: true,
      message: existingMembership ? 'Member already exists' : 'New member registered',
      data: {
        membership: {
          ...membershipData,
          nft_vouchers: formattedVouchers,
        },
        is_new_member: !existingMembership,
        business_name: business.name,
      },
    })
  } catch (error: any) {
    console.error('Scan member error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error',
      },
      { status: 500 },
    )
  }
}
