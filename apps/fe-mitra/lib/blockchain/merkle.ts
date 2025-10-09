import crypto from 'crypto'

export function calculateMerkleRoot(hashes: string[]): string {
  if (hashes.length === 0) return ''
  if (hashes.length === 1) return hashes[0]!

  const newLevel: string[] = []

  for (let i = 0; i < hashes.length; i += 2) {
    if (i + 1 < hashes.length) {
      const combined = hashes[i]! + hashes[i + 1]
      const hash = crypto.createHash('sha256').update(combined).digest('hex')
      newLevel.push(hash)
    } else {
      newLevel.push(hashes[i]!)
    }
  }

  return calculateMerkleRoot(newLevel)
}
