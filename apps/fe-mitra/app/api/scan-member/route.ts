import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // Get kasir (business owner) yang login
    const {
      data: { user: kasir },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !kasir) {
      console.error('Auth error:', authError)
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    console.log('Kasir ID:', kasir.id) // Debug log

    // Get QR data dari request body
    const body = await request.json()
    const { qr_data } = body

    if (!qr_data) {
      return NextResponse.json({ success: false, error: 'QR data required' }, { status: 400 })
    }

    // Parse QR data
    let qrPayload
    try {
      qrPayload = JSON.parse(qr_data)
    } catch (e) {
      console.error('QR parse error:', e)
      return NextResponse.json({ success: false, error: 'Invalid QR format' }, { status: 400 })
    }

    console.log('QR Payload:', qrPayload) // Debug log

    // Validate QR type
    if (qrPayload.type !== 'mitrachain_member') {
      return NextResponse.json({ success: false, error: 'Invalid QR type' }, { status: 400 })
    }

    // Get business milik kasir
    const { data: business, error: businessError } = await supabase
      .from('businesses')
      .select('id, name')
      .eq('owner_id', kasir.id)
      .single()

    if (businessError) {
      console.error('Business error:', businessError)
      return NextResponse.json(
        {
          success: false,
          error: 'Business not found. Please create a business first.',
        },
        { status: 404 },
      )
    }

    if (!business) {
      return NextResponse.json(
        {
          success: false,
          error: 'No business found for this user',
        },
        { status: 404 },
      )
    }

    console.log('Business ID:', business.id) // Debug log

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

    if (existingMembership) {
      console.log('Existing membership found')
      return NextResponse.json({
        success: true,
        message: 'Member already exists',
        data: {
          membership: existingMembership,
          is_new_member: false,
        },
      })
    }

    // Auto register member baru
    console.log('Creating new membership...') // Debug log

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

    console.log('New membership created:', newMembership)

    return NextResponse.json({
      success: true,
      message: 'New member registered',
      data: {
        membership: newMembership,
        is_new_member: true,
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
