/**
 * Whether a URL really points at Google.
 *
 * Shared by reviews and testimonials, which both carry one of these links and
 * must judge it the same way — a link the review form refuses and the
 * testimonial form accepts is the same bug with two answers.
 *
 * Both render it behind a "Read on Google" link beside the Google mark. That
 * is a claim about where the words came from, so the address behind it has to
 * be checkable — a link to anywhere else under that label is a lie the CMS
 * would be helping to tell. Hence an allowlist of hosts rather than a general
 * "is this a URL" check.
 *
 * The allowed set is Google's own review, maps and sharing surfaces:
 *   google.com/maps/...        a place or a review permalink
 *   <cc>.google.com            the regional domains, e.g. google.co.in
 *   g.page / g.co              the short links a Business Profile hands out
 *   goo.gl, maps.app.goo.gl    the older and current maps share links
 *   *.google                   the brand TLD — share.google and whatever
 *                              Google puts there next, see GOOGLE_TLD below
 *
 * http is refused as well as unknown hosts: these links are printed on a page
 * served over https, and an http one would be blocked or downgraded anyway.
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
