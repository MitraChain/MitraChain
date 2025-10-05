import { NMKRClient } from '@/lib/nmkr/client'
import { createClient } from '@/lib/supabase/server'
import { createHmac } from 'crypto'
import { NextResponse } from 'next/server'

const NMKR_CUSTOMER_ID = parseInt(process.env.NMKR_CUSTOMER_ID || '0')
const NMKR_PASSWORD_PEPPER = process.env.NMKR_PASSWORD_PEPPER || ''

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user already has wallet in database
    const { data: existingWallet, error: checkError } = await supabase
      .from('user_wallets')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()

    if (checkError) {
      console.error('Error checking wallet:', checkError)
    }

    if (existingWallet) {
      console.log('User already has wallet:', existingWallet.wallet_address)
      return NextResponse.json({
        success: true,
        message: 'Wallet already exists',
        data: {
          userId: user.id,
          email: user.email,
          wallet: {
            walletAddress: existingWallet.wallet_address,
            walletName: existingWallet.wallet_name,
            network: existingWallet.network,
          },
        },
      })
    }

    if (!NMKR_CUSTOMER_ID || !NMKR_PASSWORD_PEPPER) {
      console.warn('NMKR not configured, using simulated wallet')

      const simulatedAddress = `addr_test1${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`
      const walletName = `MitraChain_${user.email?.split('@')[0]}_${user.id.slice(0, 8)}`

      const { data: newWallet, error: insertError } = await supabase
        .from('user_wallets')
        .insert({
          user_id: user.id,
          wallet_address: simulatedAddress,
          wallet_name: walletName,
          network: 'preprod',
        })
        .select()
        .single()

      if (insertError) {
        throw new Error(`Failed to save wallet: ${insertError.message}`)
      }

      return NextResponse.json({
        success: true,
        data: {
          userId: user.id,
          email: user.email,
          wallet: {
            walletAddress: newWallet.wallet_address,
            walletName: newWallet.wallet_name,
            network: newWallet.network,
          },
        },
      })
    }

    const walletPassword = createHmac('sha256', NMKR_PASSWORD_PEPPER).update(user.id).digest('hex')

    const nmkr = new NMKRClient()
    const walletName = `MitraChain_${user.email?.split('@')[0]}_${user.id.slice(0, 8)}`

    const walletResponse = await nmkr.createWallet({
      walletPassword: walletPassword,
      enterpriseAddress: false,
      walletName,
    })

    if (!walletResponse || !walletResponse.address) {
      throw new Error('Failed to create wallet via NMKR')
    }

    // Save wallet to database
    const { data: newWallet, error: insertError } = await supabase
      .from('user_wallets')
      .insert({
        user_id: user.id,
        wallet_address: walletResponse.address,
        wallet_name: walletResponse.walletName || walletName,
        network: walletResponse.network || 'preprod',
      })
      .select()
      .single()

    if (insertError) {
      console.error('Insert wallet error:', insertError)
      throw new Error(`Failed to save wallet: ${insertError.message}`)
    }

    return NextResponse.json({
      success: true,
      data: {
        userId: user.id,
        email: user.email,
        wallet: {
          walletAddress: newWallet.wallet_address,
          walletName: newWallet.wallet_name,
          network: newWallet.network,
        },
      },
    })
  } catch (error: any) {
    console.error('Create wallet error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to create wallet',
        details: error.toString(),
      },
      { status: 500 },
    )
  }
}
