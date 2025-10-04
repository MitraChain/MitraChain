import { createClient } from '@/lib/supabase/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { MutationConfig } from '@workspace/query-config'
import type { Database, RewardProgram } from '@workspace/supabase'
import { toast } from 'sonner'
import { z } from 'zod'

type RewardProgramUpdate = Database['public']['Tables']['reward_programs']['Update']

export const schemaEditRewardProgram = z.object({
  name: z.string().min(1, { message: 'Program name is required.' }).optional(),
  type: z.enum(['stamp', 'point', 'milestone']).optional(),
  threshold: z.number().positive({ message: 'Threshold must be a positive number.' }).optional(),
  reward_description: z.string().min(1, { message: 'Reward description is required.' }).optional(),
})

export type SchemaEditRewardProgram = z.infer<typeof schemaEditRewardProgram>

export const editRewardProgram = async ({
  programId,
  values,
}: {
  programId: string
  values: SchemaEditRewardProgram
}): Promise<RewardProgram> => {
  const supabase = createClient()
  const programData: RewardProgramUpdate = values

  const { data, error } = await supabase
    .from('reward_programs')
    .update(programData)
    .eq('id', programId)
    .select()
    .single()

  if (error) {
    throw new Error(error.message || 'Failed to update the reward program.')
  }
  return data
}

export const useEditRewardProgram = ({
  mutationConfig,
}: {
  mutationConfig?: MutationConfig<typeof editRewardProgram>
} = {}) => {
  const queryClient = useQueryClient()
  const { onSuccess, onError, ...restConfig } = mutationConfig || {}

  return useMutation({
    mutationFn: editRewardProgram,
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({ queryKey: ['reward-programs'] })
      toast.success(`Program "${data.name}" updated successfully!`)
      onSuccess?.(data, ...args)
    },
    onError: (error: Error, ...args) => {
      toast.error(error.message)
      onError?.(error, ...args)
    },
    ...restConfig,
  })
}
