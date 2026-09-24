import type { Metadata } from "next";
import Link from "next/link";

import { Icon } from "@/components/icon";
import { Reveal } from "@/components/motion";
import { SITE, TEL_HREF } from "@/lib/site";

import { TrainingMatcher } from "./training-matcher";

export const metadata: Metadata = {
  title: "6 Weeks & 6 Months Industrial Training Matcher",
  description: `Pick your university, branch and semester to see the industrial training format and live project tracks that fit, with synopsis, diary and report support. ${SITE.name}, ${SITE.address.locality}.`,
  alternates: { canonical: "/tools/training-matcher" },
};

export default function TrainingMatcherPage() {
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
              <li>Tools</li>
              <li aria-hidden="true">/</li>
              <li>
                <span aria-current="page" className="text-white">
                  Training matcher
                </span>
              </li>
            </ol>
          </nav>

          <Reveal>
            <p className="mt-8 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-wide">Free Tool · Instant Match</p>
            <h1 className="mt-6 max-w-2xl font-display text-[clamp(2.2rem,5vw,3.6rem)] leading-[1.06] font-extrabold tracking-[-0.03em] text-balance text-white/45">
              <span className="text-white">6 Weeks &amp; 6 Months</span> <span className="text-white">training matcher.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/75 lg:text-lg">
              Set your university, branch and semester to see the training format and live project tracks that fit, with the syllabus and batch dates one click away.
            </p>
          </Reveal>
        </div>
      </header>

      <section className="px-5 py-14 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-[1240px]">
          <div className="mb-10 text-center">
            <h2 className="font-display text-3xl leading-[1.08] font-extrabold tracking-tight sm:text-4xl">
              Find your <span className="text-action">industrial training</span>
            </h2>
            <ul className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-medium text-content-muted sm:text-sm">
              {["Training certificate", "Synopsis & report support", "Practical live project"].map((item) => (
                <li key={item} className="flex items-center gap-1.5 text-action">
                  <Icon name="check" className="size-3.5" strokeWidth={2.6} />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <TrainingMatcher />

          <div className="mt-10 flex flex-col items-center justify-between gap-6 rounded-panel border border-border-subtle bg-surface-raised p-6 shadow-card sm:flex-row sm:p-7">
            <div className="text-center sm:text-left">
              <h3 className="font-display text-lg font-bold tracking-tight">Need custom batch timing or a college letter?</h3>
              <p className="mt-1 max-w-xl text-sm text-content-muted">
                A counsellor will help with your training synopsis, batch timings and joining letter for your department.
              </p>
            </div>
            <div className="flex w-full flex-col gap-2.5 sm:w-auto sm:flex-row">
              <a href={TEL_HREF} className="inline-flex h-11 items-center justify-center gap-2 rounded-control border border-border-strong px-5 text-sm font-bold transition-colors hover:bg-surface-sunken">
                <Icon name="phone" className="size-4 text-action" />
                Call {SITE.phone}
              </a>
              <button type="button" data-enquiry="Industrial Training" className="inline-flex h-11 items-center justify-center gap-2 rounded-control bg-action px-5 text-sm font-bold text-white transition-colors hover:bg-action-hover">
                Request a free callback
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border-subtle bg-surface-sunken px-5 py-16 text-center lg:px-8 lg:py-24">
        <Reveal className="mx-auto max-w-2xl">
          <p className="text-xs font-bold tracking-[0.22em] text-action uppercase">Ready to get started?</p>
          <h2 className="mt-5 font-display text-[clamp(2rem,5vw,3.4rem)] leading-[1.05] font-extrabold tracking-[-0.03em] text-balance">Start building your career today.</h2>
          <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-content-muted lg:text-lg">
            Talk to a counsellor. One call is usually enough to know which training fits your branch, your semester and the job you want.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button type="button" data-enquiry className="inline-flex h-13 items-center justify-center gap-2 rounded-full bg-action px-8 font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-action-hover">
              Book a free demo class <span aria-hidden="true">→</span>
            </button>
            <a href={TEL_HREF} className="inline-flex h-13 items-center justify-center gap-2 rounded-full border border-border-strong bg-surface-raised px-6 font-semibold transition-colors hover:border-action hover:text-action">
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
