import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Icon } from "@/components/icon";
import { Reveal, WordReveal } from "@/components/motion";
import { TEAM, TEAM_ROLES } from "@/lib/about";
import { courseGroups, SITE, TEL_HREF } from "@/lib/site";

export const metadata: Metadata = {
  title: "Our Team",
  description: `The trainers, counsellors and staff at ${SITE.name}, ${SITE.address.locality}: the people behind every batch, practical test and placement.`,
  alternates: { canonical: "/about/team" },
};

type Card = { title: string; subtitle: string; photo?: string; icon?: string };

const GRADIENTS = [
  "from-brand-700 to-brand-500",
  "from-ink to-brand-600",
  "from-brand-600 to-accent-500",
  "from-brand-900 to-brand-400",
];

/**
 * Real people once TEAM is filled in; until then, the roles the institute
 * actually staffs (one trainer card per subject area, plus the support desks).
 * Role cards carry an icon, never a face, so nobody is misrepresented.
 */
const CARDS: Card[] =
  TEAM.length > 0
    ? TEAM.map((m) => ({ title: m.name, subtitle: m.role, photo: m.photo }))
    : [
        ...courseGroups.map((g) => ({ title: `${g.title} Trainers`, subtitle: g.blurb, icon: "monitor" })),
        ...TEAM_ROLES.filter((r) => r.title !== "Trainers").map((r) => ({ title: r.title, subtitle: SITE.name, icon: r.icon })),
      ];

const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

const TEAM_ICON = (
  <svg viewBox="0 0 24 24" fill="none" className="size-3.5" aria-hidden="true">
    <circle cx="12" cy="8" r="3.1" stroke="currentColor" strokeWidth="1.7" />
    <path d="M7.2 18.2a4.8 4.8 0 0 1 9.6 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    <path
      d="M18.4 9.6a2.3 2.3 0 1 0-1.6-4M21 16.8a3.6 3.6 0 0 0-2.8-3.5M5.6 9.6a2.3 2.3 0 1 1 1.6-4M3 16.8a3.6 3.6 0 0 1 2.8-3.5"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
    />
  </svg>
);

/** Tall pill that widens and squares off on hover or keyboard focus. */
function TeamCard({ card, index, hidden }: { card: Card; index: number; hidden: boolean }) {
  return (
    <article
      tabIndex={hidden ? -1 : 0}
      className="group relative h-[300px] w-[168px] shrink-0 overflow-hidden rounded-[84px] border border-white/15 bg-white/5 outline-none transition-[width,border-radius,border-color] duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:w-[228px] hover:rounded-[32px] hover:border-white/35 focus:w-[228px] focus:rounded-[32px] focus:border-white/35 focus-visible:ring-2 focus-visible:ring-action motion-reduce:transition-none sm:h-[350px] sm:w-[196px] sm:rounded-[98px] sm:hover:w-[268px] sm:hover:rounded-[36px] sm:focus:w-[268px] sm:focus:rounded-[36px] lg:h-[400px] lg:w-[220px] lg:rounded-[110px] lg:hover:w-[310px] lg:hover:rounded-[40px] lg:focus:w-[310px] lg:focus:rounded-[40px]"
    >
      {card.photo ? (
        <Image
          src={card.photo}
          alt={hidden ? "" : card.title}
          fill
          sizes="(min-width: 1024px) 310px, (min-width: 640px) 268px, 228px"
          className="object-cover object-top"
        />
      ) : (
        <span aria-hidden="true" className={`absolute inset-0 grid place-items-center bg-gradient-to-br ${GRADIENTS[index % GRADIENTS.length]}`}>
          <span className="-mt-16 grid size-20 place-items-center rounded-full bg-white/15 text-white ring-8 ring-white/5 transition-transform duration-700 group-hover:scale-110">
            {card.icon ? <Icon name={card.icon} className="size-9" /> : <span className="font-display text-2xl font-bold">{initials(card.title)}</span>}
          </span>
        </span>
      )}
      <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/40" />
      <div className="absolute inset-x-0 bottom-0 px-6 pb-10 text-center">
        <h3 className="truncate font-display text-sm font-bold tracking-tight text-white">{card.title}</h3>
        <span aria-hidden="true" className="mx-auto mt-2 block h-px w-8 bg-accent-yellow transition-all duration-500 group-hover:w-14" />
        <p className="mt-2 truncate text-[11px] text-white/75">{card.subtitle}</p>
      </div>
    </article>
  );
}

const PROMISES = ["Free demo class", "Morning, evening & weekend batches", "Certificate on completion"];

export default function TeamPage() {
  return (
    <div>
      {/* ---------- Hero ---------- */}
      <section className="on-inverse relative isolate flex min-h-[88svh] items-center overflow-hidden bg-ink px-5 pt-32 pb-16 text-white lg:px-8 lg:pt-40 lg:pb-20">
        <Image src="/images/about/team.jpg" alt="" fill priority sizes="100vw" className="-z-30 scale-105 object-cover blur-[1px]" />
        <div aria-hidden="true" className="absolute inset-0 -z-20 bg-gradient-to-br from-ink/95 via-ink/80 to-brand-700/60" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-b from-ink/60 via-transparent to-ink/95" />
        <div className="mx-auto w-full max-w-[1240px]">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-medium tracking-wide backdrop-blur-md">
              {TEAM_ICON}
              Our Team
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="mt-7 max-w-4xl font-display text-4xl leading-[1.08] font-bold tracking-tight text-balance text-white/40 sm:text-5xl lg:text-6xl">
              The <span className="text-white">people who teach here,</span> and <span className="text-white">keep the students moving.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/70 lg:text-lg">
              Trainers, counsellors and staff at {SITE.name}, {SITE.address.locality}: the team behind every batch, every practical test and every job
              search.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---------- Meet the team ---------- */}
      <section className="relative isolate overflow-hidden bg-surface-sunken py-20 lg:py-28">
        <div className="mx-auto max-w-[1240px] px-5 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <Reveal>
                <span className="inline-flex items-center gap-2 rounded-full border border-action/20 bg-action/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-action">
                  {TEAM_ICON}
                  Meet the team
                </span>
              </Reveal>
              <WordReveal
                lines={["Meet the people who", "teach here"]}
                className="mt-6 font-display text-3xl leading-[1.1] font-bold tracking-tight sm:text-4xl lg:text-5xl"
              />
              <Reveal delay={0.2}>
                <p className="mt-5 text-base leading-relaxed text-content-muted lg:text-lg">
                  Trainers, counsellors and staff who keep the classrooms running and the students moving.
                </p>
              </Reveal>
            </div>
            <Link
              href="/contact"
              className="group inline-flex shrink-0 items-center gap-3 self-start rounded-full bg-action py-2 pr-2 pl-7 text-sm font-semibold text-white transition-colors duration-300 hover:bg-action-hover lg:self-auto"
            >
              Talk to a counsellor
              <span className="grid size-8 place-items-center rounded-full bg-white text-action transition-transform duration-300 group-hover:translate-x-0.5">
                <span aria-hidden="true">→</span>
              </span>
            </Link>
          </div>
        </div>

        <Reveal className="mt-10 lg:mt-14">
          <div className="marquee [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
            <div className="animate-marquee flex w-max">
              {[false, true].map((hidden) => (
                <div key={String(hidden)} aria-hidden={hidden || undefined} className="flex items-center gap-3 pr-3 sm:gap-4 sm:pr-4 lg:gap-5 lg:pr-5">
                  {CARDS.map((card, i) => (
                    <TeamCard key={`${card.title}-${i}`} card={card} index={i} hidden={hidden} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="relative isolate overflow-hidden border-t border-border-subtle bg-surface-sunken px-5 py-20 text-center lg:px-8 lg:py-28">
        <div className="mx-auto max-w-2xl">
          <p className="text-xs font-bold tracking-[0.22em] text-action uppercase">Ready to get started?</p>
          <WordReveal
            lines={["Start building your", "career today."]}
            className="mt-5 font-display text-4xl leading-[1.05] font-bold tracking-tight sm:text-5xl lg:text-6xl"
          />
          <Reveal delay={0.15}>
            <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-content-muted lg:text-lg">
              Talk to a counsellor today. One call is usually enough to know which course fits your background, your schedule and the job you want.
            </p>
          </Reveal>
          <Reveal delay={0.25} className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button
              type="button"
              data-enquiry
              className="inline-flex h-14 items-center justify-center rounded-full bg-ink px-8 text-sm font-semibold text-white transition-colors duration-300 hover:bg-action"
            >
              Book a free demo
            </button>
            <a
              href={TEL_HREF}
              className="group inline-flex items-center gap-3 rounded-full bg-action py-3 pr-8 pl-3 text-white shadow-[0_20px_45px_-18px_rgba(37,99,235,0.9)] transition-colors duration-300 hover:bg-action-hover"
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-white/20">
                <Icon name="phone" className="size-5" />
              </span>
              <span className="text-left">
                <span className="block text-[11px] font-medium tracking-[0.14em] text-white/70 uppercase">Call now</span>
                <span className="block font-display text-lg font-bold tracking-tight">{SITE.phone}</span>
              </span>
            </a>
          </Reveal>
          <ul className="mt-10 flex flex-col items-center justify-center gap-3 text-sm text-content-muted sm:flex-row sm:gap-5">
            {PROMISES.map((item, i) => (
              <li key={item} className="inline-flex items-center gap-2">
                {i > 0 && <span aria-hidden="true" className="mr-3 hidden h-4 w-px bg-border-strong sm:block" />}
                <Icon name="check" className="size-4 shrink-0 text-action" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
