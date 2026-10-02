import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { enquiriesLockApi } from '../../api'

const LOCK_KEY = ['enquiries', 'unlocked'] as const

/**
 * Mirrors `useAuth`'s shape (a status resolved from the server, mutations
 * that update the cache on success) but for the second, enquiries-only gate.
 */
export function useEnquiriesLock() {
  const queryClient = useQueryClient()

  const status = useQuery({
    queryKey: LOCK_KEY,
    queryFn: () => enquiriesLockApi.status(),
    staleTime: 60 * 1000,
    retry: false,
  })

  const unlockMutation = useMutation({
    mutationFn: (password: string) => enquiriesLockApi.unlock(password),
    onSuccess: () => queryClient.setQueryData(LOCK_KEY, true),
  })

  const lockMutation = useMutation({
    mutationFn: () => enquiriesLockApi.lock(),
    onSuccess: () => queryClient.setQueryData(LOCK_KEY, false),
  })

  return {
    checking: status.isPending,
    unlocked: status.data ?? false,
    unlock: unlockMutation.mutateAsync,
    locking: lockMutation.isPending,
    lock: lockMutation.mutateAsync,
  }
}
