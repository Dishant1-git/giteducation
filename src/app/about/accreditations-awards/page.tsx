import type { Metadata } from "next";
import Link from "next/link";

import { Icon } from "@/components/icon";
import { Reveal } from "@/components/motion";
import { AWARDS, CREDENTIALS, WHY_CHECK } from "@/lib/about";
import { certificateHref, certificatePrograms, SITE, TEL_HREF } from "@/lib/site";

export const metadata: Metadata = {
  title: "Accreditations & Awards",
  description: `Registration, certificates and recognition of ${SITE.name}, ${SITE.address.locality}: what we hold, and how to check it yourself.`,
  alternates: { canonical: "/about/accreditations-awards" },
};

const EYEBROW = "font-mono text-xs font-bold tracking-[0.22em] text-action uppercase";
const H2 = "mt-4 font-display text-[clamp(1.8rem,4vw,2.8rem)] leading-[1.1] font-extrabold tracking-tight text-balance";

export default function AccreditationsAwardsPage() {
  return (
    <div>
      {/* ---------- Hero ---------- */}
      <header className="on-inverse hero-surface relative isolate overflow-hidden px-5 pt-28 pb-16 text-white sm:pt-32 lg:px-8 lg:pb-20">
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
                <Link href="/about" className="transition-colors hover:text-accent-yellow">
                  About
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <span aria-current="page" className="text-white">
                  Accreditations &amp; Awards
                </span>
              </li>
            </ol>
          </nav>
          <Reveal>
            <p className="mt-8 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-wide">
              Accreditations &amp; Awards
            </p>
            <h1 className="mt-6 max-w-3xl font-display text-[clamp(2.2rem,5vw,3.6rem)] leading-[1.06] font-extrabold tracking-[-0.03em] text-balance">
              A certificate is only worth <span className="text-accent-yellow">what stands behind it.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/75 lg:text-lg">
              What {SITE.name} holds, what each certificate carries, and how you can check all of it before you enrol.
            </p>
          </Reveal>
        </div>
      </header>

      {/* ---------- What to check ---------- */}
      <section className="px-5 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-[1240px]">
          <div className="mx-auto max-w-3xl text-center">
            <p className={EYEBROW}>Why it matters</p>
            <h2 className={H2}>What to check before you choose an institute</h2>
            <p className="mt-5 text-base leading-relaxed text-content-muted lg:text-lg">
              Not every certificate carries the same weight. These are the four things worth checking anywhere you plan to study, including here.
            </p>
          </div>
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:mt-14">
            {WHY_CHECK.map((item, i) => (
              <li key={item.title}>
                <Reveal className="h-full" delay={(i % 2) * 0.08}>
                  <div className="flex h-full gap-5 rounded-card border border-border-subtle bg-surface-sunken p-6 lg:p-7">
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-surface-accent text-action">
                      <Icon name={item.icon} className="size-5" />
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-bold tracking-tight">{item.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-content-muted">{item.text}</p>
                    </div>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- Credentials ---------- */}
      <section id="credentials" className="border-t border-border-subtle bg-surface-sunken px-5 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-[1240px]">
          <div className="mx-auto max-w-3xl text-center">
            <p className={EYEBROW}>Our credentials</p>
            <h2 className={H2}>{CREDENTIALS.length === 1 ? "Our registration" : "Credentials you can verify"}</h2>
            <p className="mt-5 text-base leading-relaxed text-content-muted lg:text-lg">
              Ask at the centre to see the original document for anything listed here.
            </p>
          </div>

          <ul className={`mx-auto mt-12 grid gap-6 lg:mt-14 ${CREDENTIALS.length >= 3 ? "lg:grid-cols-3" : CREDENTIALS.length === 2 ? "md:grid-cols-2" : "max-w-2xl"}`}>
            {CREDENTIALS.map((credential, i) => (
              <li key={credential.title}>
                <Reveal className="h-full" delay={i * 0.1}>
                  <div className="flex h-full flex-col rounded-card border border-border-subtle bg-surface-raised p-7 lg:p-8">
                    <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-action text-white">
                      <Icon name={credential.icon} className="size-6" />
                    </span>
                    <h3 className="mt-5 font-display text-lg font-bold tracking-tight">{credential.title}</h3>
                    {credential.since && <p className="mt-1 text-xs font-semibold tracking-wide text-action uppercase">Since {credential.since}</p>}
                    <p className="mt-1 font-mono text-xs text-content-muted">{credential.issuer}</p>
                    <p className="mt-4 text-sm leading-relaxed text-content-muted">{credential.text}</p>
                    <ul className="mt-5 space-y-2.5 border-t border-border-subtle pt-5">
                      {credential.points.map((point) => (
                        <li key={point} className="flex gap-2.5 text-sm leading-relaxed">
                          <Icon name="check" className="mt-0.5 size-4 shrink-0 text-action" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- Awards (shown once there are any) ---------- */}
      {AWARDS.length > 0 && (
        <section id="awards" className="px-5 py-16 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-[1240px]">
            <div className="mx-auto max-w-3xl text-center">
              <p className={EYEBROW}>Awards & recognition</p>
              <h2 className={H2}>Recognised for the training</h2>
            </div>
            <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {AWARDS.map((award) => (
                <li key={`${award.title}-${award.year}`} className="rounded-card border border-border-subtle bg-surface-raised p-6">
                  <span className="grid size-11 place-items-center rounded-xl bg-accent-yellow text-ink">
                    <Icon name="sparkle" className="size-5" />
                  </span>
                  <p className="mt-4 font-mono text-xs font-bold tracking-wide text-action">{award.year}</p>
                  <h3 className="mt-1 font-display text-base font-bold tracking-tight">{award.title}</h3>
                  <p className="mt-1 text-sm text-content-muted">{award.by}</p>
                  {award.text && <p className="mt-3 text-sm leading-relaxed text-content-muted">{award.text}</p>}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ---------- Certificates ---------- */}
      <section className="border-t border-border-subtle px-5 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-[1240px] gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-start lg:gap-16">
          <div>
            <p className={EYEBROW}>Your certificate</p>
            <h2 className={H2}>Earned in a practical test, not just for attending</h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-content-muted">
              A certificate is issued only after the final practical assessment. It names the course and its duration, so an employer can see exactly
              what you studied.
            </p>
            <Link
              href="/reviews"
              className="mt-7 inline-flex h-12 items-center gap-2 rounded-full border border-border-strong bg-surface-raised px-6 text-sm font-semibold transition-colors hover:border-action hover:text-action"
            >
              Read student reviews <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div>
            <h3 className="font-display text-base font-bold tracking-tight">Certificate programs</h3>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {certificatePrograms.map((program) => (
                <li key={program.slug}>
                  <Link
                    href={certificateHref(program.slug)}
                    className="flex items-center gap-3 rounded-card border border-border-subtle bg-surface-raised p-4 text-sm font-semibold transition-colors hover:border-action hover:text-action"
                  >
                    <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-surface-accent text-action">
                      <Icon name={program.icon} className="size-4" />
                    </span>
                    {program.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="border-t border-border-subtle bg-surface-sunken px-5 py-16 text-center lg:px-8 lg:py-24">
        <Reveal className="mx-auto max-w-2xl">
          <p className="text-xs font-bold tracking-[0.22em] text-action uppercase">See it for yourself</p>
          <h2 className="mt-5 font-display text-[clamp(2rem,5vw,3.4rem)] leading-[1.05] font-extrabold tracking-[-0.03em] text-balance">Visit the centre before you decide.</h2>
          <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-content-muted lg:text-lg">
            Book a free demo class, see the lab, and ask to see our registration and a sample certificate.
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
