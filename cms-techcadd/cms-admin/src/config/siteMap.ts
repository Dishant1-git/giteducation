/**
 * Where each kind of content ends up on the public website.
 *
 * An editor filling in a form cannot tell, from the form alone, whether they
 * are writing something that appears on the homepage, on a page of its own, or
 * nowhere at all until a developer wires it up. That gap is where "I saved it
 * and nothing happened" comes from, so it is answered here in one place and
 * shown on every form.
 *
 * Keeping it as data rather than prose in each form means a module that is not
 * yet connected has to say so explicitly, instead of quietly omitting the note.
 *
 * This map describes giteducation.org. The routes named here are that site's
 * (`src/app/…`), and the modules marked `notLive` are the ones its pages do
 * not read — see `src/lib/cms.ts` on the website for the reading side.
 */

/** The public site. Set VITE_SITE_URL when it is not on the usual dev port. */
export const SITE_URL = (
  (import.meta.env.VITE_SITE_URL as string | undefined) ?? 'http://localhost:3000'
).replace(/\/$/, '')

/**
 * The site's host without the scheme, for the address printed beside a slug
 * field and in the search-result preview.
 *
 * Derived from SITE_URL so those hints follow the deployment instead of
 * naming a domain the site is not on.
 */
export const SITE_HOST = SITE_URL.replace(/^https?:\/\//, '')

export interface Placement {
  /** Where this content shows up, in a sentence an editor can act on. */
  where: string
  /**
   * The public URL of one record, when it has a page of its own.
   *
   * Undefined means the content appears inside other pages rather than at its
   * own address — a review has no URL, a blog post does.
   */
  url?: (record: Record<string, unknown>) => string | undefined
  /**
   * Set when nothing on the website reads this yet.
   *
   * The honest alternative to leaving the module out of this map, which would
   * read as "no note needed" rather than "this goes nowhere".
   */
  notLive?: string
}

const slugUrl = (prefix: string) => (record: Record<string, unknown>) => {
  const slug = record.slug
  return typeof slug === 'string' && slug ? `${SITE_URL}${prefix}${slug}` : undefined
}

export const SITE_MAP: Record<string, Placement> = {
  blogs: {
    where: 'The blog index at /blogs, the blog slider on the home page, and a page of its own.',
    url: slugUrl('/blogs/'),
  },
  courses: {
    where:
      'Its own course page at /courses/…, and the course directory at /courses under the category you choose. Student reviews and FAQs you link here replace the built-in ones on that page.',
    url: slugUrl('/courses/'),
  },
  categories: {
    where:
      'The headings on the Courses page. A course appears under the category you choose for it, and the order here is the order on the site. Blog posts use the same list for their category label.',
  },
  pages: {
    where: 'At its own address using the page slug, and in the main menu or footer when you choose a placement.',
    url: slugUrl('/'),
  },
  faqs: {
    where:
      'The /faq page, one tab per category in the order set under FAQ categories. Featured questions also appear in the FAQ section of the home page. Course-specific questions shown on a course page are chosen on that course.',
  },
  reviews: {
    where:
      'The /reviews page, in the order set here. The course name links the card to that course when it matches a course title. A review linked from a course also appears on that course page.',
  },
  testimonials: {
    where: 'Featured, published testimonials appear in the student feedback section on the home page. Video and Google links open from each testimonial.',
  },
  events: {
    where:
      'The events listing at /events, soonest first, and a page of its own. The first tag is the course the "Reserve a free seat" button files the enquiry under.',
    url: slugUrl('/events/'),
  },
  gallery: {
    where: 'The /gallery page. Every photograph in every published album joins the photo wall, with its caption.',
  },
  settings: {
    where: '',
    notLive:
      'The website prints its phone number, address and social links from its own code (src/lib/site.ts), not from here. What you save is kept, and used by this CMS for emails, but changing it does not change the site.',
  },
  redirects: {
    where: 'Enabled redirects are applied by the website before the requested page is served.',
  },
  enquiries: {
    where: 'Received from the website forms — Book a Free Demo and the contact form. Nothing here is published back to it.',
  },
  media: {
    where: 'Used by whatever content references it — a blog cover, an event photo, a gallery photograph.',
  },
  seo: {
    where: 'Meta titles and descriptions set on a course or blog post are used on that page.',
  },
  'ai-knowledge': {
    where: '',
    notLive: 'The website has no AI assistant. Entries saved here are stored but nothing reads them.',
  },
  comments: {
    where: 'Comments submitted under blog posts are held for moderation here. Approved comments and staff replies appear on their post.',
  },
}

/**
 * The public address of one record, or undefined when it has none.
 *
 * Wraps the per-module `url` above so a caller does not have to know which
 * modules have their own page — a list page can offer "View on site" wherever
 * this returns something and omit it everywhere else, without carrying its own
 * copy of the site's URL shapes.
 */
export function publicUrlFor(module: string, record: object | undefined): string | undefined {
  if (!record) return undefined
  // Callers pass their own entity types (Course, Blog, Page); the map's own
  // url() reads a couple of named fields off it and checks them, so an
  // index-signature cast here is safe and saves every caller a cast.
  const placement = SITE_MAP[module]
  if (placement?.notLive) return undefined
  return placement?.url?.(record as Record<string, unknown>)
}
