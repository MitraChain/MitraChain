import { Database } from './types'

export * from './types'

export type Product = Database['public']['Tables']['products']['Row']

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
