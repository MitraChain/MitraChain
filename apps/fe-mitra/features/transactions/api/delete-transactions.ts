import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { createClient } from '@/lib/supabase/client'
import { MutationConfig } from '@workspace/query-config'
import { Transaction } from '@workspace/supabase/index'

export const deleteTransaction = async (transactionId: string) => {
  const supabase = createClient()
  const { error } = await supabase.from('transactions').delete().eq('id', transactionId)

  if (error) {
    throw new Error(error.message || 'Failed to delete the transaction.')
  }

  return true
}

export const useDeleteTransaction = ({
  mutationConfig,
}: {
  mutationConfig?: MutationConfig<typeof deleteTransaction>
} = {}) => {
  const queryClient = useQueryClient()
  const { onSuccess, onError, onMutate, ...restConfig } = mutationConfig || {}

  return useMutation({
    mutationFn: deleteTransaction,

    onMutate: async (deletedTransactionId) => {
      await queryClient.cancelQueries({ queryKey: ['transactions'] })

      const previousTransactions = queryClient.getQueryData<Transaction[]>(['transactions'])

      queryClient.setQueryData<Transaction[]>(['transactions'], (oldData = []) =>
        oldData.filter((transaction) => transaction.id !== deletedTransactionId),
      )

      return { previousTransactions }
    },

    onError: (...args) => {
      if (args[2]?.previousTransactions) {
        queryClient.setQueryData(['transactions'], args[2].previousTransactions)
      }
      toast.error(args[0].message)
      onError?.(...args)
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
    },

    onSuccess: (...args) => {
      toast.success('Transaction deleted successfully!')
      onSuccess?.(...args)
    },
    ...restConfig,
  })
}
