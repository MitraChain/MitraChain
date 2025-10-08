import { useQuery } from '@tanstack/react-query'

import { createClient } from '@/lib/supabase/client'
import { Transaction, TransactionItem } from '@workspace/supabase'

type TransactionItemWithProduct = TransactionItem & {
  products: {
    name: string | null
  } | null
}

export type TransactionDetail = Transaction & {
  transaction_items: TransactionItemWithProduct[]
  memberships: {
    businesses: {
      name: string | null
    } | null
  } | null
}

export const getTransactionById = async (
  transactionId: string,
): Promise<TransactionDetail | null> => {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('transactions')
    .select(
      `
      *,
      transaction_items (
        *,
        products ( name )
      )
    `,
    )
    .eq('id', transactionId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null
    }
    console.error('Error fetching transaction:', error)
    throw new Error(error.message || 'Failed to fetch transaction details.')
  }

  return data
}

export const useGetTransactionById = (transactionId: string) => {
  return useQuery({
    queryKey: ['transaction', transactionId],
    queryFn: () => getTransactionById(transactionId),
    enabled: !!transactionId,
  })
}
