"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from "motion/react";

import { SITE, WHATSAPP_HREF } from "@/lib/site";

/**
 * Site-wide chrome that lives outside the page: reading-progress bar, eased
 * scrolling, back-to-top and the WhatsApp action.
 *
 * It also drives the CSS-class reveal system (`.reveal` / `.is-visible`) used by
 * the marketing home page. The observer is re-attached on every route change,
 * because elements from a newly navigated page are not in the DOM when this
 * component first mounts.
 */
export function SiteChrome() {
  const pathname = usePathname();
  const [showTop, setShowTop] = useState(false);
  const reduce = useReducedMotion();
  const lenisRef = useRef<Lenis | null>(null);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });

  // Eased scrolling and in-page anchor handling. Disabled when the user asks for
  // reduced motion, so the browser's own instant jump is used instead.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ autoRaf: true, lerp: 0.09, anchors: { offset: -110 } });
    lenisRef.current = lenis;
    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Every page opens at its hero — on first load, on refresh and after client-side
  // navigation. The browser's own scroll restoration is switched off (it would
  // reopen a refreshed page half-way down), and Lenis keeps its own scroll target,
  // so it is reset too or it would ease the new page back to the old position.
  // Links to an anchor (/#contact) keep their own target.
  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  }, []);

  useEffect(() => {
    if (window.location.hash) return;
    lenisRef.current?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    let ticking = false;
    const update = () => {
      ticking = false;
      setShowTop(window.scrollY > 900);
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Reveal-on-scroll for elements with the `.reveal` class.
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const root = document.documentElement;
    const show = (el: HTMLElement) => {
      el.classList.add("is-visible");
      el.addEventListener("transitionend", () => el.style.setProperty("--d", "0ms"), { once: true });
    };
    document.querySelectorAll<HTMLElement>(".reveal").forEach((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight) show(el);
    });
    root.classList.add("reveal-ready");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          show(entry.target as HTMLElement);
          observer.unobserve(entry.target);
        }
      },
      // Any sliver counts: a high threshold leaves tall blocks hidden for too long.
      { threshold: 0.01, rootMargin: "0px 0px -60px 0px" },
    );
    document.querySelectorAll(".reveal:not(.is-visible)").forEach((el) => observer.observe(el));

    // Safety net: whatever the observer misses, reveal anything that has reached the
    // viewport. Without this a single missed callback leaves a section blank for good.
    let ticking = false;
    const sweep = () => {
      ticking = false;
      const pending = document.querySelectorAll<HTMLElement>(".reveal:not(.is-visible)");
      for (const el of pending) {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) {
          show(el);
          observer.unobserve(el);
        }
      }
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(sweep);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      root.classList.remove("reveal-ready");
    };
  }, [pathname]);

  // Pointer position for [data-pointer] elements: spotlight glows, tilt cards and
  // the hero light. Pointer-driven only, so touch and keyboard users lose nothing.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let last: HTMLElement | null = null;
    const onMove = (event: PointerEvent) => {
      const el = event.target instanceof Element ? event.target.closest<HTMLElement>("[data-pointer]") : null;
      if (last && last !== el) {
        last.style.setProperty("--rx", "0deg");
        last.style.setProperty("--ry", "0deg");
      }
      last = el;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const target = el.querySelector<HTMLElement>(":scope > .hero-spot") ?? el;
      target.style.setProperty("--mx", `${x}px`);
      target.style.setProperty("--my", `${y}px`);
      if (el.classList.contains("tilt")) {
        el.style.setProperty("--ry", `${(x / rect.width - 0.5) * 12}deg`);
        el.style.setProperty("--rx", `${(0.5 - y / rect.height) * 12}deg`);
      }
    };
    document.addEventListener("pointermove", onMove, { passive: true });
    return () => document.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <>
      <motion.div
        aria-hidden="true"
        style={{ scaleX: reduce ? scrollYProgress : progress }}
        className="no-print fixed inset-x-0 top-0 z-[60] h-1 origin-left bg-gradient-to-r from-brand-500 via-violet-500 to-accent-yellow"
      />

      <div className="floating-actions no-print fixed right-4 bottom-4 z-40 flex flex-col items-end gap-3 sm:right-5 sm:bottom-5">
        <AnimatePresence>
          {showTop && (
            <motion.a
              href="#top"
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.85 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="grid size-11 place-items-center rounded-full border border-white/10 bg-panel text-white shadow-raised transition-colors hover:bg-action"
            >
              <span className="sr-only">Back to top</span>
              <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 19V5M6 11l6-6 6 6" />
              </svg>
            </motion.a>
          )}
        </AnimatePresence>

        <a
          href={WHATSAPP_HREF}
          target="_blank"
          rel="noopener noreferrer"
          className="animate-pulse-ring grid size-14 place-items-center rounded-full bg-[#1d8c46] text-white shadow-raised transition-transform hover:scale-105"
        >
          <span className="sr-only">Chat with {SITE.name} on WhatsApp (opens in a new tab)</span>
          <svg viewBox="0 0 24 24" aria-hidden="true" className="size-7 fill-current">
            <path d="M17.5 14.4c-.3-.1-1.8-.9-2-1s-.5-.1-.7.1-.8 1-.9 1.2-.3.2-.6.1a8 8 0 0 1-2.4-1.5 9 9 0 0 1-1.6-2c-.2-.3 0-.5.1-.6l.5-.5.3-.5v-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6a1.1 1.1 0 0 0-.8.4 3.4 3.4 0 0 0-1 2.5 5.9 5.9 0 0 0 1.2 3.1 13.4 13.4 0 0 0 5.2 4.6c1.9.8 2.7.9 3.6.7a3.1 3.1 0 0 0 2-1.4 2.5 2.5 0 0 0 .2-1.4c-.1-.2-.3-.2-.6-.4zM12 21.8a9.8 9.8 0 0 1-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4a9.8 9.8 0 1 1 8.3 4.6zm0-21.6A11.8 11.8 0 0 0 1.8 17.9L.1 24l6.3-1.6A11.8 11.8 0 1 0 12 .2z" />
          </svg>
        </a>
      </div>
    </>
  );
}
