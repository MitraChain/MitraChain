import { createClient } from '@/lib/supabase/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { MutationConfig } from '@workspace/query-config'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export const logout = async () => {
  const supabase = createClient()
  const { error } = await supabase.auth.signOut()

  if (error) {
    throw new Error(error.message || 'Failed to log out.')
  }
  return true
}

// The custom hook that wraps useMutation
export const useLogout = ({
  mutationConfig,
}: {
  mutationConfig?: MutationConfig<typeof logout>
} = {}) => {
  const queryClient = useQueryClient()
  const router = useRouter()
  const { onSuccess, onError, ...restConfig } = mutationConfig || {}

  return useMutation({
    mutationFn: logout,
    onSuccess: (...args) => {
      queryClient.clear()

      router.push('/auth')

      toast.success('You have been successfully logged out.')
      onSuccess?.(...args)
    },
    onError: (error: Error, ...args) => {
      toast.error(error.message)
      onError?.(error, ...args)
    },
    ...restConfig,
  })
}
