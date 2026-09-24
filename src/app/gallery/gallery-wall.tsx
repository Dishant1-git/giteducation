"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import type { GalleryPhoto } from "@/lib/gallery";

/** Each row shows every photo, starting at a different point so the rows don't line up. */
const ROWS = [
  { offset: 0, reverse: false, duration: "56s" },
  { offset: 3, reverse: true, duration: "72s" },
  { offset: 6, reverse: false, duration: "64s" },
];

export function GalleryWall({ photos }: { photos: GalleryPhoto[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastTrigger = useRef<HTMLElement | null>(null);

  const show = (index: number, trigger: HTMLElement) => {
    lastTrigger.current = trigger;
    setOpen(index);
  };

  const close = useCallback(() => {
    setOpen(null);
    lastTrigger.current?.focus();
  }, []);

  const step = useCallback(
    (by: number) => setOpen((i) => (i === null ? i : (i + by + photos.length) % photos.length)),
    [photos.length],
  );

  useEffect(() => {
    if (open === null) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close, step]);

  const current = open === null ? null : photos[open];

  return (
    <>
      <div className="space-y-4 lg:space-y-5">
        {ROWS.map((row, r) => {
          const ordered = photos.map((_, i) => (i + row.offset) % photos.length);
          return (
            <div key={r} className="marquee overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
              <ul
                className={`flex w-max ${row.reverse ? "animate-marquee-reverse" : "animate-marquee"}`}
                style={{ animationDuration: row.duration }}
              >
                {/* Two copies: the animation shifts by half, so the loop is seamless */}
                {[0, 1].map((copy) => (
                  <li key={copy} className="flex" aria-hidden={copy === 1 || undefined}>
                    {ordered.map((index) => (
                      <button
                        key={index}
                        type="button"
                        tabIndex={copy === 1 ? -1 : 0}
                        onClick={(e) => show(index, e.currentTarget)}
                        aria-label={`Open photo: ${photos[index].caption}`}
                        className="group relative mr-4 h-[130px] w-[200px] shrink-0 overflow-hidden rounded-card border border-border-subtle bg-surface-sunken transition-shadow duration-500 hover:shadow-card sm:h-[160px] sm:w-[250px] lg:mr-5 lg:h-[190px] lg:w-[300px]"
                      >
                        <Image
                          src={photos[index].src}
                          alt={photos[index].caption}
                          fill
                          sizes="(min-width: 1024px) 300px, (min-width: 640px) 250px, 200px"
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </button>
                    ))}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {current && open !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={current.caption}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm sm:p-8"
          onClick={close}
        >
          <figure className="relative w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-panel bg-black sm:aspect-video">
              <Image src={current.src} alt={current.caption} fill sizes="(min-width: 1024px) 1024px, 100vw" className="object-contain" />
            </div>
            <figcaption className="mt-4 flex items-center justify-between gap-4 text-sm text-white/80">
              <span>{current.caption}</span>
              <span className="shrink-0 font-mono text-xs text-white/50">
                {open + 1} / {photos.length}
              </span>
            </figcaption>
            <div className="mt-4 flex justify-center gap-3">
              <button type="button" onClick={() => step(-1)} className="inline-flex h-11 items-center rounded-full border border-white/25 px-5 text-sm font-semibold text-white transition-colors hover:bg-white/10">
                <span aria-hidden="true">←</span>&nbsp;Previous
              </button>
              <button type="button" onClick={() => step(1)} className="inline-flex h-11 items-center rounded-full border border-white/25 px-5 text-sm font-semibold text-white transition-colors hover:bg-white/10">
                Next&nbsp;<span aria-hidden="true">→</span>
              </button>
            </div>
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              aria-label="Close photo"
              className="absolute -top-3 -right-3 grid size-10 place-items-center rounded-full bg-white text-ink shadow-card transition-transform hover:scale-105 sm:-top-4 sm:-right-4"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className="size-4" aria-hidden="true">
                <path d="m6 6 12 12M18 6 6 18" />
              </svg>
            </button>
          </figure>
        </div>
      )}
    </>
  );
}
