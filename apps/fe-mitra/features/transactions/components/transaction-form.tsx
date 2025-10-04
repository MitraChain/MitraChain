'use client'

import { useGetUser } from '@/features/auth/api/get-user'
import { useGetUserMemberships } from '@/features/auth/api/get-user-memberships'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMaskito } from '@maskito/react'
import {
  rupiahMaskOptions,
  transformNumberToRupiahMask,
  withMaskitoRegister,
} from '@workspace/lib/maskito'
import { Transaction } from '@workspace/supabase/index'
import { Button } from '@workspace/ui/components/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@workspace/ui/components/form'
import { Input } from '@workspace/ui/components/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { schemaAddTransaction, SchemaAddTransaction, useAddTransaction, AddTransactionPayload } from '../api/create-transactions'
import { useEditTransaction } from '../api/edit-transactions'

type CartItem = {
  product_id: string
  quantity: number
  price_at_purchase: number
}

type Props = {
  initialTransaction?: Transaction | null
  totalAmount?: number
  cartItems?: CartItem[]
  onSuccess?: (transaction: Transaction) => void
  onCancel?: () => void
}

function TransactionForm({ 
  initialTransaction, 
  totalAmount,
  cartItems = [],
  onSuccess, 
  onCancel 
}: Readonly<Props>) {
  const { data: userData } = useGetUser()
  const { data: memberships, isLoading: isMembershipsLoading } = useGetUserMemberships()
  const priceMaskitoRef = useMaskito({ options: rupiahMaskOptions })
  const isEdit = Boolean(initialTransaction)

  const addMutation = useAddTransaction({
    mutationConfig: {
      onSuccess,
    },
  })
  
  const editMutation = useEditTransaction({
    mutationConfig: {
      onSuccess,
    },
  })

  const form = useForm<SchemaAddTransaction>({
    resolver: zodResolver(schemaAddTransaction),
    defaultValues: {
      membership_id: initialTransaction?.membership_id ?? '',
      qris_tx_id: initialTransaction?.qris_tx_id ?? '',
      total_amount: totalAmount 
        ? transformNumberToRupiahMask(totalAmount)
        : initialTransaction?.total_amount 
        ? transformNumberToRupiahMask(initialTransaction.total_amount) 
        : '',
      onchain_proof_hash: initialTransaction?.onchain_proof_hash ?? '',
    },
    mode: 'onSubmit',
  })

  useEffect(() => {
    if (memberships && memberships.length === 1 && !form.getValues('membership_id')) {
      form.setValue('membership_id', memberships[0]?.id)
    }
  }, [memberships, form])

  const onSubmit = (values: SchemaAddTransaction) => {
    if (isEdit && initialTransaction) {
      editMutation.mutate({ transactionId: initialTransaction.id, values })
    } else if (!userData?.user?.id) {
      toast.error('User not found')
    } else {
      // Pass cartItems to mutation
      addMutation.mutate({ ...values, cartItems })
    }
  }

  const isLoading = addMutation.isPending || editMutation.isPending

  if (isMembershipsLoading) {
    return <div>Loading memberships...</div>
  }

  if (!memberships || memberships.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No memberships found for your businesses.</p>
        <p className="text-sm text-muted-foreground mt-2">
          Please ensure you have businesses with active memberships.
        </p>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        {memberships.length > 1 && (
          <FormField
            control={form.control}
            name="membership_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="membership-id">Customer Membership</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  disabled={isEdit}
                >
                  <FormControl>
                    <SelectTrigger id="membership-id">
                      <SelectValue placeholder="Select a membership" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {memberships.map((membership) => (
                      <SelectItem key={membership.id} value={membership.id}>
                        {membership.businesses?.name || 'Unknown Business'} - {membership.wallet_address?.slice(0, 6)}...{membership.wallet_address?.slice(-4)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="qris_tx_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="qris-tx-id">QRIS Transaction ID</FormLabel>
              <FormControl>
                <Input
                  id="qris-tx-id"
                  placeholder="Enter QRIS Transaction ID"
                  className="font-sans"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="total_amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="total-amount">Total Amount</FormLabel>
              <FormControl>
                <Input
                  id="total-amount"
                  placeholder="Rp10.000"
                  readOnly={Boolean(totalAmount)}
                  {...field}
                  {...withMaskitoRegister(form.register('total_amount'), priceMaskitoRef)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="onchain_proof_hash"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="onchain-proof-hash">Onchain Proof Hash</FormLabel>
              <FormControl>
                <Input
                  id="onchain-proof-hash"
                  placeholder="Enter blockchain proof hash"
                  className="font-sans"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (isEdit ? 'Saving...' : 'Creating...') : isEdit ? 'Save' : 'Create'}
          </Button>
          {onCancel ? (
            <Button type="button" variant="ghost" onClick={onCancel} disabled={isLoading}>
              Cancel
            </Button>
          ) : null}
        </div>
      </form>
    </Form>
  )
}

export default TransactionForm