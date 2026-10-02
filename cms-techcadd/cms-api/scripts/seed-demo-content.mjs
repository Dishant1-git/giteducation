// Fills the empty modules with one real record each, so every wired-up page
// has something to render.
//
// Written for this integration: gallery, testimonials, events, editor pages
// and redirects all shipped with no rows at all, and a module with no data
// cannot be told apart from a module that is not wired up. One record each is
// enough to prove the path end to end and small enough that an editor can
// delete them without losing anything.
//
// Idempotent — every insert checks for its own row first.
//
//   node scripts/seed-demo-content.mjs

import { randomUUID } from 'node:crypto'
import { copyFile, readdir, mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import { readFileSync } from 'node:fs'

import mysql from 'mysql2/promise'

const env = Object.fromEntries(
  readFileSync(new URL('../.env', import.meta.url), 'utf8')
    .split(/\r?\n/)
    .filter((line) => /^\w+=/.test(line))
    .map((line) => {
      const at = line.indexOf('=')
      return [line.slice(0, at), line.slice(at + 1).replace(/^["']|["']$/g, '')]
    }),
)

const db = await mysql.createConnection({
  host: env.DB_HOST,
  port: Number(env.DB_PORT),
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  multipleStatements: false,
})

const one = async (sql, params = []) => (await db.query(sql, params))[0][0]

/** Copies a file from the website's public folder into the CMS media library. */
async function media(sourceName, alt) {
  const existing = await one('SELECT id, url FROM media WHERE alt = ? LIMIT 1', [alt])
  if (existing) return existing.id

  const uploads = join(process.cwd(), env.UPLOAD_DIR || 'uploads')
  await mkdir(uploads, { recursive: true })

  const from = join(process.cwd(), '..', '..', 'public', 'images', sourceName)
  const stored = `${randomUUID()}.png`
  await copyFile(from, join(uploads, stored))

  const id = randomUUID()
  await db.execute(
    `INSERT INTO media (id, filename, url, mime_type, size, width, height, alt, folder, created_at, updated_at)
     VALUES (?, ?, ?, 'image/png', 0, 1200, 900, ?, 'demo', NOW(3), NOW(3))`,
    // Site-relative to the CMS, which is how every upload is stored: the
    // website resolves it against the CMS origin.
    [id, stored, `/uploads/${stored}`, alt],
  )
  return id
}

let report = []

/* ---- an editor-authored page, with two blocks ---- */
{
  const slug = 'placement-support'
  let page = await one('SELECT id FROM pages WHERE slug = ? LIMIT 1', [slug])

  if (!page) {
    const id = randomUUID()
    await db.execute(
      `INSERT INTO pages (id, title, slug, template, nav_placement, nav_label, nav_order,
                          content, status, meta_title, meta_description, meta_keywords,
                          created_at, updated_at)
       VALUES (?, 'Placement Support', ?, 'default', 'footer', 'Placement Support', 0,
               '', 'published', 'Placement Support',
               'How placement assistance works at Techcadd Hoshiarpur.', '[]', NOW(3), NOW(3))`,
      [id, slug],
    )

    const blocks = [
      [
        'rich-text',
        'How placement support works',
        '<p>Resume reviews, mock technical and HR rounds, on-campus drives with recruiting companies, and direct referrals from mentors. Support continues after your course ends until you are placed.</p>',
        null,
        null,
      ],
      ['cta', 'Talk to a counsellor', 'Counselling is free and carries no obligation to enrol.', '/contact', 'Contact us'],
    ]

    for (const [position, [type, title, body, linkUrl, linkLabel]] of blocks.entries()) {
      await db.execute(
        `INSERT INTO page_sections (id, page_id, type, title, body, link_url, link_label,
                                    link_target, visible, position, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, 'same', 1, ?, NOW(3), NOW(3))`,
        [randomUUID(), id, type, title, body, linkUrl, linkLabel, position],
      )
    }
    report.push('page  /placement-support')
  }
}

/* ---- a redirect for the middleware to apply ---- */
{
  const from = '/placements'
  const existing = await one('SELECT id FROM redirects WHERE from_path = ? LIMIT 1', [from])
  if (!existing) {
    await db.execute(
      `INSERT INTO redirects (id, from_path, to_path, type, enabled, created_at, updated_at)
       VALUES (?, ?, '/placement-support', 301, 1, NOW(3), NOW(3))`,
      [randomUUID(), from],
    )
    report.push('redirect /placements -> /placement-support')
  }
}

/* ---- a testimonial ---- */
{
  const name = 'Gurleen Sandhu'
  const existing = await one('SELECT id FROM testimonials WHERE student_name = ? LIMIT 1', [name])
  if (!existing) {
    await db.execute(
      `INSERT INTO testimonials (id, student_name, batch, rating, quote, featured, status,
                                 created_at, updated_at)
       VALUES (?, ?, '2025 Full Stack', 5,
               'The six-month internship is the part that actually got me hired — I had shipped real features before my first interview.',
               1, 'published', NOW(3), NOW(3))`,
      [randomUUID(), name],
    )
    report.push('testimonial')
  }
}

/* ---- a gallery album with two photographs ---- */
{
  const slug = 'campus-and-labs'
  let album = await one('SELECT id FROM gallery_albums WHERE slug = ? LIMIT 1', [slug])

  if (!album) {
    const id = randomUUID()
    await db.execute(
      `INSERT INTO gallery_albums (id, title, slug, description, event_date, status, created_at, updated_at)
       VALUES (?, 'Campus and labs', ?, 'The project floor and the lab benches on an ordinary working day.',
               CURDATE(), 'published', NOW(3), NOW(3))`,
      [id, slug],
    )

    const files = (await readdir(join(process.cwd(), '..', '..', 'public', 'images')))
      .filter((name) => name.endsWith('.png'))
      .slice(0, 2)

    for (const [position, file] of files.entries()) {
      const mediaId = await media(file, `Campus photograph ${position + 1}`)
      await db.execute(
        `INSERT INTO gallery_images (id, album_id, media_id, caption, position)
         VALUES (?, ?, ?, ?, ?)`,
        [randomUUID(), id, mediaId, position === 0 ? 'The project floor' : 'Lab benches', position],
      )
    }
    report.push(`album /gallery (${files.length} photographs)`)
  }
}

/* ---- a blog post, so the blog and its comment thread have something ---- */
{
  const slug = 'what-employers-actually-test-in-a-fresher-interview'
  const existing = await one('SELECT id FROM blogs WHERE slug = ? LIMIT 1', [slug])

  if (!existing) {
    const author = await one("SELECT id FROM users WHERE role = 'admin' ORDER BY created_at LIMIT 1")
    const category = await one("SELECT id FROM categories WHERE name = 'Programming' LIMIT 1")
    const cover = await media('6_Months.png', 'Fresher interview preparation')

    await db.execute(
      `INSERT INTO blogs (id, title, slug, author_id, category_id, cover_image_id, excerpt, body,
                          publish_date, status, meta_title, meta_description, meta_keywords,
                          created_at, updated_at)
       VALUES (?, 'What employers actually test in a fresher interview', ?, ?, ?, ?,
               'Four rounds, and what each one is really looking for — from the people who sit on the other side of them.',
               '<p>Most fresher interviews are not a test of how much you have memorised. They are a test of whether you can explain a decision you made.</p><h2>The screening round</h2><p>A recruiter checks that your CV is what it claims. Keep your project list short and be able to talk about every line of it.</p><h2>The technical round</h2><p>Expect to be asked why you chose a database, not to recite its syntax.</p>',
               CURDATE(), 'published', 'What employers actually test in a fresher interview',
               'Four rounds, and what each one is really looking for.', '[]', NOW(3), NOW(3))`,
      [randomUUID(), slug, author?.id ?? null, category?.id ?? null, cover],
    )
    report.push(`blog /blog/${slug}`)
  }
}


/* ---- an event, with an agenda and highlights ---- */
{
  const slug = 'ai-careers-open-day'
  let event = await one('SELECT id FROM events WHERE slug = ? LIMIT 1', [slug])

  if (!event) {
    const id = randomUUID()
    const cover = await media('45_days.png', 'AI careers open day')

    await db.execute(
      `INSERT INTO events (id, title, slug, event_type, mode, summary, body, cover_image_id,
                           starts_on, start_time, end_time, venue_name, city, host_name,
                           registration_url, seats, featured, status, meta_title, meta_description,
                           meta_keywords, created_at, updated_at)
       VALUES (?, 'AI Careers Open Day', ?, 'seminar', 'in-person',
               'A morning with the trainers and the placement team on what an AI career actually asks for.',
               '<p>Walk the labs, sit in on a live session, and ask the placement team the questions a brochure does not answer.</p>',
               ?, DATE_ADD(CURDATE(), INTERVAL 21 DAY), '10:00:00', '13:00:00',
               'Techcadd Campus', 'Hoshiarpur', 'Techcadd Placement Team',
               'https://techcadd.com/contact', 60, 1, 'published',
               'AI Careers Open Day', 'A morning with the trainers and the placement team.',
               '[]', NOW(3), NOW(3))`,
      [id, slug, cover],
    )

    const agenda = [
      ['10:00', 'Doors open and lab tour', 'See the GPU workstations and the project floor.'],
      ['11:00', 'What an AI role asks for', 'The skills hiring managers actually test.'],
      ['12:00', 'Placement team Q&A', 'Bring your CV.'],
    ]
    for (const [position, [time, title, detail]] of agenda.entries()) {
      await db.execute(
        `INSERT INTO event_agenda (id, event_id, time_label, title, detail, position)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [randomUUID(), id, time, title, detail, position],
      )
    }

    const highlights = [
      'A clear picture of which track fits your background',
      'The lab tour, without an appointment',
      'A CV review on the day',
    ]
    for (const [position, text] of highlights.entries()) {
      await db.execute(
        'INSERT INTO event_highlights (id, event_id, text, position) VALUES (?, ?, ?, ?)',
        [randomUUID(), id, text, position],
      )
    }
    report.push('event /events/ai-careers-open-day')
  }
}

console.log(
  report.length > 0
    ? `Seeded into \`${env.DB_NAME}\`:\n  ${report.join('\n  ')}`
    : 'Everything is already seeded — nothing to do.',
)

await db.end()
