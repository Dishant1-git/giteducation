"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { Icon } from "@/components/icon";
import { SITE, courseGroups } from "@/lib/site";

/**
 * "Still exploring?" enquiry popup.
 *
 * - Opens by itself once per browser session, 10 seconds after the site loads.
 * - Anything can open it with `openEnquiry()` (the header's Book Free Demo buttons do).
 * - Escape, the close button or a click on the backdrop closes it.
 *
 * Submissions are validated here but not sent anywhere yet: there is no form
 * backend in this project. Wire `submitEnquiry` to your email/CRM/API when ready.
 */

const OPEN_EVENT = "enquiry:open";
const AUTO_OPEN_KEY = "enquiry-auto-shown";
const AUTO_OPEN_DELAY = 10_000;

/** Open the enquiry popup from anywhere on the page. */
export function openEnquiry() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

type Enquiry = { course: string; name: string; phone: string };

// TODO: send to a real endpoint (email service, CRM or an API route).
async function submitEnquiry(enquiry: Enquiry) {
  void enquiry;
}

/** A random single-digit sum, always different from `previous` so a refresh visibly changes. */
const newSum = (previous?: { a: number; b: number }) => {
  let a: number, b: number;
  do {
    a = 1 + Math.floor(Math.random() * 9);
    b = 1 + Math.floor(Math.random() * 9);
  } while (previous && a === previous.a && b === previous.b);
  return { a, b };
};

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
  const [sum, setSum] = useState(newSum);
  const [form, setForm] = useState({ course: "", name: "", phone: "", answer: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof typeof form, string>>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const dialogRef = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const reduce = useReducedMotion();
  const titleId = useId();

  const show = useCallback(() => {
    lastFocus.current = document.activeElement as HTMLElement | null;
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

  const update = (field: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = field === "phone" ? event.target.value.replace(/\D/g, "").slice(0, 10) : event.target.value;
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const refreshSum = () => {
    setSum((s) => newSum(s));
    setForm((f) => ({ ...f, answer: "" }));
    setErrors((e) => ({ ...e, answer: undefined }));
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const next: typeof errors = {};
    if (!form.course) next.course = "Please choose a course.";
    if (form.name.trim().length < 2) next.name = "Please enter your full name.";
    if (!/^\d{10}$/.test(form.phone)) next.phone = "Enter a 10-digit contact number.";
    if (Number(form.answer) !== sum.a + sum.b) next.answer = "That answer isn't right. Try again.";
    setErrors(next);
    if (Object.keys(next).length) {
      // Wrong answer: ask a fresh question but keep the error message showing
      if (next.answer) {
        setSum((s) => newSum(s));
        setForm((f) => ({ ...f, answer: "" }));
      }
      return;
    }
    setStatus("sending");
    await submitEnquiry({ course: form.course, name: form.name.trim(), phone: form.phone });
    setStatus("sent");
  };

  const reset = () => {
    setForm({ course: "", name: "", phone: "", answer: "" });
    setErrors({});
    setStatus("idle");
    setSum((s) => newSum(s));
  };

  const field =
    "h-14 w-full rounded-2xl border bg-white/10 px-5 text-[15px] text-white placeholder:text-white/70 outline-none transition-colors focus:border-white focus:bg-white/15";
  const fieldBorder = (name: keyof typeof form) => (errors[name] ? "border-red-300" : "border-white/25");
  const errorText = (name: keyof typeof form) =>
    errors[name] && (
      <p id={`${titleId}-${name}-error`} className="mt-1.5 text-xs font-medium text-red-100">
        {errors[name]}
      </p>
    );

  return (
    <AnimatePresence onExitComplete={() => status === "sent" && reset()}>
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
            className="relative grid max-h-[calc(100dvh-1.5rem)] w-full max-w-5xl overflow-y-auto overscroll-contain rounded-[2rem] shadow-2xl shadow-black/40 md:grid-cols-2"
          >
            {/* Top-right of the whole popup: over the form on desktop, over the heading on phones */}
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute top-5 right-5 z-10 grid size-11 cursor-pointer place-items-center rounded-full border border-white/40 text-white transition-colors hover:bg-white/15"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>

            {/* Left: pitch */}
            <div className="relative isolate overflow-hidden bg-panel p-7 text-white sm:p-10 md:p-12">
              <div className="panel-glow pointer-events-none absolute inset-0 -z-10" />
              <h2 id={titleId} className="pr-12 font-display text-3xl leading-tight font-bold tracking-tight sm:text-[2.6rem] md:pr-0">
                <span aria-hidden="true" className="animate-wave mr-2 inline-block">
                  👋
                </span>
                Still exploring? Let us help
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-white/65">
                Talk to a counsellor and we&apos;ll map the shortest route from where you are to the job you want.
              </p>

              <figure className="mt-8 hidden rounded-3xl border border-white/10 bg-white/[0.06] p-7 md:block">
                <blockquote className="text-lg leading-relaxed">&ldquo;AI is the new electricity.&rdquo;</blockquote>
                <figcaption className="mt-6 flex items-center gap-4">
                  <span className="grid size-12 place-items-center rounded-full bg-white/10 text-white/80">
                    <Icon name="robot" className="size-5" />
                  </span>
                  <span>
                    <span className="block font-semibold">Andrew Ng</span>
                    <span className="block text-sm text-white/60">Founder, DeepLearning.AI</span>
                  </span>
                </figcaption>
              </figure>

              <div className="mt-6 hidden items-center justify-between gap-3 rounded-2xl bg-white/90 px-6 py-4 text-ink md:flex">
                <span className="flex items-center gap-3 font-semibold">
                  <GoogleG />
                  Google Verified
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5 text-[#1d9bf0]">
                    <path fill="currentColor" d="M12 2 14.4 4l3.1-.4.9 3 2.7 1.6-.9 3 .9 3-2.7 1.6-.9 3-3.1-.4L12 22l-2.4-2-3.1.4-.9-3L2.9 15.8l.9-3-.9-3 2.7-1.6.9-3 3.1.4z" />
                    <path fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="m8.5 12 2.3 2.3 4.7-4.6" />
                  </svg>
                </span>
                <span className="tracking-[0.2em] text-amber-500" aria-label="Rated 5 out of 5">
                  ★★★★★
                </span>
              </div>

              <p className="mt-8 hidden text-sm leading-relaxed text-white/55 md:block">
                You can also share your requirements at{" "}
                <a href={`mailto:${SITE.email}`} className="font-medium text-white underline underline-offset-2">
                  {SITE.email}
                </a>
                , and our team will get back to you right away.
              </p>
            </div>

            {/* Right: form */}
            <div className="relative bg-gradient-to-br from-brand-600 via-brand-500 to-violet-600 p-7 text-white sm:p-10 md:p-12">

              {status === "sent" ? (
                <div className="flex min-h-[28rem] flex-col items-start justify-center">
                  <span className="grid size-14 place-items-center rounded-full bg-[#a3e635] text-ink">
                    <Icon name="check" className="size-7" strokeWidth={2.5} />
                  </span>
                  <h3 className="mt-6 font-display text-2xl font-bold tracking-tight sm:text-3xl">Thanks, {form.name.trim().split(" ")[0]}!</h3>
                  <p className="mt-3 max-w-sm text-white/80">
                    A counsellor will call you on <span className="font-semibold text-white">{form.phone}</span> about {form.course}.
                  </p>
                  <button type="button" onClick={close} className="mt-8 h-12 cursor-pointer rounded-full bg-white px-8 font-semibold text-brand-700 transition-colors hover:bg-white/90">
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={onSubmit} noValidate className="space-y-4">
                  <h3 className="text-xl leading-snug font-bold sm:text-2xl md:pr-12">Tell us your goal. We&apos;ll code it into reality.</h3>

                  <div className="pt-3">
                    <label htmlFor={`${titleId}-course`} className="sr-only">
                      Course of interest
                    </label>
                    <div className="relative">
                      <select
                        id={`${titleId}-course`}
                        value={form.course}
                        onChange={update("course")}
                        aria-invalid={!!errors.course}
                        aria-describedby={errors.course ? `${titleId}-course-error` : undefined}
                        className={`${field} ${fieldBorder("course")} cursor-pointer appearance-none pr-12 ${form.course ? "" : "text-white/90"}`}
                      >
                        <option value="" disabled className="text-foreground">
                          Select Your Course of Interest*
                        </option>
                        {courseGroups.map((group) => (
                          <optgroup key={group.title} label={group.title} className="text-foreground">
                            {group.items.map((item) => (
                              <option key={item.label} value={item.label} className="text-foreground">
                                {item.label}
                              </option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                      <svg viewBox="0 0 12 12" aria-hidden="true" className="pointer-events-none absolute top-1/2 right-5 size-3.5 -translate-y-1/2">
                        <path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    {errorText("course")}
                  </div>

                  <div>
                    <label htmlFor={`${titleId}-name`} className="sr-only">
                      Full name
                    </label>
                    <input
                      id={`${titleId}-name`}
                      value={form.name}
                      onChange={update("name")}
                      placeholder="Full Name*"
                      autoComplete="name"
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? `${titleId}-name-error` : undefined}
                      className={`${field} ${fieldBorder("name")}`}
                    />
                    {errorText("name")}
                  </div>

                  <div>
                    <label htmlFor={`${titleId}-phone`} className="sr-only">
                      Contact number
                    </label>
                    <input
                      id={`${titleId}-phone`}
                      value={form.phone}
                      onChange={update("phone")}
                      placeholder="Contact Number (10 Digits)*"
                      inputMode="numeric"
                      autoComplete="tel-national"
                      aria-invalid={!!errors.phone}
                      aria-describedby={errors.phone ? `${titleId}-phone-error` : undefined}
                      className={`${field} ${fieldBorder("phone")}`}
                    />
                    {errorText("phone")}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-3 pt-1 pb-3">
                      <label htmlFor={`${titleId}-answer`} className="font-semibold">
                        Security verification
                      </label>
                      {/* Question and refresh wrap together, never apart */}
                      <span className="flex items-center gap-3">
                        <span className="shrink-0 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 font-bold tracking-wide whitespace-nowrap" aria-live="polite">
                          {sum.a} + {sum.b} = ?
                        </span>
                        <button
                          type="button"
                          onClick={refreshSum}
                          aria-label="New question"
                          className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-xl border border-white/30 bg-white/10 transition-colors hover:bg-white/20"
                        >
                          <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 12a8 8 0 1 1-2.3-5.7L20 8.5 M20 4v4.5h-4.5" />
                          </svg>
                        </button>
                      </span>
                    </div>
                    <input
                      id={`${titleId}-answer`}
                      value={form.answer}
                      onChange={update("answer")}
                      placeholder="Answer"
                      inputMode="numeric"
                      autoComplete="off"
                      aria-invalid={!!errors.answer}
                      aria-describedby={errors.answer ? `${titleId}-answer-error` : undefined}
                      className={`${field} ${fieldBorder("answer")}`}
                    />
                    {errorText("answer")}
                  </div>

                  <p className="flex items-center gap-3 rounded-2xl bg-[#a3e635] px-6 py-4 font-semibold text-ink">
                    <span className="grid size-6 place-items-center rounded-full bg-ink text-[#a3e635]">
                      <Icon name="check" className="size-3.5" strokeWidth={3} />
                    </span>
                    Expert response within 5 minutes.
                  </p>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={status === "sending"}
                      className="group inline-flex h-14 cursor-pointer items-center gap-3 rounded-full bg-white/70 px-10 font-semibold text-brand-700 transition-colors hover:bg-white disabled:cursor-wait disabled:opacity-70"
                    >
                      {status === "sending" ? "Sending…" : "Submit"}
                      <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
