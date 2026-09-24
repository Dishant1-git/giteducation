import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Icon } from "@/components/icon";
import { Reveal } from "@/components/motion";
import { EVENTS, formatEventDate } from "@/lib/events";
import { SITE, TEL_HREF } from "@/lib/site";

export const metadata: Metadata = {
  title: "Events | Workshops, Demo Classes & Seminars",
  description: `Free workshops, demo classes and career counselling sessions at ${SITE.name}, ${SITE.address.locality}. Reserve a seat for the next event.`,
  alternates: { canonical: "/events" },
};

export default function EventsPage() {
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
                  Events
                </span>
              </li>
            </ol>
          </nav>
          <Reveal>
            <p className="mt-8 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-wide">Events</p>
            <h1 className="mt-6 max-w-3xl font-display text-[clamp(2.2rem,5vw,3.6rem)] leading-[1.06] font-extrabold tracking-[-0.03em] text-balance text-white/45">
              Workshops, demo classes and <span className="text-white">the days we teach</span> <span className="text-accent-yellow">in public.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/75 lg:text-lg">
              Short, hands-on sessions at our {SITE.address.locality} centre. Come and try a class, meet the trainers and see the lab before you join.
            </p>
          </Reveal>
        </div>
      </header>

      <section className="px-5 py-14 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-[1240px]">
          <div className="flex items-baseline justify-between gap-4 border-b border-border-subtle pb-4">
            <p className="font-mono text-xs font-bold tracking-[0.22em] text-action uppercase">Upcoming events</p>
            <p className="font-mono text-xs text-content-muted">{EVENTS.length} events</p>
          </div>

          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:mt-10 lg:grid-cols-3">
            {EVENTS.map((event, i) => (
              <Reveal as="li" key={event.id} delay={i * 0.08} className="flex">
                <article className="group flex flex-1 flex-col overflow-hidden rounded-card border border-border-subtle bg-surface-raised shadow-card transition-colors hover:border-action/40">
                  <div className="relative aspect-[16/10] overflow-hidden bg-surface-sunken">
                    <Image
                      src={event.image}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                    <span className="absolute bottom-3 left-3 rounded-full border border-white/25 bg-black/40 px-3 py-1 font-mono text-[10px] tracking-[0.14em] text-white uppercase backdrop-blur-md">
                      {event.kind}
                    </span>
                    <span className="absolute top-3 right-3 rounded-full bg-action px-3 py-1 text-[11px] font-semibold text-white">Upcoming</span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <p className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs text-content-muted">
                      <span className="inline-flex items-center gap-1.5">
                        <Icon name="calendar" className="size-3.5" />
                        <time dateTime={event.date}>{formatEventDate(event.date)}</time>
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Icon name="clock" className="size-3.5" />
                        {event.time}
                      </span>
                    </p>
                    <h2 className="mt-3 font-display text-lg leading-snug font-bold tracking-tight text-balance">{event.title}</h2>
                    <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-content-muted">{event.summary}</p>
                    <p className="mt-5 flex items-center gap-1.5 border-t border-border-subtle pt-4 text-xs text-content-muted">
                      <Icon name="location" className="size-3.5 shrink-0 text-action" />
                      {SITE.name}, {SITE.address.street}, {SITE.address.locality}
                    </p>
                    <button
                      type="button"
                      data-enquiry={event.enquiry}
                      className="mt-4 inline-flex h-11 items-center justify-center rounded-full bg-action px-5 text-sm font-semibold text-white transition-colors hover:bg-action-hover"
                    >
                      Reserve a free seat
                    </button>
                  </div>
                </article>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-border-subtle bg-surface-sunken px-5 py-16 text-center lg:px-8 lg:py-24">
        <Reveal className="mx-auto max-w-2xl">
          <p className="text-xs font-bold tracking-[0.22em] text-action uppercase">Ready to get started?</p>
          <h2 className="mt-5 font-display text-[clamp(2rem,5vw,3.4rem)] leading-[1.05] font-extrabold tracking-[-0.03em] text-balance">Start building your career today.</h2>
          <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-content-muted lg:text-lg">
            Can&apos;t make these dates? Talk to a counsellor and we will fit a free demo class around your schedule.
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
