import { Card, CardContent } from '@workspace/ui/components/card'

export default function TransactionHistoryPage() {
  return (
    <div className="p-4 md:p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Transaction History</h1>
        <p className="text-muted-foreground mt-1">A record of your recent activity.</p>
      </header>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="font-semibold">Purchase at Business {i}</p>
                <p className="text-muted-foreground text-sm">October {i + 5}, 2025</p>
              </div>
              <p className="font-semibold text-green-500">+1 Stamp</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
