import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CourseCard } from "@/components/course-card";
import { Icon } from "@/components/icon";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { CATALOGUE, categoryHref } from "@/lib/catalogue";
import { getCoursesByCategory } from "@/lib/cms";
import { SITE, TEL_HREF } from "@/lib/site";

/**
 * One main category of the catalogue, as its own local-search page:
 * /courses/category/cad-courses-in-jalandhar and so on.
 *
 * The four known categories are built ahead of time. Nothing here sets
 * `dynamicParams = false`: with it, a CMS save would leave these pages
 * answering a cached 404 until the next deploy. An unknown address is turned
 * away by notFound() instead.
 */

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return CATALOGUE.map((category) => ({ slug: category.slug }));
}

const findCategory = (slug: string) => CATALOGUE.find((category) => category.slug === slug);

/** "CAD / CAM, SolidWorks and Revit" — the category's main courses, as a phrase. */
function mainCourses(slug: string): string {
  const labels = (findCategory(slug)?.subCategories ?? []).flatMap((sub) => sub.courses.filter((course) => course.main).map((course) => course.label));
  return labels.length > 1 ? `${labels.slice(0, -1).join(", ")} and ${labels[labels.length - 1]}` : (labels[0] ?? "");
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = findCategory(slug);
  if (!category) return { title: "Category not found" };

  const description = `${category.pageTitle} at ${SITE.name}: ${mainCourses(slug)}. One computer per student, practical assignments and a certificate on completion.`;
  return {
    title: category.pageTitle,
    description,
    alternates: { canonical: categoryHref(category) },
    openGraph: { title: category.pageTitle, description, url: categoryHref(category), type: "website" },
  };
}

export default async function CourseCategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = findCategory(slug);
  if (!category) notFound();

  // The courses actually running: what the CMS has published, or the built-in set.
  const group = (await getCoursesByCategory()).find((g) => g.category === category.title);
  const subCategories = group?.subCategories ?? [];
  const courses = subCategories.flatMap((sub) => sub.courses);
  const url = `${SITE.url}${categoryHref(category)}`;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: category.pageTitle,
      url,
      itemListElement: courses.map((course, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: course.title,
        url: `${SITE.url}/courses/${course.slug}`,
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
        { "@type": "ListItem", position: 2, name: "Courses", item: `${SITE.url}/courses` },
        { "@type": "ListItem", position: 3, name: category.title, item: url },
      ],
    },
  ];

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header id="top" className="on-inverse hero-surface relative isolate overflow-hidden px-5 pt-28 pb-16 text-white sm:pt-32 lg:px-8 lg:pb-20">
        <div className="panel-glow pointer-events-none absolute inset-0 -z-10" />
        <div className="grid-overlay pointer-events-none absolute inset-0 -z-10 opacity-50" />
        <div className="mx-auto max-w-[1240px]">
          <nav aria-label="Breadcrumb" className="no-print">
            <ol className="flex flex-wrap items-center gap-2 text-[13px] text-white/60">
              <li>
                <Link href="/" className="transition-colors hover:text-accent-yellow">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/courses" className="transition-colors hover:text-accent-yellow">
                  Courses
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <span aria-current="page" className="text-white">
                  {category.title}
                </span>
              </li>
            </ol>
          </nav>

          <Reveal>
            <p className="mt-8 flex flex-wrap items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 font-semibold tracking-wide">
                <Icon name={category.icon} className="size-3.5" />
                {category.title}
              </span>
              <span className="rounded-full bg-accent-yellow px-3 py-1 font-semibold text-ink">
                {courses.length} {courses.length === 1 ? "course" : "courses"} running
              </span>
            </p>
            <h1 className="mt-5 max-w-3xl font-display text-[clamp(2rem,5vw,3.4rem)] leading-[1.05] font-extrabold tracking-[-0.03em] text-balance">{category.pageTitle}</h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/75 lg:text-lg">
              {category.blurb}, taught at {SITE.name}, {SITE.address.area}, {SITE.address.locality}. One computer per student, practical assignments in every class and a
              certificate on completion. Pick a course to see its full syllabus and batch timings.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/#contact" data-enquiry className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-accent-yellow px-7 font-semibold text-ink transition-all duration-200 hover:-translate-y-0.5 hover:bg-white">
                Book a free demo class
                <span aria-hidden="true">→</span>
              </Link>
              <a href={TEL_HREF} className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/25 bg-white/5 px-6 font-medium transition-colors duration-200 hover:border-white/50 hover:bg-white/10">
                <Icon name="phone" className="size-4" />
                Talk to a counsellor
              </a>
            </div>
          </Reveal>
        </div>
      </header>

      <div className="mx-auto max-w-[1240px] px-5 py-14 lg:px-8 lg:py-20">
        {subCategories.map((sub, subIndex) => (
          <section key={sub.title} aria-labelledby={`sub-${subIndex}`} className="border-t border-border-subtle pt-10 first:border-t-0 first:pt-0 [&:not(:first-child)]:mt-14">
            <Reveal>
              <p className="section-rule text-action">{category.title}</p>
              <h2 id={`sub-${subIndex}`} className="mt-3 font-display text-2xl font-extrabold tracking-[-0.02em] sm:text-3xl">
                {sub.title}
              </h2>
            </Reveal>

            <Stagger as="ul" className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {sub.courses.map((course) => (
                <StaggerItem as="li" key={course.slug}>
                  <CourseCard course={course} />
                </StaggerItem>
              ))}
            </Stagger>
          </section>
        ))}

        {/* The other categories */}
        <nav aria-labelledby="other-categories" className="mt-16 rounded-panel border border-border-subtle bg-surface-sunken p-6 sm:p-8">
          <h2 id="other-categories" className="font-display text-xl font-bold tracking-tight">
            More courses in {SITE.address.locality}
          </h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {CATALOGUE.filter((other) => other.slug !== category.slug).map((other) => (
              <li key={other.slug}>
                <Link
                  href={categoryHref(other)}
                  className="group flex h-full items-center gap-3 rounded-card border border-border-subtle bg-surface-raised px-4 py-3.5 text-sm font-semibold transition-colors duration-200 hover:border-action hover:text-action"
                >
                  <Icon name={other.icon} className="size-5 shrink-0 text-action" />
                  {other.pageTitle}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/courses"
                className="group flex h-full items-center gap-3 rounded-card border border-border-subtle bg-surface-raised px-4 py-3.5 text-sm font-semibold transition-colors duration-200 hover:border-action hover:text-action"
              >
                <Icon name="book" className="size-5 shrink-0 text-action" />
                All courses
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
