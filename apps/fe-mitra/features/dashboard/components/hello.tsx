'use client'

import { useGetUser } from '@/features/auth/api/get-user'

const Dashboard = () => {
  useGetUser()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-foreground text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome to MitraChain Admin Portal</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="border-border bg-card rounded-lg border p-6">
          <div className="text-muted-foreground text-sm font-medium">Total Sales</div>
          <div className="text-card-foreground mt-2 text-2xl font-bold">$0.00</div>
          <p className="text-muted-foreground mt-1 text-xs">Placeholder data</p>
        </div>

        <div className="border-border bg-card rounded-lg border p-6">
          <div className="text-muted-foreground text-sm font-medium">Products</div>
          <div className="text-card-foreground mt-2 text-2xl font-bold">0</div>
          <p className="text-muted-foreground mt-1 text-xs">Active products</p>
        </div>

        <div className="border-border bg-card rounded-lg border p-6">
          <div className="text-muted-foreground text-sm font-medium">Transactions</div>
          <div className="text-card-foreground mt-2 text-2xl font-bold">0</div>
          <p className="text-muted-foreground mt-1 text-xs">This month</p>
        </div>

        <div className="border-border bg-card rounded-lg border p-6">
          <div className="text-muted-foreground text-sm font-medium">Loyalty Members</div>
          <div className="text-card-foreground mt-2 text-2xl font-bold">0</div>
          <p className="text-muted-foreground mt-1 text-xs">Active members</p>
        </div>
      </div>

      <div className="border-border bg-card rounded-lg border p-6">
        <h2 className="text-card-foreground mb-4 text-lg font-semibold">Top Selling Products</h2>
        <p className="text-muted-foreground text-sm">No data available yet</p>
      </div>
    </div>
  )
}

export default Dashboard
