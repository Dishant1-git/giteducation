"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { EnquiryForm } from "@/components/enquiry-form";
import { Icon } from "@/components/icon";
import { SITE } from "@/lib/site";

/**
 * "Still exploring?" enquiry popup.
 *
 * - Opens by itself once per browser session, 10 seconds after the site loads.
 * - Anything can open it with `openEnquiry()` (the header's Book Free Demo buttons do),
 *   or by carrying a `data-enquiry` attribute (works from server components too).
 * - Escape, the close button or a click on the backdrop closes it.
 *
 * - The course dropdown is pre-filled: from `openEnquiry("Course")` or a
 *   `data-enquiry="Course"` value if given, otherwise from the page's
 *   `data-enquiry-course` attribute (set by course and certificate pages).
 *
 * The form itself lives in enquiry-form.tsx.
 */

const OPEN_EVENT = "enquiry:open";
const AUTO_OPEN_KEY = "enquiry-auto-shown";
const AUTO_OPEN_DELAY = 10_000;

/** Open the enquiry popup from anywhere, optionally with a course pre-selected. */
export function openEnquiry(course?: unknown) {
  // Accepts being used directly as an onClick handler: a click event is not a course.
  window.dispatchEvent(new CustomEvent<string | undefined>(OPEN_EVENT, { detail: typeof course === "string" ? course : undefined }));
}

/** The course of the page being viewed, if it declares one. */
const pageCourse = () => document.querySelector("[data-enquiry-course]")?.getAttribute("data-enquiry-course") ?? "";

function GoogleG() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className="size-7 shrink-0">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}

export function EnquiryModal() {
  const [open, setOpen] = useState(false);
  const [course, setCourse] = useState("");
  const [formKey, setFormKey] = useState(0);
  const dialogRef = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const reduce = useReducedMotion();
  const titleId = useId();

  const show = useCallback((event?: Event) => {
    lastFocus.current = document.activeElement as HTMLElement | null;
    const requested = event instanceof CustomEvent && typeof event.detail === "string" ? event.detail : "";
    setCourse(requested || pageCourse());
    // Fresh form (and fresh pre-selection) every time the popup opens.
    setFormKey((key) => key + 1);
    setOpen(true);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    lastFocus.current?.focus?.();
  }, []);

  // Open on request from anywhere (header buttons etc.)
  useEffect(() => {
    window.addEventListener(OPEN_EVENT, show);
    return () => window.removeEventListener(OPEN_EVENT, show);
  }, [show]);

  // Any link or button marked `data-enquiry` (every "Book demo" CTA, on every
  // page) opens this popup instead of following its href. Server components
  // only need the attribute; the href remains the no-JavaScript fallback.
  // Capture phase runs before Next's <Link> handler, which skips navigation
  // once the default is prevented. Modified clicks (new tab etc.) are left alone.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const trigger = event.target instanceof Element ? event.target.closest("[data-enquiry]") : null;
      if (!trigger) return;
      event.preventDefault();
      openEnquiry(trigger.getAttribute("data-enquiry") || undefined);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  // Auto-open once per session, 10s after load
  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(AUTO_OPEN_KEY) === "1";
    } catch {}
    if (seen) return;
    const timer = setTimeout(() => {
      try {
        sessionStorage.setItem(AUTO_OPEN_KEY, "1");
      } catch {}
      show();
    }, AUTO_OPEN_DELAY);
    // If the visitor opens it themselves first, don't pop it up again later
    const cancel = () => {
      clearTimeout(timer);
      try {
        sessionStorage.setItem(AUTO_OPEN_KEY, "1");
      } catch {}
    };
    window.addEventListener(OPEN_EVENT, cancel);
    return () => {
      clearTimeout(timer);
      window.removeEventListener(OPEN_EVENT, cancel);
    };
  }, [show]);

  // While open: lock page scroll, focus the dialog, Escape closes, Tab stays inside
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.querySelector<HTMLElement>("select, input, button")?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = [...dialogRef.current.querySelectorAll<HTMLElement>("a[href], button, input, select")].filter((el) => !el.hasAttribute("disabled"));
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, close]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="enquiry"
          data-lenis-prevent
          className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <button type="button" aria-label="Close enquiry form" tabIndex={-1} onClick={close} className="absolute inset-0 cursor-default bg-panel/70 backdrop-blur-sm" />

          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="no-scrollbar relative grid max-h-[calc(100dvh-1.5rem)] w-full max-w-3xl overflow-y-auto overscroll-contain rounded-3xl shadow-2xl shadow-black/40 md:grid-cols-2"
          >
            {/* Top-right of the whole popup: over the form on desktop, over the heading on phones */}
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute top-4 right-4 z-10 grid size-9 cursor-pointer place-items-center rounded-full border border-white/40 text-white transition-colors hover:bg-white/15"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>

            {/* Left: pitch */}
            <div className="relative isolate overflow-hidden bg-panel p-5 text-white sm:p-7">
              <div className="panel-glow pointer-events-none absolute inset-0 -z-10" />
              <h2 id={titleId} className="pr-12 font-display text-xl leading-tight font-bold tracking-tight sm:text-[1.75rem] md:pr-0">
                <span aria-hidden="true" className="animate-wave mr-2 inline-block">
                  👋
                </span>
                Still exploring? Let us help
              </h2>
              {/* Dropped on short phone screens so the form still fits without scrolling */}
              <p className="mt-2.5 text-[13px] leading-relaxed text-white/65 max-md:[@media(max-height:830px)]:hidden">
                Talk to a counsellor and we&apos;ll map the shortest route from where you are to the job you want.
              </p>

              <figure className="mt-6 hidden rounded-2xl border border-white/10 bg-white/[0.06] p-5 md:block">
                <blockquote className="text-sm leading-relaxed">&ldquo;AI is the new electricity.&rdquo;</blockquote>
                <figcaption className="mt-4 flex items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-full bg-white/10 text-white/80">
                    <Icon name="robot" className="size-4" />
                  </span>
                  <span>
                    <span className="block text-[13px] font-semibold">Andrew Ng</span>
                    <span className="block text-xs text-white/60">Founder, DeepLearning.AI</span>
                  </span>
                </figcaption>
              </figure>

              <div className="mt-4 hidden items-center justify-between gap-3 rounded-xl bg-white/90 px-4 py-2.5 text-ink md:flex">
                <span className="flex items-center gap-2 text-[13px] font-semibold">
                  <GoogleG />
                  Google Verified
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4 text-[#1d9bf0]">
                    <path fill="currentColor" d="M12 2 14.4 4l3.1-.4.9 3 2.7 1.6-.9 3 .9 3-2.7 1.6-.9 3-3.1-.4L12 22l-2.4-2-3.1.4-.9-3L2.9 15.8l.9-3-.9-3 2.7-1.6.9-3 3.1.4z" />
                    <path fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="m8.5 12 2.3 2.3 4.7-4.6" />
                  </svg>
                </span>
                <span className="text-xs tracking-[0.18em] text-amber-500" aria-label="Rated 5 out of 5">
                  ★★★★★
                </span>
              </div>

              <p className="mt-5 hidden text-xs leading-relaxed text-white/55 md:block">
                You can also share your requirements at{" "}
                <a href={`mailto:${SITE.email}`} className="font-medium text-white underline underline-offset-2">
                  {SITE.email}
                </a>
                , and our team will get back to you right away.
              </p>
            </div>

            {/* Right: form */}
            <div className="relative bg-gradient-to-br from-brand-600 via-brand-500 to-violet-600 p-5 text-white sm:p-7">

              <EnquiryForm key={formKey} initialCourse={course} onDone={close} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
