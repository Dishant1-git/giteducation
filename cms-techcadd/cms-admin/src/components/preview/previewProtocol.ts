/** What the preview pane frames, and the device widths it offers. */

export type PreviewKind = 'course' | 'page'

/** Where the public site is served from. */
export const SITE_ORIGIN = (
  (import.meta.env.VITE_SITE_URL as string | undefined) ?? 'http://localhost:3000'
).replace(/\/$/, '')

export const DEVICES = [
  { id: 'desktop', label: 'Desktop', width: null, icon: 'Monitor' },
  { id: 'tablet', label: 'Tablet', width: 834, icon: 'Tablet' },
  { id: 'mobile', label: 'Mobile', width: 390, icon: 'Smartphone' },
] as const

export type DeviceId = (typeof DEVICES)[number]['id']
