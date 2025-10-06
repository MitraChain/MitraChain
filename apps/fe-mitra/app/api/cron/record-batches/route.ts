// apps/fe-mitra/app/api/cron/record-batches/route.ts
import { recordBatchToBlockchain } from '@/lib/blockchain/cardano'
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// PENTING: Protect endpoint ini dengan secret key
export async function POST(request: Request) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET || 'your-secret-key'

    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
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

    console.log('========== CRON JOB: Record Batches ==========')

    // Get businesses dengan >= 10 pending transactions
    const { data: businessesWithPending, error: queryError } = await supabase.rpc(
      'get_businesses_ready_for_batch',
    )

    if (queryError) {
      console.error('Query error:', queryError)
      return NextResponse.json({ success: false, error: queryError.message }, { status: 500 })
    }

    if (!businessesWithPending || businessesWithPending.length === 0) {
      console.log('No businesses ready for batch recording')
      return NextResponse.json({ success: true, message: 'No batches to process' })
    }

    const results = []

    // Process each business
    for (const business of businessesWithPending) {
      try {
        console.log(`\nProcessing business: ${business.business_id}`)

        // Get pending transactions (limit 10 per batch)
        const { data: queueItems, error: queueError } = await supabase
          .from('transaction_batch_queue')
          .select('id, transaction_id, transactions(*)')
          .eq('business_id', business.business_id)
          .eq('is_recorded', false)
          .limit(10)

        if (queueError || !queueItems || queueItems.length === 0) {
          console.log(`No transactions found for ${business.business_id}`)
          continue
        }

        const transactions = queueItems.map((item: any) => item.transactions)
        const transactionIds = transactions.map((tx: any) => tx.id)

        console.log(`Found ${transactions.length} transactions to record`)

        // Record to blockchain
        const blockchainResult = await recordBatchToBlockchain({
          businessId: business.business_id,
          transactions,
        })

        // Create batch record
        const { data: batch, error: batchError } = await supabase
          .from('blockchain_batches')
          .insert({
            business_id: business.business_id,
            transaction_count: transactions.length,
            total_amount: transactions.reduce((sum: number, tx: any) => sum + tx.total_amount, 0),
            transaction_ids: transactionIds,
            merkle_root: blockchainResult.merkleRoot,
            onchain_tx_hash: blockchainResult.txHash,
          })
          .select()
          .single()

        if (batchError) {
          console.error('Failed to create batch record:', batchError)
          continue
        }

        // Update queue items
        const { error: updateError } = await supabase
          .from('transaction_batch_queue')
          .update({
            is_recorded: true,
            batch_id: batch.id,
          })
          .in(
            'id',
            queueItems.map((item) => item.id),
          )

        if (updateError) {
          console.error('Failed to update queue:', updateError)
        }

        // Update transactions with blockchain hash
        await supabase
          .from('transactions')
          .update({
            onchain_proof_hash: blockchainResult.txHash,
          })
          .in('id', transactionIds)

        results.push({
          business_id: business.business_id,
          transaction_count: transactions.length,
          tx_hash: blockchainResult.txHash,
        })

        console.log(`✓ Batch recorded successfully`)
      } catch (error: any) {
        console.error(`Error processing business ${business.business_id}:`, error)
        results.push({
          business_id: business.business_id,
          error: error.message,
        })
      }
    }

    console.log('========== CRON JOB COMPLETED ==========')

    return NextResponse.json({
      success: true,
      batches_processed: results.length,
      results,
    })
  } catch (error: any) {
    console.error('Cron job error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
