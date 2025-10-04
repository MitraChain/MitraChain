// lib/nmkr/client.ts
const NMKR_API_KEY = process.env.NMKR_API_KEY!
const NMKR_API_URL = process.env.NMKR_API_URL || 'https://studio-api.preprod.nmkr.io'

interface CreateWalletResponse {
  address: string
  adressType: string
  network: string
  walletName: string
  seedPhrase?: string
  pkh: string
}

export class NMKRClient {
  private apiKey: string
  private baseUrl: string

  constructor() {
    this.apiKey = NMKR_API_KEY
    this.baseUrl = NMKR_API_URL
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`
    console.log('NMKR Request:', options.method || 'GET', url)

    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
        ...options.headers,
      },
    })

    const responseText = await response.text()
    console.log('NMKR Response:', response.status, responseText)

    if (!response.ok) {
      throw new Error(`NMKR API Error: ${response.status} - ${responseText}`)
    }

    return responseText ? JSON.parse(responseText) : {}
  }

  // Create managed wallet - customerid MUST be integer
  async createWallet(params: {
    walletPassword?: string
    enterpriseAddress?: boolean
    walletName: string
  }): Promise<CreateWalletResponse> {
    const customerId = process.env.NMKR_CUSTOMER_ID
    const { walletPassword = '', enterpriseAddress = false, walletName } = params

    // POST /v2/CreateWallet/{customerid} with JSON body
    return this.request(`/v2/CreateWallet/${customerId}`, {
      method: 'POST',
      body: JSON.stringify({
        walletpassword: walletPassword,
        enterpriseaddress: enterpriseAddress,
        walletname: walletName,
      }),
    })
  }

  // List wallets - customerId is integer
  async listWallets(customerId: number) {
    return this.request(`/v2/ListAllWallets/${customerId}`)
  }
}
