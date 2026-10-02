import { describe, expect, it } from 'vitest'

import { isGoogleUrl } from '../src/modules/shared/googleUrl.js'

/**
 * The rule behind the Google link on a review.
 *
 * Worth pinning down rather than trusting to reading, because it has been
 * wrong twice in the same direction: the allowlist refused `share.google` —
 * the shortener the Google app now hands out — purely because that surface was
 * launched after the list was written. A refusal here reaches the editor as
 * "enter an https link to Google" while they are looking at an https link to
 * Google, which is the least helpful error a form can give.
 *
 * The other direction matters more. This URL is printed behind a button
 * reading "Read on Google" beside the Google mark, so anything that gets past
 * this function is a claim about where a review was written. The hostile cases
 * below are the ones that make that claim false.
 */
describe('isGoogleUrl', () => {
  it('accepts the surfaces Google actually hands out', () => {
    for (const url of [
      'https://share.google/qPVLjBI6xn84AMUdJ',
      'https://g.page/r/CQ_example/review',
      'https://g.co/kgs/example',
      'https://goo.gl/maps/example',
      'https://maps.app.goo.gl/example',
      'https://maps.google.com/?cid=123',
      'https://search.google.com/local/reviews?placeid=abc',
      'https://www.google.com/maps/place/techcadd',
      'https://google.com/maps/place/techcadd',
      // The regional domains — an Indian visitor's share link is google.co.in.
      'https://www.google.co.in/maps/place/techcadd',
      'https://google.de/maps/place/techcadd',
    ]) {
      expect(isGoogleUrl(url), url).toBe(true)
    }
  })

  it('accepts anything on the .google brand TLD', () => {
    // Google runs the registry, so a host ending in .google is Google by
    // definition. This is what keeps the next new surface from being refused.
    expect(isGoogleUrl('https://share.google/abc')).toBe(true)
    expect(isGoogleUrl('https://blog.google/products/maps/')).toBe(true)
    expect(isGoogleUrl('https://about.google/')).toBe(true)
  })

  it('refuses hosts that only look like Google', () => {
    for (const url of [
      // The one the anchoring exists for: a domain somebody else can register.
      'https://google.evil.com/maps',
      'https://www.google.evil.com/',
      'https://notgoogle.com/',
      'https://googl.com/',
      // Ends in "google" as a label but is not under the .google TLD.
      'https://mygoogle.com/',
      // A lookalike of the brand TLD on a registrable suffix.
      'https://google.com.evil.net/',
      'https://example.com/',
    ]) {
      expect(isGoogleUrl(url), url).toBe(false)
    }
  })

  it('refuses anything that is not https', () => {
    // These are printed on a page served over https, and the schemes below are
    // how a link field becomes a way to run something.
    expect(isGoogleUrl('http://www.google.com/maps')).toBe(false)
    expect(isGoogleUrl('javascript:alert(1)')).toBe(false)
    expect(isGoogleUrl('data:text/html,<script>alert(1)</script>')).toBe(false)
  })

  it('refuses what is not a URL at all', () => {
    // The paste that started this: a share link with the scheme left off is
    // read by a browser as a path on our own site, not as a link to Google.
    expect(isGoogleUrl('share.google/qPVLjBI6xn84AMUdJ')).toBe(false)
    expect(isGoogleUrl('g.page/r/CQ_example/review')).toBe(false)
    expect(isGoogleUrl('')).toBe(false)
    expect(isGoogleUrl('   ')).toBe(false)
  })
})
