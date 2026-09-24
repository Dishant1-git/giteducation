"use client";

import Link from "next/link";
import { useId, useMemo, useState } from "react";

export type FaqGroup = {
  id: string;
  label: string;
  /** Course page, linked under that tab. */
  href?: string;
  items: [question: string, answer: string][];
};

type Row = { key: string; q: string; a: string; from?: string };

export function FaqBrowser({ groups }: { groups: FaqGroup[] }) {
  const baseId = useId();
  const [active, setActive] = useState(groups[0]?.id ?? "");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<string | null>(`${groups[0]?.id}-0`);

  const term = query.trim().toLowerCase();
  const group = groups.find((g) => g.id === active) ?? groups[0];

  /** While searching, every tab is searched and each answer shows the tab it came from. */
  const rows = useMemo<Row[]>(() => {
    if (!term) return group.items.map(([q, a], i) => ({ key: `${group.id}-${i}`, q, a }));
    const seen = new Set<string>();
    const found: Row[] = [];
    for (const g of groups) {
      g.items.forEach(([q, a], i) => {
        if (seen.has(q) || !`${q} ${a}`.toLowerCase().includes(term)) return;
        seen.add(q);
        found.push({ key: `${g.id}-${i}`, q, a, from: g.label });
      });
    }
    return found;
  }, [term, group, groups]);

  const selectTab = (id: string) => {
    setActive(id);
    setOpen(`${id}-0`);
  };

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <label htmlFor={`${baseId}-search`} className="sr-only">
          Search the questions
        </label>
        <input
          id={`${baseId}-search`}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search: fees, certificate, timings…"
          className="h-12 w-full rounded-card border border-border-subtle bg-surface-raised px-4 text-sm outline-none transition-colors placeholder:text-content-muted focus:border-action sm:max-w-md"
        />
        <p className="font-mono text-xs text-content-muted" aria-live="polite">
          {term ? `${rows.length} ${rows.length === 1 ? "answer" : "answers"} found` : `${group.items.length} questions`}
        </p>
      </div>

      {!term && (
        <div role="tablist" aria-label="FAQ categories" className="mt-6 flex gap-2 overflow-x-auto border-b border-border-subtle pb-px">
          {groups.map((g) => {
            const selected = g.id === group.id;
            return (
              <button
                key={g.id}
                type="button"
                role="tab"
                id={`${baseId}-tab-${g.id}`}
                aria-selected={selected}
                aria-controls={`${baseId}-panel`}
                onClick={() => selectTab(g.id)}
                className={`inline-flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold whitespace-nowrap transition-colors ${
                  selected ? "border-action text-action" : "border-transparent text-content-muted hover:border-border-strong hover:text-content"
                }`}
              >
                {g.label}
                <span className="rounded-full bg-surface-sunken px-1.5 py-0.5 text-xs font-medium">{g.items.length}</span>
              </button>
            );
          })}
        </div>
      )}

      <div
        id={`${baseId}-panel`}
        role={term ? undefined : "tabpanel"}
        aria-labelledby={term ? undefined : `${baseId}-tab-${group.id}`}
        className="mt-8"
      >
        {rows.length === 0 ? (
          <p className="rounded-card border border-dashed border-border-strong p-8 text-center text-sm text-content-muted">
            No answer matches &ldquo;{query}&rdquo;. Try a shorter word, or call the centre and ask.
          </p>
        ) : (
          <ul className="grid gap-3 lg:gap-4">
            {rows.map(({ key, q, a, from }) => {
              const isOpen = open === key;
              return (
                <li
                  key={key}
                  className={`overflow-hidden rounded-card border transition-colors duration-300 ${
                    isOpen ? "border-border-strong bg-surface-raised shadow-card" : "border-border-subtle bg-surface-raised hover:border-border-strong"
                  }`}
                >
                  <h3>
                    <button
                      type="button"
                      id={`${baseId}-${key}-q`}
                      aria-expanded={isOpen}
                      aria-controls={`${baseId}-${key}-a`}
                      onClick={() => setOpen(isOpen ? null : key)}
                      className="flex w-full items-center gap-4 px-6 py-5 text-left lg:px-7"
                    >
                      <span className="flex-1">
                        {from && <span className="mb-1 block font-mono text-[11px] tracking-[0.14em] text-action uppercase">{from}</span>}
                        <span className="text-base font-semibold tracking-tight lg:text-[1.0625rem]">{q}</span>
                      </span>
                      <span
                        aria-hidden="true"
                        className={`grid size-8 shrink-0 place-items-center rounded-full font-mono text-sm transition-transform duration-300 ${
                          isOpen ? "rotate-45 bg-action text-white" : "bg-surface-sunken text-content-muted"
                        }`}
                      >
                        +
                      </span>
                    </button>
                  </h3>
                  <div
                    id={`${baseId}-${key}-a`}
                    role="region"
                    aria-labelledby={`${baseId}-${key}-q`}
                    className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-6 pb-6 text-sm leading-relaxed text-content-muted lg:px-7 lg:text-[0.9375rem]">{a}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {!term && group.href && (
          <Link href={group.href} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-action hover:underline">
            See the full {group.label} course page <span aria-hidden="true">→</span>
          </Link>
        )}
      </div>
    </div>
  );
}
