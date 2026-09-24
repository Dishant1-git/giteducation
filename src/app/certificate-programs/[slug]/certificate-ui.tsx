"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, animate, motion, useInView, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";

import { openEnquiry } from "@/components/enquiry-modal";
import { Icon } from "@/components/icon";
import { TEL_HREF } from "@/lib/site";

/**
 * Interactive and scroll-driven parts of the certificate program pages.
 *
 * Styled with the site's semantic tokens (globals.css), so these pages share the
 * course pages' theme. Motion rules mirror src/components/motion.tsx: only
 * opacity/transform animate, scroll-linked values are springs, and
 * `prefers-reduced-motion` renders everything in its final state.
 */

const EASE = [0.16, 1, 0.3, 1] as const;
const SPRING = { stiffness: 140, damping: 30, mass: 0.4 };

/* ------------------------------------------------------------------ *
 * Hero parallax — content drifts up and fades as the hero scrolls away.
 * ------------------------------------------------------------------ */

export function HeroParallax({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useSpring(useTransform(scrollYProgress, [0, 1], [0, 110]), SPRING);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.25]);

  return (
    <div ref={ref} className={className}>
      <motion.div style={reduce ? undefined : { y, opacity }}>{children}</motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Entrance primitives.
 * ------------------------------------------------------------------ */

export function FadeIn({
  children,
  className,
  delay = 0,
  y = 24,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: "div" | "li" | "section" | "article" | "figure";
}) {
  const reduce = useReducedMotion();
  const Component = motion[as];
  return (
    <Component
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15, margin: "0px 0px -60px 0px" }}
      transition={{ duration: 0.55, delay, ease: EASE }}
    >
      {children}
    </Component>
  );
}

/** Scales in from slightly smaller — used for the certificate document. */
export function ScaleIn({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, scale: 0.92, rotate: -2 }}
      whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.9, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ *
 * Count-up number. The final value is in the HTML for crawlers / no-JS.
 * ------------------------------------------------------------------ */

export function CountUp({ value, decimals = 0, suffix = "" }: { value: number; decimals?: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!inView || reduce || !ref.current) return;
    const node = ref.current;
    const controls = animate(0, value, {
      duration: 0.9,
      ease: EASE,
      onUpdate: (latest) => {
        node.textContent = `${latest.toFixed(decimals)}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [inView, reduce, value, decimals, suffix]);

  return (
    <span ref={ref} className="tabular-nums">
      {`${value.toFixed(decimals)}${suffix}`}
    </span>
  );
}

/* ------------------------------------------------------------------ *
 * Curriculum timeline — the rail draws itself as you scroll through it.
 * ------------------------------------------------------------------ */

export type TimelineModule = { title: string; hours: string; topics: string[] };

export function ScrollTimeline({ modules }: { modules: TimelineModule[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const scaleY = useSpring(scrollYProgress, SPRING);
  const baseId = useId();
  const [open, setOpen] = useState<number[]>([0]);
  const allOpen = open.length === modules.length;

  const toggle = (index: number) => setOpen((current) => (current.includes(index) ? current.filter((i) => i !== index) : [...current, index]));

  return (
    <div>
      <div className="mb-5 flex justify-end">
        <button
          type="button"
          onClick={() => setOpen(allOpen ? [] : modules.map((_, i) => i))}
          className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border-subtle bg-surface-raised px-4 py-2 text-[13px] font-semibold text-content transition-colors duration-200 hover:border-action hover:text-action"
        >
          <Icon name={allOpen ? "check" : "download"} className="size-4" />
          {allOpen ? "Collapse all" : "Expand all"}
          <span className="sr-only"> curriculum modules</span>
        </button>
      </div>

      <ol ref={ref} className="relative space-y-3 pl-12 sm:pl-16">
        <span aria-hidden="true" className="absolute top-2 bottom-2 left-[19px] w-0.5 rounded-full bg-border-subtle sm:left-[27px]" />
        <motion.span
          aria-hidden="true"
          style={{ scaleY: reduce ? 1 : scaleY }}
          className="absolute top-2 bottom-2 left-[19px] w-0.5 origin-top rounded-full bg-action sm:left-[27px]"
        />

        {modules.map((module, index) => {
          const isOpen = open.includes(index);
          const headerId = `${baseId}-h-${index}`;
          const panelId = `${baseId}-p-${index}`;
          return (
            <FadeIn as="li" key={module.title} delay={Math.min(index * 0.05, 0.25)} className="relative">
              <span
                aria-hidden="true"
                className={`absolute top-3 -left-12 grid size-10 place-items-center rounded-full border font-mono text-xs font-bold transition-colors duration-300 sm:-left-16 sm:size-14 sm:text-sm ${
                  isOpen ? "border-action bg-action text-white shadow-raised" : "border-border-strong bg-surface-raised text-content-muted"
                }`}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <div
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
                    onClick={() => toggle(index)}
                    className="flex w-full cursor-pointer items-start gap-4 px-5 py-4 text-left sm:px-6 sm:py-5"
                  >
                    <span className="flex-1">
                      <span className={`block text-[15px] font-semibold tracking-tight text-balance sm:text-base ${isOpen ? "text-action" : "text-content"}`}>{module.title}</span>
                      <span className="mt-1 block text-xs text-content-muted">
                        {module.hours} · {module.topics.length} topics
                      </span>
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
                {/* Stays mounted so the syllabus is in the HTML; `inert` removes a closed panel from focus order. */}
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={headerId}
                  inert={!isOpen}
                  initial={false}
                  animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                  transition={reduce ? { duration: 0 } : { duration: 0.28, ease: EASE }}
                  className="overflow-hidden"
                >
                  <ul className="grid gap-2.5 border-t border-border-subtle px-5 py-5 sm:grid-cols-2 sm:px-6">
                    {module.topics.map((topic) => (
                      <li key={topic} className="flex items-start gap-2.5 text-sm leading-relaxed text-content-muted">
                        <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-action" />
                        {topic}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            </FadeIn>
          );
        })}
      </ol>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Assessment weight bar — grows to its value when scrolled into view.
 * ------------------------------------------------------------------ */

export function WeightBar({ weight, label }: { weight: number; label: string }) {
  const reduce = useReducedMotion();
  return (
    <span
      role="meter"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={weight}
      aria-label={`${label}: ${weight}% of the final mark`}
      className="block h-2 w-full overflow-hidden rounded-full bg-surface-sunken"
    >
      <motion.span
        className="block h-full origin-left rounded-full bg-action"
        style={{ width: `${weight}%` }}
        initial={reduce ? false : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.9, ease: EASE }}
      />
    </span>
  );
}

/* ------------------------------------------------------------------ *
 * Tools strip — rows slide in opposite directions as the section scrolls.
 * ------------------------------------------------------------------ */

export function ScrollMarquee({ rows }: { rows: string[][] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const forward = useTransform(scrollYProgress, [0, 1], ["4%", "-18%"]);
  const backward = useTransform(scrollYProgress, [0, 1], ["-18%", "4%"]);

  return (
    <div ref={ref} className="space-y-3 overflow-hidden py-2 [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
      {rows.map((row, index) => (
        <motion.ul key={index} style={reduce ? undefined : { x: index % 2 === 0 ? forward : backward }} className="flex w-max gap-3">
          {[...row, ...row].map((item, i) => (
            <li
              key={`${item}-${i}`}
              aria-hidden={i >= row.length ? true : undefined}
              className="rounded-full border border-border-subtle bg-surface-raised px-4 py-2 text-sm font-medium whitespace-nowrap text-content"
            >
              {item}
            </li>
          ))}
        </motion.ul>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Section index — sticky "On this page" list, same look as the course pages.
 * ------------------------------------------------------------------ */

export function SectionIndex({ sections }: { sections: { id: string; label: string }[] }) {
  const [active, setActive] = useState(sections[0]?.id ?? "");
  const activeRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
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

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "nearest", inline: "center" });
  }, [active]);

  return (
    <nav aria-label="On this page" className="no-print">
      <p className="section-rule mb-3 hidden text-content-muted lg:flex">On this page</p>
      <ul className="scroll-x flex gap-1 lg:block lg:space-y-0.5">
        {sections.map((section, index) => {
          const isActive = active === section.id;
          return (
            <li key={section.id} className="relative shrink-0">
              {isActive && (
                <motion.span
                  layoutId="certificate-index-active"
                  aria-hidden="true"
                  className="absolute inset-0 rounded-control bg-surface-accent"
                  transition={{ duration: 0.3, ease: EASE }}
                />
              )}
              <Link
                ref={isActive ? activeRef : undefined}
                href={`#${section.id}`}
                aria-current={isActive ? "true" : undefined}
                className={`relative flex items-center gap-2 rounded-control px-3 py-2 text-[13px] leading-snug whitespace-nowrap transition-colors duration-200 lg:whitespace-normal ${
                  isActive ? "font-semibold text-action" : "text-content-muted hover:bg-surface-sunken hover:text-content"
                }`}
              >
                <span className={`font-mono text-[10px] ${isActive ? "text-action" : "text-content-muted/70"}`}>{String(index + 1).padStart(2, "0")}</span>
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
 * FAQ accordion.
 * ------------------------------------------------------------------ */

export function FaqList({ items }: { items: [question: string, answer: string][] }) {
  const baseId = useId();
  const [open, setOpen] = useState<number | null>(0);
  const reduce = useReducedMotion();

  return (
    <ul className="space-y-3">
      {items.map(([question, answer], index) => {
        const isOpen = open === index;
        const headerId = `${baseId}-q-${index}`;
        const panelId = `${baseId}-a-${index}`;
        return (
          <li
            key={question}
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
                onClick={() => setOpen(isOpen ? null : index)}
                className="flex w-full cursor-pointer items-start gap-4 px-5 py-4 text-left sm:px-6 sm:py-5"
              >
                <span className="mt-0.5 font-mono text-xs text-content-muted">{String(index + 1).padStart(2, "0")}</span>
                <span className={`flex-1 text-[15px] font-semibold tracking-tight text-balance sm:text-base ${isOpen ? "text-action" : "text-content"}`}>{question}</span>
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
            <motion.div
              id={panelId}
              role="region"
              aria-labelledby={headerId}
              inert={!isOpen}
              initial={false}
              animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
              transition={reduce ? { duration: 0 } : { duration: 0.28, ease: EASE }}
              className="overflow-hidden"
            >
              <p className="border-t border-border-subtle px-5 py-5 text-sm leading-relaxed text-content-muted sm:px-6 sm:text-[15px]">{answer}</p>
            </motion.div>
          </li>
        );
      })}
    </ul>
  );
}

/* ------------------------------------------------------------------ *
 * Buttons
 * ------------------------------------------------------------------ */

const BUTTON_STYLES = {
  /** Yellow pill used on the dark hero, as on the course pages. */
  hero: "h-12 bg-accent-yellow px-7 text-ink hover:-translate-y-0.5 hover:bg-white",
  /** Solid brand button on light surfaces. */
  primary: "h-12 bg-action px-6 text-white hover:bg-action-hover",
  /** White pill inside a dark card. */
  light: "h-12 bg-white text-ink hover:bg-accent-yellow",
};

/** Opens the site-wide enquiry popup (course pre-selected from the page). */
export function EnquireButton({ children, variant = "hero", className = "" }: { children: ReactNode; variant?: keyof typeof BUTTON_STYLES; className?: string }) {
  return (
    <button
      type="button"
      onClick={openEnquiry}
      className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 ${BUTTON_STYLES[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="no-print inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-full border border-white/25 px-6 font-medium transition-colors duration-200 hover:border-white/50 hover:bg-white/10"
    >
      <Icon name="download" className="size-4" />
      Download syllabus
    </button>
  );
}

/* ------------------------------------------------------------------ *
 * Mobile action bar — appears once the hero CTAs have scrolled away.
 * `course-action-bar` lets the floating buttons and footer make room (globals.css).
 * ------------------------------------------------------------------ */

export function ActionBar({ title }: { title: string }) {
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
          transition={{ duration: 0.3, ease: EASE }}
          className="course-action-bar no-print fixed inset-x-0 bottom-0 z-40 border-t border-border-subtle bg-surface-raised/95 backdrop-blur-md lg:hidden"
        >
          <div className="flex items-center gap-3 px-4 py-3 pr-20">
            <p className="min-w-0 flex-1 text-[13px] leading-snug font-semibold">
              <span className="block truncate">{title}</span>
              <span className="block text-xs font-normal text-content-muted">Free demo class available</span>
            </p>
            <a
              href={TEL_HREF}
              className="grid size-11 shrink-0 place-items-center rounded-full border border-border-strong text-action transition-colors hover:bg-surface-accent"
            >
              <span className="sr-only">Call the institute</span>
              <Icon name="phone" className="size-5" />
            </a>
            <button
              type="button"
              onClick={openEnquiry}
              className="inline-flex h-11 shrink-0 cursor-pointer items-center rounded-full bg-action px-5 text-sm font-semibold text-white transition-colors hover:bg-action-hover"
            >
              Book demo
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
