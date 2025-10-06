import { useMutation } from '@tanstack/react-query'
import { MutationConfig } from '@workspace/query-config'
import { toast } from 'sonner'

export const scanMember = async (qrData: string) => {
  const response = await fetch('/api/scan-member', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ qr_data: qrData }),
  })

  const data = await response.json()

  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Failed to scan member')
  }

  return data.data
}

export const useScanMember = ({
  mutationConfig,
}: {
  mutationConfig?: MutationConfig<typeof scanMember>
} = {}) => {
  const { onSuccess, onError, ...restConfig } = mutationConfig || {}

  return useMutation({
    mutationFn: scanMember,
    onSuccess: (data, ...args) => {
      if (data.is_new_member) {
        toast.success(`New member registered at ${data.business_name}!`)
      } else {
        toast.success('Member found!')
      }
      onSuccess?.(data, ...args)
    },
    onError: (error: Error, ...args) => {
      toast.error(error.message || 'Failed to scan member')
      onError?.(error, ...args)
    },
    ...restConfig,
  })
}
