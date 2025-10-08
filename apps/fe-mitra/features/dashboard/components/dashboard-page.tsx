'use client'

import { transformNumberToRupiahMask } from '@workspace/lib/maskito'
import { Activity, DollarSign, Package, Users } from 'lucide-react'
import { useGetDashboardStats } from '../api/get-dashboard-stats'
import { StatCard, StatCardSkeleton } from './stat-card'

export default function DashboardPage() {
  const { data: stats, isPending } = useGetDashboardStats()

  if (isPending) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>
    )
  }

  if (!stats && !isPending) {
    return <p className="text-muted-foreground">Could not load dashboard stats.</p>
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Sales (This Month)"
        value={transformNumberToRupiahMask(stats.total_sales_this_month)}
        description="Total revenue generated this month"
        icon={<DollarSign className="text-muted-foreground h-4 w-4" />}
      />
      <StatCard
        title="Total Products"
        value={stats.total_products}
        description="Total number of active products"
        icon={<Package className="text-muted-foreground h-4 w-4" />}
      />
      <StatCard
        title="Transactions (This Month)"
        value={stats.total_transactions_this_month}
        description="Number of sales this month"
        icon={<Activity className="text-muted-foreground h-4 w-4" />}
      />
      <StatCard
        title="Total Members"
        value={stats.total_memberships}
        description="Total loyalty program members"
        icon={<Users className="text-muted-foreground h-4 w-4" />}
      />
    </div>
  )
}
