'use client'

import { transformNumberToRupiahMask } from '@workspace/lib/index'
import { Database } from '@workspace/supabase/types'
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
import { useDeleteTransaction } from '../api/delete-transactions'
import TransactionForm from './transaction-form'
// import TransactionForm from './transaction-form'

type Transaction = Database['public']['Tables']['transactions']['Row']

type Props = {
  transaction: Transaction
}

function TransactionItem({ transaction }: Readonly<Props>) {
  const [openEdit, setOpenEdit] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)

  const deleteMutation = useDeleteTransaction({
    mutationConfig: {
      onSuccess: () => {
        setOpenDelete(false)
      },
    },
  })

  const handleDelete = () => {
    deleteMutation.mutate(transaction.id)
  }

  return (
    <div className="bg-card text-card-foreground flex items-center justify-between rounded-lg border p-4">
      <div className="min-w-0">
        <div className="text-pretty font-medium">
          {transformNumberToRupiahMask(transaction.total_amount)}
        </div>
        <div className="text-muted-foreground text-sm">
          {new Date(transaction.created_at).toLocaleDateString()} -{' '}
          {new Date(transaction.created_at).toLocaleTimeString()}
        </div>
        {transaction.qris_tx_id && (
          <div className="text-muted-foreground text-xs">
            QRIS ID: {transaction.qris_tx_id}
          </div>
        )}
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
              <DialogTitle>Edit transaction</DialogTitle>
            </DialogHeader>
            <TransactionForm
              initialTransaction={transaction}
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
              <AlertDialogTitle>Delete transaction?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. The transaction will be permanently deleted.
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

export default TransactionItem
