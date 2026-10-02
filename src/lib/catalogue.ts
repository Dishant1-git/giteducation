/**
 * How the course catalogue is organised: four main categories, each split into
 * sub-categories.
 *
 * This file is the one place that decides which category and sub-category a
 * course sits in, which courses the navbar lists, and which old course
 * addresses now redirect. It imports nothing, so the header, the footer and
 * next.config.ts can all read it without pulling in the course copy.
 */

export type CatalogueCourse = {
  label: string;
  slug: string;
  /** Listed in the Courses dropdown. The rest are reached from /courses. */
  main?: boolean;
  badge?: string;
};

export type CatalogueCategory = {
  /** Address of the category page: /courses/category/[slug]. */
  slug: string;
  title: string;
  blurb: string;
  /** Key in `lineIcons` (src/lib/site.ts). */
  icon: string;
  subCategories: { title: string; courses: CatalogueCourse[] }[];
};

export const CATALOGUE: CatalogueCategory[] = [
  {
    slug: "cad-courses-in-jalandhar",
    title: "CADD & Design",
    blurb: "Mechanical, architectural and structural design software",
    icon: "cube",
    subCategories: [
      {
        title: "Mechanical CAD / CAM",
        courses: [
          { label: "CAD / CAM", slug: "cad-cam-course-in-jalandhar", main: true },
          { label: "SolidWorks", slug: "solidworks-course-in-jalandhar", main: true },
          { label: "CNC Programming", slug: "cnc-programming-course-in-jalandhar", main: true },
          { label: "SolidCAM", slug: "solidcam-course-in-jalandhar" },
          { label: "WorkNC", slug: "worknc-course-in-jalandhar" },
        ],
      },
      {
        title: "Architecture & Interior",
        courses: [
          { label: "Revit", slug: "revit-course-in-jalandhar", main: true },
          { label: "3ds Max", slug: "3ds-max-course-in-jalandhar", main: true },
          { label: "SketchUp", slug: "sketchup-course-in-jalandhar" },
        ],
      },
      {
        title: "Civil & Structural",
        courses: [
          { label: "STAAD Pro", slug: "staad-pro-course-in-jalandhar", main: true },
          { label: "ETABS", slug: "etabs-course-in-jalandhar" },
        ],
      },
    ],
  },
  {
    slug: "basic-computer-courses-in-jalandhar",
    title: "Basic Computer Courses",
    blurb: "Computer basics, office software and typing",
    icon: "monitor",
    subCategories: [
      {
        title: "Computer Basics & Office",
        courses: [
          { label: "Basic Computer", slug: "basic-computer-course-in-jalandhar", main: true },
          { label: "MS Office", slug: "ms-office-course-in-jalandhar", main: true },
          { label: "Advance Excel", slug: "advance-excel-course-in-jalandhar", main: true },
          { label: "Google Workspace", slug: "google-workspace-course-in-jalandhar" },
          { label: "CAT Pro", slug: "cat-pro-course-in-jalandhar" },
        ],
      },
      {
        title: "Typing",
        courses: [
          { label: "Punjabi Typing", slug: "punjabi-typing-course-in-jalandhar", main: true },
          { label: "English Typing", slug: "english-typing-course-in-jalandhar", main: true },
        ],
      },
    ],
  },
  {
    slug: "web-graphics-digital-marketing-courses-in-jalandhar",
    title: "Web, Graphics & Digital Marketing",
    blurb: "Websites, design software and online promotion",
    icon: "megaphone",
    subCategories: [
      {
        title: "Digital Marketing",
        courses: [
          { label: "Digital Marketing", slug: "digital-marketing-course-in-jalandhar", main: true },
          { label: "SEO", slug: "seo-course-in-jalandhar", main: true },
          { label: "SMO", slug: "smo-course-in-jalandhar" },
          { label: "Google Ads", slug: "google-ads-course-in-jalandhar" },
          { label: "Meta Ads", slug: "meta-ads-course-in-jalandhar" },
        ],
      },
      {
        title: "Web Designing",
        courses: [
          { label: "Web Designing", slug: "web-designing-course-in-jalandhar", main: true },
          { label: "WordPress", slug: "wordpress-course-in-jalandhar", main: true },
        ],
      },
      {
        title: "Graphic Designing",
        courses: [
          { label: "Graphic Designing", slug: "graphic-designing-course-in-jalandhar", main: true },
          { label: "Illustrator", slug: "illustrator-course-in-jalandhar" },
        ],
      },
    ],
  },
  {
    slug: "tally-accounting-courses-in-jalandhar",
    title: "Tally & Accounting",
    blurb: "Tally, GST billing and accounting software",
    icon: "receipt",
    subCategories: [
      {
        title: "Tally",
        courses: [
          { label: "Tally Prime", slug: "tally-prime-course-in-jalandhar", main: true },
          { label: "Tally ERP-9", slug: "tally-erp9-course-in-jalandhar", main: true },
        ],
      },
      {
        title: "Accounting Software",
        courses: [{ label: "QuickBooks", slug: "quickbooks-course-in-jalandhar", main: true }],
      },
    ],
  },
];

/** Where a course sits, by slug. Undefined for a course the catalogue does not know. */
export function placeOf(slug: string): { category: string; subCategory: string } | undefined {
  for (const category of CATALOGUE) {
    for (const sub of category.subCategories) {
      if (sub.courses.some((course) => course.slug === slug)) return { category: category.title, subCategory: sub.title };
    }
  }
  return undefined;
}

/** Sub-category for a course the catalogue does not place — one added in the CMS. */
export const OTHER_SUB_CATEGORY = "More courses";

/**
 * Courses the institute no longer runs: the AI, data, cloud and
 * programming-language courses. Each old address redirects to the page beside
 * it, and the course is left out of the catalogue even if the CMS still has it
 * published.
 */
export const WITHDRAWN_COURSES: Record<string, string> = {
  "artificial-intelligence-course-in-jalandhar": "/courses",
  "generative-ai-course-in-jalandhar": "/courses",
  "core-python-course-in-jalandhar": "/courses",
  "web-development-with-python-course-in-jalandhar": "/courses/web-designing-course-in-jalandhar",
};
