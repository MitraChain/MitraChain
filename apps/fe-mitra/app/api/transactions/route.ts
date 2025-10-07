// apps/fe-mitra/app/api/transactions/route.ts
import { snap } from '@/lib/midtrans/client'
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
    const { membership_id, total_amount, cartItems, payment_method, used_vouchers } = body

    if (!membership_id || !total_amount || !cartItems || cartItems.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 },
      )
    }

    if (!['cash', 'qris'].includes(payment_method)) {
      return NextResponse.json({ success: false, error: 'Invalid payment method' }, { status: 400 })
    }

    const { data: membership, error: membershipError } = await supabase
      .from('memberships')
      .select('*, businesses!inner(owner_id, id, name)')
      .eq('id', membership_id)
      .single()

    if (membershipError || !membership) {
      return NextResponse.json({ success: false, error: 'Invalid membership' }, { status: 404 })
    }

    if (membership.businesses.owner_id !== kasir.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized access to membership' },
        { status: 403 },
      )
    }

    const timestamp = Date.now()
    const transactionId =
      payment_method === 'cash'
        ? `CASH-${timestamp}`
        : `QRIS-${timestamp}-${Math.random().toString(36).substr(2, 9)}`

    // Create transaction
    const { data: transaction, error: txError } = await supabase
      .from('transactions')
      .insert({
        membership_id,
        total_amount,
        qris_tx_id: transactionId,
        onchain_proof_hash: '',
        payment_status: payment_method === 'cash' ? 'completed' : 'pending',
        payment_verified_at: payment_method === 'cash' ? new Date().toISOString() : null,
      })
      .select()
      .single()

    if (txError) {
      console.error('Transaction insert error:', txError)
      return NextResponse.json(
        { success: false, error: 'Failed to create transaction' },
        { status: 500 },
      )
    }

    // Create transaction items
    const transactionItems = cartItems.map((item: any) => ({
      transaction_id: transaction.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price_at_purchase: item.price_at_purchase,
    }))

    const { error: itemsError } = await supabase.from('transaction_items').insert(transactionItems)

    if (itemsError) {
      console.error('Transaction items insert error:', itemsError)
      await supabase.from('transactions').delete().eq('id', transaction.id)
      return NextResponse.json(
        { success: false, error: 'Failed to create transaction items' },
        { status: 500 },
      )
    }

    // Handle payment method
    if (payment_method === 'cash') {
      // CASH: Update points immediately
      const earnedPoints = Math.floor(total_amount / 10000)
      const newTotalPoints = (membership.points || 0) + earnedPoints

      await supabase.from('memberships').update({ points: newTotalPoints }).eq('id', membership_id)

      if (used_vouchers && used_vouchers.length > 0) {
        const { error: voucherError } = await supabase
          .from('reward_redemptions')
          .update({
            nft_redeemed: true,
            nft_redeemed_at: new Date().toISOString(),
            redeemed_by: kasir.id,
          })
          .in('id', used_vouchers)

        if (voucherError) {
          console.error('Failed to redeem vouchers:', voucherError)
        } else {
          console.log(`${used_vouchers.length} vouchers redeemed`)
        }
      }

      // ADD TO QUEUE untuk blockchain recording
      const { error: queueError } = await supabase.from('transaction_batch_queue').insert({
        business_id: membership.businesses.id,
        transaction_id: transaction.id,
        is_recorded: false,
      })

      if (queueError) {
        console.error('Failed to add to queue:', queueError)
      }

      // Check batch threshold
      const { count } = await supabase
        .from('transaction_batch_queue')
        .select('*', { count: 'exact', head: true })
        .eq('business_id', membership.businesses.id)
        .eq('is_recorded', false)

      console.log(`Pending transactions in queue: ${count}`)

      if (count && count >= 10) {
        console.log('Batch threshold reached, triggering blockchain recording...')

        // Trigger batch recording
        fetch(
          `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}/api/cron/record-batches`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${process.env.CRON_SECRET}`,
              'Content-Type': 'application/json',
            },
          },
        )
          .then(() => console.log('Blockchain batch recording triggered'))
          .catch((err) => console.error('Failed to trigger batch recording:', err))
      }

      return NextResponse.json({
        success: true,
        data: {
          transaction,
          payment_method: 'cash',
          requires_payment: false,
          earned_points: earnedPoints,
          total_points: newTotalPoints,
        },
      })
    } else {
      // QRIS: Create Midtrans token
      try {
        const parameter = {
          transaction_details: {
            order_id: transactionId,
            gross_amount: total_amount,
          },
          customer_details: {
            email: kasir.email || 'customer@example.com',
          },
          enabled_payments: [
            'credit_card',
            'bca_va',
            'bni_va',
            'bri_va',
            'echannel',
            'gopay',
            'shopeepay',
            'qris',
          ],
          callbacks: {
            finish: 'https://uncognized-aiden-lumberly.ngrok-free.dev/create-transaction',
          },
        }

        const midtransTransaction = await snap.createTransaction(parameter)

        return NextResponse.json({
          success: true,
          data: {
            transaction,
            payment_method: 'qris',
            requires_payment: true,
            payment_token: midtransTransaction.token,
            payment_url: midtransTransaction.redirect_url,
          },
        })
      } catch (midtransError: any) {
        console.error('Midtrans error:', midtransError)
        await supabase.from('transactions').delete().eq('id', transaction.id)
        return NextResponse.json(
          { success: false, error: 'Failed to create payment token' },
          { status: 500 },
        )
      }
    }
  } catch (error: any) {
    console.error('Create transaction error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 },
    )
  }
}
