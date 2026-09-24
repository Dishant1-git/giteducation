import type { Metadata } from "next";
import Link from "next/link";

import { Icon } from "@/components/icon";
import { Reveal } from "@/components/motion";
import { TRACKS } from "@/lib/career-tracks";
import { formatFee, getCourse } from "@/lib/courses";
import { SITE, TEL_HREF } from "@/lib/site";

import { CareerTrackFinder, type CourseSummary } from "./career-track-finder";

export const metadata: Metadata = {
  title: "Find My Career Track | Free 90-Day Roadmap + PDF",
  description: `Answer four questions and get a free 90-day career plan: free certificates, three portfolio projects, job titles to apply for and a pitch template. Built by ${SITE.name}, ${SITE.address.locality}.`,
  alternates: { canonical: "/tools/career-track-finder" },
};

export default function CareerTrackFinderPage() {
  // Only the few course fields the result card shows are sent to the client.
  const courses: Record<string, CourseSummary> = {};
  for (const track of Object.values(TRACKS)) {
    const course = getCourse(track.courseSlug);
    if (course) courses[course.slug] = { title: course.shortTitle, duration: course.duration, fee: formatFee(course.fee.amount) };
  }

  return (
    <div>
      <header className="no-print on-inverse hero-surface relative isolate overflow-hidden px-5 pt-28 pb-14 text-white sm:pt-32 lg:px-8 lg:pb-16">
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
              <li>Tools</li>
              <li aria-hidden="true">/</li>
              <li>
                <span aria-current="page" className="text-white">
                  Find my career track
                </span>
              </li>
            </ol>
          </nav>

          <Reveal>
            <p className="mt-8 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-wide">
              Free Tool · 4 Questions · PDF Roadmap
            </p>
            <h1 className="mt-6 max-w-2xl font-display text-[clamp(2.2rem,5vw,3.6rem)] leading-[1.06] font-extrabold tracking-[-0.03em] text-balance text-white/45">
              <span className="text-white">Find my</span> IT / CAD <span className="text-white">career track.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/75 lg:text-lg">
              Four questions, then a 90-day plan you can actually follow: free certificates, three portfolio projects, the job titles to apply for, and a pitch
              template for your first client. Download it as a PDF. No form, no email, no catch.
            </p>
          </Reveal>
        </div>
      </header>

      <section className="px-5 py-14 lg:px-8 lg:py-20 print:p-0">
        <CareerTrackFinder courses={courses} />
      </section>

      <section id="cta" className="no-print border-t border-border-subtle bg-surface-sunken px-5 py-16 text-center lg:px-8 lg:py-24">
        <Reveal className="mx-auto max-w-2xl">
          <p className="text-xs font-bold tracking-[0.22em] text-action uppercase">Ready to get started?</p>
          <h2 className="mt-5 font-display text-[clamp(2rem,5vw,3.4rem)] leading-[1.05] font-extrabold tracking-[-0.03em] text-balance">
            Start building your career today.
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-content-muted lg:text-lg">
            Talk to a counsellor. One call is usually enough to know which track fits your education, your schedule and the job you want.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              type="button"
              data-enquiry
              className="inline-flex h-13 items-center justify-center gap-2 rounded-full bg-action px-8 font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-action-hover"
            >
              Book a free demo class <span aria-hidden="true">→</span>
            </button>
            <a
              href={TEL_HREF}
              className="inline-flex h-13 items-center justify-center gap-2 rounded-full border border-border-strong bg-surface-raised px-6 font-semibold transition-colors hover:border-action hover:text-action"
            >
              <Icon name="phone" className="size-4" />
              {SITE.phone}
            </a>
          </div>
          <ul className="mt-9 flex flex-col items-center justify-center gap-3 text-sm text-content-muted sm:flex-row sm:gap-6">
            {["Free career counselling", "No registration fee", "Placement support included"].map((item) => (
              <li key={item} className="inline-flex items-center gap-2">
                <Icon name="check" className="size-4 text-action" strokeWidth={2.2} />
                {item}
              </li>
            ))}
          </ul>
        </Reveal>
      </section>
    </div>
  );
}
