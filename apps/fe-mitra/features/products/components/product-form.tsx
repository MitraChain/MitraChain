'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Product } from '@workspace/supabase/index'
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
import { useForm } from 'react-hook-form'
import { schemaAddProduct, SchemaAddProduct, useAddProduct } from '../api/create-product'
import { useEditProduct } from '../api/edit-product'

type Props = {
  initialProduct?: Product | null
  onSuccess?: (product: Product) => void
  onCancel?: () => void
}

function ProductForm({ initialProduct, onSuccess, onCancel }: Readonly<Props>) {
  const isEdit = Boolean(initialProduct)

  const addMutation = useAddProduct({
    mutationConfig: {
      onSuccess,
    },
  })
  const editMutation = useEditProduct({
    mutationConfig: {
      onSuccess,
    },
  })

  const form = useForm<SchemaAddProduct>({
    resolver: zodResolver(schemaAddProduct),
    defaultValues: {
      name: initialProduct?.name ?? '',
      price: initialProduct?.price ?? undefined,
    },
    mode: 'onSubmit',
  })

  const onSubmit = (values: SchemaAddProduct) => {
    if (isEdit && initialProduct) {
      editMutation.mutate({ productId: initialProduct.id, values })
    } else {
      addMutation.mutate(values)
    }
  }

  const isLoading = addMutation.isPending || editMutation.isPending

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="product-name">Name</FormLabel>
              <FormControl>
                <Input
                  id="product-name"
                  placeholder="e.g. Latte"
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
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="product-price">Price</FormLabel>
              <FormControl>
                <Input
                  id="product-price"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step="0.01"
                  placeholder="0.00"
                  className="font-sans"
                  value={field.value as any}
                  onChange={(e) => field.onChange(e.target.value)}
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

export default ProductForm
