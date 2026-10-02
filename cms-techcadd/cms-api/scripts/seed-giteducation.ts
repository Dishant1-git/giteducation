import { randomUUID } from 'node:crypto'
import { copyFile, readFile, stat } from 'node:fs/promises'
import { basename, dirname, extname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { execute, pool, queryOne, type Row } from '../src/db/pool.js'
import * as blogsRepo from '../src/modules/blogs/blogs.repo.js'
import { blogSchema } from '../src/modules/blogs/blogs.schema.js'
import * as coursesRepo from '../src/modules/courses/courses.repo.js'
import { courseSchema } from '../src/modules/courses/courses.schema.js'
import * as eventsRepo from '../src/modules/events/events.repo.js'
import { eventSchema } from '../src/modules/events/events.schema.js'
import * as faqsRepo from '../src/modules/faqs/faqs.repo.js'
import * as galleryRepo from '../src/modules/gallery/gallery.repo.js'
import { albumSchema } from '../src/modules/gallery/gallery.schema.js'
import { readDimensions } from '../src/modules/media/dimensions.js'
import { ensureUploadRoot, publicUrl, storedName, uploadRoot } from '../src/modules/media/storage.js'

// The website's own content files. They are plain data with no framework
// imports, so they load here exactly as the site loads them.
import { POSTS } from '../../../src/lib/blog.ts'
import { COURSES } from '../../../src/lib/courses.ts'
import { EVENTS } from '../../../src/lib/events.ts'
import { GENERAL_FAQS } from '../../../src/lib/faq.ts'
import { PHOTOS } from '../../../src/lib/gallery.ts'
import { REVIEWS } from '../../../src/lib/reviews.ts'
import { SITE } from '../../../src/lib/site.ts'

/**
 * Moves giteducation.org's built-in content into the CMS.
 *
 * Everything the site prints — courses, blog posts, events, the gallery, the
 * general FAQ and the reviews wall — lived in `src/lib/*.ts`, where only a
 * developer could change it. This carries it across verbatim, so on the day the
 * site starts reading from the CMS it shows exactly what it showed the day
 * before, and an editor starts from the real catalogue instead of an empty one.
 *
 * Idempotent: every record is looked up by its slug (or its own text) first, so
 * running it twice adds nothing, and running it after an editor has been at
 * work overwrites nothing.
 *
 *   npm run db:seed        (once, first — blog posts need an author)
 *   npm run db:seed:site
 */

const here = dirname(fileURLToPath(import.meta.url))
/** `public/` of the website this CMS sits inside. */
const sitePublic = resolve(here, '../../../public')

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 150)

/* ------------------------------------------------------------------ */
/* Media                                                                */
/* ------------------------------------------------------------------ */

const MIME: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
}

interface SeededMedia {
  id: string
  url: string
  alt: string
}

/**
 * Copies one of the site's own images into the media library.
 *
 * Looked up by its original path first, kept in `folder`, so a photo used by
 * three posts is stored once and a second run finds it instead of copying it
 * again.
 */
async function importImage(sitePath: string, alt: string): Promise<SeededMedia | undefined> {
  const folder = `website${dirname(sitePath)}`.slice(0, 120)
  const filename = basename(sitePath)

  const existing = await queryOne<Row>(
    'SELECT id, url, alt FROM media WHERE filename = ? AND folder = ? LIMIT 1',
    [filename, folder],
  )
  if (existing) return { id: existing.id as string, url: existing.url as string, alt: (existing.alt as string) ?? '' }

  const source = join(sitePublic, sitePath)
  const mimeType = MIME[extname(source).toLowerCase()]
  if (!mimeType) return undefined

  let size: number
  try {
    size = (await stat(source)).size
  } catch {
    console.warn(`  ! image not found, skipped: ${sitePath}`)
    return undefined
  }

  const name = storedName(mimeType, filename)
  await copyFile(source, join(uploadRoot, name))

  const dimensions = readDimensions(await readFile(source))
  const id = randomUUID()
  await execute(
    `INSERT INTO media (id, filename, url, mime_type, size, width, height, alt, folder, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(3), NOW(3))`,
    [id, filename, publicUrl(name), mimeType, size, dimensions.width ?? null, dimensions.height ?? null, alt.slice(0, 255), folder],
  )

  return { id, url: publicUrl(name), alt }
}

/* ------------------------------------------------------------------ */
/* Categories (shared by courses and blog posts)                        */
/* ------------------------------------------------------------------ */

async function categoryId(name: string, order: number): Promise<string> {
  const existing = await queryOne<Row>('SELECT id FROM categories WHERE name = ? LIMIT 1', [name])
  if (existing) return existing.id as string

  const id = randomUUID()
  await execute(
    `INSERT INTO categories (id, name, slug, sort_order, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, 'published', NOW(3), NOW(3))`,
    [id, name, slugify(name), order],
  )
  return id
}

/* ------------------------------------------------------------------ */
/* Courses                                                              */
/* ------------------------------------------------------------------ */

/**
 * A tool group as one line: "Deep learning: TensorFlow; Keras; OpenCV".
 *
 * The CMS holds tools as a flat list and the site prints them in named groups.
 * One line per group keeps the grouping without a second table, and the site
 * splits it back apart on the first colon. Semicolons between items because
 * a couple of item names contain commas.
 */
const toolLine = (group: { group: string; items: string[] }) => `${group.group}: ${group.items.join('; ')}`

async function seedCourses(): Promise<{ created: number; ids: Map<string, string> }> {
  const ids = new Map<string, string>()
  const categoryOrder: string[] = []
  let created = 0

  for (const course of COURSES) {
    if (!categoryOrder.includes(course.category)) categoryOrder.push(course.category)

    const existing = await queryOne<Row>(
      "SELECT id FROM courses WHERE slug = ? AND segment = 'courses' LIMIT 1",
      [course.slug],
    )
    if (existing) {
      ids.set(course.slug, existing.id as string)
      continue
    }

    const input = courseSchema.parse({
      // The CMS `title` is the short name it lists and searches by; the page
      // heading, with the city in it, goes in `h1`.
      title: course.shortTitle,
      h1: course.title,
      slug: course.slug,
      segment: 'courses',
      categoryId: await categoryId(course.category, categoryOrder.indexOf(course.category)),
      shortDescription: course.tagline,
      overview: course.summary.join('\n'),
      duration: course.duration,
      icon: course.icon,
      levelLabel: course.level,
      feeAmount: course.fee.amount,
      feeInstallments: course.fee.installments,
      seats: course.seats,
      nextBatch: course.nextBatch,
      weeklyHours: course.weeklyHours,
      ratingValue: course.rating.value,
      ratingCount: course.rating.count,
      modes: course.modes,
      languages: course.languages,
      batches: course.batches,
      certification: course.certification,
      eligibility: course.eligibility.join('\n'),
      highlights: course.outcomes,
      benefits: course.highlights.map((h) => ({
        placement: 'what-you-get',
        title: h.title,
        body: h.text,
        icon: h.icon,
      })),
      // The title column holds 120 characters; a longer line goes in the body,
      // and the site prints whichever is filled.
      audience: course.audience.map((line) =>
        line.length <= 120 ? { title: line, body: '' } : { title: '', body: line },
      ),
      syllabus: course.curriculum.map((module) => ({
        title: module.title,
        hours: Number.parseInt(module.hours, 10) || undefined,
        topics: module.topics,
      })),
      tools: course.tools.map(toolLine),
      projects: course.projects.map((p) => ({ title: p.title, body: p.text, tags: p.tags })),
      careerRoles: course.careers.map((c) => ({ role: c.role, salaryStart: c.salary, market: c.demand })),
      seo: {
        metaTitle: course.seo.title,
        metaDescription: course.seo.description,
        keywords: course.seo.keywords,
      },
      status: 'published',
    })

    const record = (await coursesRepo.create(input)) as { id: string }
    ids.set(course.slug, record.id)
    created += 1
  }

  // Related courses, once every course has an id to point at.
  for (const course of COURSES) {
    const id = ids.get(course.slug)
    if (!id) continue
    const linked = await queryOne<Row>('SELECT 1 AS n FROM course_related WHERE course_id = ? LIMIT 1', [id])
    if (linked) continue

    for (const [position, slug] of course.related.entries()) {
      const relatedId = ids.get(slug)
      if (!relatedId || relatedId === id) continue
      await execute(
        'INSERT IGNORE INTO course_related (course_id, related_id, position) VALUES (?, ?, ?)',
        [id, relatedId, position],
      )
    }
  }

  return { created, ids }
}

/* ------------------------------------------------------------------ */
/* Blog                                                                 */
/* ------------------------------------------------------------------ */

const escapeHtml = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** The site's heading / paragraphs / list sections as the HTML the editor writes. */
const sectionsToHtml = (sections: (typeof POSTS)[number]['sections']) =>
  sections
    .map((section) =>
      [
        `<h2>${escapeHtml(section.heading)}</h2>`,
        ...section.paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`),
        section.list ? `<ul>${section.list.map((item) => `<li><p>${escapeHtml(item)}</p></li>`).join('')}</ul>` : '',
      ].join(''),
    )
    .join('')

async function seedBlogs(authorId: string): Promise<number> {
  let created = 0
  let blogCategoryOrder = 100

  for (const post of POSTS) {
    const existing = await queryOne<Row>('SELECT id FROM blogs WHERE slug = ? LIMIT 1', [post.slug])
    if (existing) continue

    const cover = await importImage(post.image, post.title)
    const input = blogSchema.parse({
      title: post.title,
      slug: post.slug,
      authorId,
      categoryId: await categoryId(post.category, blogCategoryOrder++),
      tags: [post.courseName],
      coverImage: cover ?? null,
      excerpt: post.excerpt,
      body: sectionsToHtml(post.sections),
      publishDate: post.date,
      seo: { keywords: [] },
      status: 'published',
    })
    await blogsRepo.create(input, authorId)
    created += 1
  }

  return created
}

/* ------------------------------------------------------------------ */
/* Events                                                               */
/* ------------------------------------------------------------------ */

const EVENT_TYPE: Record<string, string> = {
  Workshop: 'workshop',
  'Demo class': 'demo-class',
  Seminar: 'seminar',
}

/** "11:00 AM" → "11:00", "4:00 PM" → "16:00". */
function to24h(label: string): string | undefined {
  const match = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(label.trim())
  if (!match) return undefined
  let hours = Number(match[1]) % 12
  if (match[3]!.toUpperCase() === 'PM') hours += 12
  return `${String(hours).padStart(2, '0')}:${match[2]}`
}

async function seedEvents(): Promise<number> {
  let created = 0

  for (const event of EVENTS) {
    const existing = await queryOne<Row>('SELECT id FROM events WHERE slug = ? LIMIT 1', [event.id])
    if (existing) continue

    const [start, end] = event.time.split(/\s*[–-]\s*/)
    const cover = await importImage(event.image, event.title)

    const input = eventSchema.parse({
      title: event.title,
      slug: event.id,
      eventType: EVENT_TYPE[event.kind] ?? 'seminar',
      mode: 'in-person',
      summary: event.summary,
      coverImage: cover ?? null,
      startsOn: event.date,
      startTime: to24h(start ?? '') ?? '',
      endTime: to24h(end ?? '') ?? '',
      venueName: SITE.name,
      venueAddress: SITE.address.street,
      city: SITE.address.locality,
      // What the "Reserve a free seat" button files the enquiry under.
      tags: [event.enquiry],
      seo: { keywords: [] },
      status: 'published',
    })
    await eventsRepo.create(input)
    created += 1
  }

  return created
}

/* ------------------------------------------------------------------ */
/* Gallery                                                              */
/* ------------------------------------------------------------------ */

const ALBUM_SLUG = 'life-at-git-education'

async function seedGallery(): Promise<number> {
  const existing = await queryOne<Row>('SELECT id FROM gallery_albums WHERE slug = ? LIMIT 1', [ALBUM_SLUG])
  if (existing) return 0

  const images = []
  for (const [order, photo] of PHOTOS.entries()) {
    const media = await importImage(photo.src, photo.caption)
    if (media) images.push({ media, caption: photo.caption, order })
  }
  if (images.length === 0) return 0

  await galleryRepo.create(
    albumSchema.parse({
      title: `Life at ${SITE.name}`,
      slug: ALBUM_SLUG,
      cover: images[0]!.media,
      description: 'Photos from the classrooms, the computer lab and our sessions.',
      images,
      status: 'published',
    }),
  )
  return images.length
}

/* ------------------------------------------------------------------ */
/* FAQs and reviews                                                     */
/* ------------------------------------------------------------------ */

async function seedFaqs(): Promise<number> {
  let created = 0
  const general = await faqsRepo.resolveCategory(undefined, 'General')

  for (const [order, [question, answer]] of GENERAL_FAQS.entries()) {
    const existing = await queryOne<Row>('SELECT id FROM faqs WHERE question = ? LIMIT 1', [question])
    if (existing) continue

    await execute(
      // Featured: these six are the ones the home page prints.
      `INSERT INTO faqs (id, question, answer, category_id, sort_order, featured, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, 1, 'published', NOW(3), NOW(3))`,
      [randomUUID(), question, answer, general, order],
    )
    created += 1
  }

  return created
}

async function seedReviews(): Promise<number> {
  let created = 0

  for (const [order, review] of REVIEWS.entries()) {
    const existing = await queryOne<Row>(
      'SELECT id FROM reviews WHERE author_name = ? AND quote = ? LIMIT 1',
      [review.name, review.text],
    )
    if (existing) continue

    await execute(
      // 'website', never 'google': that source prints the Google mark, and
      // these were collected by the institute, not left on Google.
      `INSERT INTO reviews
         (id, author_name, rating, quote, reviewed_on, course_name, badge,
          source, sort_order, status, created_at, updated_at)
       VALUES (?, ?, 5, ?, NULL, ?, ?, 'website', ?, 'published', NOW(3), NOW(3))`,
      [randomUUID(), review.name, review.text, review.course, review.role.slice(0, 80), order],
    )
    created += 1
  }

  return created
}

/* ------------------------------------------------------------------ */
/* Settings                                                             */
/* ------------------------------------------------------------------ */

/** Values the migrations and the settings module put there as placeholders. */
const PLACEHOLDER_NAMES = new Set(['', 'TechCADD', 'techcadd'])

async function seedSettings(): Promise<string[]> {
  const row = await queryOne<Row>('SELECT * FROM settings WHERE id = 1 LIMIT 1')
  if (!row) return []

  const details: Record<string, string> = {
    site_name: SITE.name,
    tagline: SITE.tagline,
    contact_email: SITE.email,
    address: `${SITE.address.street}, ${SITE.address.locality}, ${SITE.address.region} ${SITE.address.postalCode}`,
  }
  // The site still carries a dummy number; an all-zero phone is not a fact
  // worth copying into the CMS as though somebody had entered it.
  if (/[1-9]/.test(SITE.phone.replace(/^\+91/, ''))) details.contact_phone = SITE.phone

  const filled: string[] = []
  const assignments: string[] = []
  const params: unknown[] = []

  for (const [column, value] of Object.entries(details)) {
    const current = String(row[column] ?? '').trim()
    const empty = column === 'site_name' ? PLACEHOLDER_NAMES.has(current) : current === ''
    if (!empty) continue
    assignments.push(`${column} = ?`)
    params.push(value)
    filled.push(column)
  }

  if (assignments.length > 0) {
    await execute(`UPDATE settings SET ${assignments.join(', ')}, updated_at = NOW(3) WHERE id = 1`, params)
  }
  return filled
}

/* ------------------------------------------------------------------ */

async function main(): Promise<void> {
  const author = await queryOne<Row>(
    "SELECT id FROM users WHERE role = 'admin' AND active = 1 ORDER BY created_at ASC LIMIT 1",
  )
  if (!author) {
    throw new Error('No administrator account yet. Run `npm run db:seed` first — blog posts need an author.')
  }

  await ensureUploadRoot()

  const settings = await seedSettings()
  const courses = await seedCourses()
  const blogs = await seedBlogs(author.id as string)
  const events = await seedEvents()
  const photos = await seedGallery()
  const faqs = await seedFaqs()
  const reviews = await seedReviews()

  const line = (label: string, added: number, total: number) =>
    console.log(`  ${label.padEnd(10)} ${added} added (${total - added} already present)`)

  console.log(`\nSeeded giteducation.org's content into \`${process.env.DB_NAME}\`:`)
  line('courses', courses.created, COURSES.length)
  line('blogs', blogs, POSTS.length)
  line('events', events, EVENTS.length)
  line('gallery', photos, PHOTOS.length)
  line('faqs', faqs, GENERAL_FAQS.length)
  line('reviews', reviews, REVIEWS.length)
  console.log(`  settings   ${settings.length ? settings.join(', ') : 'already filled in'}`)
  console.log('\nSafe to run again.')
}

main()
  .catch((error: unknown) => {
    console.error('Seed failed:', error instanceof Error ? error.message : error)
    process.exitCode = 1
  })
  .finally(() => pool.end())
