import Link from "next/link";

import { Icon } from "@/components/icon";
import { COURSES } from "@/lib/courses";
import { TEL_HREF } from "@/lib/site";

export default function CourseNotFound() {
  return (
    <div className="hero-surface on-inverse relative isolate overflow-hidden px-5 pt-32 pb-20 text-white">
      <div className="panel-glow pointer-events-none absolute inset-0 -z-10" />
      <div className="mx-auto max-w-3xl text-center">
        <p className="font-mono text-xs tracking-[0.18em] text-accent-yellow uppercase">Error 404</p>
        <h1 className="mt-4 font-display text-3xl leading-tight font-extrabold tracking-tight text-balance sm:text-4xl">
          We could not find that course page
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/70">
          The link may be out of date, or the course may have been renamed. Every course we currently run is listed below.
        </p>

        <ul className="mx-auto mt-10 grid max-w-2xl gap-2 text-left sm:grid-cols-2">
          {COURSES.map((course) => (
            <li key={course.slug}>
              <Link
                href={`/courses/${course.slug}`}
                className="flex items-center gap-3 rounded-card border border-white/15 bg-white/[0.06] px-4 py-3 text-sm font-medium transition-colors duration-200 hover:border-white/40 hover:bg-white/10"
              >
                <Icon name={course.icon} className="size-4 shrink-0 text-accent-yellow" />
                {course.shortTitle}
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/courses" className="inline-flex h-12 items-center justify-center rounded-full bg-accent-yellow px-7 font-semibold text-ink transition-colors hover:bg-white">
            Browse all courses
          </Link>
          <a href={TEL_HREF} className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/25 px-6 font-medium transition-colors hover:border-white/50 hover:bg-white/10">
            <Icon name="phone" className="size-4" />
            Call the helpline
          </a>
        </div>
      </div>
    </div>
  );
}
