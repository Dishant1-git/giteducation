import type { Metadata } from "next";
import Link from "next/link";

import { Icon } from "@/components/icon";
import { Reveal } from "@/components/motion";
import { PHOTOS } from "@/lib/gallery";
import { SITE, TEL_HREF } from "@/lib/site";

import { GalleryWall } from "./gallery-wall";

export const metadata: Metadata = {
  title: "Gallery | Inside the Centre",
  description: `Photos from the classrooms, computer lab and sessions at ${SITE.name}, ${SITE.address.locality}.`,
  alternates: { canonical: "/gallery" },
};

export default function GalleryPage() {
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
                  Gallery
                </span>
              </li>
            </ol>
          </nav>
          <Reveal>
            <p className="mt-8 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-wide">Gallery</p>
            <h1 className="mt-6 max-w-3xl font-display text-[clamp(2.2rem,5vw,3.6rem)] leading-[1.06] font-extrabold tracking-[-0.03em] text-balance text-white/45">
              Inside the <span className="text-white">classrooms, the lab</span> and <span className="text-accent-yellow">our sessions.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/75 lg:text-lg">
              Hover over a row to pause it, and click any photo to see it full size.
            </p>
          </Reveal>
        </div>
      </header>

      <section className="py-14 lg:py-20">
        <div className="mx-auto max-w-[1240px] px-5 lg:px-8">
          <p className="font-mono text-xs font-bold tracking-[0.22em] text-action uppercase">Life at {SITE.name}</p>
          <h2 className="mt-4 font-display text-[clamp(1.8rem,4vw,2.8rem)] leading-[1.1] font-extrabold tracking-tight">Our gallery</h2>
        </div>
        <div className="mt-10 lg:mt-14">
          <GalleryWall photos={PHOTOS} />
        </div>
      </section>

      <section className="border-t border-border-subtle bg-surface-sunken px-5 py-16 text-center lg:px-8 lg:py-24">
        <Reveal className="mx-auto max-w-2xl">
          <p className="text-xs font-bold tracking-[0.22em] text-action uppercase">Ready to get started?</p>
          <h2 className="mt-5 font-display text-[clamp(2rem,5vw,3.4rem)] leading-[1.05] font-extrabold tracking-[-0.03em] text-balance">Start building your career today.</h2>
          <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-content-muted lg:text-lg">
            Photos only show so much. Book a free demo class and see the lab for yourself.
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
