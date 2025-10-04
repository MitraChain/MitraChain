'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { RewardProgram } from '@workspace/supabase/index'
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
import {
  SchemaAddRewardProgram,
  schemaAddRewardProgram,
  useAddRewardProgram,
} from '../api/add-reward-program'
import { useEditRewardProgram } from '../api/edit-reward-program'

type Props = {
  initialProgram?: RewardProgram | null
  onSuccess?: (program: RewardProgram) => void
  onCancel?: () => void
}

export function RewardProgramForm({ initialProgram, onSuccess, onCancel }: Readonly<Props>) {
  const isEdit = Boolean(initialProgram)

  const addMutation = useAddRewardProgram({ mutationConfig: { onSuccess } })
  const editMutation = useEditRewardProgram({ mutationConfig: { onSuccess } })

  const form = useForm<SchemaAddRewardProgram>({
    resolver: zodResolver(schemaAddRewardProgram),
    defaultValues: {
      name: initialProgram?.name ?? '',
      type: initialProgram?.type ?? 'point',
      threshold: initialProgram?.threshold ?? 100,
      reward_description: initialProgram?.reward_description ?? '',
    },
    mode: 'onSubmit',
  })

  const onSubmit = (values: SchemaAddRewardProgram) => {
    if (isEdit && initialProgram) {
      editMutation.mutate({ programId: initialProgram.id, values })
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
              <FormLabel>Program Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Loyalty Points" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="threshold"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Target Threshold</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="e.g., 1000"
                  {...field}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="reward_description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reward Description</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Free Coffee" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (isEdit ? 'Saving...' : 'Creating...') : isEdit ? 'Save' : 'Create'}
          </Button>
          {onCancel && (
            <Button type="button" variant="ghost" onClick={onCancel} disabled={isLoading}>
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Form>
  )
}
