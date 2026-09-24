import Link from "next/link";

import { Icon } from "@/components/icon";
import { MAIL_HREF, SITE, TEL_HREF, footerCols } from "@/lib/site";

const socials: [label: string, icon: React.ReactNode][] = [
  [
    "Instagram",
    <svg key="i" viewBox="0 0 24 24" aria-hidden="true" className="size-5 fill-none stroke-current" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" className="fill-current stroke-none" />
    </svg>,
  ],
  [
    "YouTube",
    <svg key="y" viewBox="0 0 24 24" aria-hidden="true" className="size-5 fill-current">
      <path d="M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2 31 31 0 0 0 .5 12 31 31 0 0 0 1 16.8a3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-4.8 31 31 0 0 0-.5-4.8zM9.7 15V9l5.8 3-5.8 3z" />
    </svg>,
  ],
  [
    "LinkedIn",
    <svg key="l" viewBox="0 0 24 24" aria-hidden="true" className="size-5 fill-current">
      <path d="M20.4 2H3.6C2.7 2 2 2.7 2 3.6v16.8c0 .9.7 1.6 1.6 1.6h16.8c.9 0 1.6-.7 1.6-1.6V3.6c0-.9-.7-1.6-1.6-1.6zM8 19H5V9.5h3V19zM6.5 8.2a1.7 1.7 0 1 1 0-3.5 1.7 1.7 0 0 1 0 3.5zM19 19h-3v-4.6c0-1.1 0-2.5-1.5-2.5S12.8 13 12.8 14.3V19h-3V9.5h2.8v1.3h.1c.4-.7 1.4-1.5 2.8-1.5 3 0 3.5 2 3.5 4.5V19z" />
    </svg>,
  ],
];

export function SiteFooter() {
  return (
    <footer id="contact" className="relative overflow-hidden border-t border-border-subtle bg-subtle">
      <div className="mx-auto max-w-6xl px-5">
        {/* Enquiry band */}
        <div className="on-inverse print-block reveal reveal-zoom relative isolate mt-12 flex flex-col items-start justify-between gap-6 overflow-hidden rounded-[2rem] bg-panel p-8 text-white shadow-2xl shadow-brand-900/20 lg:flex-row lg:items-center lg:p-10">
          <div className="panel-glow pointer-events-none absolute inset-0 -z-10" />
          <div className="grid-overlay pointer-events-none absolute inset-0 -z-10 opacity-60" />
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight lg:text-3xl">Ready to start learning?</h2>
            <p className="mt-1.5 text-sm text-white/65">Book a free demo class and see our computer lab before you decide.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href={`${MAIL_HREF}?subject=Free%20demo%20class`}
              data-enquiry
              className="inline-flex h-11 items-center gap-2 rounded-full bg-accent-yellow px-6 text-sm font-semibold text-ink shadow-lg shadow-accent-yellow/20 transition-all hover:-translate-y-0.5 hover:bg-white"
            >
              Book Free Demo →
            </a>
            <a href={TEL_HREF} className="inline-flex h-11 items-center gap-2 rounded-full border border-white/20 px-5 text-sm font-medium transition-colors hover:border-white/50 hover:bg-white/10">
              📞 {SITE.phone}
            </a>
          </div>
        </div>

        {/* Directory */}
        <div className="relative z-10 grid gap-12 pt-16 pb-14 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr_1fr] lg:gap-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="group flex items-center gap-2 font-display text-xl font-bold tracking-tight">
              <span className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-action to-accent-500 text-sm font-extrabold text-white transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110">
                GIT
              </span>
              GIT <span className="-ml-1 text-action">Education</span>
            </Link>
            <p className="mt-5 max-w-sm text-[0.95rem] leading-relaxed text-content-muted">Computer Training Institute</p>
            <ul className="mt-7 space-y-3.5 text-sm text-content-muted">
              <li className="flex gap-3">
                <Icon name="location" className="mt-0.5 size-[18px] shrink-0 text-action" />
                <span>Jalandhar, Punjab, India</span>
              </li>
              <li>
                <a href={TEL_HREF} className="flex gap-3 transition-colors hover:text-action">
                  <Icon name="phone" className="size-[18px] shrink-0 text-action" />
                  {SITE.phone}
                </a>
              </li>
              <li>
                <a href={MAIL_HREF} className="flex gap-3 transition-colors hover:text-action">
                  <Icon name="mail" className="size-[18px] shrink-0 text-action" />
                  {SITE.email}
                </a>
              </li>
              <li className="flex gap-3">
                <Icon name="clock" className="size-[18px] shrink-0 text-action" />
                Mon – Sat, 8 AM – 7 PM
              </li>
            </ul>
            <ul className="mt-8 flex gap-3">
              {socials.map(([label, icon]) => (
                <li key={label}>
                  <Link
                    href="/#contact"
                    aria-label={label}
                    className="grid size-12 place-items-center rounded-full bg-line/70 text-foreground transition-all duration-300 hover:-translate-y-1 hover:bg-action hover:text-white"
                  >
                    {icon}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {footerCols.map(([heading, links]) => (
            <nav key={heading} aria-labelledby={`footer-${heading.replace(/\s+/g, "-").toLowerCase()}`}>
              <h2 id={`footer-${heading.replace(/\s+/g, "-").toLowerCase()}`} className="sr-only">
                {heading}
              </h2>
              <ul className="space-y-4">
                {links.map(([label, href]) => (
                  <li key={label}>
                    <Link href={href} className="inline-block text-[1.05rem] text-content-muted transition-all duration-200 hover:translate-x-1 hover:text-action">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

      </div>

      {/* Giant background wordmark */}
      <svg aria-hidden="true" viewBox="0 0 1000 190" className="wordmark-rise pointer-events-none absolute inset-x-0 bottom-0 h-auto w-full select-none">
        <defs>
          <linearGradient id="footer-wordmark" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-ink)" stopOpacity="0.14" />
            <stop offset="100%" stopColor="var(--color-action)" stopOpacity="0.03" />
          </linearGradient>
        </defs>
        <text
          x="16"
          y="176"
          textLength="918"
          lengthAdjust="spacingAndGlyphs"
          fill="url(#footer-wordmark)"
          style={{ fontFamily: "var(--font-inter), ui-sans-serif, sans-serif", fontSize: 200, fontWeight: 700 }}
        >
          techcadd
        </text>
        <text x="926" y="176" fill="url(#footer-wordmark)" style={{ fontFamily: "var(--font-inter), ui-sans-serif, sans-serif", fontSize: 200, fontWeight: 700 }}>
          .
        </text>
      </svg>

      <div className="relative z-10 mx-auto max-w-6xl px-5">
        <nav aria-label="Legal" className="flex flex-wrap gap-x-9 gap-y-2 border-t border-foreground/10 py-6 text-sm text-content-muted">
          {["Privacy Policy", "Terms & Conditions", "Refund Policy"].map((label) => (
            <Link key={label} href="/#contact" className="transition-colors hover:text-action">
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-col gap-3 border-t border-foreground/10 py-7 text-sm text-content-muted lg:flex-row lg:items-center lg:justify-between">
          <p>
            © {new Date().getFullYear()} {SITE.name}. All rights reserved. Built in <span className="font-medium text-foreground">Jalandhar, Punjab</span>.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <span className="inline-flex items-center gap-2">
              <span aria-hidden="true" className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
              </span>
              Admissions Open
            </span>
            <span aria-hidden="true" className="h-4 w-px bg-foreground/15" />
            <span>4.9★ on Google (500+ reviews)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
