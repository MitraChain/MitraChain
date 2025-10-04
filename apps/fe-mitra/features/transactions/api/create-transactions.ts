import { createClient } from '@/lib/supabase/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { MutationConfig } from '@workspace/query-config'
import { Transaction } from '@workspace/supabase/index'
import { Database } from '@workspace/supabase/types'
import { toast } from 'sonner'
import { z } from 'zod'

type TransactionInsert = Database['public']['Tables']['transactions']['Insert']
type TransactionItemInsert = Database['public']['Tables']['transaction_items']['Insert']

export const schemaAddTransaction = z.object({
  membership_id: z.string().min(1, { message: 'Membership is required.' }),
  onchain_proof_hash: z.string().min(1, { message: 'Proof hash is required.' }),
  qris_tx_id: z.string().min(1, { message: 'QRIS transaction ID is required.' }),
  total_amount: z.number().min(1, { message: 'Total amount is required.' }),
})

export type SchemaAddTransaction = z.infer<typeof schemaAddTransaction>

// Extended type for mutation that includes cartItems
export type AddTransactionPayload = SchemaAddTransaction & {
  cartItems?: {
    product_id: string
    quantity: number
    price_at_purchase: number
  }[]
}

export const addTransaction = async (values: AddTransactionPayload): Promise<Transaction> => {
  const supabase = createClient()

  const transactionData: TransactionInsert = {
    membership_id: values.membership_id,
    onchain_proof_hash: values.onchain_proof_hash,
    qris_tx_id: values.qris_tx_id,
    total_amount: values.total_amount,
  }

  const { data, error } = await supabase
    .from('transactions')
    .insert(transactionData)
    .select()
    .single()

  if (error) {
    throw new Error(error.message || 'Failed to create the transaction.')
  }

  if (values.cartItems && values.cartItems.length > 0) {
    const transactionItems: TransactionItemInsert[] = values.cartItems.map((item) => ({
      ...item,
      transaction_id: data.id,
    }))

    const { error: itemsError } = await supabase.from('transaction_items').insert(transactionItems)

    if (itemsError) {
      await supabase.from('transactions').delete().eq('id', data.id)
      throw new Error(itemsError.message || 'Failed to create transaction items.')
    }
  }

  return data
}

export const useAddTransaction = ({
  mutationConfig,
}: {
  mutationConfig?: MutationConfig<typeof addTransaction>
} = {}) => {
  const queryClient = useQueryClient()
  const { onSuccess, onError, ...restConfig } = mutationConfig || {}

  return useMutation({
    mutationFn: addTransaction,
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      toast.success(`Transaction "${data.qris_tx_id}" created successfully!`)
      onSuccess?.(data, ...args)
    },
    onError: (error, ...args) => {
      toast.error(error.message)
      onError?.(error, ...args)
    },
    ...restConfig,
  })
}
