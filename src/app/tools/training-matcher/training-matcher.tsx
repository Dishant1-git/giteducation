"use client";

import Link from "next/link";
import { useState } from "react";

import { Icon } from "@/components/icon";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { BRANCHES, DELIVERABLES, TRACKS, UNIVERSITIES, formatFor, type BranchId } from "@/lib/training-matcher";

const EASE = [0.16, 1, 0.3, 1] as const;

export function TrainingMatcher() {
  const [universityId, setUniversityId] = useState(UNIVERSITIES[0].id);
  const [branchId, setBranchId] = useState<BranchId>(BRANCHES[0].id);
  const [semester, setSemester] = useState(5);
  const reduce = useReducedMotion();

  const university = UNIVERSITIES.find((u) => u.id === universityId) ?? UNIVERSITIES[0];
  const branch = BRANCHES.find((b) => b.id === branchId) ?? BRANCHES[0];
  // A diploma has fewer semesters; keep the chosen semester in range.
  const sem = Math.min(semester, university.semesters);
  const format = formatFor(sem, university.semesters);
  const tracks = branch.tracks.map((id) => TRACKS[id]);
  const matchKey = `${branch.id}-${format.title}`;

  return (
    <div className="space-y-10">
      <div className="rounded-panel border border-border-subtle bg-surface-raised p-5 shadow-card sm:p-7">
        <StepLabel index={1}>Select your university or board</StepLabel>
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5">
          {UNIVERSITIES.map((u) => {
            const active = u.id === universityId;
            return (
              <button
                key={u.id}
                type="button"
                aria-pressed={active}
                onClick={() => setUniversityId(u.id)}
                className={`flex items-center justify-between gap-2 rounded-control border p-3 text-left text-xs font-semibold transition-all duration-200 sm:text-sm ${
                  active ? "border-action bg-surface-accent text-action shadow-card" : "border-border-subtle bg-surface-raised text-content-muted hover:border-action/30 hover:bg-surface-sunken"
                }`}
              >
                <span>{u.name}</span>
                {active && <Icon name="check" className="size-3.5 shrink-0" strokeWidth={2.6} />}
              </button>
            );
          })}
        </div>

        <StepLabel index={2} className="mt-7">
          Select your branch or stream
        </StepLabel>
        <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
          {BRANCHES.map((b) => {
            const active = b.id === branchId;
            return (
              <button
                key={b.id}
                type="button"
                aria-pressed={active}
                onClick={() => setBranchId(b.id)}
                className={`flex items-center gap-3 rounded-control border p-3.5 text-left transition-all duration-200 ${
                  active ? "border-action bg-surface-accent shadow-card" : "border-border-subtle bg-surface-raised hover:border-action/30 hover:bg-surface-sunken"
                }`}
              >
                <span className={`grid size-10 shrink-0 place-items-center rounded-lg transition-colors ${active ? "bg-action text-white" : "bg-surface-sunken text-content-muted"}`}>
                  <Icon name={b.icon} className="size-5" />
                </span>
                <span className="text-xs leading-tight font-bold sm:text-sm">{b.name}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-7 flex items-center justify-between">
          <StepLabel index={3}>Choose your current semester</StepLabel>
          <span className="text-xs font-semibold text-action">Semester {sem}</span>
        </div>
        <div className={`mt-3 grid gap-2 ${university.semesters === 6 ? "grid-cols-3 sm:grid-cols-6" : "grid-cols-4 sm:grid-cols-8"}`}>
          {Array.from({ length: university.semesters }, (_, i) => i + 1).map((n) => {
            const active = n === sem;
            return (
              <button
                key={n}
                type="button"
                aria-pressed={active}
                onClick={() => setSemester(n)}
                className={`rounded-control border py-2.5 text-center text-xs font-bold transition-all duration-200 sm:text-sm ${
                  active ? "border-action bg-action text-white shadow-raised" : "border-border-subtle bg-surface-raised text-content-muted hover:border-action/30"
                }`}
              >
                Sem {n}
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={matchKey}
          initial={reduce ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? undefined : { opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease: EASE }}
          className="space-y-10"
          aria-live="polite"
        >
          <div className="relative overflow-hidden rounded-panel border border-action/20 bg-linear-to-r from-surface-accent via-surface-raised to-surface-raised p-6 shadow-card sm:p-7">
            <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
              <div>
                <p className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md border border-action/20 bg-action/10 px-2.5 py-0.5 text-[10px] font-bold tracking-[0.12em] text-action uppercase">{format.label}</span>
                  <span className="text-xs text-content-muted">Semester {sem} match</span>
                </p>
                <h2 className="mt-2 font-display text-xl font-extrabold tracking-tight sm:text-2xl">{format.title}</h2>
                <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-content-muted">{format.text}</p>
              </div>
              <div className="shrink-0 rounded-card border border-border-subtle bg-surface-raised px-4 py-3 text-center shadow-card">
                <span className="block text-[10px] tracking-[0.12em] text-content-muted uppercase">Duration</span>
                <span className="mt-0.5 block text-sm font-bold text-action">{format.duration}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-display text-lg font-bold tracking-tight sm:text-xl">Matched project tracks for {branch.name}</h3>
            <p className="mt-1 text-sm text-content-muted">
              For {university.name}. Confirm your department&apos;s exact training rules with your guide; we match the report to them.
            </p>

            <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {tracks.map((track) => (
                <li key={track.id} className="group flex flex-col justify-between rounded-card border border-border-subtle bg-surface-raised p-6 transition-all duration-300 hover:-translate-y-1 hover:border-action/30 hover:shadow-raised">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <span className="rounded-md border border-border-subtle bg-surface-sunken px-2.5 py-0.5 text-[10px] font-bold text-content-muted uppercase">{track.tag}</span>
                      <span className="flex items-center gap-1 text-xs font-medium text-action">
                        <Icon name="clock" className="size-3.5" />
                        {format.duration}
                      </span>
                    </div>
                    <h4 className="font-display text-base font-bold tracking-tight transition-colors group-hover:text-action sm:text-lg">{track.title}</h4>
                    <p className="text-sm leading-relaxed text-content-muted">{track.text}</p>
                    <div>
                      <span className="text-[10px] font-bold tracking-[0.14em] text-content-muted uppercase">Tools you will use</span>
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {track.stack.map((tool) => (
                          <span key={tool} className="rounded-md border border-border-subtle bg-surface-sunken px-2 py-0.5 text-[11px] font-medium text-content-muted">
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="border-t border-border-subtle pt-3">
                      <span className="text-[10px] font-bold tracking-[0.14em] text-content-muted uppercase">You walk out with</span>
                      <ul className="mt-1.5 space-y-1">
                        {[track.outcome, "Training certificate", "Project report & synopsis"].map((item) => (
                          <li key={item} className="flex items-center gap-1.5 text-xs">
                            <Icon name="check" className="size-3.5 shrink-0 text-action" strokeWidth={2.4} />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="mt-6 flex flex-col gap-2">
                    <button
                      type="button"
                      data-enquiry={`${format.title} – ${track.enquiryName}`}
                      className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-control bg-action text-sm font-semibold text-white transition-colors hover:bg-action-hover"
                    >
                      <Icon name="download" className="size-4" />
                      Get syllabus &amp; batch dates
                    </button>
                    <Link
                      href={track.courseSlug ? `/courses/${track.courseSlug}` : "/courses"}
                      className="text-center text-xs font-semibold text-content-muted transition-colors hover:text-action"
                    >
                      See the full course →
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="rounded-panel border border-border-subtle bg-surface-raised p-6 shadow-card sm:p-7">
        <div className="flex items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-control bg-surface-accent text-action">
            <Icon name="document" className="size-5" />
          </span>
          <div>
            <h3 className="font-display text-lg font-bold tracking-tight">University paperwork, handled</h3>
            <p className="mt-1 text-sm text-content-muted">Every track includes the documents your college asks for at the end of training.</p>
          </div>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {DELIVERABLES.map((d) => (
            <div key={d.title} className="flex items-start gap-2.5 rounded-control border border-border-subtle bg-surface-sunken p-4">
              <Icon name="check" className="mt-0.5 size-4 shrink-0 text-action" strokeWidth={2.4} />
              <div>
                <p className="text-sm font-bold">{d.title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-content-muted">{d.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StepLabel({ index, children, className = "" }: { index: number; children: string; className?: string }) {
  return (
    <p className={`text-[10px] font-bold tracking-[0.14em] text-content-muted uppercase ${className}`}>
      {index}. {children}
    </p>
  );
}
