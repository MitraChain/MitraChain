import { Database } from './types'

export * from './types'

export type Product = Database['public']['Tables']['products']['Row']
export type Business = Database['public']['Tables']['businesses']['Row']
export type RewardProgram = Database['public']['Tables']['reward_programs']['Row']
export type Transaction = Database['public']['Tables']['transactions']['Row']
export type Membership = Database['public']['Tables']['memberships']['Row']

export type PaginatedResponse<T> = {
  data: T[]
  meta: {
    totalItems: number
    itemCount: number
    itemsPerPage: number
    totalPages: number
    currentPage: number
  }
}
