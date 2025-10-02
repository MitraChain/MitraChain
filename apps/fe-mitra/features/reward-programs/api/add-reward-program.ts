import { useGetUser } from '@/features/auth/api/get-user'
import { createClient } from '@/lib/supabase/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { MutationConfig } from '@workspace/query-config'
import type { Database, RewardProgram } from '@workspace/supabase'
import { toast } from 'sonner'
import { z } from 'zod'

type RewardProgramInsert = Database['public']['Tables']['reward_programs']['Insert']

export const schemaAddRewardProgram = z.object({
  name: z.string().min(1, { message: 'Program name is required.' }),
  type: z.enum(['stamp', 'point', 'milestone']),
  threshold: z.number().positive({ message: 'Threshold must be a positive number.' }),
  reward_description: z.string().min(1, { message: 'Reward description is required.' }),
})

export type SchemaAddRewardProgram = z.infer<typeof schemaAddRewardProgram>

export const addRewardProgram = async (
  programData: RewardProgramInsert,
): Promise<RewardProgram> => {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('reward_programs')
    .insert(programData)
    .select()
    .single()

  if (error) {
    throw new Error(error.message || 'Failed to create the reward program.')
  }

  return data
}

type RewardProgramMutationFn = (values: SchemaAddRewardProgram) => Promise<RewardProgram>
export const useAddRewardProgram = ({
  mutationConfig,
}: {
  mutationConfig?: MutationConfig<RewardProgramMutationFn>
} = {}) => {
  const queryClient = useQueryClient()
  const { data: userData } = useGetUser()
  const { onSuccess, onError, ...restConfig } = mutationConfig || {}

  return useMutation({
    mutationFn: async (values: SchemaAddRewardProgram) => {
      if (!userData?.business?.id) {
        throw new Error('No active business found.')
      }

      const programData: RewardProgramInsert = {
        ...values,
        business_id: userData.business.id,
      }

      return addRewardProgram(programData)
    },
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({ queryKey: ['reward-programs'] })
      toast.success(`Program "${data.name}" created successfully!`)
      onSuccess?.(data, ...args)
    },
    onError: (error: Error, ...args) => {
      toast.error(error.message)
      onError?.(error, ...args)
    },
    ...restConfig,
  })
}
