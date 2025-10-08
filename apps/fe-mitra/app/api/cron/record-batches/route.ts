import { calculateMerkleRoot } from '@/lib/blockchain/merkle'
import plutusJson from '@/lib/blockchain/plutus.json'
import { Crypto } from '@peculiar/webcrypto'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'
import { NextResponse } from 'next/server'
import fetch from 'node-fetch'

interface Membership {
  wallet_address: string
}

interface Transaction {
  id: string
  total_amount: number
  created_at: string
  payment_status: string
  memberships: Membership[]
}

interface BatchQueue {
  id: string
  transaction_id: string
  transactions: Transaction
}

if (typeof globalThis.crypto === 'undefined') globalThis.crypto = new Crypto() as any
if (typeof globalThis.fetch === 'undefined') globalThis.fetch = fetch as any

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

function safeMetadataString(value: string | undefined | null, maxBytes = 64): string {
  if (!value) return ''
  const encoder = new TextEncoder()
  const bytes = encoder.encode(value)
  if (bytes.length <= maxBytes) return value
  const hash = crypto.createHash('sha1').update(value).digest('hex')
  return hash.substring(0, Math.min(hash.length, maxBytes))
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } },
    )

    const { data: businesses } = await supabase
      .from('businesses')
      .select('id, name, wallet_address, wallet_seed_phrase')
      .not('wallet_address', 'is', null)
      .not('wallet_seed_phrase', 'is', null)

    if (!businesses || businesses.length === 0) {
      return NextResponse.json({ success: true, message: 'No businesses to process' })
    }

    const results = []

    for (const business of businesses) {
      try {
        // Ambil queue per business
        const { data: pendingTxs, error: fetchError } = await supabase
          .from('transaction_batch_queue')
          .select(
            `
    id,
    transaction_id,
    transactions!inner(
      id,
      total_amount,
      created_at,
      payment_status,
      memberships!inner(wallet_address)
    )
  `,
          )
          .eq('business_id', business.id)
          .eq('is_recorded', false)
          .limit(10)
          .overrideTypes<BatchQueue[], { merge: false }>()

        if (fetchError || !pendingTxs || pendingTxs.length < 10) {
          continue
        }

        const txHashes = pendingTxs.map((tx) =>
          crypto.createHash('sha256').update(tx.transaction_id).digest('hex'),
        )
        const merkleRoot = calculateMerkleRoot(txHashes)

        const { count: batchCount } = await supabase
          .from('blockchain_batches')
          .select('*', { count: 'exact', head: true })
          .eq('business_id', business.id)

        const batchNumber = (batchCount || 0) + 1

        const txRecords = pendingTxs.map((tx) => {
          const transaction = tx.transactions
          const membership = Array.isArray(transaction.memberships)
            ? transaction.memberships[0]
            : transaction.memberships

          return {
            tx_id: tx.transaction_id,
            amount: transaction.total_amount || 0,
            timestamp: new Date(transaction.created_at || Date.now()).toISOString(),
            customer_wallet: membership?.wallet_address || 'unknown',
          }
        })

        const totalAmount = txRecords.reduce((sum, tx) => sum + tx.amount, 0)

        // Submit ke Cardano
        const txHash = await submitToCardano({
          business,
          batchNumber,
          txRecords,
          merkleRoot,
          totalAmount,
        })

        // Simpan ke blockchain_batches
        const batchId = crypto.randomUUID()
        await supabase.from('blockchain_batches').insert({
          id: batchId,
          business_id: business.id,
          transaction_count: pendingTxs.length,
          total_amount: totalAmount,
          transaction_ids: pendingTxs.map((t) => t.transaction_id),
          merkle_root: merkleRoot,
          onchain_tx_hash: txHash,
          recorded_at: new Date().toISOString(),
          batch_number: batchNumber,
        })

        const transactionIds = pendingTxs.map((tx) => tx.transaction_id)
        const queueIds = pendingTxs.map((tx) => tx.id)

        // ✅ Update semua transaksi dengan onchain_proof_hash
        await supabase
          .from('transactions')
          .update({ onchain_proof_hash: txHash })
          .in('id', transactionIds)

        // ✅ Hapus queue agar tidak menumpuk
        await supabase.from('transaction_batch_queue').delete().in('id', queueIds)

        results.push({
          business_id: business.id,
          business_name: business.name,
          batch_id: batchId,
          batch_number: batchNumber,
          tx_count: pendingTxs.length,
          total_amount: totalAmount,
          cardano_tx: txHash,
          explorer_url: `https://preprod.cardanoscan.io/transaction/${txHash}`,
          success: true,
        })
      } catch (error: any) {
        console.error(`Failed for ${business.name}:`, error)
        results.push({
          business_id: business.id,
          business_name: business.name,
          success: false,
          error: error.message,
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${results.length} businesses`,
      results,
    })
  } catch (error: any) {
    console.error('Cron error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

async function submitToCardano(data: {
  business: any
  batchNumber: number
  txRecords: any[]
  merkleRoot: string
  totalAmount: number
}) {
  const { business, batchNumber, txRecords, merkleRoot, totalAmount } = data

  const { Blockfrost, Lucid } = await import('lucid-cardano')
  const blockfrost = new Blockfrost(
    'https://cardano-preprod.blockfrost.io/api/v0',
    process.env.BLOCKFROST_PROJECT_ID!,
  )

  const lucid = await Lucid.new(blockfrost, 'Preprod')
  lucid.selectWalletFromSeed(business.wallet_seed_phrase)

  const batchMetadata = {
    protocol: 'MitraChain-v1.0',
    type: 'transaction_batch',
    business: {
      id: safeMetadataString(business.id),
      name: safeMetadataString(business.name),
      wallet: safeMetadataString(business.wallet_address),
    },
    batch: {
      number: batchNumber,
      transaction_count: txRecords.length,
      total_amount: totalAmount,
      merkle_root: safeMetadataString(merkleRoot),
      recorded_at: new Date().toISOString(),
    },
    transactions: txRecords.map((tx) => ({
      id: safeMetadataString(tx.tx_id.substring(0, 16)),
      amount: tx.amount,
    })),
    validation: {
      validator_hash: safeMetadataString(plutusJson.validators[0]!.hash),
      plutus_version: 'v3',
    },
  }

  const tx = await lucid.newTx().attachMetadata(674, batchMetadata).complete()
  const signedTx = await tx.sign().complete()
  const txHash = await signedTx.submit()

  return txHash
}
