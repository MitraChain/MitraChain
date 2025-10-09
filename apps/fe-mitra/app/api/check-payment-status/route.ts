// apps/fe-mitra/app/api/check-payment-status/route.ts
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { order_id } = await req.json()

    // Cek status transaksi dari Midtrans
    const response = await fetch(`https://api.midtrans.com/v2/${order_id}/status`, {
      headers: {
        Authorization: `Basic ${Buffer.from(process.env.MIDTRANS_SERVER_KEY + ':').toString('base64')}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Midtrans status check failed: ${response.status}`)
    }

    const result = await response.json()
    const transactionStatus = result.transaction_status

    console.log(`ℹ️ Checking payment status for ${order_id}: ${transactionStatus}`)

    const is_paid =
      transactionStatus === 'settlement' ||
      transactionStatus === 'capture' ||
      transactionStatus === 'success'

    return NextResponse.json({ success: true, is_paid, status: transactionStatus })
  } catch (error: any) {
    console.error('Check payment error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
