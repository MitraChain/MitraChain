export async function submitMetadataToCardano(data: {
  seedPhrase: string
  metadata: any
}): Promise<string> {
  const { seedPhrase, metadata } = data

  const txHash = `mock_tx_${Date.now()}`

  console.log('Metadata to submit:', metadata)

  return txHash
}
