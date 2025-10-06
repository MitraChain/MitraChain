// apps/fe-mitra/lib/blockchain/cardano.ts
import crypto from 'crypto'

interface BatchTransaction {
  id: string
  qris_tx_id: string
  total_amount: number
  created_at: string
}

interface RecordBatchParams {
  businessId: string
  transactions: BatchTransaction[]
}

// Generate Merkle Root dari transaksi
function generateMerkleRoot(transactions: BatchTransaction[]): string {
  const hashes = transactions.map((tx) => {
    const data = `${tx.id}${tx.qris_tx_id}${tx.total_amount}${tx.created_at}`
    return crypto.createHash('sha256').update(data).digest('hex')
  })

  // Simple merkle root: hash of all hashes combined
  const combined = hashes.join('')
  return crypto.createHash('sha256').update(combined).digest('hex')
}

// TODO: Implement actual Cardano transaction
// Untuk MVP, kita simulate dulu
export async function recordBatchToBlockchain(
  params: RecordBatchParams,
): Promise<{ success: boolean; txHash: string; merkleRoot: string }> {
  const { businessId, transactions } = params

  console.log(`Recording batch for business ${businessId}`)
  console.log(`Transaction count: ${transactions.length}`)

  // Generate merkle root
  const merkleRoot = generateMerkleRoot(transactions)
  console.log(`Merkle root: ${merkleRoot}`)

  // TODO: Actual Cardano transaction menggunakan Aiken/Mesh
  // Untuk sekarang, simulate dengan delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Simulate transaction hash
  const txHash = `cardano_tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  console.log(`Blockchain tx hash: ${txHash}`)

  return {
    success: true,
    txHash,
    merkleRoot,
  }
}
