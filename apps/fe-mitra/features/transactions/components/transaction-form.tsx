'use client'

import { useGetUserMemberships } from '@/features/auth/api/get-user-memberships'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMaskito } from '@maskito/react'
import { rupiahMaskOptions, withMaskitoRegister } from '@workspace/lib/maskito'
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
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import {
  schemaAddTransaction,
  SchemaAddTransaction,
  useAddTransaction,
} from '../api/create-transactions'
import { useCartItems, useCartStore } from '../store/cart-store'

function TransactionForm({ onCancel }: { onCancel?: () => void }) {
  const router = useRouter()
  const items = useCartItems()
  const cartItemsForSubmit = Array.from(items.values()).map((item) => ({
    product_id: item.id,
    quantity: item.quantity,
    price_at_purchase: item.price,
  }))
  const clearCart = useCartStore((state) => state.clearCart)
  const total = useCartStore((state) =>
    Array.from(state.items.values()).reduce((sum, item) => sum + item.price * item.quantity, 0),
  )

  const { data: memberships, isLoading: isMembershipsLoading } = useGetUserMemberships()
  const priceMaskitoRef = useMaskito({ options: rupiahMaskOptions })

  const addMutation = useAddTransaction({
    mutationConfig: {
      onSuccess: () => {
        toast.success('Transaction created successfully!')
        clearCart()
        router.push('/transactions')
      },
    },
  })

  const form = useForm<SchemaAddTransaction>({
    resolver: zodResolver(schemaAddTransaction),
    mode: 'onSubmit',
  })

  useEffect(() => {
    if (memberships && memberships.length === 1 && !form.getValues('membership_id')) {
      form.setValue('membership_id', memberships[0]?.id)
    }
  }, [memberships, form])

  const onSubmit = (values: SchemaAddTransaction) => {
    addMutation.mutate({ ...values, cartItems: cartItemsForSubmit })
  }

  const isLoading = addMutation.isPending

  if (isMembershipsLoading) {
    return <div>Loading memberships...</div>
  }

  if (!memberships || memberships.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground">No memberships found for your businesses.</p>
        <p className="text-muted-foreground mt-2 text-sm">
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger id="membership-id">
                      <SelectValue placeholder="Select a membership" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {memberships.map((membership) => (
                      <SelectItem key={membership.id} value={membership.id}>
                        {membership.businesses[0]?.name || 'Unknown Business'} -{' '}
                        {membership.wallet_address?.slice(0, 6)}...
                        {membership.wallet_address?.slice(-4)}
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
                  readOnly={Boolean(total)}
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
            {isLoading ? 'Creating...' : 'Create'}
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
