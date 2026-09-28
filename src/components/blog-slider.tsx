"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { formatPostDate, type BlogPost } from "@/lib/blog";

/**
 * Blog carousel: three cards at a time (two on tablets, one on phones). Each step
 * slides the row one card to the left and brings the next post in on the right.
 *
 * The loop is seamless because the list is rendered twice: once the index passes
 * the end of the real posts it jumps back by one list length with the transition
 * switched off, which is invisible since the duplicated card is identical.
 *
 * The step distance is measured from the rendered cards, so it stays correct
 * across breakpoints and gap changes without duplicating those numbers here.
 */

const AUTOPLAY_MS = 4500;

export function BlogSlider({ posts }: { posts: BlogPost[] }) {
  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(true);
  const [step, setStep] = useState(0);
  const [paused, setPaused] = useState(false);
  const trackRef = useRef<HTMLUListElement>(null);

  // One card plus the gap, measured from the DOM.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () => {
      const [first, second] = track.children as unknown as HTMLElement[];
      if (first && second) setStep(second.offsetLeft - first.offsetLeft);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  const next = useCallback(() => setIndex((i) => i + 1), []);

  const previous = useCallback(() => {
    setIndex((i) => {
      if (i > 0) return i - 1;
      // At the start: hop forward one list length without animating, then step back.
      setAnimate(false);
      requestAnimationFrame(() => {
        setAnimate(true);
        setIndex(posts.length - 1);
      });
      return posts.length;
    });
  }, [posts.length]);

  // Advance on its own, unless the visitor is interacting or asked for less motion.
  useEffect(() => {
    if (paused || posts.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(next, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [paused, next, posts.length]);

  // Once a full list has scrolled past, rewind silently.
  const onTransitionEnd = () => {
    if (index < posts.length) return;
    setAnimate(false);
    setIndex((i) => i - posts.length);
    requestAnimationFrame(() => setAnimate(true));
  };

  return (
    <div
      role="group"
      aria-roledescription="carousel"
      aria-label="Latest from the blog"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="overflow-hidden">
        <ul
          ref={trackRef}
          onTransitionEnd={onTransitionEnd}
          style={{ transform: `translate3d(-${index * step}px, 0, 0)` }}
          className={`flex gap-5 ${animate ? "transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" : ""}`}
        >
          {[...posts, ...posts].map((post, i) => (
            <li
              key={`${post.slug}-${i}`}
              aria-hidden={i < index || i >= index + 3}
              className="w-[calc(100%-1rem)] shrink-0 sm:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-2.5rem)/3)]"
            >
              <Link
                href={`/blogs/${post.slug}`}
                tabIndex={i < index || i >= index + 3 ? -1 : undefined}
                className="group flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-border-subtle bg-surface-raised shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-action/30 hover:shadow-raised"
              >
                <span className="relative block aspect-[16/10] overflow-hidden bg-subtle">
                  <Image
                    src={post.image}
                    alt=""
                    width={1200}
                    height={750}
                    sizes="(min-width: 1024px) 380px, (min-width: 640px) 45vw, 90vw"
                    className="size-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 rounded-full bg-surface-raised/90 px-3 py-1 text-[11px] font-semibold text-action backdrop-blur">{post.category}</span>
                </span>
                <span className="flex flex-1 flex-col p-5">
                  <span className="font-mono text-[11px] tracking-[0.12em] text-content-muted uppercase">
                    {formatPostDate(post.date)} · {post.readMinutes} min read
                  </span>
                  <h3 className="mt-2 font-display text-lg leading-snug font-bold tracking-tight text-balance transition-colors group-hover:text-action">{post.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-content-muted">{post.excerpt}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-action">
                    Read more
                    <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 flex items-center justify-center gap-3">
        {[
          ["Previous posts", previous, "M15 19l-7-7 7-7"],
          ["Next posts", next, "M9 5l7 7-7 7"],
        ].map(([label, action, path]) => (
          <button
            key={label as string}
            type="button"
            onClick={action as () => void}
            aria-label={label as string}
            className="grid size-11 cursor-pointer place-items-center rounded-full border border-border-subtle bg-surface-raised text-foreground transition-all hover:-translate-y-0.5 hover:border-action hover:bg-action hover:text-white"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d={path as string} />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}
