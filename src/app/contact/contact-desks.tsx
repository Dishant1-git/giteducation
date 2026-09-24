"use client";

import { useId, useState } from "react";

import { Icon } from "@/components/icon";
import { MAIL_HREF, SITE, TEL_HREF, WHATSAPP_HREF } from "@/lib/site";

type Desk = { id: string; icon: string; label: string; initials: string; text: string; subject: string };

/** One institute, one phone line: each desk says what to ask for, not a different number. */
const DESKS: Desk[] = [
  {
    id: "students",
    icon: "users",
    label: "Student Support",
    initials: "SS",
    text: "Course choice, batch timings, fees and instalments, demo classes and certificates.",
    subject: "Student enquiry",
  },
  {
    id: "colleges",
    icon: "building",
    label: "College Partnerships",
    initials: "CP",
    text: "Campus workshops, industrial training and project support for your department.",
    subject: "College partnership enquiry",
  },
  {
    id: "placement",
    icon: "briefcase",
    label: "Placement Help",
    initials: "PH",
    text: "CV reviews, mock interviews and job leads for students who have completed a course.",
    subject: "Placement help",
  },
];

export function ContactDesks() {
  const id = useId();
  const [active, setActive] = useState(DESKS[0].id);
  const desk = DESKS.find((d) => d.id === active) ?? DESKS[0];

  const onKeyDown = (event: React.KeyboardEvent, index: number) => {
    const step = event.key === "ArrowDown" || event.key === "ArrowRight" ? 1 : event.key === "ArrowUp" || event.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    const next = DESKS[(index + step + DESKS.length) % DESKS.length];
    setActive(next.id);
    document.getElementById(`${id}-tab-${next.id}`)?.focus();
  };

  return (
    <div className="overflow-hidden rounded-panel border border-border-subtle bg-surface-raised shadow-card lg:grid lg:grid-cols-[minmax(0,19rem)_1fr]">
      <div role="tablist" aria-label="Support desks" aria-orientation="vertical" className="flex flex-col gap-3 bg-action p-4 sm:p-5">
        {DESKS.map((d, i) => {
          const selected = d.id === active;
          return (
            <button
              key={d.id}
              id={`${id}-tab-${d.id}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`${id}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(d.id)}
              onKeyDown={(event) => onKeyDown(event, i)}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 text-left text-white transition-colors sm:p-4 ${
                selected ? "border-white/70 bg-white/25" : "border-white/25 bg-white/10 hover:bg-white/20"
              }`}
            >
              <span aria-hidden="true" className="grid size-11 shrink-0 place-items-center rounded-xl bg-white/20">
                <Icon name={d.icon} className="size-5" />
              </span>
              <span className="font-display text-base font-bold tracking-tight">{d.label}</span>
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`${id}-panel`}
        aria-labelledby={`${id}-tab-${desk.id}`}
        className="flex flex-col items-center gap-5 p-6 text-center sm:p-8 md:flex-row md:gap-8 md:text-left"
      >
        <span aria-hidden="true" className="grid size-20 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-600 to-brand-400 font-display text-2xl font-bold text-white sm:size-24">
          {desk.initials}
        </span>
        <div className="min-w-0">
          <p className="font-display text-xl font-bold tracking-tight sm:text-2xl">{desk.label}</p>
          <p className="mt-1.5 max-w-md text-sm leading-relaxed text-content-muted">{desk.text}</p>
          <dl className="mt-4 space-y-2 text-sm sm:text-base">
            <div className="flex items-center justify-center gap-3 md:justify-start">
              <dt className="text-action">
                <span className="sr-only">Phone</span>
                <Icon name="phone" className="size-4" />
              </dt>
              <dd>
                <a href={TEL_HREF} className="transition-colors hover:text-action">
                  {SITE.phone}
                </a>
              </dd>
            </div>
            <div className="flex items-center justify-center gap-3 md:justify-start">
              <dt className="text-action">
                <span className="sr-only">Email</span>
                <Icon name="mail" className="size-4" />
              </dt>
              <dd className="min-w-0 break-all">
                <a href={MAIL_HREF} className="transition-colors hover:text-action">
                  {SITE.email}
                </a>
              </dd>
            </div>
            <div className="flex items-center justify-center gap-3 md:justify-start">
              <dt className="text-action">
                <span className="sr-only">Location</span>
                <Icon name="location" className="size-4" />
              </dt>
              <dd>
                {SITE.name}, {SITE.address.locality}
              </dd>
            </div>
          </dl>
          <div className="mt-5 flex flex-wrap justify-center gap-2.5 md:justify-start">
            <a href={TEL_HREF} className="inline-flex h-10 items-center gap-2 rounded-full bg-action px-4 text-xs font-semibold text-white transition-colors hover:bg-action-hover">
              <Icon name="phone" className="size-4" />
              Call now
            </a>
            <a
              href={WHATSAPP_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center gap-2 rounded-full bg-[#25D366] px-4 text-xs font-semibold text-white transition-colors hover:bg-[#1da851]"
            >
              WhatsApp
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            <a
              href={`${MAIL_HREF}?subject=${encodeURIComponent(`${desk.subject} – ${SITE.name}`)}`}
              className="inline-flex h-10 items-center gap-2 rounded-full border border-border-strong px-4 text-xs font-semibold transition-colors hover:border-action hover:text-action"
            >
              <Icon name="mail" className="size-4" />
              Email
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
