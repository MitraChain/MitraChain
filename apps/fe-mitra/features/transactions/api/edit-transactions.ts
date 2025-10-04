import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { createClient } from '@/lib/supabase/client'
import { parseRupiahMaskToNumber } from '@workspace/lib/maskito'
import { MutationConfig } from '@workspace/query-config'
import { Transaction } from '@workspace/supabase/index'
import { Database } from '@workspace/supabase/types'
import { SchemaAddTransaction } from '@/features/transactions/api/create-transactions'

type TransactionUpdate = Database['public']['Tables']['transactions']['Update']

export const editTransaction = async ({
  transactionId,
  values,
}: {
  transactionId: string
  values: SchemaAddTransaction
}): Promise<Transaction> => {
  const supabase = createClient()
  const transactionData: TransactionUpdate = { ...values, total_amount: parseRupiahMaskToNumber(values.total_amount) }
  

  const { data, error } = await supabase
    .from('transactions')
    .update(transactionData)
    .eq('id', transactionId)
    .select()
    .single()

  if (error) {
    throw new Error(error.message || 'Failed to update the transaction.')
  }

  return data
}

export const useEditTransaction = ({
  mutationConfig,
}: {
  mutationConfig?: MutationConfig<typeof editTransaction>
} = {}) => {
  const queryClient = useQueryClient()
  const { onSuccess, onError, ...restConfig } = mutationConfig || {}

  return useMutation({
    mutationFn: editTransaction,
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      toast.success(`Transaction "${data.id}" updated successfully!`)
      onSuccess?.(data, ...args)
    },
    onError: (error, ...args) => {
      toast.error(error.message)
      onError?.(error, ...args)
    },
    ...restConfig,
  })
}
