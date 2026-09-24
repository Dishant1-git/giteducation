import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Icon } from "@/components/icon";
import { CERTIFICATE_PROGRAMS, getCertificateProgram, getOtherCertificatePrograms, type CertificateProgram } from "@/lib/certificate-programs";
import { FEE_NOTE, PLACEMENT_STEPS, formatFee } from "@/lib/courses";
import { SITE, TEL_HREF, WHATSAPP_HREF, certificateHref, courseEnquiryEmail } from "@/lib/site";

import {
  ActionBar,
  CountUp,
  EnquireButton,
  FadeIn,
  FaqList,
  HeroParallax,
  PrintButton,
  ScaleIn,
  ScrollMarquee,
  ScrollTimeline,
  SectionIndex,
  WeightBar,
} from "./certificate-ui";

/**
 * Certificate program page — /certificate-programs/[slug].
 *
 * Same theme as the course pages (semantic tokens in globals.css). All copy comes
 * from src/lib/certificate-programs.ts (certificate-specific) and the linked
 * course in src/lib/courses.ts (syllabus, batches, fees, reviews).
 */

/** Page sections in order. Also drives the "On this page" index. */
const SECTIONS = [
  { id: "overview", label: "Program overview" },
  { id: "skills", label: "Skills certified" },
  { id: "curriculum", label: "Curriculum" },
  { id: "tools", label: "Tools & software" },
  { id: "projects", label: "Live projects" },
  { id: "assessment", label: "Assessment" },
  { id: "certificate", label: "Your certificate" },
  { id: "careers", label: "Career outcomes" },
  { id: "placement", label: "Placement support" },
  { id: "fees", label: "Batches & fees" },
  { id: "reviews", label: "Student reviews" },
  { id: "faqs", label: "FAQs" },
];

export function generateStaticParams() {
  return CERTIFICATE_PROGRAMS.map((program) => ({ slug: program.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const program = getCertificateProgram(slug);
  if (!program) return { title: "Certificate program not found" };

  const path = certificateHref(program.slug);
  return {
    title: program.seo.title,
    description: program.seo.description,
    keywords: program.seo.keywords,
    alternates: { canonical: path },
    openGraph: { title: program.seo.title, description: program.seo.description, url: path, type: "article" },
  };
}

/* ---------------------------------------------------------------- *
 * Building blocks
 * ---------------------------------------------------------------- */

function Section({ id, index, title, lead, children }: { id: string; index: number; title: string; lead?: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-28 border-t border-border-subtle py-12 first:border-t-0 lg:py-16">
      <FadeIn className="mb-8">
        <p className="section-rule text-action">Section {String(index).padStart(2, "0")}</p>
        <h2 id={`${id}-title`} className="mt-3 font-display text-2xl leading-tight font-extrabold tracking-[-0.02em] text-balance sm:text-3xl lg:text-[2.1rem]">
          {title}
        </h2>
        {lead && <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-content-muted sm:text-base">{lead}</p>}
      </FadeIn>
      {children}
    </section>
  );
}

/** Standard content card — same treatment as the course pages. */
const CARD = "print-block h-full rounded-card border border-border-subtle bg-surface-raised p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-border-strong hover:shadow-card";

const DEMAND_STYLE: Record<string, string> = {
  "Very high": "bg-status-success-soft text-status-success",
  High: "bg-status-info-soft text-status-info",
  Moderate: "bg-status-warning-soft text-status-warning",
};

function StructuredData({ program }: { program: CertificateProgram }) {
  const url = `${SITE.url}${certificateHref(program.slug)}`;
  const data = [
    {
      "@context": "https://schema.org",
      "@type": "Course",
      name: program.title,
      description: program.seo.description,
      url,
      inLanguage: "en-IN",
      educationalCredentialAwarded: `${SITE.name} ${program.credential}`,
      teaches: program.skills,
      provider: { "@type": "EducationalOrganization", name: SITE.legalName, url: SITE.url, telephone: SITE.phone },
      aggregateRating: { "@type": "AggregateRating", ratingValue: program.course.rating.value, reviewCount: program.course.rating.count, bestRating: 5 },
      offers: { "@type": "Offer", price: program.course.fee.amount, priceCurrency: "INR", category: "Paid", url },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
        { "@type": "ListItem", position: 2, name: "Certificate Programs", item: `${SITE.url}/certificate-programs` },
        { "@type": "ListItem", position: 3, name: program.label, item: url },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: program.faqs.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
    },
  ];
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

/* ---------------------------------------------------------------- *
 * Page
 * ---------------------------------------------------------------- */

export default async function CertificateProgramPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const program = getCertificateProgram(slug);
  if (!program) notFound();

  const { course } = program;
  const others = getOtherCertificatePrograms(program);
  const totalHours = course.curriculum.reduce((sum, module) => sum + (parseFloat(module.hours) || 0), 0);
  const months = parseFloat(course.duration) || 0;
  const toolRows = [course.tools.flatMap((g) => g.items), program.skills.map((s) => s.split(" ").slice(0, 4).join(" "))];

  return (
    // data-enquiry-course pre-selects this program's course whenever the enquiry popup opens here.
    <article className="pb-4" data-enquiry-course={course.shortTitle}>
      <StructuredData program={program} />

      {/* ---------- Hero ---------- */}
      <header id="top" className="on-inverse hero-surface relative isolate overflow-hidden pt-28 pb-16 text-white sm:pt-32 lg:pb-20">
        <div className="panel-glow pointer-events-none absolute inset-0 -z-10" />
        <div className="grid-overlay pointer-events-none absolute inset-0 -z-10 opacity-50" />

        <HeroParallax className="mx-auto max-w-[1240px] px-5 lg:px-8">
          <nav aria-label="Breadcrumb" className="no-print">
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-white/60">
              <li>
                <Link href="/" className="transition-colors hover:text-accent-yellow">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/certificate-programs" className="transition-colors hover:text-accent-yellow">
                  Certificate Programs
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <span aria-current="page" className="text-white">
                  {program.label}
                </span>
              </li>
            </ol>
          </nav>

          <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] lg:gap-12">
            <div>
              <FadeIn>
                <p className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 font-semibold tracking-wide">
                    <Icon name="certificate" className="size-3.5 text-accent-yellow" />
                    Certificate Program
                  </span>
                  <span className="rounded-full bg-accent-yellow px-3 py-1 font-semibold text-ink">Admissions open</span>
                  <span className="rounded-full border border-white/20 px-3 py-1 text-white/75">{course.level}</span>
                </p>
              </FadeIn>

              <FadeIn delay={0.08}>
                <h1 className="mt-5 font-display text-[clamp(2rem,5.2vw,3.5rem)] leading-[1.05] font-extrabold tracking-[-0.03em] text-balance">{program.title}</h1>
              </FadeIn>

              <FadeIn delay={0.16}>
                <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/75 lg:text-lg">{program.tagline}</p>
                <p className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/70">
                  <span className="inline-flex items-center gap-2">
                    <span aria-hidden="true" className="text-accent-yellow">
                      ★★★★★
                    </span>
                    {course.rating.value.toFixed(1)} / 5 from {course.rating.count} students
                  </span>
                  <span aria-hidden="true" className="h-4 w-px bg-white/20" />
                  <span>Next batch: {course.nextBatch}</span>
                </p>
              </FadeIn>

              <FadeIn delay={0.24} className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <EnquireButton>
                  Book a free demo class
                  <span aria-hidden="true">→</span>
                </EnquireButton>
                <a
                  href={TEL_HREF}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/25 bg-white/5 px-6 font-medium transition-colors duration-200 hover:border-white/50 hover:bg-white/10"
                >
                  <Icon name="phone" className="size-4" />
                  {SITE.phone}
                </a>
                <PrintButton />
              </FadeIn>
            </div>

            {/* Credential summary */}
            <FadeIn delay={0.1}>
              <aside aria-labelledby="credential-summary" className="print-block rounded-panel border border-white/15 bg-white/[0.07] p-6 backdrop-blur-md">
                <h2 id="credential-summary" className="font-mono text-[11px] tracking-[0.18em] text-white/55 uppercase">
                  Credential awarded
                </h2>
                <p className="mt-3 font-display text-xl leading-snug font-bold tracking-tight">{program.credential}</p>
                <p className="mt-1 font-mono text-xs text-accent-yellow">Reg. No. format · {program.code}/YYYY/NNNN</p>

                <p className="mt-5 flex items-baseline gap-2">
                  <span className="font-display text-4xl font-extrabold tracking-tight">{formatFee(course.fee.amount)}</span>
                  <span className="text-sm text-white/60">program fee</span>
                </p>
                <p className="mt-1 text-sm text-white/65">or {course.fee.installments}</p>

                <dl className="mt-6 space-y-4 border-t border-white/15 pt-6">
                  {[
                    ["Duration", course.duration],
                    ["Class load", course.weeklyHours],
                    ["Pass mark", program.passMark],
                  ].map(([term, value]) => (
                    <div key={term} className="flex items-baseline justify-between gap-4">
                      <dt className="shrink-0 text-sm text-white/60">{term}</dt>
                      <dd className="text-right text-sm font-semibold">{value}</dd>
                    </div>
                  ))}
                </dl>

                <EnquireButton variant="light" className="mt-6 w-full">
                  Reserve a seat
                </EnquireButton>
                <a
                  href={courseEnquiryEmail(`${program.label} Certificate Program`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 flex h-11 items-center justify-center gap-2 rounded-full border border-white/25 text-sm font-medium transition-colors duration-200 hover:border-white/50 hover:bg-white/10"
                >
                  <Icon name="mail" className="size-4" />
                  Email an enquiry
                  <span className="sr-only"> (opens Gmail in a new tab)</span>
                </a>
              </aside>
            </FadeIn>
          </div>
        </HeroParallax>
      </header>

      {/* ---------- Stats ---------- */}
      <div className="border-b border-border-subtle bg-surface-raised">
        <div className="mx-auto max-w-[1240px] px-5 py-6 lg:px-8">
          <h2 className="sr-only">Program at a glance</h2>
          <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
            {[
              { label: "Months", value: months, decimals: months % 1 ? 1 : 0, suffix: "", icon: "clock" },
              { label: "Modules", value: course.curriculum.length, decimals: 0, suffix: "", icon: "book" },
              { label: "Hours of lab practice", value: totalHours, decimals: 0, suffix: "+", icon: "monitor" },
              { label: "Student rating", value: course.rating.value, decimals: 1, suffix: " / 5", icon: "sparkle" },
            ].map((stat, index) => (
              <FadeIn key={stat.label} delay={index * 0.07} className="flex items-center gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-surface-accent text-action">
                  <Icon name={stat.icon} className="size-5" />
                </span>
                <p className="min-w-0">
                  <span className="block font-display text-2xl leading-none font-extrabold tracking-tight">
                    <CountUp value={stat.value} decimals={stat.decimals} suffix={stat.suffix} />
                  </span>
                  <span className="mt-1 block text-xs text-content-muted">{stat.label}</span>
                </p>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>

      {/* ---------- Notice ---------- */}
      <div className="bg-surface-accent">
        <div className="mx-auto flex max-w-[1240px] flex-wrap items-center gap-x-4 gap-y-2 px-5 py-3 text-sm lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-status-info px-3 py-1 text-[11px] font-bold tracking-[0.1em] text-white uppercase">Notice</span>
          <p className="min-w-0 flex-1 text-content">
            Admissions for the <strong className="font-semibold">{course.nextBatch.toLowerCase()}</strong> intake are open. Seats are limited to {course.seats} per batch.{" "}
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
            <SectionIndex sections={SECTIONS} />
          </div>

          <div className="min-w-0">
            <Section id="overview" index={1} title={`About the ${program.label} certificate program`} lead={`${course.category} · ${course.duration} · ${SITE.address.locality}, ${SITE.address.region}`}>
              <div className="grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
                <FadeIn className="space-y-4 text-[15px] leading-relaxed text-content-muted sm:text-base">
                  {program.summary.map((paragraph) => (
                    <p key={paragraph.slice(0, 32)}>{paragraph}</p>
                  ))}
                  <p>
                    Want the full course details?{" "}
                    <Link href={`/courses/${course.slug}`} className="font-semibold text-action underline underline-offset-2 hover:text-action-hover">
                      See the {course.shortTitle} course page
                    </Link>
                    .
                  </p>
                </FadeIn>
                <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                  {course.highlights.map((highlight, index) => (
                    <FadeIn as="li" key={highlight.title} delay={index * 0.07}>
                      <div className={CARD}>
                        <span className="grid size-10 place-items-center rounded-xl bg-surface-accent text-action">
                          <Icon name={highlight.icon} className="size-5" />
                        </span>
                        <h3 className="mt-4 text-[15px] font-bold tracking-tight">{highlight.title}</h3>
                        <p className="mt-1.5 text-sm leading-relaxed text-content-muted">{highlight.text}</p>
                      </div>
                    </FadeIn>
                  ))}
                </ul>
              </div>
            </Section>

            <Section id="skills" index={2} title="What this certificate says you can do" lead="Every skill below is printed on your certificate and tested in the final assessment.">
              <ul className="grid gap-3 sm:grid-cols-2">
                {program.skills.map((skill, index) => (
                  <FadeIn as="li" key={skill} delay={index * 0.05}>
                    <div className="print-block flex h-full items-start gap-3 rounded-card border border-border-subtle bg-surface-raised p-4">
                      <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-status-success-soft text-status-success">
                        <Icon name="check" className="size-3.5" strokeWidth={2.4} />
                      </span>
                      <span className="text-[15px] leading-relaxed">{skill}</span>
                    </div>
                  </FadeIn>
                ))}
              </ul>
            </Section>

            <Section
              id="curriculum"
              index={3}
              title="Curriculum"
              lead={`${course.curriculum.length} modules, about ${totalHours} hours of lab work over ${course.duration}. Each module ends with a practical file checked by your trainer.`}
            >
              <ScrollTimeline modules={course.curriculum} />
            </Section>

            <Section id="tools" index={4} title="Tools and software you will use" lead="All software is installed on your lab system. Nothing has to be bought before you join.">
              <ScrollMarquee rows={toolRows} />
              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                {course.tools.map((group, index) => (
                  <FadeIn key={group.group} delay={index * 0.07}>
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
                  </FadeIn>
                ))}
              </div>
            </Section>

            <Section id="projects" index={5} title="Live projects" lead="You build these yourself in class. They become your portfolio and part of your assessment.">
              <ol className="grid gap-4 sm:grid-cols-2">
                {course.projects.map((project, index) => (
                  <FadeIn as="li" key={project.title} delay={index * 0.07}>
                    <article className={`${CARD} flex flex-col`}>
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
                  </FadeIn>
                ))}
              </ol>
            </Section>

            <Section id="assessment" index={6} title="How you are assessed" lead={`The certificate is issued only after you pass. Pass mark: ${program.passMark}.`}>
              <ol className="space-y-3">
                {program.assessment.map((part, index) => (
                  <FadeIn as="li" key={part.part} delay={index * 0.08}>
                    <div className="print-block rounded-card border border-border-subtle bg-surface-raised p-5">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h3 className="text-[15px] font-bold tracking-tight">
                          <span className="mr-2 font-mono text-xs font-normal text-content-muted">{String(index + 1).padStart(2, "0")}</span>
                          {part.part}
                        </h3>
                        <p className="font-display text-2xl font-extrabold tracking-tight text-action tabular-nums">{part.weight}%</p>
                      </div>
                      <p className="mt-1.5 mb-4 text-sm leading-relaxed text-content-muted">{part.checks}</p>
                      <WeightBar weight={part.weight} label={part.part} />
                    </div>
                  </FadeIn>
                ))}
              </ol>
            </Section>

            <Section id="certificate" index={7} title="Your certificate" lead="Issued within 10 working days of passing, with a registration number any employer can verify.">
              <FadeIn>
                <div className="print-block on-inverse relative isolate overflow-hidden rounded-panel bg-panel p-6 text-white sm:p-8">
                  <div className="panel-glow pointer-events-none absolute inset-0 -z-10" />
                  <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-center">
                    <ScaleIn>
                      <figure className="relative rounded-card bg-white p-2 text-content shadow-overlay">
                        <div className="rounded-[0.9rem] border-2 border-double border-border-strong px-5 py-7 text-center sm:px-8 sm:py-9">
                          <p className="font-mono text-[10px] tracking-[0.22em] text-content-muted uppercase">{SITE.legalName}</p>
                          <p className="mt-5 text-[11px] tracking-[0.2em] text-content-muted uppercase">This is to certify that</p>
                          <p className="mt-2 font-display text-2xl font-bold italic sm:text-3xl">Your Name</p>
                          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-content-muted">
                            has completed the {course.duration} program and passed the practical assessment for the
                          </p>
                          <p className="mt-3 font-display text-lg leading-snug font-extrabold tracking-tight text-action sm:text-xl">{program.credential}</p>
                          <div className="mt-6 grid grid-cols-3 gap-3 border-t border-border-subtle pt-4 text-left text-[11px]">
                            <p>
                              <span className="block text-content-muted">Reg. No.</span>
                              <span className="font-mono font-semibold">{program.code}/2026/0412</span>
                            </p>
                            <p className="text-center">
                              <span className="block text-content-muted">Result</span>
                              <span className="font-semibold">Grade A</span>
                            </p>
                            <p className="text-right">
                              <span className="block text-content-muted">Issued at</span>
                              <span className="font-semibold">{SITE.address.locality}</span>
                            </p>
                          </div>
                        </div>
                        <span aria-hidden="true" className="absolute -top-3 -right-3 grid size-12 place-items-center rounded-full bg-accent-yellow text-ink shadow-raised">
                          <Icon name="certificate" className="size-6" />
                        </span>
                        <figcaption className="sr-only">Sample layout. Your certificate carries your own name, registration number and result.</figcaption>
                      </figure>
                    </ScaleIn>

                    <div>
                      <h3 className="font-display text-xl font-bold tracking-tight">How verification works</h3>
                      <ol className="mt-5 space-y-4">
                        {[
                          ["Pass the assessment", "Practical tasks, files and viva, marked by your trainer."],
                          ["Certificate issued", "Printed with your registration number and result within 10 working days."],
                          ["Employer checks", `They call ${SITE.phone} or email us with your registration number.`],
                          ["We confirm", `Your name, program and result are confirmed from records kept since ${SITE.established}.`],
                        ].map(([title, text], index) => (
                          <FadeIn as="li" key={title} delay={index * 0.08} className="flex gap-3">
                            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-white/10 font-mono text-xs font-bold text-accent-yellow">{index + 1}</span>
                            <span>
                              <span className="block text-sm font-semibold">{title}</span>
                              <span className="mt-0.5 block text-sm leading-relaxed text-white/70">{text}</span>
                            </span>
                          </FadeIn>
                        ))}
                      </ol>
                    </div>
                  </div>
                </div>
              </FadeIn>

              <FadeIn delay={0.08}>
                <div className="mt-5 rounded-card border border-border-subtle bg-surface-raised p-5 sm:p-6">
                  <h3 className="flex items-center gap-2 text-[15px] font-bold tracking-tight">
                    <Icon name="briefcase" className="size-5 text-action" />
                    Where students use this certificate
                  </h3>
                  <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                    {program.usedFor.map((use) => (
                      <li key={use} className="flex items-start gap-2.5 text-sm leading-relaxed text-content-muted">
                        <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-action" />
                        {use}
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeIn>
            </Section>

            <Section
              id="careers"
              index={8}
              title="Career outcomes"
              lead="Roles our students take after this program. Salary bands are local starting ranges reported by employers and alumni, not a guarantee."
            >
              <ul className="grid gap-4 sm:grid-cols-2">
                {course.careers.map((career, index) => (
                  <FadeIn as="li" key={career.role} delay={index * 0.07}>
                    <div className={CARD}>
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-[15px] font-bold tracking-tight">{career.role}</h3>
                        <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${DEMAND_STYLE[career.demand]}`}>{career.demand} demand</span>
                      </div>
                      <p className="mt-4 text-xs tracking-[0.12em] text-content-muted uppercase">Starting salary band</p>
                      <p className="mt-1 font-display text-xl font-extrabold tracking-tight tabular-nums">{career.salary}</p>
                    </div>
                  </FadeIn>
                ))}
              </ul>
            </Section>

            <Section id="placement" index={9} title="Placement support" lead="The same four steps for every student, in the final month of the program.">
              <ol className="grid gap-4 sm:grid-cols-2">
                {PLACEMENT_STEPS.map((step, index) => (
                  <FadeIn as="li" key={step.title} delay={index * 0.07}>
                    <div className="print-block h-full rounded-card border border-border-subtle bg-surface-raised p-5">
                      <span className="grid size-10 place-items-center rounded-xl bg-panel font-display text-sm font-bold text-white">{String(index + 1).padStart(2, "0")}</span>
                      <h3 className="mt-4 text-[15px] font-bold tracking-tight">{step.title}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-content-muted">{step.text}</p>
                    </div>
                  </FadeIn>
                ))}
              </ol>
              <FadeIn>
                <p className="mt-5 rounded-card border border-status-warning/25 bg-status-warning-soft p-4 text-sm leading-relaxed text-content">
                  <strong className="font-semibold">What we do not promise:</strong> we provide placement support, not a guaranteed job.
                </p>
              </FadeIn>
            </Section>

            <Section id="fees" index={10} title="Batches and fees" lead="Batch timings are fixed at admission. Changing your batch later is free, subject to seats.">
              <FadeIn>
                {course.batches.length === 0 ? (
                  <p className="rounded-card border border-border-strong bg-surface-accent p-5 text-sm leading-relaxed">
                    Batch timings are confirmed at counselling. Call{" "}
                    <a href={TEL_HREF} className="font-semibold text-action underline underline-offset-2">
                      {SITE.phone}
                    </a>{" "}
                    for the current schedule.
                  </p>
                ) : (
                  <div className="scroll-x print-block rounded-card border border-border-subtle bg-surface-raised" tabIndex={0} role="group" aria-label="Batch timings table, scrollable">
                    <table className="data-table">
                      <caption className="px-4 pt-4">Current batch timings for the {program.label} certificate program</caption>
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
              </FadeIn>

              <FadeIn delay={0.06}>
                <div className="mt-5 grid gap-4 rounded-card border border-border-strong bg-surface-accent p-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                  <div>
                    <p className="font-display text-xl font-bold tracking-tight">
                      {formatFee(course.fee.amount)} <span className="text-sm font-medium text-content-muted">· or {course.fee.installments}</span>
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-content-muted">{FEE_NOTE}</p>
                  </div>
                  <EnquireButton variant="primary">Confirm my seat</EnquireButton>
                </div>
              </FadeIn>
            </Section>

            <Section id="reviews" index={11} title="What students say" lead={`${course.rating.value.toFixed(1)} out of 5 from ${course.rating.count} students who finished this program.`}>
              <ul className="grid gap-4 sm:grid-cols-2">
                {course.reviews.map((review, index) => (
                  <FadeIn as="li" key={review.name} delay={index * 0.08}>
                    <figure className="print-block flex h-full flex-col rounded-card border border-border-subtle bg-surface-raised p-6">
                      <p aria-hidden="true" className="text-sm tracking-widest text-amber-500">
                        ★★★★★
                      </p>
                      <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed">&ldquo;{review.text}&rdquo;</blockquote>
                      <figcaption className="mt-5 flex items-center gap-3 border-t border-border-subtle pt-4">
                        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-panel font-display text-xs font-bold text-white">{review.initials}</span>
                        <span className="min-w-0">
                          <span className="block text-sm font-semibold">{review.name}</span>
                          <span className="block truncate text-xs text-content-muted">{review.role}</span>
                        </span>
                      </figcaption>
                    </figure>
                  </FadeIn>
                ))}
              </ul>
            </Section>

            <Section id="faqs" index={12} title="Frequently asked questions" lead="Still unsure after reading these? Call the helpline and ask — counselling costs nothing.">
              <FaqList items={program.faqs} />
            </Section>
          </div>
        </div>
      </div>

      {/* ---------- Other certificate programs ---------- */}
      <section aria-labelledby="more-title" className="border-t border-border-subtle bg-surface-sunken py-14 lg:py-20">
        <div className="mx-auto max-w-[1240px] px-5 lg:px-8">
          <FadeIn className="flex flex-wrap items-end justify-between gap-4">
            <h2 id="more-title" className="font-display text-2xl font-extrabold tracking-[-0.02em] sm:text-3xl">
              Other certificate programs
            </h2>
            <Link href="/certificate-programs" className="text-sm font-semibold text-action hover:text-action-hover">
              View all certificate programs →
            </Link>
          </FadeIn>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((item, index) => (
              <FadeIn as="li" key={item.slug} delay={index * 0.08}>
                <Link
                  href={certificateHref(item.slug)}
                  className="group flex h-full flex-col rounded-card border border-border-subtle bg-surface-raised p-6 transition-all duration-200 hover:-translate-y-1 hover:border-action hover:shadow-card"
                >
                  <span className="grid size-11 place-items-center rounded-xl bg-surface-accent text-action transition-colors duration-200 group-hover:bg-action group-hover:text-white">
                    <Icon name={item.icon} className="size-5" />
                  </span>
                  <span className="mt-4 font-display text-lg font-bold tracking-tight">{item.label}</span>
                  <span className="mt-2 flex-1 text-sm leading-relaxed text-content-muted">{item.tagline}</span>
                  <span className="mt-4 flex items-center justify-between border-t border-border-subtle pt-4 text-sm">
                    <span className="text-content-muted">{item.course.duration}</span>
                    <span className="font-semibold text-action">
                      View program <span aria-hidden="true">→</span>
                    </span>
                  </span>
                </Link>
              </FadeIn>
            ))}
          </ul>
        </div>
      </section>

      <ActionBar title={`${program.label} Certificate`} />
    </article>
  );
}
