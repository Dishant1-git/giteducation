import Link from "next/link";

import { Icon } from "@/components/icon";
import type { Course } from "@/lib/courses";

/** One course in a listing: the /courses index and the category pages. */
export function CourseCard({ course }: { course: Course }) {
  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group flex h-full flex-col rounded-card border border-border-subtle bg-surface-raised p-6 transition-all duration-200 hover:-translate-y-1 hover:border-action hover:shadow-card"
    >
      <span className="flex items-start justify-between gap-3">
        <span className="grid size-11 place-items-center rounded-xl bg-surface-accent text-action transition-colors duration-200 group-hover:bg-action group-hover:text-white">
          <Icon name={course.icon} className="size-5" />
        </span>
        <span className="rounded-full bg-surface-sunken px-2.5 py-1 text-[11px] font-semibold text-content-muted">{course.duration}</span>
      </span>

      <span className="mt-4 font-display text-lg leading-snug font-bold tracking-tight text-balance">{course.shortTitle}</span>
      <span className="mt-2 flex-1 text-sm leading-relaxed text-content-muted">{course.tagline}</span>

      <span className="mt-5 flex items-end justify-end gap-3 border-t border-border-subtle pt-4">
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-action">
          View course
          <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">
            →
          </span>
        </span>
      </span>
    </Link>
  );
}
