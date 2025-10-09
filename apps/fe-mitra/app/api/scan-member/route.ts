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

    if (!qr_data || typeof qr_data !== 'string') {
      return NextResponse.json(
        { success: false, error: 'QR data (user_id) required' },
        { status: 400 },
      )
    }

    // Validasi user_id sebagai UUID v4
    const uuidRegex =
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/
    if (!uuidRegex.test(qr_data)) {
      return NextResponse.json({ success: false, error: 'Invalid user_id format' }, { status: 400 })
    }

    const user_id = qr_data

    // Temukan bisnis milik kasir
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

    // Cek apakah member sudah ada
    const { data: existingMembership, error: checkError } = await supabase
      .from('memberships')
      .select('*')
      .eq('user_id', user_id)
      .eq('business_id', business.id)
      .maybeSingle()

    if (checkError) {
      console.error('Check membership error:', checkError)
    }

    let membershipData = existingMembership

    // Jika belum ada, daftarkan otomatis
    if (!existingMembership) {
      const { data: newMembership, error: insertError } = await supabase
        .from('memberships')
        .insert({
          user_id,
          business_id: business.id,
          wallet_address: '',
          nft_id: '',
          points: 0,
        })
        .select()
        .single()

      if (insertError) {
        console.error('Insert membership error:', insertError)
        return NextResponse.json(
          { success: false, error: `Failed to create membership: ${insertError.message}` },
          { status: 500 },
        )
      }

      membershipData = newMembership
    }

    // Ambil voucher NFT yang belum di-redeem
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

    const formattedVouchers =
      nftVouchers?.map((voucher) => {
        const rewardProgram = Array.isArray(voucher.reward_programs)
          ? voucher.reward_programs[0]
          : voucher.reward_programs

        return {
          id: voucher.id,
          nft_id: voucher.nft_id,
          nft_redeemed: voucher.nft_redeemed,
          reward_program_id: voucher.reward_program_id,
          reward_program_name: rewardProgram?.name || 'Unknown',
          reward_program_type: rewardProgram?.type || 'point',
          reward_threshold: rewardProgram?.threshold || 0,
          reward_description: rewardProgram?.reward_description || '',
        }
      }) || []

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
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 },
    )
  }
}
