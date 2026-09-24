"use client";

import Link from "next/link";
import { useId, useState } from "react";

import { Icon } from "@/components/icon";
import { LEVELS, LOCATIONS, ROLES, estimate, formatK, formatLakh, type Option } from "@/lib/salary-estimator";

export function SalaryEstimator() {
  const [roleId, setRoleId] = useState(ROLES[0].id);
  const [locationId, setLocationId] = useState(LOCATIONS[0].id);
  const [levelId, setLevelId] = useState(LEVELS[0].id);
  const [skills, setSkills] = useState<string[]>([]);
  const selectId = useId();

  const role = ROLES.find((r) => r.id === roleId) ?? ROLES[0];
  const location = LOCATIONS.find((l) => l.id === locationId) ?? LOCATIONS[0];
  const level = LEVELS.find((l) => l.id === levelId) ?? LEVELS[0];
  const skillCount = skills.filter((s) => role.skills.some((rs) => rs.id === s)).length;

  const [min, max] = estimate(role, location.factor, level.factor, skillCount);
  const growth = LEVELS.map((l) => ({ level: l, range: estimate(role, location.factor, l.factor, skillCount) }));
  const chartMax = growth[growth.length - 1].range[1];

  function changeRole(id: string) {
    setRoleId(id);
    setSkills([]); // Skills are role-specific; stale ticks would inflate the new role's estimate.
  }

  function toggleSkill(id: string) {
    setSkills((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-start">
      {/* Inputs */}
      <form className="space-y-7 rounded-panel border border-border-subtle bg-surface-raised p-6 shadow-card sm:p-8" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label htmlFor={selectId} className="text-sm font-semibold">
            Role you are aiming for
          </label>
          <div className="relative mt-2">
            <select
              id={selectId}
              value={roleId}
              onChange={(e) => changeRole(e.target.value)}
              className="h-12 w-full appearance-none rounded-control border border-border-strong bg-surface-raised pr-10 pl-4 text-sm font-medium transition-colors hover:border-action"
            >
              {ROLES.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.title}
                </option>
              ))}
            </select>
            <span aria-hidden="true" className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-content-muted">
              ▾
            </span>
          </div>
        </div>

        <RadioGroup legend="Where you will work" name="location" options={LOCATIONS} value={locationId} onChange={setLocationId} />
        <RadioGroup legend="Your experience" name="level" options={LEVELS} value={levelId} onChange={setLevelId} columns={4} />

        <fieldset>
          <legend className="text-sm font-semibold">Skills you can prove</legend>
          <p className="mt-1 text-xs text-content-muted">Each one typically adds about 8% at interview.</p>
          <div className="mt-3 space-y-2">
            {role.skills.map((skill) => {
              const checked = skills.includes(skill.id);
              return (
                <label
                  key={skill.id}
                  className={`flex cursor-pointer items-center gap-3 rounded-control border px-4 py-3 text-sm transition-colors has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-focus ${
                    checked ? "border-action bg-surface-accent" : "border-border-subtle hover:border-action/40 hover:bg-surface-sunken"
                  }`}
                >
                  <input type="checkbox" checked={checked} onChange={() => toggleSkill(skill.id)} className="size-4 shrink-0 accent-[var(--color-action)]" />
                  {skill.label}
                </label>
              );
            })}
          </div>
        </fieldset>
      </form>

      {/* Result */}
      <section aria-labelledby="estimate-heading" className="lg:sticky lg:top-28">
        <div className="on-inverse overflow-hidden rounded-panel bg-surface-inverse text-content-inverse shadow-overlay">
          <div className="relative isolate p-6 sm:p-8">
            <div className="panel-glow pointer-events-none absolute inset-0 -z-10 opacity-70" />
            <p id="estimate-heading" className="font-mono text-[11px] font-bold tracking-[0.2em] text-accent-yellow uppercase">
              Estimated monthly salary
            </p>
            <p className="mt-3 font-display text-[clamp(2rem,6vw,3rem)] leading-none font-extrabold tracking-tight" aria-live="polite">
              {formatK(min)} <span className="text-content-inverse-muted">–</span> {formatK(max)}
            </p>
            <p className="mt-3 text-sm text-content-inverse-muted">
              About {formatLakh(min)}–{formatLakh(max)} a year · {role.title} · {location.label} · {level.label}
            </p>
          </div>

          <div className="border-t border-border-inverse p-6 sm:p-8">
            <h3 className="text-sm font-semibold">How this role grows with experience</h3>
            <p className="mt-1 text-xs text-content-inverse-muted">Monthly range in {location.label}, with the skills you ticked.</p>
            <ul className="mt-5 space-y-3">
              {growth.map(({ level: l, range }) => {
                const current = l.id === level.id;
                return (
                  <li key={l.id} className="grid grid-cols-[5.5rem_minmax(0,1fr)] items-center gap-3 sm:grid-cols-[6.5rem_minmax(0,1fr)_9.5rem]">
                    <span className={`text-xs ${current ? "font-bold text-content-inverse" : "text-content-inverse-muted"}`}>{l.label}</span>
                    <span className="relative h-3 rounded-full bg-white/10" title={`${l.label}: ${formatK(range[0])} – ${formatK(range[1])} a month`}>
                      <span
                        className={`absolute inset-y-0 rounded-full transition-all duration-500 ${current ? "bg-accent-yellow" : "bg-brand-400"}`}
                        style={{ left: `${(range[0] / chartMax) * 100}%`, right: `${100 - (range[1] / chartMax) * 100}%` }}
                      />
                    </span>
                    <span className={`col-start-2 text-xs tabular-nums sm:col-start-auto sm:text-right ${current ? "font-bold" : "text-content-inverse-muted"}`}>
                      {formatK(range[0])}–{formatK(range[1])}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="mt-4 rounded-panel border border-border-subtle bg-surface-raised p-6 shadow-card">
          <p className="text-sm font-semibold">Job titles to search for</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {role.jobTitles.map((t) => (
              <li key={t} className="rounded-full border border-border-strong px-3 py-1 text-xs font-medium">
                {t}
              </li>
            ))}
          </ul>
          <div className="mt-5 flex flex-col gap-2 border-t border-border-subtle pt-5 sm:flex-row">
            <Link
              href={`/courses/${role.courseSlug}`}
              className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-action px-5 text-sm font-semibold text-white transition-colors hover:bg-action-hover"
            >
              See the {role.courseName} course <span aria-hidden="true">→</span>
            </Link>
            <button
              type="button"
              data-enquiry={role.courseName}
              className="inline-flex h-11 flex-1 items-center justify-center rounded-full border border-border-strong px-5 text-sm font-semibold transition-colors hover:border-action hover:text-action"
            >
              Ask a counsellor
            </button>
          </div>
        </div>

        <p className="mt-4 flex gap-2 text-xs leading-relaxed text-content-muted">
          <Icon name="document" className="mt-0.5 size-4 shrink-0" />
          Indicative in-hand ranges from common job posts for these roles. Actual offers depend on the employer, your interview and your portfolio. Use this
          to plan, not as a promise.
        </p>
      </section>
    </div>
  );
}

function RadioGroup({
  legend,
  name,
  options,
  value,
  onChange,
  columns = 2,
}: {
  legend: string;
  name: string;
  options: Option[];
  value: string;
  onChange: (id: string) => void;
  columns?: 2 | 4;
}) {
  return (
    <fieldset>
      <legend className="text-sm font-semibold">{legend}</legend>
      <div className={`mt-3 grid gap-2 ${columns === 4 ? "grid-cols-2 sm:grid-cols-4" : "sm:grid-cols-2"}`}>
        {options.map((o) => {
          const checked = o.id === value;
          return (
            <label
              key={o.id}
              className={`flex cursor-pointer flex-col rounded-control border px-4 py-3 transition-colors has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-focus ${
                checked ? "border-action bg-surface-accent" : "border-border-subtle hover:border-action/40 hover:bg-surface-sunken"
              }`}
            >
              <input type="radio" name={name} value={o.id} checked={checked} onChange={() => onChange(o.id)} className="sr-only" />
              <span className={`text-sm font-semibold ${checked ? "text-action" : ""}`}>{o.label}</span>
              <span className="text-xs text-content-muted">{o.hint}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
