import { useCallback, useMemo, type ReactNode } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { authApi, type Session } from '../api/resources/auth'
import {
  AuthContext,
  roleAllows,
  type AuthContextValue,
  type AuthStatus,
  type Permission,
} from './authContext'

const SESSION_KEY = ['auth', 'session'] as const

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()

  /**
   * The session is resolved from the server, not from storage. Retry is off:
   * a 401 is the ordinary signed-out answer, not a failure worth repeating.
   */
  const session = useQuery({
    queryKey: SESSION_KEY,
    queryFn: () => authApi.current().then((value) => value ?? null),
    retry: false,
    staleTime: 5 * 60 * 1000,
  })

  const loginMutation = useMutation({
    mutationFn: ({ identifier, password }: { identifier: string; password: string }) =>
      authApi.login(identifier, password),
    onSuccess: (user) => queryClient.setQueryData<Session | null>(SESSION_KEY, user),
  })

  const login = useCallback(
    async (identifier: string, password: string) => {
      await loginMutation.mutateAsync({ identifier, password })
    },
    [loginMutation],
  )

  /**
   * Signs out locally whatever the server says.
   *
   * The request is still made — it is what deletes the session row and expires
   * the cookie — but its failure must not strand somebody signed in. Before
   * this, a rejected call meant the cache was never cleared and the screen
   * never changed: pressing Sign out did nothing at all, with no error to
   * explain why, which is the worst possible outcome for the one control a
   * person reaches for when they want to be signed out.
   *
   * Returns whether the server was reached, so the caller can say so.
   */
  const logout = useCallback(async () => {
    let reachedServer = true
    try {
      await authApi.logout()
    } catch {
      reachedServer = false
    }

    // Local state goes either way. Dropping every cached record matters most
    // in the failure case: the next person at this screen must not find the
    // last one's data still sitting in it.
    queryClient.setQueryData<Session | null>(SESSION_KEY, null)
    queryClient.clear()
    queryClient.setQueryData<Session | null>(SESSION_KEY, null)

    return reachedServer
  }, [queryClient])

  const current = session.data ?? null

  const can = useCallback(
    (permission: Permission) => (current ? roleAllows(current.role, permission) : false),
    [current],
  )

  const status: AuthStatus = session.isPending
    ? 'loading'
    : current
      ? 'authenticated'
      : 'unauthenticated'

  const value = useMemo<AuthContextValue>(
    () => ({ session: current, status, login, logout, can }),
    [current, status, login, logout, can],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
