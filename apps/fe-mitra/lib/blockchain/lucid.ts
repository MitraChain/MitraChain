import { Blockfrost, Lucid } from 'lucid-cardano'

export async function initLucid(seedPhrase: string) {
  try {
    const blockfrost = new Blockfrost(
      process.env.CARDANO_NETWORK === 'mainnet'
        ? 'https://cardano-mainnet.blockfrost.io/api/v0'
        : 'https://cardano-preprod.blockfrost.io/api/v0',
      process.env.BLOCKFROST_PROJECT_ID!,
    )

    const lucid = await Lucid.new(blockfrost, 'Preprod')

    lucid.selectWalletFromSeed(seedPhrase)

    return lucid
  } catch (error) {
    console.error('Failed to initialize Lucid:', error)
    throw error
  }
}
