# Course page — UI guidelines

Implementation-ready rules for the slug-based course pages at `/courses/[slug]`.
"Must" is non-negotiable. "Should" is a recommendation a reviewer may waive with a reason.

---

## 1. Context and goals

**Design intent, in one sentence:** a course page must read like an official course prospectus — structured, verifiable, printable — while still converting a visitor into an enquiry.

- **Audience:** readers and knowledge seekers — students, parents and working adults comparing institutes, usually on a mid-range Android phone.
- **Surface:** marketing site, slug-driven. One template, content per course in `src/lib/courses.ts`.
- **Success:** a visitor can answer "what will I learn, how long, when, how much, and what job does it lead to" without calling — then calls anyway, because the CTA is always within reach.

### Where the content lives

| Concern | File |
| --- | --- |
| Course content (all courses) | `src/lib/courses.ts` |
| Site identity, nav, contact | `src/lib/site.ts` |
| Page template | `src/app/courses/[slug]/page.tsx` |
| Interactive parts | `src/app/courses/[slug]/course-ui.tsx` |
| Course directory | `src/app/courses/page.tsx` |
| Tokens and primitives | `src/app/globals.css` |
| Motion primitives | `src/components/motion.tsx` |

Adding a course means adding one object to `COURSES`. No template edit, and `generateStaticParams` prerenders the new page automatically.

---

## 2. Design tokens and foundations

Component code **must** use semantic tokens. Raw hex values and one-off spacing **must not** appear in component files; the palette lives in `@theme` in `globals.css` and nowhere else.

### Colour (semantic layer)

| Token | Utility | Use |
| --- | --- | --- |
| `--color-surface` | `bg-surface` | Page background |
| `--color-surface-raised` | `bg-surface-raised` | Cards, table bodies, accordions |
| `--color-surface-sunken` | `bg-surface-sunken` | Wells, table headers, chips |
| `--color-surface-accent` | `bg-surface-accent` | Informational blocks, active nav item |
| `--color-surface-inverse` | `bg-panel` | Dark sections |
| `--color-content` | `text-content` | Body text — 15.8:1 on surface |
| `--color-content-muted` | `text-content-muted` | Secondary text — 6.4:1 |
| `--color-content-inverse` | `text-white` | Text on inverse — 17.9:1 |
| `--color-action` | `text-action` / `bg-action` | Links and primary action — 8.6:1 on white |
| `--color-action-hover` | `bg-action-hover` | Hover/active of primary action |
| `--color-focus` | outline colour | Focus ring. Never overridden to transparent |
| `--color-border-subtle` / `--color-border-strong` | `border-border-subtle` / `-strong` | Dividers; `strong` for emphasis and table rules |
| `--color-status-{info,success,warning,danger}` + `-soft` | badges, notices | Status only. Never decoration |

**Rules**

- Text on a dark surface **must** sit inside an element carrying `.on-inverse`, which flips the focus ring to white.
- Status colour **must** be paired with a text label. Colour alone **must not** carry meaning (the demand column reads "High", not a green dot).
- New colours **must** be added as semantic tokens, not inline.

### Typography

Two families only: `font-sans` (Inter) for text, `font-display` (Bricolage) for headings.

| Role | Classes |
| --- | --- |
| Page H1 | `font-display text-[clamp(2rem,5.2vw,3.5rem)] leading-[1.05] font-extrabold tracking-[-0.03em] text-balance` |
| Section H2 | `font-display text-2xl sm:text-3xl lg:text-[2.1rem] font-extrabold tracking-[-0.02em]` |
| Card H3 | `text-[15px] font-bold tracking-tight` |
| Body | `text-[15px] sm:text-base leading-relaxed` |
| Secondary | `text-sm leading-relaxed text-content-muted` |
| Eyebrow / label | `.section-rule`, or `font-mono text-[11px] tracking-[0.12em] uppercase` |

- Body copy **must not** be set below 14px (`text-sm`). Labels and legal text may go to 12px; nothing on the page goes below 11px.
- Long titles **must** wrap, never truncate: use `text-balance` on headings, `truncate` only where a fixed-width row makes it unavoidable (the mobile action bar).
- Line length **should** stay under ~75 characters — use `max-w-2xl` on prose blocks.

> **Deviation from the supplied brief, recorded deliberately:** the brief's scraped scale (`font.size.xs=6.5px`, base 13–16px) and its inverted colour set (`text.primary=#ffffff` on `surface.base=#000000`) come from a different site. Adopting them here would fail WCAG 2.2 AA on body text size and break consistency with the existing home page. The rules above keep the brief's *structure* — semantic tokens, a fixed scale, no local exceptions — on this site's palette.

### Spacing, radius, elevation, motion

- Spacing **must** come from the Tailwind scale (`gap-3`, `p-5`, `py-12`…). Arbitrary pixel padding is not allowed in component files.
- Section rhythm: `py-12 lg:py-16`, separated by `border-t border-border-subtle`.
- Radius: `rounded-control` (buttons/inputs), `rounded-card` (cards, accordion items), `rounded-panel` (large panels), `rounded-full` (pills and CTAs).
- Elevation: `shadow-card` (resting card), `shadow-raised` (floating action), `shadow-overlay` (menus). Nothing else.
- Motion: `--motion-instant 150ms`, `--motion-fast 180ms`, `--motion-normal 240ms`, `--motion-slow 320ms`, `--motion-slower 520ms`.
  - Entrance animations **must** animate `opacity` and `transform` only.
  - Every entrance **must** be `once: true` — content never re-animates on scroll-back.
  - `prefers-reduced-motion: reduce` **must** remove movement, never content: reduced-motion users get the final state immediately.

---

## 3. Component rules

Every interactive component **must** define: default, hover, focus-visible, active, disabled, loading, error. Where a state cannot occur (a static link has no loading state), the component documents that it cannot occur rather than leaving it undefined.

### 3.1 Primary action (CTA button / link)

- **Anatomy:** label, optional leading icon (`size-4`), optional trailing arrow marked `aria-hidden`.
- **Sizing:** `h-12` desktop and mobile; `h-11` for secondary actions inside cards. Minimum hit area 44×44 px — a smaller visual control **must** add padding to reach it.
- **Variants:** `accent` (yellow on dark hero), `solid` (`bg-action text-white`), `outline` (`border-white/25` on inverse, `border-border-strong` on light), `quiet` (text + arrow).

| State | Rule |
| --- | --- |
| Default | Token background, `font-semibold`, radius `rounded-full` |
| Hover | Background shifts one step (`hover:bg-action-hover`, or `hover:bg-white` on accent) + `hover:-translate-y-0.5`; duration `--motion-normal` |
| Focus-visible | Global 3px `--color-focus` outline at 2px offset; white on `.on-inverse`. **Must not** be removed |
| Active | Translate returns to 0 — the button "presses" |
| Disabled | `opacity-60`, `cursor-not-allowed`, `aria-disabled="true"`. A disabled link **must** be rendered as a `<button>`, never a dead `<a>` |
| Loading | `aria-busy="true"`, label replaced by spinner + accessible "Submitting…". Width **must** be preserved so layout does not jump |
| Error | Error text is owned by the form, not the button; the button returns to default |

- **Keyboard:** Enter and Space activate. Tab order follows DOM order; no positive `tabindex`.
- **Pointer:** hover effects only under `(hover: hover)`. **Touch:** no hover-only affordance may be the sole path to an action.
- **Long content:** labels **should** stay under 24 characters; longer labels wrap rather than overflow.

### 3.2 Accordion (curriculum, FAQs)

- **Anatomy:** `<h3>` wrapping a `<button aria-expanded aria-controls>` (index, title, meta, `+` indicator) and a panel with `role="region" aria-labelledby`.
- **Variants:** with "Expand all" (curriculum, `showExpandAll`), without (FAQs). `defaultOpenFirst` opens module 01 so the page never presents an entirely closed block.

| State | Rule |
| --- | --- |
| Default | `border-border-subtle`, `bg-surface-raised/70` |
| Hover | `border-border-strong` |
| Focus-visible | Global outline on the header button |
| Open | `border-border-strong`, `bg-surface-raised`, `shadow-card`, title in `text-action`, indicator rotates 135° |
| Disabled | Not applicable — a module is never disabled; a course with no modules renders no section (see empty states) |
| Loading | Not applicable — content is static and prerendered |
| Error | Not applicable |

- **Keyboard:** Tab reaches each header; Enter/Space toggles. Arrow-key roving is **not** used, because these are disclosures, not a tablist — `aria-expanded` carries the state.
- **Touch:** whole header row is the tap target (min height 56px).
- **Motion:** height + opacity, `--motion-slow`; reduced motion collapses to opacity only.
- **Long content:** topics wrap in a two-column grid that collapses to one below `sm`. No max-height or inner scroll.

### 3.3 Section index (`SectionNav`)

- **Anatomy:** `<nav aria-label="On this page">` + ordered list of in-page links with two-digit numbers.
- **Responsive:** horizontal, sticky under the header below `lg`; vertical and sticky at `lg:top-28` above it.

| State | Rule |
| --- | --- |
| Default | `text-content-muted` |
| Hover | `bg-surface-sunken text-content` |
| Focus-visible | Global outline |
| Active (scrollspy) | `bg-surface-accent`, `font-semibold text-action`, `aria-current="true"` |
| Empty | If fewer than three sections exist, the index **must not** render |

- Scrollspy **must** pick the section nearest the top of the viewport, never "last intersected", to avoid flicker.
- The active item **must** be scrolled into view in the horizontal variant.
- Anchor targets **must** clear the fixed header (`scroll-mt-28`, plus the global `[id] { scroll-margin-top: 7rem }`).

### 3.4 Data table (career outcomes, batches)

- **Anatomy:** `<table class="data-table">` with `<caption>`, `<thead>` column headers (`scope="col"`), row headers (`scope="row"`) for the first cell of each row.
- The table **must** be wrapped in `.scroll-x` with `tabIndex={0}`, `role="group"` and an accessible name, so a keyboard user can scroll it.

| State | Rule |
| --- | --- |
| Default | `bg-surface-raised`, 1px `--color-border-subtle` row rules |
| Header | `bg-surface-sunken`, 2px `--color-border-strong` bottom rule, uppercase 12px |
| Row hover | `bg-surface-accent` (pointer only) |
| Focus-visible | Outline on the scroll container |
| Empty | A course with no batches **must** render a "Batch timings confirmed at counselling" note instead of an empty table |

- Numeric columns **must** use `tabular-nums`; timings use `whitespace-nowrap`.
- Tables **must not** be replaced by stacked `<div>`s on mobile — they stay tables and scroll, so the header/row relationship survives for screen readers.

### 3.5 Mobile action bar

- Appears after 640px of scroll, `lg:hidden`, `role` none (it is a region of links).
- **Must not** overlap the floating WhatsApp action: `body:has(.course-action-bar) .floating-actions { bottom: 5.25rem }` handles this declaratively, plus `pr-20` on the bar's content.
- Animates on the Y axis at `--motion-slow`; reduced motion fades instead.
- The course title truncates to one line; the two actions never shrink.

### 3.6 Header and dropdowns

- Each dropdown **must** be a `<button aria-expanded aria-controls>`, never a hover-only `<div>`.
- **Pointer:** opens on hover with a 120ms close delay, only when `(hover: hover) and (pointer: fine)`.
- **Touch and keyboard:** opens on click/Enter/Space.
- Escape **must** close the panel and return focus to the trigger; an outside pointer-down closes it.
- The mobile drawer **must** lock body scroll, move focus into the panel and close on Escape and on navigation.

### Page-wide density budget

The reference density for this template is: links ≈ 106, buttons ≈ 54, cards ≈ 26, lists ≈ 16, inputs ≈ 5, navigation ≈ 5, tables = 2. Two rules follow:

- A page **must not** exceed two data tables; a third comparison belongs in cards.
- Repeated link groups (tools, topics, tags) **must** be marked up as lists so the 100+ links stay navigable by landmark and list shortcuts.

---

## 4. Accessibility — testable acceptance criteria

Target: **WCAG 2.2 AA**. Each criterion below is a pass/fail check.

| # | Criterion | How to test | Pass |
| --- | --- | --- | --- |
| A1 | Skip link | Load page, press Tab once | "Skip to main content" becomes visible and moves focus to `#main-content` |
| A2 | Focus visible everywhere | Tab through the entire page | Every stop shows a 3px `--color-focus` ring (white on dark). No stop is invisible |
| A3 | Focus order | Tab through | Order matches visual order; focus never jumps behind the fixed header |
| A4 | Dropdown keyboard contract | Focus a nav trigger, press Enter, then Escape | Panel opens, `aria-expanded="true"`; Escape closes it and focus returns to the trigger |
| A5 | Drawer | Open the mobile menu | Body scroll locks, focus enters the panel, Escape closes it |
| A6 | Accordion semantics | Inspect a curriculum header | `<button aria-expanded aria-controls>` inside a heading; panel has `role="region"` + `aria-labelledby` |
| A7 | Table semantics | Inspect both tables | `<caption>` present; `scope="col"` on every column header; `scope="row"` on the first cell of each row |
| A8 | Table scroll by keyboard | Tab to a table on a 360px viewport | The scroll container takes focus and arrow keys scroll it |
| A9 | Contrast | Sample body, muted text, links, badges, both themes of surface | Every text pairing ≥ 4.5:1; large headings ≥ 3:1 |
| A10 | Colour independence | Grayscale the page | Demand, seat availability and notice severity remain readable from text alone |
| A11 | Reduced motion | Enable `prefers-reduced-motion: reduce`, reload | No entrance movement, no parallax, no marquee; all content visible and in final position |
| A12 | No-JS resilience | Disable JavaScript | All course content is present in the HTML (pages are prerendered); accordions render collapsed but their content is in the DOM for search engines |
| A13 | Target size | Measure every control | ≥ 44×44 px, or ≥ 24×24 px with adequate spacing (WCAG 2.2 SC 2.5.8) |
| A14 | Headings | Run a heading-order check | One `<h1>`; sections are `<h2>`; card and accordion titles are `<h3>`; no level is skipped |
| A15 | Landmarks | Inspect landmarks | One `<header>`, one `<main>`, one `<footer>`; every `<nav>` has a unique `aria-label` |
| A16 | Link purpose | Read links out of context | No "click here"/"read more"; external links announce "(opens in a new tab)" |
| A17 | Zoom / reflow | 320px width at 400% zoom | No horizontal page scroll; only tables scroll, inside their own container |
| A18 | Images | Inspect decorative art | Decorative SVG is `aria-hidden`; meaningful icons carry a `title` |

---

## 5. Content and tone standards

Concise, confident, implementation-focused. Write what happens, not what it feels like.

| Do | Don't |
| --- | --- |
| "Six modules over six months. Every module ends with a practical file checked by your trainer." | "An amazing journey of transformation!" |
| "Placement support, not a guaranteed job." | "100% placement guarantee" |
| "Fees shown are indicative and confirmed in writing at counselling." | Silence about fees |
| "Salary bands reported to us by employers and alumni." | "Earn ₹12 LPA!" |
| Button: "Book a free demo class" | Button: "Click here" |
| Empty state: "Batch timings confirmed at counselling." | An empty table |

**Rules**

- Every claim about outcomes **must** be attributable (assessment, employer report, student count) or qualified.
- Numbers shown to a visitor (fee, duration, seats, rating) **must** come from `courses.ts`, never from copy typed into JSX.
- Button and link labels **must** name the action and its object: "Confirm my seat", "Download syllabus", "Email an enquiry".
- Indian English, Indian number formatting (`₹42,000` via `formatFee`), 12-hour batch timings.

---

## 6. Anti-patterns — prohibited

1. **Hidden focus.** `outline: none` without a replacement of equal contrast.
2. **Hover-only disclosure.** A menu or panel reachable only by hovering.
3. **Raw hex or one-off spacing** in a component file.
4. **A new type size** outside the scale to make one heading fit.
5. **Colour-only status.** A green dot with no label.
6. **Re-animating content** on every scroll pass, or entrance animations that leave content invisible when JS fails.
7. **Truncated course titles** in the page heading or card titles.
8. **Tables rebuilt as stacked divs** on mobile.
9. **Fabricated urgency** — countdowns, fake "2 seats left" that never change.
10. **Guaranteed-job claims** of any kind.
11. **Course copy inside JSX.** New content goes in `courses.ts`.
12. **A third data table** on one page.

---

## 7. Migration notes

- Header, footer and site chrome moved out of `src/app/page.tsx` into `src/components/` and are mounted once in `src/app/layout.tsx`. Page files **must not** render their own header or footer.
- The legacy `.reveal` / `.is-visible` CSS system still drives the home page and is re-attached on every route change by `SiteChrome`. **New sections must use the `Reveal` / `Stagger` primitives** from `src/components/motion.tsx` instead; the CSS system is not extended further.
- Every page **must** open with a dark hero band, because the header renders transparent over the top of the page before scroll.
- Course links **must** point at `/courses/<slug>`; `#contact` remains the enquiry anchor on the home page.

## 8. Edge cases the template already handles

| Case | Behaviour |
| --- | --- |
| Unknown slug | `notFound()` → `not-found.tsx` lists every live course and the helpline |
| Missing related slug | Filtered out by `getRelatedCourses`; the rail hides itself if empty |
| Long course title | Wraps with `text-balance`; the hero clamp keeps it within two or three lines at 320px |
| Long batch timing string | Table cell keeps `whitespace-nowrap`; the container scrolls |
| Course with one review | Grid collapses to a single column; no placeholder card is invented |
| Print | Chrome, floating actions and the action bar are dropped; tables repeat headers; external links print their URL |

---

## 9. QA checklist

Before merging a change to a course page or the template:

- [ ] `npx next build` passes — every slug in `COURSES` prerenders.
- [ ] `npx eslint src --max-warnings=0` is clean.
- [ ] Tab through the whole page: every stop has a visible ring, order matches the visual order (A1–A3).
- [ ] Open and close each nav dropdown with keyboard only, including Escape (A4).
- [ ] Open the mobile drawer; confirm scroll lock, focus move and Escape (A5).
- [ ] Toggle every accordion, then "Expand all" and "Collapse all".
- [ ] 320px, 360px, 768px, 1024px, 1440px: no horizontal page scroll; tables scroll inside their container (A17).
- [ ] `prefers-reduced-motion: reduce`: no movement, nothing invisible (A11).
- [ ] Contrast sample: body, muted, link, each status badge, hero text on the dark panel (A9).
- [ ] Grayscale pass: status still readable (A10).
- [ ] View source: `Course`, `BreadcrumbList` and `FAQPage` JSON-LD present and valid.
- [ ] Metadata: title, description, canonical and keywords come from `course.seo`.
- [ ] Print preview: one clean syllabus document, no chrome.
- [ ] Fee, duration, seats and rating on the page match `courses.ts`.
- [ ] No hardcoded phone, email or course copy introduced in JSX.
