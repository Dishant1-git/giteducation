"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { Icon } from "@/components/icon";
import { TEL_HREF } from "@/lib/site";

/* ------------------------------------------------------------------ *
 * Section index — the sticky "contents" list used on long course pages.
 * ------------------------------------------------------------------ */

export function SectionNav({ sections }: { sections: { id: string; label: string }[] }) {
  const [active, setActive] = useState(sections[0]?.id ?? "");
  const activeRef = useRef<HTMLAnchorElement>(null);
  const tooFewSections = sections.length < 3;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // The heading nearest the top of the viewport wins, so the index never
        // flickers between two sections that are both partly visible.
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-120px 0px -65% 0px", threshold: 0 },
    );
    for (const section of sections) {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [sections]);

  // Keep the active item in view in the horizontal mobile index.
  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "nearest", inline: "center" });
  }, [active]);

  // An index of one or two entries is noise, not navigation.
  if (tooFewSections) return null;

  return (
    <nav aria-label="On this page" className="no-print">
      <p className="section-rule mb-3 hidden text-content-muted lg:flex">On this page</p>
      <ul className="scroll-x flex gap-1 lg:block lg:space-y-0.5">
        {sections.map((section, index) => {
          const isActive = active === section.id;
          return (
            <li key={section.id} className="shrink-0">
              <Link
                ref={isActive ? activeRef : undefined}
                href={`#${section.id}`}
                aria-current={isActive ? "true" : undefined}
                className={`relative flex items-center gap-2 rounded-control px-3 py-2 text-[13px] leading-snug whitespace-nowrap transition-colors duration-200 lg:whitespace-normal ${
                  isActive
                    ? "bg-surface-accent font-semibold text-action"
                    : "text-content-muted hover:bg-surface-sunken hover:text-content"
                }`}
              >
                <span className={`font-mono text-[10px] ${isActive ? "text-action" : "text-content-muted/70"}`}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                {section.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/* ------------------------------------------------------------------ *
 * Accordion — used for the curriculum and the FAQs.
 * ------------------------------------------------------------------ */

export type AccordionItem = {
  id: string;
  title: string;
  meta?: string;
  content: ReactNode;
};

export function Accordion({
  items,
  label,
  defaultOpenFirst = false,
  showExpandAll = false,
}: {
  items: AccordionItem[];
  /** Used for the "expand all" control's accessible name. */
  label: string;
  defaultOpenFirst?: boolean;
  showExpandAll?: boolean;
}) {
  const baseId = useId();
  const [open, setOpen] = useState<string[]>(defaultOpenFirst && items[0] ? [items[0].id] : []);
  const reduce = useReducedMotion();
  const allOpen = open.length === items.length;

  const toggle = (id: string) =>
    setOpen((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));

  return (
    <div>
      {showExpandAll && (
        <div className="mb-4 flex justify-end">
          <button
            type="button"
            onClick={() => setOpen(allOpen ? [] : items.map((item) => item.id))}
            className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border-subtle bg-surface-raised px-4 py-2 text-[13px] font-semibold text-content transition-colors duration-200 hover:border-action hover:text-action"
          >
            <Icon name={allOpen ? "check" : "download"} className="size-4" />
            {allOpen ? "Collapse all" : "Expand all"}
            <span className="sr-only"> {label}</span>
          </button>
        </div>
      )}

      <ul className="space-y-3">
        {items.map((item, index) => {
          const isOpen = open.includes(item.id);
          const headerId = `${baseId}-${index}-header`;
          const panelId = `${baseId}-${index}-panel`;
          return (
            <li
              key={item.id}
              className={`print-block overflow-hidden rounded-card border transition-colors duration-200 ${
                isOpen ? "border-border-strong bg-surface-raised shadow-card" : "border-border-subtle bg-surface-raised/70 hover:border-border-strong"
              }`}
            >
              <h3>
                <button
                  type="button"
                  id={headerId}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggle(item.id)}
                  className="flex w-full cursor-pointer items-start gap-4 px-5 py-4 text-left sm:px-6 sm:py-5"
                >
                  <span className="mt-0.5 font-mono text-xs text-content-muted">{String(index + 1).padStart(2, "0")}</span>
                  <span className="flex-1">
                    <span className={`block text-[15px] font-semibold tracking-tight text-balance sm:text-base ${isOpen ? "text-action" : "text-content"}`}>
                      {item.title}
                    </span>
                    {item.meta && <span className="mt-1 block text-xs text-content-muted">{item.meta}</span>}
                  </span>
                  <span
                    aria-hidden="true"
                    className={`grid size-8 shrink-0 place-items-center rounded-full font-mono text-sm transition-all duration-300 ${
                      isOpen ? "rotate-[135deg] bg-panel text-white" : "bg-surface-sunken text-content-muted"
                    }`}
                  >
                    +
                  </span>
                </button>
              </h3>
              {/* The panel stays mounted so its text is in the HTML for search
                  engines and for users without JavaScript. `inert` keeps a closed
                  panel out of the focus order and the accessibility tree. */}
              <motion.div
                id={panelId}
                role="region"
                aria-labelledby={headerId}
                inert={!isOpen}
                initial={false}
                animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                transition={reduce ? { duration: 0 } : { duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <div className="border-t border-border-subtle px-5 py-5 sm:px-6">{item.content}</div>
              </motion.div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Print / save-as-PDF. The page's print stylesheet drops the chrome, so the
 * browser's own dialog produces a clean syllabus handout.
 * ------------------------------------------------------------------ */

export function PrintButton({ className }: { className?: string }) {
  return (
    <button type="button" onClick={() => window.print()} className={className}>
      <Icon name="download" className="size-4" />
      Download syllabus
    </button>
  );
}

/* ------------------------------------------------------------------ *
 * Mobile action bar — appears once the hero CTAs have scrolled away.
 * ------------------------------------------------------------------ */

export function CourseActionBar({ courseTitle }: { courseTitle: string }) {
  const [visible, setVisible] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    let ticking = false;
    const update = () => {
      ticking = false;
      setVisible(window.scrollY > 640);
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

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={reduce ? { opacity: 0 } : { y: "100%" }}
          animate={reduce ? { opacity: 1 } : { y: 0 }}
          exit={reduce ? { opacity: 0 } : { y: "100%" }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="course-action-bar no-print fixed inset-x-0 bottom-0 z-40 border-t border-border-subtle bg-surface-raised/95 backdrop-blur-md lg:hidden"
        >
          <div className="flex items-center gap-3 px-4 py-3 pr-20">
            <p className="min-w-0 flex-1 text-[13px] leading-snug font-semibold">
              <span className="block truncate">{courseTitle}</span>
              <span className="block text-xs font-normal text-content-muted">Free demo class available</span>
            </p>
            <a
              href={TEL_HREF}
              className="grid size-11 shrink-0 place-items-center rounded-full border border-border-strong text-action transition-colors hover:bg-surface-accent"
            >
              <span className="sr-only">Call the institute</span>
              <Icon name="phone" className="size-5" />
            </a>
            <Link
              href="/#contact"
              className="inline-flex h-11 shrink-0 items-center rounded-full bg-action px-5 text-sm font-semibold text-white transition-colors hover:bg-action-hover"
            >
              Book demo
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
