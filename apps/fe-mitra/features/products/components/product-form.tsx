'use client'

import { useGetUser } from '@/features/auth/api/get-user'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMaskito } from '@maskito/react'
import {
  rupiahMaskOptions,
  transformNumberToRupiahMask,
  withMaskitoRegister,
} from '@workspace/lib/maskito'
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
import { toast } from 'sonner'
import { schemaAddProduct, SchemaAddProduct, useAddProduct } from '../api/create-product'
import { useEditProduct } from '../api/edit-product'

type Props = {
  initialProduct?: Product | null
  onSuccess?: (product: Product) => void
  onCancel?: () => void
}

function ProductForm({ initialProduct, onSuccess, onCancel }: Readonly<Props>) {
  const { data: userData } = useGetUser()
  const priceMaskitoRef = useMaskito({ options: rupiahMaskOptions })
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
      price: initialProduct?.price ? transformNumberToRupiahMask(initialProduct?.price) : '',
    },
    mode: 'onSubmit',
  })

  const onSubmit = (values: SchemaAddProduct) => {
    if (isEdit && initialProduct) {
      editMutation.mutate({ productId: initialProduct.id, values })
    } else if (!userData?.business) {
      toast.error('Business not found')
    } else {
      addMutation.mutate({ values, businessId: userData?.business.id ?? '' })
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
                  placeholder="Rp10.000"
                  {...field}
                  {...withMaskitoRegister(form.register('price'), priceMaskitoRef)}
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
