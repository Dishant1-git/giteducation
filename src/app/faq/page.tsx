import type { Metadata } from "next";
import Link from "next/link";

import { Icon } from "@/components/icon";
import { Reveal } from "@/components/motion";
import { COMMON_FAQS as CERTIFICATE_FAQS } from "@/lib/certificate-programs";
import { COMMON_FAQS as COURSE_FAQS, COURSES, PLACEMENT_STEPS } from "@/lib/courses";
import { GENERAL_FAQS } from "@/lib/faq";
import { SITE, TEL_HREF } from "@/lib/site";

import { FaqBrowser, type FaqGroup } from "./faq-browser";

export const metadata: Metadata = {
  title: "FAQ | Admissions, Fees, Batches & Certificates",
  description: `Answers to common questions about courses, batches, fees, certificates and placement help at ${SITE.name}, ${SITE.address.locality}.`,
  alternates: { canonical: "/faq" },
};

const placementAnswer = `Yes. ${PLACEMENT_STEPS.map((step) => `${step.title}: ${step.text}`).join(" ")}`;

const courseCommon = new Set(COURSE_FAQS.map(([q]) => q));
const missedClasses = COURSE_FAQS.filter(([q]) => q === "What happens if I miss classes?");

/** General first, then certificates, then one tab per course in catalogue order. */
const GROUPS: FaqGroup[] = [
  {
    id: "general",
    label: "General",
    items: [...GENERAL_FAQS, ...missedClasses, ["Do you help with placement?", placementAnswer]],
  },
  { id: "certificates", label: "Certificates", items: CERTIFICATE_FAQS },
  ...COURSES.map((course) => ({
    id: course.slug,
    label: course.shortTitle,
    href: `/courses/${course.slug}`,
    items: course.faqs.filter(([q]) => !courseCommon.has(q)),
  })).filter((group) => group.items.length > 0),
];

export default function FaqPage() {
  const seen = new Set<string>();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: GROUPS.flatMap((g) => g.items)
      .filter(([q]) => {
        if (seen.has(q)) return false;
        seen.add(q);
        return true;
      })
      .map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

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
                  FAQ
                </span>
              </li>
            </ol>
          </nav>
          <Reveal>
            <p className="mt-8 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-wide">FAQ</p>
            <h1 className="mt-6 max-w-3xl font-display text-[clamp(2.2rem,5vw,3.6rem)] leading-[1.06] font-extrabold tracking-[-0.03em] text-balance text-white/45">
              <span className="text-white">Questions</span> we are asked, and <span className="text-accent-yellow">straight answers.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/75 lg:text-lg">
              Admissions, batches, fees and certificates. If something is not covered here, call the centre and we will answer it on the phone.
            </p>
          </Reveal>
        </div>
      </header>

      <section className="px-5 py-14 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-[1240px]">
          <FaqBrowser groups={GROUPS} />

          <div className="mt-16 rounded-panel border border-border-subtle bg-surface-sunken p-8 text-center lg:mt-20 lg:p-10">
            <h2 className="font-display text-xl font-bold tracking-tight lg:text-2xl">Still not sure?</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-content-muted lg:text-base">
              Course choice, batch timing and fees are easier to settle in one conversation than by reading. Counselling is free.
            </p>
            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href={TEL_HREF}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-action px-7 text-sm font-semibold text-white transition-colors hover:bg-action-hover"
              >
                <Icon name="phone" className="size-4" />
                Call {SITE.phone}
              </a>
              <button
                type="button"
                data-enquiry
                className="inline-flex h-12 items-center justify-center rounded-full border border-border-strong bg-surface-raised px-7 text-sm font-semibold transition-colors hover:border-action hover:text-action"
              >
                Book a free demo
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
