import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Icon } from "@/components/icon";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { COURSES, FEE_NOTE, PLACEMENT_STEPS, formatFee, getCourse, getRelatedCourses, type Course } from "@/lib/courses";
import { SITE, TEL_HREF, WHATSAPP_HREF, courseEnquiryEmail } from "@/lib/site";

import { Accordion, CourseActionBar, PrintButton, SectionNav } from "./course-ui";

/** Sections rendered on every course page, in order. Also drives the page index. */
const SECTIONS = [
  { id: "overview", label: "Course overview" },
  { id: "outcomes", label: "What you will learn" },
  { id: "curriculum", label: "Curriculum" },
  { id: "tools", label: "Tools & software" },
  { id: "projects", label: "Live projects" },
  { id: "careers", label: "Career outcomes" },
  { id: "placement", label: "Placement support" },
  { id: "eligibility", label: "Eligibility" },
  { id: "batches", label: "Batches & fees" },
  { id: "certification", label: "Certification" },
  { id: "reviews", label: "Student reviews" },
  { id: "faqs", label: "FAQs" },
];

export function generateStaticParams() {
  return COURSES.map((course) => ({ slug: course.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const course = getCourse(slug);
  if (!course) return { title: "Course not found" };

  const path = `/courses/${course.slug}`;
  return {
    title: course.seo.title,
    description: course.seo.description,
    keywords: course.seo.keywords,
    alternates: { canonical: path },
    openGraph: {
      title: course.seo.title,
      description: course.seo.description,
      url: path,
      type: "article",
    },
  };
}

/* ---------------------------------------------------------------- *
 * Building blocks
 * ---------------------------------------------------------------- */

function SectionHeading({
  id,
  index,
  title,
  lead,
}: {
  id: string;
  index: number;
  title: string;
  lead?: string;
}) {
  return (
    <div className="mb-8">
      <p className="section-rule text-action">Section {String(index).padStart(2, "0")}</p>
      <h2 id={`${id}-title`} className="mt-3 font-display text-2xl leading-tight font-extrabold tracking-[-0.02em] text-balance sm:text-3xl lg:text-[2.1rem]">
        {title}
      </h2>
      {lead && <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-content-muted sm:text-base">{lead}</p>}
    </div>
  );
}

function Section({
  id,
  index,
  title,
  lead,
  children,
}: {
  id: string;
  index: number;
  title: string;
  lead?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-28 border-t border-border-subtle py-12 first:border-t-0 lg:py-16">
      <Reveal>
        <SectionHeading id={id} index={index} title={title} lead={lead} />
      </Reveal>
      {children}
    </section>
  );
}

/** Label/value pair used in the hero fact strip and the summary card. */
function Fact({ icon, label, value, inverse = false }: { icon: string; label: string; value: string; inverse?: boolean }) {
  return (
    <div className="flex items-start gap-3">
      <span className={`mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl ${inverse ? "bg-white/10 text-accent-yellow" : "bg-surface-accent text-action"}`}>
        <Icon name={icon} className="size-4.5" />
      </span>
      <span className="min-w-0">
        <span className={`block text-[11px] font-semibold tracking-[0.12em] uppercase ${inverse ? "text-white/55" : "text-content-muted"}`}>{label}</span>
        <span className={`mt-0.5 block text-sm leading-snug font-semibold ${inverse ? "text-white" : "text-content"}`}>{value}</span>
      </span>
    </div>
  );
}

function StructuredData({ course }: { course: Course }) {
  const url = `${SITE.url}/courses/${course.slug}`;
  const data = [
    {
      "@context": "https://schema.org",
      "@type": "Course",
      name: course.title,
      description: course.seo.description,
      url,
      inLanguage: "en-IN",
      educationalLevel: course.level,
      teaches: course.outcomes,
      provider: {
        "@type": "EducationalOrganization",
        name: SITE.legalName,
        url: SITE.url,
        telephone: SITE.phone,
        email: SITE.email,
        address: {
          "@type": "PostalAddress",
          streetAddress: SITE.address.street,
          addressLocality: SITE.address.locality,
          addressRegion: SITE.address.region,
          postalCode: SITE.address.postalCode,
          addressCountry: SITE.address.country,
        },
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: course.rating.value,
        reviewCount: course.rating.count,
        bestRating: 5,
      },
      offers: {
        "@type": "Offer",
        price: course.fee.amount,
        priceCurrency: "INR",
        category: "Paid",
        availability: "https://schema.org/InStock",
        url,
      },
      hasCourseInstance: course.batches.map((batch) => ({
        "@type": "CourseInstance",
        name: `${course.shortTitle} — ${batch.name} batch`,
        courseMode: batch.mode.toLowerCase().includes("online") ? ["onsite", "online"] : "onsite",
        courseSchedule: `${batch.days}, ${batch.time}`,
        courseWorkload: course.weeklyHours,
        location: {
          "@type": "Place",
          name: `${SITE.name}, ${SITE.address.locality}`,
          address: `${SITE.address.street}, ${SITE.address.locality}, ${SITE.address.region}`,
        },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
        { "@type": "ListItem", position: 2, name: "Courses", item: `${SITE.url}/courses` },
        { "@type": "ListItem", position: 3, name: course.shortTitle, item: url },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: course.faqs.map(([question, answer]) => ({
        "@type": "Question",
        name: question,
        acceptedAnswer: { "@type": "Answer", text: answer },
      })),
    },
  ];

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

/* ---------------------------------------------------------------- *
 * Page
 * ---------------------------------------------------------------- */

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = getCourse(slug);
  if (!course) notFound();

  const related = getRelatedCourses(course);

  return (
    // data-enquiry-course pre-selects this course whenever the enquiry popup opens on this page.
    <article className="pb-4" data-enquiry-course={course.shortTitle}>
      <StructuredData course={course} />

      {/* ---------- Hero ---------- */}
      <header id="top" className="on-inverse hero-surface relative isolate overflow-hidden pt-28 pb-16 text-white sm:pt-32 lg:pb-20">
        <div className="panel-glow pointer-events-none absolute inset-0 -z-10" />
        <div className="grid-overlay pointer-events-none absolute inset-0 -z-10 opacity-50" />

        <div className="mx-auto max-w-[1240px] px-5 lg:px-8">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="no-print">
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-white/60">
              <li>
                <Link href="/" className="transition-colors hover:text-accent-yellow">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/courses" className="transition-colors hover:text-accent-yellow">
                  Courses
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <span aria-current="page" className="text-white">
                  {course.shortTitle}
                </span>
              </li>
            </ol>
          </nav>

          <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] lg:gap-12">
            <div>
              <Reveal>
                <p className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 font-semibold tracking-wide">{course.category}</span>
                  <span className="rounded-full bg-accent-yellow px-3 py-1 font-semibold text-ink">Admissions open</span>
                  <span className="rounded-full border border-white/20 px-3 py-1 text-white/75">{course.level}</span>
                </p>

                <h1 className="mt-5 font-display text-[clamp(2rem,5.2vw,3.5rem)] leading-[1.05] font-extrabold tracking-[-0.03em] text-balance">
                  {course.title}
                </h1>

                <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/75 lg:text-lg">{course.tagline}</p>

                <p className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/70">
                  <span className="inline-flex items-center gap-2">
                    <span aria-hidden="true" className="text-accent-yellow">
                      ★★★★★
                    </span>
                    <span>
                      {course.rating.value.toFixed(1)} / 5 from {course.rating.count} students
                    </span>
                  </span>
                  <span aria-hidden="true" className="h-4 w-px bg-white/20" />
                  <span>Next batch: {course.nextBatch}</span>
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <Link
                    href="/#contact"
                    data-enquiry
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-accent-yellow px-7 font-semibold text-ink transition-all duration-200 hover:-translate-y-0.5 hover:bg-white"
                  >
                    Book a free demo class
                    <span aria-hidden="true">→</span>
                  </Link>
                  <a
                    href={TEL_HREF}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/25 bg-white/5 px-6 font-medium transition-colors duration-200 hover:border-white/50 hover:bg-white/10"
                  >
                    <Icon name="phone" className="size-4" />
                    {SITE.phone}
                  </a>
                  <PrintButton className="no-print inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-full border border-white/25 px-6 font-medium transition-colors duration-200 hover:border-white/50 hover:bg-white/10" />
                </div>
              </Reveal>
            </div>

            {/* Admission summary card */}
            <Reveal delay={0.1}>
              <aside
                aria-labelledby="admission-summary"
                className="print-block rounded-panel border border-white/15 bg-white/[0.07] p-6 backdrop-blur-md lg:sticky lg:top-28"
              >
                <h2 id="admission-summary" className="font-mono text-[11px] tracking-[0.18em] text-white/55 uppercase">
                  Admission summary
                </h2>
                <p className="mt-3 flex items-baseline gap-2">
                  <span className="font-display text-4xl font-extrabold tracking-tight">{formatFee(course.fee.amount)}</span>
                  <span className="text-sm text-white/60">course fee</span>
                </p>
                <p className="mt-1 text-sm text-white/65">or {course.fee.installments}</p>

                <dl className="mt-6 space-y-4 border-t border-white/15 pt-6">
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="text-sm text-white/60">Duration</dt>
                    <dd className="text-sm font-semibold">{course.duration}</dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="text-sm text-white/60">Class load</dt>
                    <dd className="text-right text-sm font-semibold">{course.weeklyHours}</dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="text-sm text-white/60">Batch size</dt>
                    <dd className="text-sm font-semibold">Max {course.seats} students</dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="text-sm text-white/60">Languages</dt>
                    <dd className="text-right text-sm font-semibold">{course.languages.join(", ")}</dd>
                  </div>
                </dl>

                <Link
                  href="/#contact"
                  className="mt-6 flex h-12 items-center justify-center gap-2 rounded-full bg-white font-semibold text-ink transition-colors duration-200 hover:bg-accent-yellow"
                >
                  Reserve a seat
                </Link>
                <a
                  href={courseEnquiryEmail(`${course.shortTitle} course`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 flex h-11 items-center justify-center gap-2 rounded-full border border-white/25 text-sm font-medium transition-colors duration-200 hover:border-white/50 hover:bg-white/10"
                >
                  <Icon name="mail" className="size-4" />
                  Email an enquiry
                  <span className="sr-only"> (opens Gmail in a new tab)</span>
                </a>
                <p className="mt-4 text-xs leading-relaxed text-white/50">{FEE_NOTE}</p>
              </aside>
            </Reveal>
          </div>
        </div>
      </header>

      {/* ---------- Fact strip ---------- */}
      <div className="border-b border-border-subtle bg-surface-raised">
        <div className="mx-auto max-w-[1240px] px-5 py-6 lg:px-8">
          <h2 className="sr-only">Course at a glance</h2>
          <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <StaggerItem>
              <Fact icon="clock" label="Duration" value={course.duration} />
            </StaggerItem>
            <StaggerItem>
              <Fact icon="users" label="Delivery" value={course.modes.join(" · ")} />
            </StaggerItem>
            <StaggerItem>
              <Fact icon="target" label="Level" value={course.level} />
            </StaggerItem>
            <StaggerItem>
              <Fact icon="certificate" label="Certification" value={course.certification} />
            </StaggerItem>
          </Stagger>
        </div>
      </div>

      {/* ---------- Notice ---------- */}
      <div className="bg-surface-accent">
        <div className="mx-auto flex max-w-[1240px] flex-wrap items-center gap-x-4 gap-y-2 px-5 py-3 text-sm lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-status-info px-3 py-1 text-[11px] font-bold tracking-[0.1em] text-white uppercase">
            Notice
          </span>
          <p className="min-w-0 flex-1 text-content">
            Admissions for the <strong className="font-semibold">{course.nextBatch.toLowerCase()}</strong> intake are open. Seats are limited to{" "}
            {course.seats} per batch.{" "}
            <a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer" className="font-semibold text-action underline underline-offset-2 hover:text-action-hover">
              Message us on WhatsApp
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </p>
        </div>
      </div>

      {/* ---------- Body ---------- */}
      <div className="mx-auto max-w-[1240px] px-5 lg:px-8">
        <div className="lg:grid lg:grid-cols-[210px_minmax(0,1fr)] lg:gap-14">
          <div className="sticky top-[4.25rem] z-30 -mx-5 border-b border-border-subtle bg-surface/95 px-5 py-2 backdrop-blur lg:top-28 lg:z-auto lg:mx-0 lg:self-start lg:border-0 lg:bg-transparent lg:px-0 lg:py-0 lg:pt-16 lg:backdrop-blur-none">
            <SectionNav sections={SECTIONS} />
          </div>

          <div>
            <Section
              id="overview"
              index={1}
              title={`About the ${course.shortTitle} course`}
              lead={`${course.category} · ${course.duration} · ${SITE.address.locality}, ${SITE.address.region}`}
            >
              <div className="grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
                <Reveal>
                  <div className="space-y-4 text-[15px] leading-relaxed text-content-muted sm:text-base">
                    {course.summary.map((paragraph) => (
                      <p key={paragraph.slice(0, 32)}>{paragraph}</p>
                    ))}
                  </div>
                </Reveal>
                <Stagger className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                  {course.highlights.map((highlight) => (
                    <StaggerItem key={highlight.title}>
                      <div className="print-block h-full rounded-card border border-border-subtle bg-surface-raised p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-border-strong hover:shadow-card">
                        <span className="grid size-10 place-items-center rounded-xl bg-surface-accent text-action">
                          <Icon name={highlight.icon} className="size-5" />
                        </span>
                        <h3 className="mt-4 text-[15px] font-bold tracking-tight">{highlight.title}</h3>
                        <p className="mt-1.5 text-sm leading-relaxed text-content-muted">{highlight.text}</p>
                      </div>
                    </StaggerItem>
                  ))}
                </Stagger>
              </div>
            </Section>

            <Section
              id="outcomes"
              index={2}
              title="What you will be able to do"
              lead="Each outcome is assessed in the final practical test before the certificate is issued."
            >
              <Stagger as="ul" className="grid gap-3 sm:grid-cols-2">
                {course.outcomes.map((outcome) => (
                  <StaggerItem as="li" key={outcome}>
                    <div className="print-block flex h-full items-start gap-3 rounded-card border border-border-subtle bg-surface-raised p-4">
                      <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-status-success-soft text-status-success">
                        <Icon name="check" className="size-3.5" strokeWidth={2.4} />
                      </span>
                      <span className="text-[15px] leading-relaxed">{outcome}</span>
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>
            </Section>

            <Section
              id="curriculum"
              index={3}
              title="Curriculum"
              lead={`${course.curriculum.length} modules over ${course.duration}. Every module ends with a practical file that is checked by your trainer.`}
            >
              <Accordion
                label="curriculum modules"
                defaultOpenFirst
                showExpandAll
                items={course.curriculum.map((module) => ({
                  id: module.title,
                  title: module.title,
                  meta: `${module.hours} · ${module.topics.length} topics`,
                  content: (
                    <ul className="grid gap-2.5 sm:grid-cols-2">
                      {module.topics.map((topic) => (
                        <li key={topic} className="flex items-start gap-2.5 text-sm leading-relaxed text-content-muted">
                          <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-action" />
                          {topic}
                        </li>
                      ))}
                    </ul>
                  ),
                }))}
              />
            </Section>

            <Section id="tools" index={4} title="Tools and software you will use" lead="All software is installed on your lab system. Nothing has to be bought before you join.">
              <Stagger className="grid gap-5 sm:grid-cols-2">
                {course.tools.map((group) => (
                  <StaggerItem key={group.group}>
                    <div className="print-block h-full rounded-card border border-border-subtle bg-surface-raised p-5">
                      <h3 className="font-mono text-[11px] tracking-[0.14em] text-content-muted uppercase">{group.group}</h3>
                      <ul className="mt-3 flex flex-wrap gap-2">
                        {group.items.map((item) => (
                          <li
                            key={item}
                            className="rounded-full border border-border-subtle bg-surface-sunken px-3 py-1.5 text-[13px] font-medium transition-colors duration-200 hover:border-action hover:bg-surface-accent hover:text-action"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>
            </Section>

            <Section id="projects" index={5} title="Live projects" lead="You build these yourself during the course. They become your portfolio and the basis of your CV.">
              <Stagger as="ol" className="grid gap-4 sm:grid-cols-2">
                {course.projects.map((project, index) => (
                  <StaggerItem as="li" key={project.title}>
                    <article className="print-block flex h-full flex-col rounded-card border border-border-subtle bg-surface-raised p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-border-strong hover:shadow-card">
                      <p className="font-mono text-xs text-content-muted">Project {String(index + 1).padStart(2, "0")}</p>
                      <h3 className="mt-2 font-display text-lg font-bold tracking-tight text-balance">{project.title}</h3>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-content-muted">{project.text}</p>
                      <ul className="mt-4 flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                          <li key={tag} className="rounded-md bg-surface-accent px-2 py-1 text-[11px] font-semibold tracking-wide text-action uppercase">
                            {tag}
                          </li>
                        ))}
                      </ul>
                    </article>
                  </StaggerItem>
                ))}
              </Stagger>
            </Section>

            <Section
              id="careers"
              index={6}
              title="Career outcomes"
              lead="Roles our students take after this course. Salary bands are the local starting ranges reported to us by employers and alumni, not a guarantee."
            >
              <Reveal>
                <div className="scroll-x print-block rounded-card border border-border-subtle bg-surface-raised" tabIndex={0} role="group" aria-label="Career outcomes table, scrollable">
                  <table className="data-table">
                    <caption className="px-4 pt-4">Typical roles, starting salary bands and current local demand</caption>
                    <thead>
                      <tr>
                        <th scope="col">Job role</th>
                        <th scope="col">Starting salary band</th>
                        <th scope="col">Local demand</th>
                      </tr>
                    </thead>
                    <tbody>
                      {course.careers.map((career) => (
                        <tr key={career.role}>
                          <th scope="row" className="font-semibold">
                            {career.role}
                          </th>
                          <td className="tabular-nums">{career.salary}</td>
                          <td>
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                                career.demand === "Very high"
                                  ? "bg-status-success-soft text-status-success"
                                  : career.demand === "High"
                                    ? "bg-status-info-soft text-status-info"
                                    : "bg-status-warning-soft text-status-warning"
                              }`}
                            >
                              {career.demand}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Reveal>
            </Section>

            <Section id="placement" index={7} title="Placement support" lead="The same four steps for every student, in the final month of the course.">
              <Stagger as="ol" className="grid gap-4 sm:grid-cols-2">
                {PLACEMENT_STEPS.map((step, index) => (
                  <StaggerItem as="li" key={step.title}>
                    <div className="print-block h-full rounded-card border border-border-subtle bg-surface-raised p-5">
                      <span className="grid size-10 place-items-center rounded-xl bg-panel font-display text-sm font-bold text-white">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <h3 className="mt-4 text-[15px] font-bold tracking-tight">{step.title}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-content-muted">{step.text}</p>
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>
              <Reveal>
                <p className="mt-5 rounded-card border border-status-warning/25 bg-status-warning-soft p-4 text-sm leading-relaxed text-content">
                  <strong className="font-semibold">What we do not promise:</strong> we provide placement support, not a guaranteed job. Any institute promising a
                  guaranteed job for a certificate course is not being straight with you.
                </p>
              </Reveal>
            </Section>

            <Section id="eligibility" index={8} title="Who this course is for" lead="If you are unsure whether it fits, counselling is free and takes fifteen minutes.">
              <div className="grid gap-5 sm:grid-cols-2">
                <Reveal>
                  <div className="print-block h-full rounded-card border border-border-subtle bg-surface-raised p-6">
                    <h3 className="flex items-center gap-2 text-[15px] font-bold tracking-tight">
                      <Icon name="users" className="size-5 text-action" />
                      Suitable for
                    </h3>
                    <ul className="mt-4 space-y-2.5">
                      {course.audience.map((item) => (
                        <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-content-muted">
                          <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-action" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
                <Reveal delay={0.08}>
                  <div className="print-block h-full rounded-card border border-border-subtle bg-surface-raised p-6">
                    <h3 className="flex items-center gap-2 text-[15px] font-bold tracking-tight">
                      <Icon name="shield" className="size-5 text-action" />
                      Eligibility
                    </h3>
                    <ul className="mt-4 space-y-2.5">
                      {course.eligibility.map((item) => (
                        <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-content-muted">
                          <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-status-success-soft text-status-success">
                            <Icon name="check" className="size-3" strokeWidth={2.6} />
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              </div>
            </Section>

            <Section id="batches" index={9} title="Batches and fees" lead="Batch timings are fixed at admission. Changing your batch later is free, subject to seats.">
              <Reveal>
                {course.batches.length === 0 ? (
                  <p className="rounded-card border border-border-strong bg-surface-accent p-5 text-sm leading-relaxed">
                    Batch timings for this course are confirmed at counselling. Call{" "}
                    <a href={TEL_HREF} className="font-semibold text-action underline underline-offset-2">
                      {SITE.phone}
                    </a>{" "}
                    for the current schedule.
                  </p>
                ) : (
                <div className="scroll-x print-block rounded-card border border-border-subtle bg-surface-raised" tabIndex={0} role="group" aria-label="Batch timings table, scrollable">
                  <table className="data-table">
                    <caption className="px-4 pt-4">Current batch timings for the {course.shortTitle} course</caption>
                    <thead>
                      <tr>
                        <th scope="col">Batch</th>
                        <th scope="col">Days</th>
                        <th scope="col">Timing</th>
                        <th scope="col">Mode</th>
                        <th scope="col">Seats</th>
                      </tr>
                    </thead>
                    <tbody>
                      {course.batches.map((batch) => (
                        <tr key={batch.name}>
                          <th scope="row" className="font-semibold">
                            {batch.name}
                          </th>
                          <td>{batch.days}</td>
                          <td className="whitespace-nowrap tabular-nums">{batch.time}</td>
                          <td>{batch.mode}</td>
                          <td className={batch.seats === "Open" ? "" : "font-semibold text-status-warning"}>{batch.seats}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                )}
              </Reveal>

              <Reveal delay={0.06}>
                <div className="mt-5 grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center rounded-card border border-border-strong bg-surface-accent p-5">
                  <div>
                    <p className="font-display text-xl font-bold tracking-tight">
                      {formatFee(course.fee.amount)} <span className="text-sm font-medium text-content-muted">· or {course.fee.installments}</span>
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-content-muted">{FEE_NOTE}</p>
                  </div>
                  <Link
                    href="/#contact"
                    className="inline-flex h-12 items-center justify-center rounded-full bg-action px-6 font-semibold text-white transition-colors duration-200 hover:bg-action-hover"
                  >
                    Confirm my seat
                  </Link>
                </div>
              </Reveal>
            </Section>

            <Section id="certification" index={10} title="Certification" lead="Issued after the final practical assessment, not for attendance alone.">
              <Reveal>
                <div className="print-block on-inverse relative isolate overflow-hidden rounded-panel bg-panel p-6 text-white sm:p-8">
                  <div className="panel-glow pointer-events-none absolute inset-0 -z-10" />
                  <div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
                    <div>
                      <h3 className="font-display text-xl font-bold tracking-tight sm:text-2xl">{course.certification}</h3>
                      <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/70 sm:text-[15px]">
                        Your certificate carries your registration number, the modules completed and your assessment result. Employers can verify it by phone with
                        the institute. It is accepted for job applications and government forms.
                      </p>
                      <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                        {["Practical assessment", "Registration number", "Module-wise record", "Phone verification"].map((item) => (
                          <li key={item} className="flex items-center gap-2.5 text-sm text-white/80">
                            <span className="grid size-5 shrink-0 place-items-center rounded-full bg-white/15 text-accent-yellow">
                              <Icon name="check" className="size-3" strokeWidth={2.6} />
                            </span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="grid gap-4">
                      <Fact inverse icon="calendar" label="Assessment" value="Final month of the course" />
                      <Fact inverse icon="certificate" label="Issued within" value="10 working days of the test" />
                      <Fact inverse icon="book" label="Record kept" value={`Since ${SITE.established}`} />
                    </div>
                  </div>
                </div>
              </Reveal>
            </Section>

            <Section id="reviews" index={11} title="What students say" lead={`${course.rating.value.toFixed(1)} out of 5 from ${course.rating.count} students who finished this course.`}>
              <Stagger className="grid gap-4 sm:grid-cols-2">
                {course.reviews.map((review) => (
                  <StaggerItem key={review.name}>
                    <figure className="print-block flex h-full flex-col rounded-card border border-border-subtle bg-surface-raised p-6">
                      <p aria-hidden="true" className="text-sm tracking-widest text-amber-500">
                        ★★★★★
                      </p>
                      <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed">&ldquo;{review.text}&rdquo;</blockquote>
                      <figcaption className="mt-5 flex items-center gap-3 border-t border-border-subtle pt-4">
                        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-panel font-display text-xs font-bold text-white">
                          {review.initials}
                        </span>
                        <span className="min-w-0">
                          <span className="block text-sm font-semibold">{review.name}</span>
                          <span className="block truncate text-xs text-content-muted">{review.role}</span>
                        </span>
                      </figcaption>
                    </figure>
                  </StaggerItem>
                ))}
              </Stagger>
            </Section>

            <Section id="faqs" index={12} title="Frequently asked questions" lead="Still unsure after reading these? Call the helpline and ask — counselling costs nothing.">
              <Accordion
                label="frequently asked questions"
                items={course.faqs.map(([question, answer]) => ({
                  id: question,
                  title: question,
                  content: <p className="text-sm leading-relaxed text-content-muted sm:text-[15px]">{answer}</p>,
                }))}
              />
            </Section>
          </div>
        </div>
      </div>

      {/* ---------- Related courses ---------- */}
      {related.length > 0 && (
        <section aria-labelledby="related-title" className="border-t border-border-subtle bg-surface-sunken py-14 lg:py-20">
          <div className="mx-auto max-w-[1240px] px-5 lg:px-8">
            <Reveal>
              <h2 id="related-title" className="font-display text-2xl font-extrabold tracking-[-0.02em] sm:text-3xl">
                Students on this course also considered
              </h2>
            </Reveal>
            <Stagger as="ul" className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <StaggerItem as="li" key={item.slug}>
                  <Link
                    href={`/courses/${item.slug}`}
                    className="group flex h-full flex-col rounded-card border border-border-subtle bg-surface-raised p-6 transition-all duration-200 hover:-translate-y-1 hover:border-action hover:shadow-card"
                  >
                    <span className="grid size-11 place-items-center rounded-xl bg-surface-accent text-action transition-colors duration-200 group-hover:bg-action group-hover:text-white">
                      <Icon name={item.icon} className="size-5" />
                    </span>
                    <span className="mt-4 font-display text-lg font-bold tracking-tight">{item.shortTitle}</span>
                    <span className="mt-2 flex-1 text-sm leading-relaxed text-content-muted">{item.tagline}</span>
                    <span className="mt-4 flex items-center justify-between border-t border-border-subtle pt-4 text-sm">
                      <span className="text-content-muted">{item.duration}</span>
                      <span className="font-semibold text-action">
                        View course <span aria-hidden="true">→</span>
                      </span>
                    </span>
                  </Link>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      <CourseActionBar courseTitle={course.shortTitle} />
    </article>
  );
}
