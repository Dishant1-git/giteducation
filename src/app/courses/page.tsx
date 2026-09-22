import type { Metadata } from "next";
import Link from "next/link";

import { Icon } from "@/components/icon";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { COURSES, formatFee, getCoursesByCategory } from "@/lib/courses";
import { SITE, TEL_HREF } from "@/lib/site";

export const metadata: Metadata = {
  title: "All Courses in Jalandhar | Computer, Accounting, Design & AI Training",
  description:
    "Every course at GIT Education Jalandhar: Basic Computer, MS Office, Advance Excel, Tally Prime with GST, Punjabi and English typing, CAD/CAM, Graphic Design, DTP, Digital Marketing and Artificial Intelligence.",
  alternates: { canonical: "/courses" },
};

export default function CoursesIndexPage() {
  const groups = getCoursesByCategory();

  return (
    <div>
      <header id="top" className="on-inverse hero-surface relative isolate overflow-hidden px-5 pt-28 pb-16 text-white sm:pt-32 lg:px-8 lg:pb-20">
        <div className="panel-glow pointer-events-none absolute inset-0 -z-10" />
        <div className="grid-overlay pointer-events-none absolute inset-0 -z-10 opacity-50" />
        <div className="mx-auto max-w-[1240px]">
          <nav aria-label="Breadcrumb" className="no-print">
            <ol className="flex items-center gap-2 text-[13px] text-white/60">
              <li>
                <Link href="/" className="transition-colors hover:text-accent-yellow">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <span aria-current="page" className="text-white">
                  Courses
                </span>
              </li>
            </ol>
          </nav>

          <Reveal>
            <p className="mt-8 flex flex-wrap items-center gap-2 text-xs">
              <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 font-semibold tracking-wide">Course directory</span>
              <span className="rounded-full bg-accent-yellow px-3 py-1 font-semibold text-ink">{COURSES.length} courses running</span>
            </p>
            <h1 className="mt-5 max-w-3xl font-display text-[clamp(2rem,5vw,3.4rem)] leading-[1.05] font-extrabold tracking-[-0.03em] text-balance">
              Every course we run in {SITE.address.locality}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/75 lg:text-lg">
              One computer per student, practical assignments in every class and placement support on every course. Pick a course to see its full syllabus, batch
              timings and fees.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/#contact" className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-accent-yellow px-7 font-semibold text-ink transition-all duration-200 hover:-translate-y-0.5 hover:bg-white">
                Book a free demo class
                <span aria-hidden="true">→</span>
              </Link>
              <a href={TEL_HREF} className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/25 bg-white/5 px-6 font-medium transition-colors duration-200 hover:border-white/50 hover:bg-white/10">
                <Icon name="phone" className="size-4" />
                Talk to a counsellor
              </a>
            </div>
          </Reveal>
        </div>
      </header>

      <div className="mx-auto max-w-[1240px] px-5 py-14 lg:px-8 lg:py-20">
        {groups.map((group, groupIndex) => (
          <section key={group.category} aria-labelledby={`group-${groupIndex}`} className="border-t border-border-subtle pt-10 first:border-t-0 first:pt-0 [&:not(:first-child)]:mt-14">
            <Reveal>
              <p className="section-rule text-action">Category {String(groupIndex + 1).padStart(2, "0")}</p>
              <h2 id={`group-${groupIndex}`} className="mt-3 font-display text-2xl font-extrabold tracking-[-0.02em] sm:text-3xl">
                {group.category}
              </h2>
            </Reveal>

            <Stagger as="ul" className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {group.courses.map((course) => (
                <StaggerItem as="li" key={course.slug}>
                  <Link
                    href={`/courses/${course.slug}`}
                    className="group flex h-full flex-col rounded-card border border-border-subtle bg-surface-raised p-6 transition-all duration-200 hover:-translate-y-1 hover:border-action hover:shadow-card"
                  >
                    <span className="flex items-start justify-between gap-3">
                      <span className="grid size-11 place-items-center rounded-xl bg-surface-accent text-action transition-colors duration-200 group-hover:bg-action group-hover:text-white">
                        <Icon name={course.icon} className="size-5" />
                      </span>
                      <span className="rounded-full bg-surface-sunken px-2.5 py-1 text-[11px] font-semibold text-content-muted">{course.duration}</span>
                    </span>

                    <span className="mt-4 font-display text-lg leading-snug font-bold tracking-tight text-balance">{course.shortTitle}</span>
                    <span className="mt-2 flex-1 text-sm leading-relaxed text-content-muted">{course.tagline}</span>

                    <span className="mt-5 flex items-end justify-between gap-3 border-t border-border-subtle pt-4">
                      <span>
                        <span className="block text-[11px] tracking-[0.12em] text-content-muted uppercase">Course fee</span>
                        <span className="mt-0.5 block font-display text-lg font-bold tracking-tight">{formatFee(course.fee.amount)}</span>
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-action">
                        View course
                        <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">
                          →
                        </span>
                      </span>
                    </span>
                  </Link>
                </StaggerItem>
              ))}
            </Stagger>
          </section>
        ))}
      </div>
    </div>
  );
}
