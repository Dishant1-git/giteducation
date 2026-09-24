"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { Icon } from "@/components/icon";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { buildPlan, QUESTIONS, type Answers, type Plan } from "@/lib/career-tracks";

export type CourseSummary = { title: string; duration: string; fee: string };

const EASE = [0.16, 1, 0.3, 1] as const;

const COST_STYLE: Record<string, string> = {
  "Free certificate": "bg-status-success-soft text-status-success",
  "Free course": "bg-status-info-soft text-status-info",
  "Free to learn, exam paid": "bg-status-warning-soft text-status-warning",
};

export function CareerTrackFinder({ courses }: { courses: Record<string, CourseSummary> }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const reduce = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);

  const done = step >= QUESTIONS.length;
  const plan = done ? buildPlan(answers as Required<Answers>) : null;

  // Keep the card in view when the question or result changes (matters on phones).
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const top = cardRef.current?.getBoundingClientRect().top ?? 0;
    if (top < 80 || top > window.innerHeight * 0.4) {
      cardRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    }
  }, [step, reduce]);

  function choose(value: string) {
    const question = QUESTIONS[step];
    setAnswers((prev) => ({ ...prev, [question.key]: value }));
    setStep((s) => s + 1);
  }

  function restart() {
    setAnswers({});
    setStep(0);
  }

  return (
    <div className="mx-auto max-w-3xl">
      <ul className="no-print mb-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
        {["100% free, always", "Results shown instantly", "No form, no email"].map((item) => (
          <li key={item} className="inline-flex items-center gap-1.5 text-xs font-semibold text-content-muted">
            <Icon name="check" className="size-3.5 text-action" strokeWidth={2.4} />
            {item}
          </li>
        ))}
      </ul>

      <div ref={cardRef} className="rounded-panel border border-border-subtle bg-surface-raised p-6 shadow-raised sm:p-9 print:border-0 print:p-0 print:shadow-none">
        <Progress step={step} onJump={(i) => i < step && setStep(i)} />

        <AnimatePresence mode="wait" initial={false}>
          {plan ? (
            <motion.div
              key="result"
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: EASE }}
            >
              <Result plan={plan} course={courses[plan.track.courseSlug]} onRestart={restart} />
            </motion.div>
          ) : (
            <motion.div
              key={step}
              initial={reduce ? false : { opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduce ? undefined : { opacity: 0, x: -24 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="mt-8"
            >
              <QuestionView step={step} selected={answers[QUESTIONS[step].key]} onChoose={choose} onBack={() => setStep((s) => Math.max(0, s - 1))} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Progress({ step, onJump }: { step: number; onJump: (index: number) => void }) {
  return (
    <ol className="no-print flex items-center gap-2 sm:gap-3" aria-label="Progress">
      {QUESTIONS.map((q, i) => {
        const complete = i < step;
        const current = i === step;
        return (
          <li key={q.key} className="flex flex-1 items-center gap-2 last:flex-none sm:gap-3">
            <button
              type="button"
              onClick={() => onJump(i)}
              disabled={!complete}
              aria-current={current ? "step" : undefined}
              aria-label={`${q.step}${complete ? " (answered, go back)" : ""}`}
              className={`grid size-8 shrink-0 place-items-center rounded-full font-mono text-xs font-bold transition-colors duration-300 ${
                complete ? "cursor-pointer bg-action text-white hover:bg-action-hover" : current ? "bg-action text-white" : "bg-surface-sunken text-content-muted"
              }`}
            >
              {complete ? <Icon name="check" className="size-3.5" strokeWidth={2.6} /> : i + 1}
            </button>
            <span className={`hidden text-xs font-semibold sm:block ${complete || current ? "text-content" : "text-content-muted"}`}>{q.step}</span>
            {i < QUESTIONS.length - 1 && <span className={`h-px flex-1 transition-colors duration-300 ${complete ? "bg-action" : "bg-border-subtle"}`} />}
          </li>
        );
      })}
    </ol>
  );
}

function QuestionView({ step, selected, onChoose, onBack }: { step: number; selected?: string; onChoose: (value: string) => void; onBack: () => void }) {
  const question = QUESTIONS[step];
  return (
    <fieldset>
      <legend className="contents">
        <span className="block font-mono text-[11px] font-bold tracking-[0.2em] text-action uppercase">
          Question {step + 1} of {QUESTIONS.length}
        </span>
        <span className="mt-2 block font-display text-xl leading-snug font-bold tracking-tight text-balance sm:text-2xl">{question.title}</span>
      </legend>
      <p className="mt-2 max-w-lg text-sm leading-relaxed text-content-muted">{question.lead}</p>

      <div className={`mt-6 grid gap-3 ${question.options.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
        {question.options.map((option) => {
          const active = selected === option.id;
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={active}
              onClick={() => onChoose(option.id)}
              className={`group flex flex-col items-start gap-1.5 rounded-card border p-5 text-left transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card ${
                active ? "border-action bg-surface-accent" : "border-border-subtle bg-surface-sunken hover:border-action/40 hover:bg-surface-raised"
              }`}
            >
              <span className="font-display text-base leading-snug font-bold tracking-tight">{option.title}</span>
              <span className="text-xs leading-relaxed text-content-muted">{option.text}</span>
            </button>
          );
        })}
      </div>

      {step > 0 && (
        <button type="button" onClick={onBack} className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-content-muted transition-colors hover:text-action">
          <span aria-hidden="true">←</span> Back
        </button>
      )}
    </fieldset>
  );
}

function Result({ plan, course, onRestart }: { plan: Plan; course?: CourseSummary; onRestart: () => void }) {
  const { track } = plan;
  const [copied, setCopied] = useState(false);

  async function copyPitch() {
    try {
      await navigator.clipboard.writeText(plan.pitch);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="career-plan mt-8" aria-live="polite">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-mono text-[11px] font-bold tracking-[0.2em] text-action uppercase">Your career track</p>
          <h2 className="mt-2 flex items-center gap-3 font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-surface-accent text-action print:hidden">
              <Icon name={track.icon} className="size-5" />
            </span>
            {track.name}
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-content-muted sm:text-base">{track.summary}</p>
        </div>
        <div className="no-print flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-action px-5 text-sm font-semibold text-white transition-colors hover:bg-action-hover"
          >
            <Icon name="download" className="size-4" />
            Download PDF
          </button>
          <button type="button" onClick={onRestart} className="inline-flex h-10 items-center rounded-full border border-border-strong px-4 text-sm font-semibold transition-colors hover:border-action hover:text-action">
            Restart
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <Note icon="target" title="Where to start" text={plan.startNote} />
        <Note icon="clock" title={`Your pace: ${plan.hours}`} text={plan.paceNote} />
      </div>

      <Block index="01" title="Your 90-day plan">
        <ol className="grid gap-3 md:grid-cols-3">
          {track.phases.map((phase, i) => (
            <li key={phase.title} className="print-block rounded-card border border-border-subtle bg-surface-sunken p-5">
              <p className="font-mono text-[11px] font-bold tracking-[0.14em] text-content-muted uppercase">
                Days {i * 30 + 1}–{(i + 1) * 30}
              </p>
              <p className="mt-1 font-display text-base font-bold tracking-tight">{phase.title}</p>
              <ul className="mt-3 space-y-2">
                {phase.tasks.map((task) => (
                  <li key={task} className="flex gap-2 text-sm leading-relaxed">
                    <Icon name="check" className="mt-0.5 size-4 shrink-0 text-action" strokeWidth={2.2} />
                    {task}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </Block>

      <Block index="02" title="Free certificates and courses" lead="Everything here costs ₹0 to learn. Labels tell you exactly what is free.">
        <ul className="divide-y divide-border-subtle rounded-card border border-border-subtle">
          {track.resources.map((r) => (
            <li key={r.name} className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
              <span>
                <span className="block text-sm font-semibold">{r.name}</span>
                <span className="block text-xs text-content-muted">{r.provider}</span>
              </span>
              <span className={`w-fit shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${COST_STYLE[r.cost]}`}>{r.cost}</span>
            </li>
          ))}
        </ul>
      </Block>

      <Block index="03" title="Three portfolio projects">
        <ol className="grid gap-3 sm:grid-cols-3">
          {track.projects.map((project, i) => (
            <li key={project.title} className="print-block rounded-card border border-border-subtle p-5">
              <span className="font-mono text-xs font-bold text-action">P{i + 1}</span>
              <p className="mt-1 font-display text-base font-bold tracking-tight">{project.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-content-muted">{project.text}</p>
            </li>
          ))}
        </ol>
      </Block>

      <Block index="04" title="Job titles to search for" lead="Type these exactly into Naukri, Indeed, LinkedIn and Apna.">
        <ul className="flex flex-wrap gap-2">
          {track.jobTitles.map((title) => (
            <li key={title} className="rounded-full border border-border-strong bg-surface-raised px-3.5 py-1.5 text-sm font-medium">
              {title}
            </li>
          ))}
        </ul>
        <p className="mt-4 rounded-card bg-surface-accent p-4 text-sm leading-relaxed">{plan.firstMove}</p>
      </Block>

      <Block index="05" title="Your first pitch" lead="Fill in the brackets and send it. Short and specific wins.">
        <div className="relative">
          <pre className="print-block overflow-x-auto rounded-card bg-surface-inverse p-5 pr-24 font-sans text-sm leading-relaxed whitespace-pre-wrap text-content-inverse print:bg-transparent print:text-black print:ring-1 print:ring-black/20">
            {plan.pitch}
          </pre>
          <button
            type="button"
            onClick={copyPitch}
            className="no-print absolute top-3 right-3 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-white/20"
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </Block>

      <div className="no-print mt-10 rounded-card border border-border-subtle bg-surface-sunken p-6">
        <p className="font-mono text-[11px] font-bold tracking-[0.2em] text-content-muted uppercase">Want a trainer beside you?</p>
        <div className="mt-3 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-display text-lg font-bold tracking-tight">{course?.title ?? track.name}</p>
            {course && (
              <p className="mt-1 text-sm text-content-muted">
                {course.duration} · {course.fee}
              </p>
            )}
            {plan.alternate && (
              <p className="mt-2 text-sm text-content-muted">
                Also worth a look for your background:{" "}
                <Link href={`/courses/${plan.alternate.courseSlug}`} className="font-semibold text-action underline underline-offset-2">
                  {plan.alternate.name}
                </Link>
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href={`/courses/${track.courseSlug}`} className="inline-flex h-11 items-center gap-2 rounded-full bg-action px-5 text-sm font-semibold text-white transition-colors hover:bg-action-hover">
              View course <span aria-hidden="true">→</span>
            </Link>
            <button
              type="button"
              data-enquiry={course?.title ?? track.name}
              className="inline-flex h-11 items-center rounded-full border border-border-strong bg-surface-raised px-5 text-sm font-semibold transition-colors hover:border-action hover:text-action"
            >
              Book a free demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Note({ icon, title, text }: { icon: string; title: string; text: string }) {
  return (
    <div className="print-block flex gap-3 rounded-card border border-border-subtle p-4">
      <Icon name={icon} className="mt-0.5 size-5 shrink-0 text-action" />
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="mt-1 text-sm leading-relaxed text-content-muted">{text}</p>
      </div>
    </div>
  );
}

function Block({ index, title, lead, children }: { index: string; title: string; lead?: string; children: ReactNode }) {
  return (
    <section className="mt-10 border-t border-border-subtle pt-8">
      <p className="section-rule text-action">{index}</p>
      <h3 className="mt-2 font-display text-xl font-extrabold tracking-tight">{title}</h3>
      {lead && <p className="mt-1 text-sm text-content-muted">{lead}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}
