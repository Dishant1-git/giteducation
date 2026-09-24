import type { Metadata } from "next";
import Link from "next/link";

import { EnquiryForm } from "@/components/enquiry-form";
import { Icon } from "@/components/icon";
import { Reveal } from "@/components/motion";
import { MAIL_HREF, SITE, TEL_HREF, WHATSAPP_HREF } from "@/lib/site";

import { ContactDesks } from "./contact-desks";

export const metadata: Metadata = {
  title: "Contact Us | Batches, Fees & Free Demo Class",
  description: `Talk to a counsellor at ${SITE.name}, ${SITE.address.street}, ${SITE.address.locality}. Call, WhatsApp or send an enquiry for batches, fees and a free demo class.`,
  alternates: { canonical: "/contact" },
};

const FULL_ADDRESS = `${SITE.address.street}, ${SITE.address.locality}, ${SITE.address.region} ${SITE.address.postalCode}`;
const MAP_QUERY = encodeURIComponent(`${SITE.name}, ${FULL_ADDRESS}`);
const MAP_EMBED = `https://www.google.com/maps?q=${MAP_QUERY}&output=embed`;
const MAP_DIRECTIONS = `https://www.google.com/maps/search/?api=1&query=${MAP_QUERY}`;

const NEXT_STEPS = [
  "A counsellor calls you back during office hours.",
  "They go through your background, your schedule and the job you want, including whether a course is wrong for you.",
  "You get a course suggestion, a batch that fits your week and a free demo class, with no obligation to enrol.",
];

const DETAILS: { icon: string; label: string; value: string; href: string; action: string; external?: boolean }[] = [
  { icon: "location", label: "Address", value: FULL_ADDRESS, href: MAP_DIRECTIONS, action: "Get directions", external: true },
  { icon: "phone", label: "Phone", value: SITE.phone, href: TEL_HREF, action: "Call now" },
  { icon: "mail", label: "Email", value: SITE.email, href: MAIL_HREF, action: "Send email" },
  { icon: "clock", label: "Office hours", value: SITE.hours, href: "", action: "" },
];

export default function ContactPage() {
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
                <span aria-current="page" className="text-white">
                  Contact
                </span>
              </li>
            </ol>
          </nav>
          <Reveal>
            <p className="mt-8 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-wide">Contact</p>
            <h1 className="mt-6 max-w-3xl font-display text-[clamp(2.2rem,5vw,3.6rem)] leading-[1.06] font-extrabold tracking-[-0.03em] text-balance">
              Talk to a counsellor in <span className="text-accent-yellow">{SITE.address.locality}</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/75 lg:text-lg">
              Tell us where you are: still in school, in college, working or running a business. We will tell you honestly which course fits, and which does
              not.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <button
                type="button"
                data-enquiry
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-accent-yellow px-7 font-semibold text-ink transition-all duration-200 hover:-translate-y-0.5 hover:bg-white"
              >
                Book a free demo class <span aria-hidden="true">→</span>
              </button>
              <a
                href={TEL_HREF}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/25 bg-white/5 px-6 font-medium transition-colors hover:border-white/50 hover:bg-white/10"
              >
                <Icon name="phone" className="size-4" />
                Call {SITE.phone}
              </a>
            </div>
          </Reveal>
        </div>
      </header>

      {/* ---------- Support desks ---------- */}
      <section className="bg-surface-sunken px-5 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-[1240px]">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-[clamp(1.8rem,4vw,2.6rem)] leading-[1.1] font-extrabold tracking-tight text-action">Support &amp; assistance</h2>
            <p className="mt-4 text-base leading-relaxed text-content-muted">Choose what you need help with and reach the right person.</p>
          </div>
          <Reveal className="mt-12">
            <ContactDesks />
          </Reveal>
        </div>
      </section>

      {/* ---------- Enquiry form ---------- */}
      <section id="enquire" className="on-inverse hero-surface relative isolate overflow-hidden px-5 py-16 text-white lg:px-8 lg:py-24">
        <div className="panel-glow pointer-events-none absolute inset-0 -z-10" />
        <div className="mx-auto grid max-w-[1240px] items-start gap-12 lg:grid-cols-[1.05fr_minmax(0,0.95fr)] lg:gap-20">
          <div>
            <h2 className="max-w-xl font-display text-[clamp(2rem,4.5vw,3rem)] leading-[1.06] font-extrabold tracking-tight text-balance">
              Take the first step towards <span className="text-accent-yellow">a job-ready skill</span> with {SITE.name}
            </h2>
            <p className="mt-8 font-display text-base font-bold tracking-tight">What happens next?</p>
            <ol className="mt-4 space-y-3.5">
              {NEXT_STEPS.map((step, i) => (
                <li key={step} className="flex gap-3.5">
                  <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-md bg-accent-yellow font-mono text-[11px] font-bold text-ink">{i + 1}</span>
                  <span className="text-sm leading-relaxed text-white/75">{step}</span>
                </li>
              ))}
            </ol>
            <p className="mt-7 max-w-lg text-sm leading-relaxed text-white/60">
              You can also call{" "}
              <a href={TEL_HREF} className="font-medium text-white underline underline-offset-2 hover:text-accent-yellow">
                {SITE.phone}
              </a>{" "}
              or write to{" "}
              <a href={MAIL_HREF} className="font-medium text-white underline underline-offset-2 hover:text-accent-yellow">
                {SITE.email}
              </a>
              .
            </p>
          </div>

          <div className="rounded-panel border border-white/15 bg-white/[0.07] p-6 backdrop-blur-md sm:p-8">
            <EnquiryForm formType="contact" heading="Tell us your goal. We'll suggest the right course." headingLevel="h3" />
          </div>
        </div>
      </section>

      {/* ---------- Map & details ---------- */}
      <section className="px-5 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-[1240px] items-start gap-10 lg:grid-cols-[1.05fr_minmax(0,1fr)] lg:gap-14">
          <div className="overflow-hidden rounded-panel border border-border-subtle shadow-card">
            <iframe
              src={MAP_EMBED}
              title={`${SITE.name} location on Google Maps`}
              width="100%"
              height="360"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block w-full border-0"
            />
          </div>

          <div className="space-y-5">
            <ul className="grid gap-4 sm:grid-cols-2">
              {DETAILS.map((item) => (
                <li key={item.label} className="flex gap-3 rounded-card border border-border-subtle bg-surface-sunken p-4">
                  <span className="mt-0.5 shrink-0 text-action">
                    <Icon name={item.icon} className="size-5" />
                  </span>
                  <div className="min-w-0">
                    <span className="block text-xs font-semibold tracking-wide text-content-muted uppercase">{item.label}</span>
                    <span className="mt-1 block text-sm break-words">{item.value}</span>
                    {item.href && (
                      <a
                        href={item.href}
                        {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-action hover:text-action-hover"
                      >
                        {item.action} <span aria-hidden="true">→</span>
                        {item.external && <span className="sr-only"> (opens in a new tab)</span>}
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            <a
              href={WHATSAPP_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-card border border-[#25D366]/25 bg-[#25D366]/5 p-5 transition-colors hover:bg-[#25D366]/10"
            >
              <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-[#25D366] text-white">
                <Icon name="phone" className="size-5" />
              </span>
              <span>
                <span className="block text-sm font-bold text-[#128c3e]">Chat on WhatsApp</span>
                <span className="mt-0.5 block text-xs text-content-muted">Replies during office hours · {SITE.hours}</span>
              </span>
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
