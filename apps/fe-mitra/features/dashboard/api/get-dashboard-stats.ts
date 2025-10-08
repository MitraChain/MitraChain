import { useQuery } from '@tanstack/react-query'

import { useGetUser } from '@/features/auth/api/get-user'
import { createClient } from '@/lib/supabase/client'

export type DashboardStats = {
  total_sales_this_month: number
  total_products: number
  total_transactions_this_month: number
  total_memberships: number
}

export const getDashboardStats = async (businessId: string): Promise<DashboardStats> => {
  const supabase = createClient()
  const { data, error } = await supabase.rpc('get_dashboard_stats', {
    business_id_param: businessId,
  })

  if (error) {
    console.error('Error fetching dashboard stats:', error)
    throw new Error(error.message || 'Failed to fetch dashboard stats.')
  }

  return data
}

export const useGetDashboardStats = () => {
  const { data: authData } = useGetUser()
  const businessId = authData?.business?.id

  return useQuery({
    queryKey: ['dashboard-stats', businessId],
    queryFn: () => getDashboardStats(businessId as string),
    enabled: !!businessId,
  })
}
