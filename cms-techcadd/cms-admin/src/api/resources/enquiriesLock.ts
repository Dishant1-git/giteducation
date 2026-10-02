import { request } from '../client'

/**
 * The second password gate in front of `/enquiries`. Separate from
 * `auth.ts` on purpose — signing in and unlocking leads are different
 * questions, answered by different secrets.
 */
export const enquiriesLockApi = {
  async status(): Promise<boolean> {
    const { unlocked } = await request<{ unlocked: boolean }>('/enquiries/unlock-status')
    return unlocked
  },

  unlock(password: string): Promise<void> {
    return request<void>('/enquiries/unlock', { method: 'POST', body: { password } })
  },

  lock(): Promise<void> {
    return request<void>('/enquiries/lock', { method: 'POST' })
  },
}
