// apps/fe-mitra/lib/nmkr/client.ts
interface MintNFTParams {
  walletAddress: string
  displayName: string
  points: number
  transactionId: string
  totalAmount: number
  metadata?: Record<string, any>
}

interface MintNFTResponse {
  success: boolean
  nftId: string
  tokenId?: string
}

// Simple 1x1 PNG placeholder (tiny blue square)
// Untuk production, ganti dengan design NFT yang benar
const PLACEHOLDER_PNG_BASE64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='

export async function mintRewardNFT(params: MintNFTParams): Promise<MintNFTResponse> {
  const { walletAddress, displayName, points, transactionId, totalAmount, metadata } = params

  try {
    const shortTx = transactionId.slice(0, 6)
    const timestamp = Date.now().toString(36)
    const uniqueSuffix = `${shortTx}_${timestamp}`

    const assetName = `MitraChain_${points}pts_${uniqueSuffix}`
    const tokenName = `MitraChain${points}pts_${uniqueSuffix}`

    const payload = {
      assetName,
      tokenname: tokenName,
      displayname: displayName,
      previewImageNft: {
        mimetype: 'image/png',
        fileFromBase64: PLACEHOLDER_PNG_BASE64,
      },
      metadata: {
        name: displayName,
        description: `Reward NFT for ${points} points earned from MitraChain`,
        image: 'ipfs://{CID}',
        points: points,
        transaction_id: transactionId,
        total_amount: totalAmount,
        timestamp: new Date().toISOString(),
        ...metadata,
      },
      receiveraddress: walletAddress,
      priceInLovelace: 5500000,
    }

    console.log(
      'NMKR Request URL:',
      `${process.env.NMKR_PROJECT_ID}/v2/UploadNft/${process.env.NMKR_PROJECT_UID}`,
    )

    const response = await fetch(
      `${process.env.NMKR_PROJECT_ID}/v2/UploadNft/${process.env.NMKR_PROJECT_UID}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.NMKR_API_KEY}`,
        },
        body: JSON.stringify(payload),
      },
    )

    const data = await response.json()

    console.log('NMKR Response Status:', response.status)
    console.log('NMKR Response Data:', JSON.stringify(data, null, 2))

    if (!response.ok) {
      throw new Error(
        data.errorMessage || data.error || data.message || `NMKR API error: ${response.status}`,
      )
    }

    return {
      success: true,
      nftId: data.nftId || data.nftUid,
      tokenId: data.tokenId,
    }
  } catch (error: any) {
    console.error('NMKR mint error details:', error)
    throw error
  }
}
