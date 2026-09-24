import type { Metadata } from "next";
import Link from "next/link";

import { Icon } from "@/components/icon";
import { Reveal } from "@/components/motion";
import { FORMATS, PARTNER_INSTITUTIONS, STEPS } from "@/lib/college-partnerships";
import { COURSES } from "@/lib/courses";
import { SITE, TEL_HREF } from "@/lib/site";
import { BRANCHES, DELIVERABLES, TRACKS } from "@/lib/training-matcher";

export const metadata: Metadata = {
  title: "College Partnerships | Workshops, Industrial Training & Placement Prep",
  description: `Campus workshops, university-mapped industrial training, project reports and placement preparation for colleges, run by ${SITE.name}, ${SITE.address.locality}.`,
  alternates: { canonical: "/college-partnerships" },
};

const STATS: [value: string, label: string][] = [
  [String(COURSES.length), "Courses to build a programme from"],
  [String(BRANCHES.length), "Degree branches with mapped tracks"],
  [String(FORMATS.length), "Ways to work with your college"],
  [String(DELIVERABLES.length), "Report documents per student"],
];

export default function CollegePartnershipsPage() {
  return (
    <div>
      <header className="on-inverse hero-surface relative isolate overflow-hidden px-5 pt-28 pb-14 text-white sm:pt-32 lg:px-8 lg:pb-16">
        <div className="panel-glow pointer-events-none absolute inset-0 -z-10" />
        <div className="grid-overlay pointer-events-none absolute inset-0 -z-10 opacity-50" />
        <div className="mx-auto max-w-[1240px]">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-[13px] text-white/60">
              <li>
                <Link href="/" className="transition-colors hover:text-accent-yellow">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <span aria-current="page" className="text-white">
                  College Partnerships
                </span>
              </li>
            </ol>
          </nav>
          <Reveal>
            <p className="mt-8 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-wide">College Partnerships</p>
            <h1 className="mt-6 max-w-4xl font-display text-[clamp(2.2rem,5vw,3.6rem)] leading-[1.06] font-extrabold tracking-[-0.03em] text-balance text-white/45">
              Bringing <span className="text-white">practical skills</span> onto your <span className="text-accent-yellow">campus.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/75 lg:text-lg">
              Workshops, university-mapped industrial training, project reports and placement preparation, run with your departments and on your timetable.
            </p>
          </Reveal>
          <dl className="mt-12 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4">
            {STATS.map(([value, label]) => (
              <div key={label} className="relative flex flex-col-reverse pl-5">
                <span aria-hidden="true" className="absolute inset-y-0 left-0 w-0.5 rounded-full bg-accent-yellow" />
                <dt className="mt-2 text-sm text-white/60">{label}</dt>
                <dd className="font-display text-3xl leading-none font-extrabold tracking-tight lg:text-4xl">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </header>

      {PARTNER_INSTITUTIONS.length > 0 && (
        <section className="px-5 py-14 lg:px-8 lg:py-20">
          <div className="mx-auto max-w-[1240px] text-center">
            <p className="font-mono text-xs font-bold tracking-[0.22em] text-action uppercase">Institutions we work with</p>
            <ul className="mt-8 flex flex-wrap justify-center gap-3">
              {PARTNER_INSTITUTIONS.map((inst) => (
                <li key={inst.name} className="rounded-full border border-border-subtle bg-surface-raised px-5 py-2.5 text-sm font-semibold">
                  {inst.name} <span className="font-normal text-content-muted">· {inst.city}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="bg-surface-sunken px-5 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-[1240px]">
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-mono text-xs font-bold tracking-[0.22em] text-action uppercase">What we run</p>
            <h2 className="mt-4 font-display text-[clamp(1.8rem,4vw,2.8rem)] leading-[1.1] font-extrabold tracking-tight text-balance">
              {FORMATS.length} ways we work with colleges
            </h2>
          </div>
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3">
            {FORMATS.map((format, i) => (
              <li key={format.title}>
                <Reveal className="h-full" delay={(i % 3) * 0.07}>
                  <div className="h-full rounded-card border border-border-subtle bg-surface-raised p-6 lg:p-7">
                    <span className="grid size-11 place-items-center rounded-xl bg-action text-white">
                      <Icon name={format.icon} className="size-5" />
                    </span>
                    <h3 className="mt-5 font-display text-lg font-bold tracking-tight">{format.title}</h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-content-muted">{format.text}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="px-5 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-[1240px] gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
          <div>
            <p className="font-mono text-xs font-bold tracking-[0.22em] text-action uppercase">Mapped to your branches</p>
            <h2 className="mt-4 font-display text-[clamp(1.8rem,4vw,2.8rem)] leading-[1.1] font-extrabold tracking-tight text-balance">
              Training that fits each department
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-content-muted">
              Each branch gets tracks built on our own courses, so students train on software their field actually uses. Students can check their own match in the Training Matcher.
            </p>
            <Link
              href="/tools/training-matcher"
              className="mt-7 inline-flex h-12 items-center gap-2 rounded-full border border-border-strong bg-surface-raised px-6 text-sm font-semibold transition-colors hover:border-action hover:text-action"
            >
              Open the Training Matcher <span aria-hidden="true">→</span>
            </Link>

            <div className="mt-10 rounded-card border border-border-subtle bg-surface-sunken p-6">
              <h3 className="font-display text-base font-bold tracking-tight">Every student submits</h3>
              <ul className="mt-4 space-y-3">
                {DELIVERABLES.map((d) => (
                  <li key={d.title} className="flex gap-3 text-sm">
                    <Icon name="check" className="mt-0.5 size-4 shrink-0 text-action" />
                    <span>
                      <span className="font-semibold">{d.title}.</span> <span className="text-content-muted">{d.text}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <ul className="grid gap-3 sm:grid-cols-2">
            {BRANCHES.map((branch) => (
              <li key={branch.id} className="rounded-card border border-border-subtle bg-surface-raised p-5">
                <div className="flex items-center gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-surface-sunken text-action">
                    <Icon name={branch.icon} className="size-4" />
                  </span>
                  <h3 className="text-sm font-semibold tracking-tight">{branch.name}</h3>
                </div>
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {branch.tracks.map((id) => (
                    <li key={id} className="rounded-md bg-surface-sunken px-2 py-1 text-[11px] font-medium text-content-muted">
                      {TRACKS[id]?.title ?? id}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-border-subtle px-5 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-[1240px]">
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-mono text-xs font-bold tracking-[0.22em] text-action uppercase">How it works</p>
            <h2 className="mt-4 font-display text-[clamp(1.8rem,4vw,2.8rem)] leading-[1.1] font-extrabold tracking-tight text-balance">
              From first call to a running programme
            </h2>
          </div>
          <ol className="relative mt-12 grid gap-8 lg:mt-14 lg:grid-cols-4 lg:gap-6">
            <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-6 hidden h-px bg-border-subtle lg:block" />
            {STEPS.map((step, i) => (
              <li key={step.title} className="relative">
                <Reveal delay={i * 0.08}>
                  <span className="relative grid size-12 place-items-center rounded-full bg-action font-display text-base font-bold text-white">
                    0{i + 1}
                  </span>
                  <h3 className="mt-5 font-display text-base font-bold tracking-tight">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-content-muted">{step.text}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-t border-border-subtle bg-surface-sunken px-5 py-16 text-center lg:px-8 lg:py-24">
        <Reveal className="mx-auto max-w-2xl">
          <p className="text-xs font-bold tracking-[0.22em] text-action uppercase">Partner with us</p>
          <h2 className="mt-5 font-display text-[clamp(2rem,5vw,3.4rem)] leading-[1.05] font-extrabold tracking-[-0.03em] text-balance">
            Tell us what your students need next.
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-content-muted lg:text-lg">
            Share your department, student numbers and the semester you are planning for, and we will come back with a written proposal.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={TEL_HREF}
              className="inline-flex h-13 items-center justify-center gap-2 rounded-full bg-action px-8 font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-action-hover"
            >
              <Icon name="phone" className="size-4" />
              Call {SITE.phone}
            </a>
            <button
              type="button"
              data-enquiry
              className="inline-flex h-13 items-center justify-center gap-2 rounded-full border border-border-strong bg-surface-raised px-6 font-semibold transition-colors hover:border-action hover:text-action"
            >
              Send an enquiry <span aria-hidden="true">→</span>
            </button>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
