"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";

/**
 * Motion primitives used across the content pages.
 *
 * Rules these enforce so individual pages cannot break them:
 * - Every entrance animation is `once: true`. Content never re-animates on scroll-back.
 * - `prefers-reduced-motion` removes movement entirely; content renders in its final
 *   state rather than fading, so nothing is ever invisible without JS or with motion off.
 * - Animations only touch `opacity` and `transform`, which the compositor can run
 *   without layout or paint work.
 */

const EASE = [0.16, 1, 0.3, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

/** Single element that animates in the first time it enters the viewport. */
export function Reveal({
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
  as?: "div" | "section" | "li" | "article" | "header";
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

/** Container whose direct <Stagger.Item> children animate in sequence. */
export function Stagger({
  children,
  className,
  step = 0.07,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  step?: number;
  as?: "div" | "ul" | "ol" | "section";
}) {
  const reduce = useReducedMotion();
  const Component = motion[as];

  return (
    <Component
      className={className}
      initial={reduce ? false : "hidden"}
      whileInView="shown"
      viewport={{ once: true, amount: 0.1, margin: "0px 0px -60px 0px" }}
      variants={{ shown: { transition: { staggerChildren: step } } }}
    >
      {children}
    </Component>
  );
}

/** Child of <Stagger>. Inherits the parent's timing. */
export function StaggerItem({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "li" | "article";
}) {
  const Component = motion[as];
  return (
    <Component className={className} variants={fadeUp}>
      {children}
    </Component>
  );
}

/**
 * Heading whose words rise out of a clipping mask one after another, the first
 * time it scrolls into view. Each entry in `lines` renders on its own line.
 */
export function WordReveal({
  lines,
  className,
  as = "h2",
  step = 0.055,
}: {
  lines: string[];
  className?: string;
  as?: "h1" | "h2";
  step?: number;
}) {
  const reduce = useReducedMotion();
  const Component = motion[as];
  let index = 0;

  return (
    <Component
      className={className}
      initial={reduce ? false : "hidden"}
      whileInView="shown"
      viewport={{ once: true, amount: 0.4 }}
      aria-label={lines.join(" ")}
    >
      {lines.map((line) => (
        <span key={line} aria-hidden="true" className="block">
          {line.split(" ").map((word, i) => {
            const delay = index++ * step;
            return (
              <span key={`${word}-${i}`}>
                {i > 0 && " "}
                <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                  <motion.span
                    className="inline-block"
                    variants={{
                      hidden: { y: "110%" },
                      shown: { y: "0%", transition: { duration: 0.8, delay, ease: EASE } },
                    }}
                  >
                    {word}
                  </motion.span>
                </span>
              </span>
            );
          })}
        </span>
      ))}
    </Component>
  );
}

export { motion, useReducedMotion };
