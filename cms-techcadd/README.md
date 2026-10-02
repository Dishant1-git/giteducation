# GIT Education CMS

The content management system for giteducation.org (the Next.js site in the
repository root). Two projects:

| Folder | What it is | Dev address |
| --- | --- | --- |
| `cms-api/` | Express + MySQL API. Staff endpoints behind a session, and `/api/public/*` for the website. | http://localhost:4000 |
| `cms-admin/` | React admin panel staff sign in to. | http://localhost:5173 |

`backend/` and `frontend/` are leftovers of an older build (compiled output and
its `node_modules`). Nothing uses them and they are git-ignored; delete them
when convenient.

## First run

```bash
# 1. API
cd cms-techcadd/cms-api
cp .env.example .env        # set DB_USER / DB_PASSWORD, COOKIE_SECRET, REVALIDATE_SECRET
npm install
npm run db:migrate          # creates the giteducation_cms database
npm run db:seed             # first admin — prints the username and password
npm run db:seed:site        # copies the website's built-in content into the CMS
npm run dev

# 2. Admin
cd ../cms-admin
npm install
npm run dev

# 3. Website (repository root)
cp .env.example .env.local  # CMS_API_URL, NEXT_PUBLIC_CMS_URL, REVALIDATE_SECRET
npm run dev
```

`REVALIDATE_SECRET` must be the same value in `cms-api/.env` and the website's
`.env.local`.

## How the two fit together

- **Reading.** `src/lib/cms.ts` in the website fetches `/api/public/*` and
  shapes it for the pages. If the CMS is unset, down or empty for a module, the
  page uses the content built into `src/lib/*.ts` instead.
- **Publishing.** After every successful save the API calls the website's
  `POST /api/revalidate`, so an edit is live within seconds. Without that call
  the site still refreshes itself every five minutes.
- **Enquiries.** The website's forms post to its own `/api/enquiries`, which
  files the lead in the CMS (Enquiries module).
- **Images.** Files uploaded to the media library are served by the API at
  `/uploads/…`; the website loads them from `NEXT_PUBLIC_CMS_URL`.

## What the website reads

| CMS module | On the site |
| --- | --- |
| Courses, Course Categories | `/courses`, `/courses/[slug]` |
| Blogs | `/blogs`, `/blogs/[slug]`, home page slider |
| Events | `/events` (upcoming only) |
| Gallery | `/gallery` |
| FAQ | `/faq`, home page (featured questions) |
| Reviews | `/reviews`; reviews linked on a course appear on its page |
| Enquiries | receives the Book Free Demo and contact forms |

Not read by the site yet, and marked as such in the admin: Pages,
Testimonials, Comments, AI Knowledge, SEO redirects and Settings (the site's
phone number, address and social links are in its `src/lib/site.ts`).
Certificate programs (`/certificate-programs`) and the About pages are also
still built into the site.

## Course fields specific to this site

Migration `052_giteducation_course_fields.sql` adds what giteducation.org's
course page prints that the base schema did not hold: seats per batch, next batch, class load, delivery modes, languages, the batch
timetable, rating, the card icon and the level as worded on the page. It also adds fee and
instalment fields; the website no longer prints fees, so those are for the
office's reference only.

Two conventions the website relies on:

- **Tools** — one entry per group, written `Group: item; item; item`.
- **What you will learn** is the `highlights` list; **Eligibility** is one
  requirement per line.
