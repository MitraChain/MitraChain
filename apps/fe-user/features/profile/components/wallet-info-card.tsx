'use client'

import { Button } from '@workspace/ui/components/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card'
import { Copy } from 'lucide-react'
import { toast } from 'sonner'

interface WalletInfoCardProps {
  walletAddress: string
}

export function WalletInfoCard({ walletAddress }: WalletInfoCardProps) {
  const handleCopy = async () => {
    if (!walletAddress) return
    await navigator.clipboard.writeText(walletAddress)
    toast.success('Wallet address copied to clipboard!')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Wallet Cardano</CardTitle>
        <CardDescription>Your wallet address in cardano blockchain</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="mb-2 text-sm font-medium">Wallet Address:</p>
          <div className="flex items-center gap-2">
            <code className="bg-muted flex-1 overflow-x-auto rounded p-2 text-xs">
              {walletAddress || 'Loading...'}
            </code>
            <Button variant="ghost" size="icon" onClick={handleCopy} disabled={!walletAddress}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="border-t pt-4">
          <p className="text-muted-foreground text-sm">
            This wallet is used to store NFT loyalty cards from various businesses.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
