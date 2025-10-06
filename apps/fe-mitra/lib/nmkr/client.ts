// apps/fe-mitra/lib/nmkr/client.ts
interface MintNFTParams {
  walletAddress: string
  displayName: string
  points: number
  transactionId: string
  metadata?: Record<string, any>
}

export async function mintRewardNFT(params: MintNFTParams) {
  const { walletAddress, displayName, points, transactionId, metadata } = params

  try {
    const response = await fetch(
      `${process.env.NMKR_PROJECT_ID}/v2/UploadNft/${process.env.NMKR_CUSTOMER_ID}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.NMKR_API_KEY}`,
        },
        body: JSON.stringify({
          assetName: `MitraChain-${points}pts-${transactionId.slice(0, 8)}`,
          displayname: displayName,
          previewImageNft: {
            mimetype: 'image/png',
            fileFromBase64: '', // TODO: Add base64 image atau URL
          },
          metadata: {
            points: points,
            transaction_id: transactionId,
            timestamp: new Date().toISOString(),
            ...metadata,
          },
          receiveraddress: walletAddress,
          // Untuk testing, set price 0
          priceInLovelace: 0,
        }),
      },
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Failed to mint NFT')
    }

    return {
      success: true,
      nftId: data.nftId,
      tokenId: data.tokenId,
    }
  } catch (error: any) {
    console.error('NMKR mint error:', error)
    throw error
  }
}
