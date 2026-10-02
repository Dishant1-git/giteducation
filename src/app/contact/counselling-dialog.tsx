"use client";

import { useCallback, useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { Icon } from "@/components/icon";
import { COUNSELLING_MAX_DAYS_AHEAD, COUNSELLING_SLOTS, counsellingDateError, counsellingWindow, formatCounsellingDate } from "@/lib/counselling";
import { SITE, allCourseGroups } from "@/lib/site";

/**
 * "Book Counselling Session" button and its three-step dialog on /contact:
 * details, then date and time slot, then confirm.
 *
 * The booking is sent to POST /api/enquiries as a "counselling" submission,
 * which files it in the CMS as a "Virtual Counselling" enquiry with the date
 * and slot. Everything is validated here and again on the server.
 *
 * Escape, the close button or a click on the backdrop closes it; focus returns
 * to the button that opened it.
 *
 * The dialog is rendered into <body>: the button sits inside a <Reveal>, whose
 * transform would otherwise become the containing block of the fixed overlay.
 */

const STEPS = ["Your details", "Date & time", "Confirm"];

type Form = { name: string; phone: string; email: string; course: string; date: string; slot: string; answer: string };
type Errors = Partial<Record<keyof Form, string>>;

const EMPTY: Form = { name: "", phone: "", email: "", course: "", date: "", slot: "", answer: "" };

/** A random single-digit sum, always different from `previous` so a refresh visibly changes. */
const newSum = (previous?: { a: number; b: number }) => {
  let a: number, b: number;
  do {
    a = 1 + Math.floor(Math.random() * 9);
    b = 1 + Math.floor(Math.random() * 9);
  } while (previous && a === previous.a && b === previous.b);
  return { a, b };
};

const noopSubscribe = () => () => {};

export function CounsellingBooking({ className = "" }: { className?: string }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Form>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [sum, setSum] = useState(newSum);
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [submitError, setSubmitError] = useState("");
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const reduce = useReducedMotion();
  // The bookable days depend on today's date, so they are worked out in the browser only.
  const hydrated = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const { min, max } = hydrated ? counsellingWindow() : { min: "", max: "" };

  const show = () => {
    setForm(EMPTY);
    setErrors({});
    setSubmitError("");
    setStatus("idle");
    setStep(0);
    setSum((s) => newSum(s));
    setOpen(true);
  };

  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  // While open: lock page scroll, Escape closes, Tab stays inside
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
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

  // Each step starts with focus on its first field
  useEffect(() => {
    if (open) dialogRef.current?.querySelector<HTMLElement>("[data-step] input, [data-step] select, [data-step] button")?.focus();
  }, [open, step, status]);

  const update = (field: keyof Form) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = field === "phone" ? event.target.value.replace(/\D/g, "").slice(0, 10) : event.target.value;
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  };

  /** Errors for one step. The server repeats every one of these checks. */
  const validate = (which: number): Errors => {
    const next: Errors = {};
    if (which === 0) {
      if (form.name.trim().length < 2) next.name = "Please enter your full name.";
      if (!/^\d{10}$/.test(form.phone)) next.phone = "Enter a 10-digit contact number.";
      if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Enter a valid email address.";
    }
    if (which === 1) {
      const dateError = counsellingDateError(form.date);
      if (dateError) next.date = dateError;
      if (!form.slot) next.slot = "Please choose a time slot.";
    }
    if (which === 2 && Number(form.answer) !== sum.a + sum.b) next.answer = "That answer isn't right. Try again.";
    return next;
  };

  const refreshSum = () => {
    setSum((s) => newSum(s));
    setForm((f) => ({ ...f, answer: "" }));
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const next = validate(step);
    setErrors(next);
    if (Object.keys(next).length) {
      if (next.answer) refreshSum();
      return;
    }
    if (step < 2) {
      setStep(step + 1);
      return;
    }

    setStatus("sending");
    setSubmitError("");
    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formType: "counselling",
          name: form.name.trim(),
          phone: form.phone,
          email: form.email.trim(),
          course: form.course,
          preferredDate: form.date,
          preferredSlot: form.slot,
          pageUrl: window.location.href,
        }),
      });
      if (response.ok) {
        setStatus("sent");
        return;
      }
      const data = (await response.json().catch(() => ({}))) as { message?: string; errors?: Errors & { preferredDate?: string; preferredSlot?: string } };
      const serverErrors: Errors = { ...data.errors, date: data.errors?.preferredDate, slot: data.errors?.preferredSlot };
      setErrors(serverErrors);
      // Go back to the step that holds the first field the server refused.
      if (serverErrors.name || serverErrors.phone || serverErrors.email) setStep(0);
      else if (serverErrors.date || serverErrors.slot) setStep(1);
      setSubmitError(data.message ?? "Please correct the highlighted fields and try again.");
    } catch {
      setSubmitError("No internet connection. Please check your connection and try again.");
    }
    setStatus("idle");
    // A used sum must not be reused; ask a fresh one for the retry.
    refreshSum();
  };

  const field = "h-11 w-full rounded-xl border bg-surface-raised px-4 text-sm text-foreground outline-none transition-colors placeholder:text-content-muted focus:border-action";
  const fieldBorder = (name: keyof Form) => (errors[name] ? "border-red-500" : "border-border-subtle");
  const label = "mb-1.5 block text-[13px] font-semibold";
  const describedBy = (name: keyof Form) => (errors[name] ? `${id}-${name}-error` : undefined);
  const errorText = (name: keyof Form) =>
    errors[name] && (
      <p id={`${id}-${name}-error`} className="mt-1.5 text-xs font-medium text-red-600">
        {errors[name]}
      </p>
    );

  return (
    <>
      <button ref={triggerRef} type="button" onClick={show} aria-haspopup="dialog" className={className}>
        <Icon name="calendar" className="size-4" />
        Book Counselling Session
      </button>

      {hydrated &&
        createPortal(
      <AnimatePresence>
        {open && (
          <motion.div
            key="counselling"
            data-lenis-prevent
            className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Backdrop */}
            <button type="button" aria-label="Close booking form" tabIndex={-1} onClick={close} className="absolute inset-0 cursor-default bg-panel/70" />

            <motion.div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={`${id}-title`}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="no-scrollbar relative max-h-[calc(100dvh-1.5rem)] w-full max-w-lg overflow-y-auto overscroll-contain rounded-3xl bg-surface p-6 text-left text-foreground shadow-2xl shadow-black/40 sm:p-8"
            >
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="absolute top-4 right-4 grid size-9 cursor-pointer place-items-center rounded-full border border-border-subtle text-content-muted transition-colors hover:bg-surface-sunken hover:text-foreground"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>

              <h2 id={`${id}-title`} className="pr-12 font-display text-xl leading-tight font-bold tracking-tight sm:text-2xl">
                Book a virtual counselling session
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-content-muted">A 30-minute call with a counsellor at {SITE.name}, on the day and time you choose.</p>

              {status === "sent" ? (
                <div data-step role="status" className="mt-7">
                  <span className="grid size-11 place-items-center rounded-full bg-[#a3e635] text-ink">
                    <Icon name="check" className="size-5" strokeWidth={2.5} />
                  </span>
                  <p className="mt-5 font-display text-lg font-bold tracking-tight">Thanks, {form.name.trim().split(" ")[0]}! Your request is in.</p>
                  <p className="mt-2 text-sm leading-relaxed text-content-muted">
                    You asked for <span className="font-semibold text-foreground">{formatCounsellingDate(form.date)}</span>,{" "}
                    <span className="font-semibold text-foreground">{form.slot}</span>. A counsellor will call you on{" "}
                    <span className="font-semibold text-foreground">{form.phone}</span> to confirm the session.
                  </p>
                  <button type="button" onClick={close} className="mt-6 h-11 cursor-pointer rounded-full bg-action px-7 text-sm font-semibold text-white transition-colors hover:bg-panel">
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={onSubmit} noValidate className="mt-6">
                  {/* Step indicator */}
                  <ol className="flex items-center gap-2" aria-label="Booking steps">
                    {STEPS.map((title, i) => (
                      <li key={title} aria-current={i === step ? "step" : undefined} className="flex flex-1 flex-col gap-2">
                        <span className={`h-1 rounded-full transition-colors ${i <= step ? "bg-action" : "bg-border-subtle"}`} />
                        <span className={`text-[11px] font-semibold tracking-wide uppercase ${i === step ? "text-action" : "text-content-muted"}`}>
                          {i + 1}. {title}
                        </span>
                      </li>
                    ))}
                  </ol>

                  <div data-step className="mt-6 space-y-4">
                    {step === 0 && (
                      <>
                        <div>
                          <label htmlFor={`${id}-name`} className={label}>
                            Full name*
                          </label>
                          <input id={`${id}-name`} value={form.name} onChange={update("name")} autoComplete="name" aria-invalid={!!errors.name} aria-describedby={describedBy("name")} className={`${field} ${fieldBorder("name")}`} />
                          {errorText("name")}
                        </div>
                        <div>
                          <label htmlFor={`${id}-phone`} className={label}>
                            Contact number (10 digits)*
                          </label>
                          <input id={`${id}-phone`} value={form.phone} onChange={update("phone")} inputMode="numeric" autoComplete="tel-national" aria-invalid={!!errors.phone} aria-describedby={describedBy("phone")} className={`${field} ${fieldBorder("phone")}`} />
                          {errorText("phone")}
                        </div>
                        <div>
                          <label htmlFor={`${id}-email`} className={label}>
                            Email (optional)
                          </label>
                          <input id={`${id}-email`} type="email" value={form.email} onChange={update("email")} autoComplete="email" aria-invalid={!!errors.email} aria-describedby={describedBy("email")} className={`${field} ${fieldBorder("email")}`} />
                          {errorText("email")}
                        </div>
                        <div>
                          <label htmlFor={`${id}-course`} className={label}>
                            Course of interest (optional)
                          </label>
                          <select id={`${id}-course`} value={form.course} onChange={update("course")} className={`${field} ${fieldBorder("course")} cursor-pointer`}>
                            <option value="">Not sure yet</option>
                            {allCourseGroups.map((group) => (
                              <optgroup key={group.title} label={group.title}>
                                {group.items.map((item) => (
                                  <option key={item.label} value={item.label}>
                                    {item.label}
                                  </option>
                                ))}
                              </optgroup>
                            ))}
                          </select>
                        </div>
                      </>
                    )}

                    {step === 1 && (
                      <>
                        <div>
                          <label htmlFor={`${id}-date`} className={label}>
                            Date*
                          </label>
                          {/* The browser's own picker button is stretched over the whole field and
                              made invisible, so a click anywhere opens the calendar and the icon
                              drawn here is always visible, whatever the browser's own one looks like. */}
                          <div className="relative">
                            <input
                              id={`${id}-date`}
                              type="date"
                              value={form.date}
                              min={min}
                              max={max}
                              onChange={update("date")}
                              aria-invalid={!!errors.date}
                              aria-describedby={`${id}-date-hint${errors.date ? ` ${id}-date-error` : ""}`}
                              className={`${field} ${fieldBorder("date")} relative cursor-pointer pr-11 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:size-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0`}
                            />
                            <Icon name="calendar" className="pointer-events-none absolute top-1/2 right-3.5 size-5 -translate-y-1/2 text-action" />
                          </div>
                          <p id={`${id}-date-hint`} className="mt-1.5 text-xs text-content-muted">
                            Any day in the next {COUNSELLING_MAX_DAYS_AHEAD} days, Monday to Saturday.
                          </p>
                          {errorText("date")}
                        </div>
                        <fieldset aria-describedby={describedBy("slot")}>
                          <legend className={label}>Time slot*</legend>
                          <div className="grid gap-2 sm:grid-cols-2">
                            {COUNSELLING_SLOTS.map((slot) => (
                              <label
                                key={slot}
                                className={`flex h-11 cursor-pointer items-center gap-2.5 rounded-xl border px-4 text-sm font-medium transition-colors has-[:focus-visible]:border-action ${
                                  form.slot === slot ? "border-action bg-action/10 text-action" : "border-border-subtle bg-surface-raised hover:border-action/50"
                                }`}
                              >
                                <input type="radio" name={`${id}-slot`} value={slot} checked={form.slot === slot} onChange={update("slot")} className="sr-only" />
                                <Icon name="clock" className="size-4 shrink-0" />
                                {slot}
                              </label>
                            ))}
                          </div>
                          {errorText("slot")}
                        </fieldset>
                      </>
                    )}

                    {step === 2 && (
                      <>
                        <dl className="divide-y divide-border-subtle rounded-2xl border border-border-subtle bg-surface-raised px-4 text-sm">
                          {[
                            ["Name", form.name.trim()],
                            ["Contact number", form.phone],
                            ["Email", form.email.trim() || "—"],
                            ["Course of interest", form.course || "Not sure yet"],
                            ["Date", formatCounsellingDate(form.date)],
                            ["Time slot", form.slot],
                          ].map(([term, value]) => (
                            <div key={term} className="flex items-start justify-between gap-4 py-2.5">
                              <dt className="text-content-muted">{term}</dt>
                              <dd className="text-right font-semibold">{value}</dd>
                            </div>
                          ))}
                        </dl>
                        <div>
                          <div className="flex flex-wrap items-center gap-2.5 pb-2">
                            <label htmlFor={`${id}-answer`} className="text-[13px] font-semibold">
                              Security verification
                            </label>
                            <span className="flex items-center gap-2.5">
                              <span className="shrink-0 rounded-full border border-border-subtle bg-surface-sunken px-3 py-1 text-[13px] font-bold tracking-wide whitespace-nowrap" aria-live="polite">
                                {sum.a} + {sum.b} = ?
                              </span>
                              <button
                                type="button"
                                onClick={refreshSum}
                                aria-label="New question"
                                className="grid size-8 shrink-0 cursor-pointer place-items-center rounded-lg border border-border-subtle bg-surface-sunken transition-colors hover:bg-border-subtle"
                              >
                                <svg viewBox="0 0 24 24" aria-hidden="true" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M20 12a8 8 0 1 1-2.3-5.7L20 8.5 M20 4v4.5h-4.5" />
                                </svg>
                              </button>
                            </span>
                          </div>
                          <input id={`${id}-answer`} value={form.answer} onChange={update("answer")} placeholder="Answer" inputMode="numeric" autoComplete="off" aria-invalid={!!errors.answer} aria-describedby={describedBy("answer")} className={`${field} ${fieldBorder("answer")}`} />
                          {errorText("answer")}
                        </div>
                      </>
                    )}
                  </div>

                  {submitError && (
                    <p role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-medium text-red-800">
                      {submitError}
                    </p>
                  )}

                  <div className="mt-6 flex items-center justify-between gap-3">
                    {step > 0 ? (
                      <button type="button" onClick={() => setStep(step - 1)} className="h-11 cursor-pointer rounded-full border border-border-subtle px-6 text-sm font-semibold transition-colors hover:bg-surface-sunken">
                        Back
                      </button>
                    ) : (
                      <span />
                    )}
                    <button
                      type="submit"
                      disabled={status === "sending"}
                      className="group inline-flex h-11 cursor-pointer items-center gap-2.5 rounded-full bg-action px-7 text-sm font-semibold text-white transition-colors hover:bg-panel disabled:cursor-wait disabled:opacity-70"
                    >
                      {step < 2 ? "Continue" : status === "sending" ? "Booking…" : "Confirm booking"}
                      <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
