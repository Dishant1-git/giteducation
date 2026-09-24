import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";

import { Icon } from "@/components/icon";
import { Reveal } from "@/components/motion";
import { FUTURE_TEXT, MISSION, MISSION_GOALS, VISION, VISION_POINTS } from "@/lib/about";
import { SITE, TEL_HREF } from "@/lib/site";

export const metadata: Metadata = {
  title: "Mission and Vision",
  description: `What ${SITE.name}, ${SITE.address.locality}, is working towards: practical, affordable computer training that leads to real work.`,
  alternates: { canonical: "/about/mission-vision" },
};

const EYEBROW = "font-mono text-xs font-bold tracking-[0.22em] text-action uppercase";
const H2 = "mt-4 font-display text-[clamp(1.8rem,4vw,2.8rem)] leading-[1.1] font-extrabold tracking-tight text-balance";

/** Positions of the vision points on a circle (radius 37%), starting at the top and going clockwise. */
const RING = VISION_POINTS.map((_, i, all) => {
  const angle = (-90 + (360 / all.length) * i) * (Math.PI / 180);
  return { x: `${(50 + 37 * Math.cos(angle)).toFixed(1)}%`, y: `${(50 + 37 * Math.sin(angle)).toFixed(1)}%` };
});

export default function MissionVisionPage() {
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
                  Mission &amp; Vision
                </span>
              </li>
            </ol>
          </nav>
          <Reveal>
            <p className="mt-8 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-wide">Mission &amp; Vision</p>
            <h1 className="mt-6 max-w-4xl font-display text-[clamp(2.2rem,5vw,3.6rem)] leading-[1.06] font-extrabold tracking-[-0.03em] text-balance text-white/45">
              Why we teach, <span className="text-white">and what we are</span> <span className="text-accent-yellow">working towards.</span>
            </h1>
          </Reveal>
        </div>
      </header>

      {/* ---------- Mission ---------- */}
      <section id="mission" className="bg-surface-sunken px-5 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-[1240px]">
          <div className="mx-auto max-w-3xl text-center">
            <p className={EYEBROW}>Our mission</p>
            <h2 className={H2}>Skills that turn into work</h2>
            <p className="mt-5 text-base leading-relaxed text-content-muted lg:text-lg">{MISSION}</p>
          </div>

          <ol className="relative mt-14 grid gap-y-10 sm:grid-cols-2 lg:mt-20 lg:grid-cols-5 lg:gap-x-6">
            <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-1/2 hidden h-px -translate-y-1/2 bg-border-strong lg:block" />
            {MISSION_GOALS.map((goal, i) => {
              const above = i % 2 === 0;
              return (
                <li key={goal.title} className="lg:grid lg:grid-rows-[1fr_auto_1fr]">
                  <Reveal
                    delay={i * 0.08}
                    className={`flex flex-col items-center gap-3 text-center ${above ? "lg:row-start-1 lg:flex-col-reverse lg:self-end" : "lg:row-start-3 lg:self-start"}`}
                  >
                    <span aria-hidden="true" className="hidden h-6 w-px bg-border-strong lg:block" />
                    <span
                      className={`grid size-16 shrink-0 place-items-center rounded-full text-white ring-6 lg:size-18 ${
                        above ? "bg-ink ring-ink/10" : "bg-action ring-action/15"
                      }`}
                    >
                      <Icon name={goal.icon} className="size-7" />
                    </span>
                    <h3 className="font-display text-sm font-bold tracking-tight lg:text-base">{goal.title}</h3>
                    <p className="max-w-[16rem] text-xs leading-relaxed text-content-muted lg:text-sm">{goal.text}</p>
                  </Reveal>
                  <span aria-hidden="true" className="hidden lg:row-start-2 lg:grid lg:h-3 lg:place-items-center">
                    <span className={`size-3 rounded-full bg-surface ring-2 ${above ? "ring-ink" : "ring-action"}`} />
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* ---------- Vision ---------- */}
      <section id="vision" className="px-5 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-[1240px]">
          <div className="mx-auto max-w-3xl text-center">
            <p className={EYEBROW}>Our vision</p>
            <h2 className={H2}>Job-ready skills, close to home</h2>
            <p className="mt-5 text-base leading-relaxed text-content-muted lg:text-lg">{VISION}</p>
          </div>

          <Reveal>
            <ul className="mx-auto mt-14 flex flex-wrap items-center justify-center gap-6 lg:relative lg:mt-16 lg:block lg:aspect-square lg:w-full lg:max-w-[44rem]">
              <li aria-hidden="true" className="pointer-events-none absolute inset-[13%] hidden rounded-full border-2 border-dashed border-action/40 lg:block" />
              <li
                aria-hidden="true"
                className="absolute top-1/2 left-1/2 hidden size-44 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-border-subtle bg-surface-sunken text-center lg:grid"
              >
                <span>
                  <span className="block font-mono text-[10px] font-bold tracking-[0.22em] text-action uppercase">Our vision</span>
                  <span className="mt-2 block font-display text-lg leading-tight font-bold tracking-tight">
                    Skilled,
                    <br />
                    close to home
                  </span>
                </span>
              </li>
              {VISION_POINTS.map((point, i) => (
                <li
                  key={point}
                  style={{ "--x": RING[i].x, "--y": RING[i].y } as CSSProperties}
                  className={`grid size-44 place-items-center rounded-full border-4 bg-surface-raised p-6 text-center shadow-card sm:size-48 lg:absolute lg:top-[var(--y)] lg:left-[var(--x)] lg:-translate-x-1/2 lg:-translate-y-1/2 ${
                    i % 2 === 0 ? "border-action" : "border-accent-yellow"
                  }`}
                >
                  <p className="text-[13px] leading-snug font-semibold text-balance">{point}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ---------- Future ---------- */}
      <section className="on-inverse hero-surface relative isolate overflow-hidden px-5 py-16 text-center text-white lg:px-8 lg:py-24">
        <div className="panel-glow pointer-events-none absolute inset-0 -z-10" />
        <Reveal className="mx-auto max-w-3xl">
          <p className="font-mono text-xs font-bold tracking-[0.22em] text-accent-yellow uppercase">Looking ahead</p>
          <h2 className="mt-5 font-display text-[clamp(1.8rem,4vw,2.8rem)] leading-[1.1] font-extrabold tracking-tight text-balance">
            Teaching today&apos;s software, <span className="text-accent-yellow">and tomorrow&apos;s.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/75 lg:text-lg">{FUTURE_TEXT}</p>
          <Link
            href="/about"
            className="mt-8 inline-flex h-12 items-center gap-2 rounded-full border border-white/25 px-6 text-sm font-semibold transition-colors hover:border-white/50 hover:bg-white/10"
          >
            More about {SITE.name} <span aria-hidden="true">→</span>
          </Link>
        </Reveal>
      </section>

      {/* ---------- CTA ---------- */}
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
