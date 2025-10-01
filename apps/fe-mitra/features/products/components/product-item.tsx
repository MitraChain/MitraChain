'use client'

import { transformNumberToRupiahMask } from '@workspace/lib/index'
import { Product } from '@workspace/supabase/index'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@workspace/ui/components/alert-dialog'
import { Button } from '@workspace/ui/components/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@workspace/ui/components/dialog'
import { useState } from 'react'
import { useDeleteProduct } from '../api/delete-product'
import ProductForm from './product-form'

type Props = {
  product: Product
}

function ProductItem({ product }: Readonly<Props>) {
  const [openEdit, setOpenEdit] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)

  const deleteMutation = useDeleteProduct({
    mutationConfig: {
      onSuccess: () => {
        setOpenDelete(false)
      },
    },
  })

  const handleDelete = () => {
    deleteMutation.mutate(product.id)
  }

  return (
    <div className="bg-card text-card-foreground flex items-center justify-between rounded-lg border p-4">
      <div className="min-w-0">
        <div className="text-pretty font-medium">{product.name}</div>
        <div className="text-muted-foreground text-sm">
          {transformNumberToRupiahMask(product.price)}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Dialog open={openEdit} onOpenChange={setOpenEdit}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              Edit
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit product</DialogTitle>
            </DialogHeader>
            <ProductForm
              initialProduct={product}
              onSuccess={async () => {
                setOpenEdit(false)
              }}
              onCancel={() => setOpenEdit(false)}
            />
          </DialogContent>
        </Dialog>

        <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete product?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. The product will be permanently deleted.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}

export default ProductItem
