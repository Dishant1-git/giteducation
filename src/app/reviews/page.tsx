import type { Metadata } from "next";
import Link from "next/link";

import { Icon } from "@/components/icon";
import { Reveal } from "@/components/motion";
import { REVIEWS } from "@/lib/reviews";
import { SITE, TEL_HREF } from "@/lib/site";

export const metadata: Metadata = {
  title: "Student Reviews | What Our Students Say",
  description: `What students say about their courses at ${SITE.name}, ${SITE.address.locality}: Tally, typing, CAD, design, Excel, digital marketing and more.`,
  alternates: { canonical: "/reviews" },
};

/** Avatar gradients, cycled so neighbouring cards differ. */
const AVATARS = ["from-brand-600 to-brand-400", "from-accent-500 to-accent-400", "from-ink to-brand-700", "from-brand-700 to-accent-500"];

export default function ReviewsPage() {
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
                  Reviews
                </span>
              </li>
            </ol>
          </nav>
          <Reveal>
            <p className="mt-8 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-wide">Reviews</p>
            <h1 className="mt-6 max-w-3xl font-display text-[clamp(2.2rem,5vw,3.6rem)] leading-[1.06] font-extrabold tracking-[-0.03em] text-balance text-white/45">
              <span className="text-white">In their words,</span> not ours.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/75 lg:text-lg">
              What students told us after finishing their course, one from each of our most popular courses.
            </p>
          </Reveal>
        </div>
      </header>

      <section className="px-5 py-14 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-[1240px]">
          <div className="flex items-baseline justify-between gap-4">
            <p className="font-mono text-xs font-bold tracking-[0.22em] text-action uppercase">Student reviews</p>
            <p className="font-mono text-xs text-content-muted">{REVIEWS.length} shown</p>
          </div>

          <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:mt-10 xl:grid-cols-4">
            {REVIEWS.map((review, i) => (
              <li key={`${review.course}-${review.name}`}>
                <Reveal className="h-full" delay={(i % 4) * 0.06}>
                  <figure className="flex h-full flex-col rounded-card border border-border-subtle bg-surface-raised p-6 transition-shadow duration-500 hover:shadow-card">
                    <figcaption className="flex items-center gap-3">
                      <span
                        aria-hidden="true"
                        className={`grid size-10 shrink-0 place-items-center rounded-full bg-gradient-to-br font-display text-xs font-bold text-white ${AVATARS[i % AVATARS.length]}`}
                      >
                        {review.initials}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold tracking-tight">{review.name}</span>
                        <span className="block truncate text-xs text-content-muted">{review.role}</span>
                      </span>
                    </figcaption>
                    <blockquote className="mt-4 flex-1 text-sm leading-relaxed">&ldquo;{review.text}&rdquo;</blockquote>
                    <Link
                      href={review.href}
                      className="mt-5 inline-flex w-fit items-center gap-1.5 rounded-md bg-surface-sunken px-2.5 py-1 text-[11px] font-semibold text-action transition-colors hover:bg-action hover:text-white"
                    >
                      {review.course} <span aria-hidden="true">→</span>
                    </Link>
                  </figure>
                </Reveal>
              </li>
            ))}
          </ul>

          <p className="mt-10 text-center text-xs leading-relaxed text-content-muted">
            Each card links to its course page, where you can read more from students who took it.
          </p>
        </div>
      </section>

      <section className="border-t border-border-subtle bg-surface-sunken px-5 py-16 text-center lg:px-8 lg:py-24">
        <Reveal className="mx-auto max-w-2xl">
          <p className="text-xs font-bold tracking-[0.22em] text-action uppercase">Ready to get started?</p>
          <h2 className="mt-5 font-display text-[clamp(2rem,5vw,3.4rem)] leading-[1.05] font-extrabold tracking-[-0.03em] text-balance">Start building your career today.</h2>
          <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-content-muted lg:text-lg">
            Talk to a counsellor. One call is usually enough to know which course fits your background, your schedule and the job you want.
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
        </Reveal>
      </section>
    </div>
  );
}
