// apps/fe-mitra/app/api/midtrans-notification/route.ts
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  console.log('========== WEBHOOK START ==========')

  try {
    const body = await request.json()

    // Verify signature
    const serverKey = process.env.MIDTRANS_SERVER_KEY || ''
    const signatureKey = body.signature_key
    const orderId = body.order_id
    const statusCode = body.status_code
    const grossAmount = body.gross_amount

    const mySignatureKey = crypto
      .createHash('sha512')
      .update(`${orderId}${statusCode}${grossAmount}${serverKey}`)
      .digest('hex')

    if (signatureKey !== mySignatureKey) {
      console.error('Invalid signature')
      return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 403 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    )

    const transactionStatus = body.transaction_status
    const fraudStatus = body.fraud_status

    let paymentSuccess = false

    if (transactionStatus === 'capture') {
      paymentSuccess = fraudStatus === 'accept'
    } else if (transactionStatus === 'settlement') {
      paymentSuccess = true
    }

    const { data: transaction, error: txError } = await supabase
      .from('transactions')
      .select('*, memberships(id, wallet_address, user_id, business_id, points)')
      .eq('qris_tx_id', orderId)
      .single()

    if (txError || !transaction) {
      console.error('Transaction not found:', orderId)
      return NextResponse.json({ success: false, error: 'Transaction not found' }, { status: 404 })
    }

    if (paymentSuccess) {
      console.log('Payment successful for:', orderId)

      // Calculate points: Rp 10.000 = 1 poin
      const earnedPoints = Math.floor(transaction.total_amount / 10000)
      const newTotalPoints = (transaction.memberships.points || 0) + earnedPoints

      console.log(`Points earned: ${earnedPoints}, New total: ${newTotalPoints}`)

      // Update membership points
      const { error: updateMemberError } = await supabase
        .from('memberships')
        .update({
          points: newTotalPoints,
        })
        .eq('id', transaction.membership_id)

      if (updateMemberError) {
        console.error('Failed to update points:', updateMemberError)
        return NextResponse.json(
          { success: false, error: 'Failed to update points' },
          { status: 500 },
        )
      }

      // Update transaction status
      await supabase
        .from('transactions')
        .update({
          payment_status: 'completed',
          payment_verified_at: new Date().toISOString(),
        })
        .eq('id', transaction.id)

      // Add to batch queue untuk blockchain recording
      const { error: queueError } = await supabase.from('transaction_batch_queue').insert({
        business_id: transaction.memberships.business_id,
        transaction_id: transaction.id,
        is_recorded: false,
      })

      if (queueError) {
        console.error('Failed to add to queue:', queueError)
        // Don't fail the whole process, just log
      } else {
        console.log('Transaction added to batch queue')
      }

      // Check if we should trigger batch recording (every 10 transactions)
      const { count } = await supabase
        .from('transaction_batch_queue')
        .select('*', { count: 'exact', head: true })
        .eq('business_id', transaction.memberships.business_id)
        .eq('is_recorded', false)

      console.log(`Pending transactions for batch: ${count}`)

      if (count && count >= 10) {
        console.log('Batch threshold reached, triggering blockchain recording...')
        // TODO: Trigger cron job atau call API untuk record ke blockchain
        // Untuk sekarang, just log
      }

      console.log('Transaction completed, points updated')
    }

    console.log('========== WEBHOOK SUCCESS ==========')
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Webhook error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
