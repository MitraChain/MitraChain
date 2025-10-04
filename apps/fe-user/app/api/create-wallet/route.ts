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

    if (!NMKR_CUSTOMER_ID || !NMKR_PASSWORD_PEPPER) {
      throw new Error(
        'Konfigurasi server tidak lengkap (NMKR_CUSTOMER_ID atau NMKR_PASSWORD_PEPPER belum di-set)',
      )
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

    return NextResponse.json({
      success: true,
      data: {
        userId: user.id,
        email: user.email,
        wallet: {
          walletAddress: walletResponse.address,
        },
      },
    })
  } catch (error: any) {
    console.error('Create wallet error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
