import { createClient } from '@/lib/supabase/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { MutationConfig } from '@workspace/query-config'
import { RewardProgram } from '@workspace/supabase/index'
import { toast } from 'sonner'

export const deleteRewardProgram = async (programId: string) => {
  const supabase = createClient()
  const { error } = await supabase.from('reward_programs').delete().eq('id', programId)

  if (error) {
    throw new Error(error.message || 'Failed to delete the reward program.')
  }
  return true
}

export const useDeleteRewardProgram = ({
  mutationConfig,
}: {
  mutationConfig?: MutationConfig<typeof deleteRewardProgram>
} = {}) => {
  const queryClient = useQueryClient()
  const { onSuccess, onError, onMutate, ...restConfig } = mutationConfig || {}

  return useMutation({
    mutationFn: deleteRewardProgram,
    onMutate: async (deletedProgramId) => {
      await queryClient.cancelQueries({ queryKey: ['reward-programs'] })
      const previousPrograms = queryClient.getQueryData<RewardProgram[]>(['reward-programs'])
      queryClient.setQueryData<RewardProgram[]>(['reward-programs'], (oldData = []) =>
        oldData.filter((program) => program.id !== deletedProgramId),
      )
      return { previousPrograms }
    },
    onError: (...args) => {
      if (args[2]?.previousPrograms) {
        queryClient.setQueryData(['reward-programs'], args[2].previousPrograms)
      }
      toast.error(args[0].message)
      onError?.(...args)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['reward-programs'] })
    },
    onSuccess: (data, ...args) => {
      toast.success('Reward program deleted successfully!')
      onSuccess?.(data, ...args)
    },
    ...restConfig,
  })
}
