/**
 * Mirrors `cms-api/src/modules/reviews/googleUrl.ts`.
 *
 * Restated rather than imported because the two apps are separate builds. The
 * server is the authority — it refuses a bad link whatever the browser thinks
 * — but repeating the rule here is what turns "the save failed" into a message
 * against the field the moment the editor leaves it.
 */

const EXACT_HOSTS = new Set([
  'g.page',
  'g.co',
  'goo.gl',
  'maps.app.goo.gl',
  'maps.google.com',
  'search.google.com',
])

/** google.com, google.co.in, google.de … but not google.evil.com. */
const GOOGLE_DOMAIN = /^(?:www\.)?google(?:\.[a-z]{2,3}){1,2}$/

/**
 * Anything on the `.google` top-level domain.
 *
 * `.google` is a brand gTLD: Google runs the registry and nobody else can
 * register under it, so a host ending in `.google` is Google by definition.
 * That makes a rule safer than a list here — `share.google`, the shortener the
 * Google app now produces when you share a review, was refused by the list
 * above purely for having been launched after it was written, and the next
 * surface Google adds would have been refused the same way.
 *
 * Anchored at both ends, so `google.evil.com` still fails: the host has to end
 * in `.google`, not merely contain it.
 */
const GOOGLE_TLD = /^(?:[a-z0-9-]+\.)*google$/

export function isGoogleUrl(value: string): boolean {
  let url: URL
  try {
    url = new URL(value)
  } catch {
    return false
  }

  if (url.protocol !== 'https:') return false

  const host = url.hostname.toLowerCase()
  return EXACT_HOSTS.has(host) || GOOGLE_DOMAIN.test(host) || GOOGLE_TLD.test(host)
}

export const GOOGLE_URL_MESSAGE =
  'Enter an https link to Google — a review, place or profile URL such as https://share.google/…, https://g.page/… or https://www.google.com/maps/…'
