'use client'

import { RewardProgram } from '@workspace/supabase/index'
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
import { useDeleteRewardProgram } from '../api/delete-reward-program'
import { RewardProgramForm } from './reward-program-form'

type Props = {
  program: RewardProgram
}

export function RewardProgramItem({ program }: Readonly<Props>) {
  const [openEdit, setOpenEdit] = useState(false)

  const deleteMutation = useDeleteRewardProgram({})

  const handleDelete = () => {
    deleteMutation.mutate(program.id)
  }

  return (
    <div className="bg-card text-card-foreground flex items-center justify-between rounded-lg border p-4">
      <div className="min-w-0">
        <p className="text-pretty font-medium">{program.name}</p>
        <p className="text-muted-foreground mt-1 text-sm">{program.reward_description}</p>
        <p className="text-muted-foreground text-sm">
          {`Type: ${program.type} | Target: ${program.threshold}`}
        </p>
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
              <DialogTitle>Edit Reward Program</DialogTitle>
            </DialogHeader>
            <RewardProgramForm
              initialProgram={program}
              onSuccess={() => {
                setOpenEdit(false)
              }}
              onCancel={() => setOpenEdit(false)}
            />
          </DialogContent>
        </Dialog>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm" disabled={deleteMutation.isPending}>
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete "{program.name}"?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the reward program.
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
