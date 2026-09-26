"use client";

import { useId, useState } from "react";

import { Icon } from "@/components/icon";
import { courseGroups } from "@/lib/site";

/**
 * Enquiry form shown in the Book Free Demo popup (enquiry-modal.tsx).
 *
 * `initialCourse` pre-selects the course dropdown. If that course is not one of
 * the menu courses (e.g. "CAD / CAM"), it is added as an extra option so the
 * visitor still sees it selected.
 *
 * Submissions are validated here and again on the server, then saved to the
 * MySQL `form_submissions` table by POST /api/enquiries.
 */

/** Stored in `form_submissions.form_type`; must be one the API accepts. */
export type EnquiryFormType = "book-demo" | "contact";
type Enquiry = { course: string; name: string; phone: string };
type SubmitResult = { ok: true } | { ok: false; message?: string; errors?: Record<string, string> };

async function submitEnquiry(formType: EnquiryFormType, enquiry: Enquiry): Promise<SubmitResult> {
  try {
    const response = await fetch("/api/enquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ formType, ...enquiry, pageUrl: window.location.href }),
    });
    const data = (await response.json().catch(() => ({}))) as { message?: string; errors?: Record<string, string> };
    if (response.ok) return { ok: true };
    return { ok: false, message: data.message, errors: data.errors };
  } catch {
    return { ok: false, message: "No internet connection. Please check your connection and try again." };
  }
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

const MENU_COURSES = new Set(courseGroups.flatMap((group) => group.items.map((item) => item.label)));

export function EnquiryForm({
  formType = "book-demo",
  initialCourse = "",
  initialPhone = "",
  heading = "Tell us your goal. We'll code it into reality.",
  headingLevel = "h3",
  onDone,
  className = "",
}: {
  formType?: EnquiryFormType;
  initialCourse?: string;
  /** Pre-fills the contact number (the home page CTA passes what the visitor typed there). */
  initialPhone?: string;
  heading?: string;
  headingLevel?: "h2" | "h3";
  /** Shows a "Done" button on the thank-you screen (the popup uses it to close). */
  onDone?: () => void;
  className?: string;
}) {
  const id = useId();
  const [sum, setSum] = useState(newSum);
  const [form, setForm] = useState({ course: initialCourse, name: "", phone: initialPhone, answer: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof typeof form, string>>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [submitError, setSubmitError] = useState("");
  const Heading = headingLevel;

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
    setSubmitError("");
    const result = await submitEnquiry(formType, { course: form.course, name: form.name.trim(), phone: form.phone });
    if (result.ok) {
      setStatus("sent");
      return;
    }
    setStatus("idle");
    if (result.errors) setErrors(result.errors as typeof errors);
    setSubmitError(result.message ?? "Please correct the highlighted fields and try again.");
    // A used sum must not be reused; ask a fresh one for the retry.
    setSum((s) => newSum(s));
    setForm((f) => ({ ...f, answer: "" }));
  };

  const reset = () => {
    setForm({ course: initialCourse, name: "", phone: initialPhone, answer: "" });
    setErrors({});
    setSubmitError("");
    setStatus("idle");
    setSum((s) => newSum(s));
  };

  const field =
    "h-11 w-full rounded-xl border bg-white/10 px-4 text-sm text-white placeholder:text-white/70 outline-none transition-colors focus:border-white focus:bg-white/15";
  const fieldBorder = (name: keyof typeof form) => (errors[name] ? "border-red-300" : "border-white/25");
  const errorText = (name: keyof typeof form) =>
    errors[name] && (
      <p id={`${id}-${name}-error`} className="mt-1.5 text-xs font-medium text-red-100">
        {errors[name]}
      </p>
    );

  if (status === "sent") {
    return (
      <div className={`flex min-h-[20rem] flex-col items-start justify-center ${className}`} role="status">
        <span className="grid size-11 place-items-center rounded-full bg-[#a3e635] text-ink">
          <Icon name="check" className="size-5" strokeWidth={2.5} />
        </span>
        <p className="mt-5 font-display text-xl font-bold tracking-tight sm:text-2xl">Thanks, {form.name.trim().split(" ")[0]}! Your enquiry is booked.</p>
        <p className="mt-2.5 max-w-sm text-sm text-white/80">
          We have received your request for a free demo class in <span className="font-semibold text-white">{form.course}</span>. A counsellor will call you on{" "}
          <span className="font-semibold text-white">{form.phone}</span> within working hours.
        </p>
        <button
          type="button"
          onClick={onDone ?? reset}
          className="mt-6 h-10 cursor-pointer rounded-full bg-white px-6 text-sm font-semibold text-brand-700 transition-colors hover:bg-white/90"
        >
          {onDone ? "Done" : "Send another enquiry"}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className={`space-y-2.5 ${className}`}>
      <Heading className="text-base leading-snug font-bold sm:text-[17px] md:pr-12">{heading}</Heading>

      <div className="pt-1.5">
        <label htmlFor={`${id}-course`} className="sr-only">
          Course of interest
        </label>
        <div className="relative">
          <select
            id={`${id}-course`}
            value={form.course}
            onChange={update("course")}
            aria-invalid={!!errors.course}
            aria-describedby={errors.course ? `${id}-course-error` : undefined}
            className={`${field} ${fieldBorder("course")} cursor-pointer appearance-none pr-10 ${form.course ? "" : "text-white/90"}`}
          >
            <option value="" disabled className="text-foreground">
              Select Your Course of Interest*
            </option>
            {initialCourse && !MENU_COURSES.has(initialCourse) && (
              <option value={initialCourse} className="text-foreground">
                {initialCourse}
              </option>
            )}
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
          <svg viewBox="0 0 12 12" aria-hidden="true" className="pointer-events-none absolute top-1/2 right-4 size-3 -translate-y-1/2">
            <path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        {errorText("course")}
      </div>

      <div>
        <label htmlFor={`${id}-name`} className="sr-only">
          Full name
        </label>
        <input
          id={`${id}-name`}
          value={form.name}
          onChange={update("name")}
          placeholder="Full Name*"
          autoComplete="name"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? `${id}-name-error` : undefined}
          className={`${field} ${fieldBorder("name")}`}
        />
        {errorText("name")}
      </div>

      <div>
        <label htmlFor={`${id}-phone`} className="sr-only">
          Contact number
        </label>
        <input
          id={`${id}-phone`}
          value={form.phone}
          onChange={update("phone")}
          placeholder="Contact Number (10 Digits)*"
          inputMode="numeric"
          autoComplete="tel-national"
          aria-invalid={!!errors.phone}
          aria-describedby={errors.phone ? `${id}-phone-error` : undefined}
          className={`${field} ${fieldBorder("phone")}`}
        />
        {errorText("phone")}
      </div>

      <div>
        <div className="flex flex-wrap items-center gap-2.5 pt-0.5 pb-2">
          <label htmlFor={`${id}-answer`} className="text-[13px] font-semibold">
            Security verification
          </label>
          {/* Question and refresh wrap together, never apart */}
          <span className="flex items-center gap-2.5">
            <span className="shrink-0 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-[13px] font-bold tracking-wide whitespace-nowrap" aria-live="polite">
              {sum.a} + {sum.b} = ?
            </span>
            <button
              type="button"
              onClick={refreshSum}
              aria-label="New question"
              className="grid size-8 shrink-0 cursor-pointer place-items-center rounded-lg border border-white/30 bg-white/10 transition-colors hover:bg-white/20"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 12a8 8 0 1 1-2.3-5.7L20 8.5 M20 4v4.5h-4.5" />
              </svg>
            </button>
          </span>
        </div>
        <input
          id={`${id}-answer`}
          value={form.answer}
          onChange={update("answer")}
          placeholder="Answer"
          inputMode="numeric"
          autoComplete="off"
          aria-invalid={!!errors.answer}
          aria-describedby={errors.answer ? `${id}-answer-error` : undefined}
          className={`${field} ${fieldBorder("answer")}`}
        />
        {errorText("answer")}
      </div>

      {submitError && (
        <p role="alert" className="flex items-start gap-2.5 rounded-xl border border-red-200/60 bg-red-950/40 px-4 py-3 text-[13px] font-medium text-white">
          <span aria-hidden="true" className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full bg-red-200 text-[10px] font-bold text-red-900">
            !
          </span>
          {submitError}
        </p>
      )}

      <p className="flex items-center gap-2.5 rounded-xl bg-[#a3e635] px-4 py-2.5 text-[13px] font-semibold text-ink">
        <span className="grid size-5 place-items-center rounded-full bg-ink text-[#a3e635]">
          <Icon name="check" className="size-3" strokeWidth={3} />
        </span>
        Expert response within 5 minutes.
      </p>

      <div className="pt-1">
        <button
          type="submit"
          disabled={status === "sending"}
          className="group inline-flex h-11 cursor-pointer items-center gap-2.5 rounded-full bg-white/70 px-7 text-sm font-semibold text-brand-700 transition-colors hover:bg-white disabled:cursor-wait disabled:opacity-70"
        >
          {status === "sending" ? "Sending…" : "Submit"}
          <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
            →
          </span>
        </button>
      </div>
    </form>
  );
}
