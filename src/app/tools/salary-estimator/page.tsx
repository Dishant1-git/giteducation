import type { Metadata } from "next";
import Link from "next/link";

import { Icon } from "@/components/icon";
import { Reveal } from "@/components/motion";
import { SITE, TEL_HREF } from "@/lib/site";

import { SalaryEstimator } from "./salary-estimator";

export const metadata: Metadata = {
  title: "Tech Salary & Career Growth Estimator | Punjab & NCR",
  description: `Estimate the monthly salary for computer, accounts, design, CAD, marketing and AI jobs in Punjab and Delhi NCR, and see how it grows with experience. Free tool by ${SITE.name}, ${SITE.address.locality}.`,
  alternates: { canonical: "/tools/salary-estimator" },
};

const STEPS = [
  { icon: "target", title: "Pick a role", text: "Choose the job you are training for, from office work to AI development." },
  { icon: "location", title: "Set place and experience", text: "Pay changes a lot between Jalandhar, the Tricity and Delhi NCR." },
  { icon: "sparkle", title: "Add skills you can prove", text: "Portfolio pieces and certificates are what move an offer upward." },
];

export default function SalaryEstimatorPage() {
  return (
    <div>
      <header className="on-inverse hero-surface relative isolate overflow-hidden px-5 pt-28 pb-14 text-white sm:pt-32 lg:px-8 lg:pb-16">
        <div className="panel-glow pointer-events-none absolute inset-0 -z-10" />
        <div className="grid-overlay pointer-events-none absolute inset-0 -z-10 opacity-50" />
        <div className="mx-auto grid max-w-[1240px] gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <div>
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
                    Salary estimator
                  </span>
                </li>
              </ol>
            </nav>
            <Reveal>
              <p className="mt-8 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-wide">
                Free Tool · Punjab &amp; NCR
              </p>
              <h1 className="mt-6 max-w-2xl font-display text-[clamp(2.2rem,5vw,3.6rem)] leading-[1.06] font-extrabold tracking-[-0.03em] text-balance">
                What will your skills <span className="text-accent-yellow">actually pay?</span>
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-white/75 lg:text-lg">
                Pick a role, a city and your experience to see a realistic monthly range, and how it grows over the next five years.
              </p>
            </Reveal>
          </div>

          <ol className="grid gap-3">
            {STEPS.map((step, i) => (
              <li key={step.title} className="flex gap-4 rounded-card border border-border-inverse bg-white/5 p-4 backdrop-blur-sm">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/10 text-accent-yellow">
                  <Icon name={step.icon} className="size-5" />
                </span>
                <span>
                  <span className="block text-sm font-semibold">
                    {i + 1}. {step.title}
                  </span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-content-inverse-muted">{step.text}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </header>

      <section className="px-5 py-14 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-[1240px]">
          <SalaryEstimator />
        </div>
      </section>

      <section className="border-t border-border-subtle bg-surface-sunken px-5 py-16 lg:px-8 lg:py-20">
        <Reveal className="mx-auto flex max-w-[1240px] flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <div className="max-w-xl">
            <p className="section-rule text-action">Next step</p>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">Turn the estimate into an offer.</h2>
            <p className="mt-4 text-base leading-relaxed text-content-muted">
              A free counselling call tells you which course, batch and portfolio will get you to the top of that range fastest.
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
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
