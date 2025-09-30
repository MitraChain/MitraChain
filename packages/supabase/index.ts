import { Database } from './types'

export * from './types'

export type Product = Database['public']['Tables']['products']['Row']
