import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Icon } from "@/components/icon";
import { Reveal } from "@/components/motion";
import { ABOUT_STATS, AUDIENCES, DIFFERENCES, MISSION, PRINCIPLES, STEPS, VISION } from "@/lib/about";
import { certificateHref, certificatePrograms, courseGroups, courseHref, SITE, TEL_HREF } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Us | Computer Training Institute in Jalandhar",
  description: `${SITE.name} has taught practical computer skills in ${SITE.address.locality} since ${SITE.established}: basic computer, typing, Tally, Excel, CAD, design, digital marketing and more.`,
  alternates: { canonical: "/about" },
};

const EYEBROW = "font-mono text-xs font-bold tracking-[0.22em] text-action uppercase";
const H2 = "mt-4 font-display text-[clamp(1.8rem,4vw,2.8rem)] leading-[1.1] font-extrabold tracking-tight text-balance";

export default function AboutPage() {
  return (
    <div>
      {/* ---------- Hero ---------- */}
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
                  About
                </span>
              </li>
            </ol>
          </nav>
          <Reveal>
            <p className="mt-8 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-wide">About us</p>
            <h1 className="mt-6 max-w-4xl font-display text-[clamp(2.2rem,5vw,3.6rem)] leading-[1.06] font-extrabold tracking-[-0.03em] text-balance text-white/45">
              Teaching <span className="text-white">practical computer skills</span> in {SITE.address.locality}{" "}
              <span className="text-accent-yellow">since {SITE.established}.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/75 lg:text-lg">
              From a first day on the computer to accounting, drafting and design software, we teach the skills that offices, businesses and
              government jobs ask for.
            </p>
          </Reveal>
          <dl className="mt-12 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4">
            {ABOUT_STATS.map(([value, label]) => (
              <div key={label} className="relative flex flex-col-reverse pl-5">
                <span aria-hidden="true" className="absolute inset-y-0 left-0 w-0.5 rounded-full bg-accent-yellow" />
                <dt className="mt-2 text-sm text-white/60">{label}</dt>
                <dd className="font-display text-3xl leading-none font-extrabold tracking-tight lg:text-4xl">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </header>

      {/* ---------- Who we are ---------- */}
      <section id="story" className="bg-surface-sunken px-5 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-[1240px]">
          <p className={EYEBROW}>Who we are</p>
          <h2 className={`${H2} max-w-3xl`}>
            Skills first. Certificates that mean something. <span className="text-action">Work at the end of it.</span>
          </h2>
          <div className="mt-12 grid gap-10 lg:mt-14 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
            <Reveal>
              <div className="space-y-5 text-base leading-relaxed text-content-muted lg:text-[17px]">
                <p>
                  {SITE.name} is a computer training institute on {SITE.address.street}, {SITE.address.locality}. It opened in {SITE.established} with one aim:
                  that a student should leave able to do the work, not just describe it.
                </p>
                <p>
                  Courses run from basic computer and typing to Tally, Advance Excel, graphic design, CAD/CAM, digital marketing and Python. Classes are
                  small, every student has their own computer, and every course ends with a practical test.
                </p>
              </div>
              <h3 className="mt-9 font-display text-sm font-bold tracking-tight">What we teach</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {courseGroups.map((group) => (
                  <li key={group.title} className="rounded-full border border-border-subtle bg-surface-raised px-3 py-1.5 text-xs font-medium">
                    {group.title}
                  </li>
                ))}
              </ul>
              <p className="mt-7 border-t border-border-subtle pt-5 text-sm text-content-muted">
                {SITE.address.street}, {SITE.address.locality}, {SITE.address.region} · {SITE.registration}
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative col-span-2 aspect-[2/1] overflow-hidden rounded-card bg-surface-raised">
                  <Image
                    src="/images/about/alpine-college-team-with-faculty.jpeg"
                    alt="GIT Education trainers with students at a college session"
                    fill
                    sizes="(min-width: 1024px) 520px, 92vw"
                    className="object-cover"
                  />
                </div>
                <div className="relative aspect-square overflow-hidden rounded-card bg-surface-raised">
                  <Image src="/images/about/alpine-college-full-hall.jpeg" alt="Students in a full GIT Education training hall" fill sizes="(min-width: 1024px) 250px, 45vw" className="object-cover" />
                </div>
                <div className="relative aspect-square overflow-hidden rounded-card bg-surface-raised">
                  <Image src="/images/about/team.jpg" alt="The GIT Education team" fill sizes="(min-width: 1024px) 250px, 45vw" className="object-cover" />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------- Mission & vision ---------- */}
      <section id="mission" className="on-inverse hero-surface relative isolate overflow-hidden px-5 py-16 text-white lg:px-8 lg:py-24">
        <div className="grid-overlay pointer-events-none absolute inset-0 -z-10 opacity-40" />
        <div className="mx-auto grid max-w-[1240px] gap-5 md:grid-cols-2">
          {([
            ["target", "Our mission", MISSION],
            ["sparkle", "Our vision", VISION],
          ] as const).map(([icon, title, text], i) => (
            <Reveal key={title} delay={i * 0.08} className="h-full">
              <div className="h-full rounded-panel border border-white/15 bg-white/[0.07] p-7 backdrop-blur-md lg:p-9">
                <span className="grid size-11 place-items-center rounded-xl bg-white/10 text-accent-yellow">
                  <Icon name={icon} className="size-5" />
                </span>
                <h2 className="mt-5 font-mono text-xs font-bold tracking-[0.22em] text-accent-yellow uppercase">{title}</h2>
                <p className="mt-3 font-display text-xl leading-snug font-bold tracking-tight lg:text-2xl">{text}</p>
              </div>
            </Reveal>
          ))}
          <Link
            href="/about/mission-vision"
            className="inline-flex items-center gap-2 text-sm font-semibold text-accent-yellow hover:underline md:col-span-2"
          >
            Read our full mission and vision <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      {/* ---------- Who we teach ---------- */}
      <section className="px-5 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-[1240px]">
          <div className="max-w-3xl">
            <p className={EYEBROW}>Who we teach</p>
            <h2 className={H2}>A course for every stage, from first click to first job</h2>
          </div>
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {AUDIENCES.map((audience, i) => (
              <li key={audience.title}>
                <Reveal className="h-full" delay={(i % 3) * 0.07}>
                  <div className="h-full rounded-card border border-border-subtle bg-surface-raised p-6 transition-shadow duration-300 hover:shadow-card lg:p-7">
                    <span className="font-mono text-[11px] font-bold tracking-[0.18em] text-action">{String(i + 1).padStart(2, "0")}</span>
                    <h3 className="mt-3 font-display text-base font-bold tracking-tight">{audience.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-content-muted">{audience.text}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- How a course runs ---------- */}
      <section id="approach" className="border-t border-border-subtle bg-surface-sunken px-5 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-[1240px]">
          <div className="mx-auto max-w-3xl text-center">
            <p className={EYEBROW}>How a course runs</p>
            <h2 className={H2}>Learn, practise, prove, progress</h2>
          </div>
          <ol className="relative mt-12 grid gap-8 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4 lg:gap-6">
            <span aria-hidden="true" className="pointer-events-none absolute inset-x-[12.5%] top-6 hidden border-t border-dashed border-border-strong lg:block" />
            {STEPS.map((step, i) => (
              <li key={step.title} className="relative lg:text-center">
                <Reveal delay={i * 0.08}>
                  <span className="relative mx-0 grid size-12 place-items-center rounded-full bg-action font-display text-base font-bold text-white lg:mx-auto">
                    0{i + 1}
                  </span>
                  <h3 className="mt-5 font-display text-lg font-bold tracking-tight">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-content-muted">{step.text}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- What makes us different ---------- */}
      <section className="px-5 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-[1240px]">
          <div className="max-w-3xl">
            <p className={EYEBROW}>The difference</p>
            <h2 className={H2}>What you get at {SITE.name}</h2>
          </div>
          <ul className="mt-12 grid gap-x-10 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
            {DIFFERENCES.map((item) => (
              <li key={item.title} className="flex gap-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-surface-accent text-action">
                  <Icon name={item.icon} className="size-5" />
                </span>
                <div>
                  <h3 className="font-display text-base font-bold tracking-tight">{item.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-content-muted">{item.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- What you can learn ---------- */}
      <section className="border-t border-border-subtle bg-surface-sunken px-5 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-[1240px]">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-3xl">
              <p className={EYEBROW}>What you can learn</p>
              <h2 className={H2}>Skills across {courseGroups.length} subject areas</h2>
            </div>
            <Link href="/courses" className="inline-flex items-center gap-2 text-sm font-semibold text-action hover:underline">
              See all courses <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {courseGroups.map((group, i) => (
              <Reveal key={group.title} className="h-full" delay={i * 0.06}>
                <div className="h-full rounded-card border border-border-subtle bg-surface-raised p-6">
                  <h3 className="font-display text-base font-bold tracking-tight">{group.title}</h3>
                  <p className="mt-1 text-xs text-content-muted">{group.blurb}</p>
                  <span aria-hidden="true" className="mt-4 block h-0.5 w-10 rounded-full bg-action" />
                  <ul className="mt-4 space-y-2">
                    {group.items.map((item) => (
                      <li key={item.label} className="flex items-start gap-2 text-sm">
                        <span aria-hidden="true" className="mt-[7px] size-1.5 shrink-0 rounded-full bg-action" />
                        {item.slug ? (
                          <Link href={courseHref(item)} className="transition-colors hover:text-action">
                            {item.label}
                          </Link>
                        ) : (
                          item.label
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Our approach ---------- */}
      <section className="on-inverse hero-surface relative isolate overflow-hidden px-5 py-16 text-white lg:px-8 lg:py-24">
        <div className="panel-glow pointer-events-none absolute inset-0 -z-10" />
        <div className="mx-auto max-w-[1240px]">
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-mono text-xs font-bold tracking-[0.22em] text-accent-yellow uppercase">Our approach</p>
            <h2 className="mt-4 font-display text-[clamp(1.8rem,4vw,2.8rem)] leading-[1.1] font-extrabold tracking-tight text-balance">
              Practical. Patient. <span className="text-accent-yellow">Job-focused.</span>
            </h2>
          </div>
          <ol className="mt-12 grid gap-10 lg:mt-14 lg:grid-cols-3 lg:gap-12">
            {PRINCIPLES.map((principle, i) => (
              <li key={principle.title} className="border-t-2 border-white/15 pt-6">
                <p className="font-mono text-xs tracking-[0.22em] text-accent-yellow">0{i + 1}</p>
                <h3 className="mt-3 font-display text-2xl font-bold tracking-tight">{principle.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/70 lg:text-base">{principle.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- Registration & certificates ---------- */}
      <section id="recognition" className="px-5 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-[1240px] gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-start lg:gap-16">
          <div>
            <p className={EYEBROW}>Registration & certificates</p>
            <h2 className={H2}>A registered institute, with certificates you can show</h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-content-muted">
              Every certificate is issued after a practical assessment and carries the course name and duration. Ask at the centre to see a sample before you
              enrol.
            </p>
            <div className="mt-7 flex gap-4 rounded-card border border-border-subtle bg-surface-sunken p-5">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-action text-white">
                <Icon name="shield" className="size-5" />
              </span>
              <div>
                <p className="font-display text-base font-bold tracking-tight">{SITE.legalName}</p>
                <p className="mt-1 text-sm text-content-muted">{SITE.registration}</p>
              </div>
            </div>
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
          <p className="text-xs font-bold tracking-[0.22em] text-action uppercase">Ready to get started?</p>
          <h2 className="mt-5 font-display text-[clamp(2rem,5vw,3.4rem)] leading-[1.05] font-extrabold tracking-[-0.03em] text-balance">Start building your career today.</h2>
          <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-content-muted lg:text-lg">
            Visit the centre, sit in on a free demo class and see the lab before you decide.
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
