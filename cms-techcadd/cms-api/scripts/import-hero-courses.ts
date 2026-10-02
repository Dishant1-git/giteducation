/**
 * Puts every course the website already renders into the CMS.
 *
 * Why this exists
 * ---------------
 * The site knows 39 courses, but they live in
 * `src/lib/courses/*.ts` — TypeScript only a developer can edit.
 * The CMS held none, so an admin opening the Courses list saw an empty table
 * even though every one of those courses has a live page with a heading, a
 * syllabus, a tool list and a careers list that someone in the office might
 * reasonably want to change.
 *
 * This reads the same catalogue the website reads and writes one CMS row per
 * course. After it runs the CMS is the editing surface for all of them: the
 * site's `courseOverlay` hands an edited field back to the page, and the
 * bundled entry stays as the fallback for everything nobody has touched.
 *
 * Only the `courses` segment. `/after-12th` and `/internship-training` are
 * pathways and formats rather than courses — they deliberately carry no
 * syllabus of their own, and inventing one to fit this table would publish the
 * same curriculum at two URLs.
 *
 * Idempotent. Matched on `segment` + `slug`, which is how a course is looked
 * up. An existing row is left exactly as it is — this seeds what is missing and
 * never overwrites an editor's work.
 *
 * Usage
 * -----
 *   cd cms-techcadd/cms-api
 *   npm run db:import-hero-courses
 *
 *   DRY_RUN=1 npm run db:import-hero-courses   # report only, write nothing
 */

import { randomUUID } from 'node:crypto'

import { execute, query, queryOne, pool, type Row } from '../src/db/pool.js'
import * as coursesRepo from '../src/modules/courses/courses.repo.js'
import { courseSchema } from '../src/modules/courses/courses.schema.js'
// The website's catalogue, read directly so there is one source of truth for
// what the site actually offers.
import { COURSES } from '../../../src/lib/courses/index.js'

const DRY_RUN = process.env.DRY_RUN === '1'

/** The CMS grades a course in three steps; the site writes a free-text level. */
function level(value: string): 'beginner' | 'intermediate' | 'advanced' | '' {
  const text = value.toLowerCase()
  if (text.includes('advanced')) return 'advanced'
  if (text.includes('intermediate')) return 'intermediate'
  if (text.includes('beginner') || text.includes('fresher')) return 'beginner'
  // "Beginner to Advanced" and friends land here. Saying nothing beats picking
  // one — an editor can grade it, and the page keeps the site's own wording
  // until they do.
  return ''
}

/** Likewise for mode: the site's "Online / Offline" is the CMS's "hybrid". */
function mode(value: string): 'online' | 'offline' | 'hybrid' | '' {
  const text = value.toLowerCase()
  if (text.includes('/') || text.includes('hybrid')) return 'hybrid'
  if (text.includes('online')) return 'online'
  if (text.includes('offline')) return 'offline'
  return ''
}

const difficulty = (value: string) =>
  value.toLowerCase() as 'beginner' | 'intermediate' | 'advanced'

/** Within the column's limit, cut on a word rather than mid-syllable. */
function clamp(text: string, max: number): string {
  const trimmed = text.trim()
  if (trimmed.length <= max) return trimmed
  const cut = trimmed.slice(0, max - 1)
  const space = cut.lastIndexOf(' ')
  return `${space > max / 2 ? cut.slice(0, space) : cut}…`
}

async function main(): Promise<void> {
  /*
   * Categories are matched by name so an imported course lands in the group the
   * site's own filters already file it under.
   *
   * A missing one is created rather than left unset. That is not this script
   * inventing an editorial decision: these are the groups the site's own
   * catalogue already sorts its courses into, and `/courses?category=…` links
   * to them from the footer today. A course imported with no category drops
   * out of the filter it currently appears under, which is a visible
   * regression rather than a tidy default.
   */
  const categoryRows = await query<Row>('SELECT id, name FROM categories')
  const categoryByName = new Map(
    categoryRows.map((row) => [String(row.name).toLowerCase(), row.id as string]),
  )

  const slugify = (value: string) =>
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

  async function categoryId(name: string): Promise<string> {
    const existing = categoryByName.get(name.toLowerCase())
    if (existing) return existing

    const id = randomUUID()
    if (!DRY_RUN) {
      await execute(
        `INSERT INTO categories (id, name, slug, sort_order, status, created_at, updated_at)
         VALUES (?, ?, ?, ?, 'published', NOW(3), NOW(3))`,
        [id, name, slugify(name), categoryByName.size],
      )
    }
    categoryByName.set(name.toLowerCase(), id)
    added += 1
    return id
  }

  let created = 0
  let skipped = 0
  let added = 0

  for (const course of COURSES) {
    const existing = await queryOne<Row>(
      "SELECT id FROM courses WHERE segment = 'courses' AND slug = ? LIMIT 1",
      [course.slug],
    )

    if (existing) {
      skipped += 1
      continue
    }

    const category = await categoryId(course.category)

    /*
     * Parsed rather than passed straight through, so every default the schema
     * declares is applied here exactly as it would be for a form submission.
     * An import that writes rows the API itself would refuse is worse than no
     * import at all.
     */
    const input = courseSchema.parse({
      title: clamp(course.title, 120),
      slug: course.slug,
      segment: 'courses',
      categoryId: category,
      shortDescription: clamp(course.shortDescription, 200),
      overview: course.overview,
      duration: course.duration,
      level: level(course.level),
      mode: mode(course.mode),
      certification: course.certification
        ? 'Industry-recognised completion certificate'
        : undefined,
      badge: course.badge,
      videoUrl: course.video.url || undefined,
      videoTitle: course.video.caption ? clamp(course.video.caption, 200) : undefined,
      careers: course.careerOutcomes.roles,
      tools: course.tools,
      highlights: course.learningOutcomes,
      audience: course.audience.map((item) => ({ title: item.label, body: item.copy })),
      whyPoints: course.whyChooseUs.map((item) => ({ title: item.title, body: item.copy })),
      careerRoles: (course.careerOutcomes.roleDetails ?? []).map((item) => ({
        role: clamp(item.role, 120),
        body: item.copy,
      })),
      toolItems: course.tools.map((name) => ({ name: clamp(name, 80) })),
      syllabus: course.modules.map((module) => ({
        title: module.title,
        body: module.summary,
        topics: module.topics,
      })),
      projects: course.projects.map((project) => ({
        title: clamp(project.name, 160),
        body: project.summary,
        tags: project.tech,
        difficulty: difficulty(project.level),
      })),
      /*
       * The course's FAQs are deliberately not imported.
       *
       * `course_faqs` joins to the shared FAQ list rather than storing a
       * question per course, so importing them would file 39 near-identical
       * copies of the same handful of questions into the help centre the site
       * renders from that same list. The page keeps the bundled FAQs, which is
       * the honest outcome until an editor curates them.
       */
      seo: {
        metaTitle: clamp(course.title, 60),
        metaDescription: clamp(course.overview, 160),
        keywords: course.keywords,
        robotsIndex: true,
        inSitemap: true,
        faqSchema: true,
      },
      // Published, because these pages are already live. Importing them as
      // drafts would take 39 working pages off the site the moment the CMS
      // started answering for them.
      status: 'published',
    })

    if (!DRY_RUN) await coursesRepo.create(input)
    created += 1
  }

  console.log(`\n${DRY_RUN ? 'Would import' : 'Imported'} into \`${process.env.DB_NAME}\`:`)
  console.log(`  created       ${created}`)
  console.log(`  already there ${skipped}`)
  console.log(`  categories    ${added} created from the site's own groups`)
}

main()
  .catch((error: unknown) => {
    console.error('Import failed:', error instanceof Error ? error.message : error)
    process.exitCode = 1
  })
  .finally(() => pool.end())
