import "server-only";

import { cache } from "react";

import { POSTS, type BlogPost } from "@/lib/blog";
import { OTHER_SUB_CATEGORY, WITHDRAWN_COURSES, placeOf } from "@/lib/catalogue";
import { COMMON_FAQS, COURSES, groupCourses, type Course, type CourseGroup } from "@/lib/courses";
import { EVENTS, type EventItem } from "@/lib/events";
import { GENERAL_FAQS } from "@/lib/faq";
import { PHOTOS, type GalleryPhoto } from "@/lib/gallery";
import { REVIEWS, type StudentReview } from "@/lib/reviews";

/**
 * The website's reading side of the CMS (cms-techcadd/).
 *
 * Every function here answers with the CMS's published content when the CMS
 * has some, and with the built-in content in `src/lib/*.ts` when it does not —
 * because CMS_API_URL is unset, the API is down, or that module is still empty.
 * So the site never renders a blank section for a reason a visitor cannot see,
 * and it builds and runs with no CMS at all.
 *
 * Reads are cached and tagged. The CMS calls POST /api/revalidate after every
 * save, which drops the tag, so an edit shows on the next page view rather
 * than when the cache window below runs out.
 */

/** Dropped by /api/revalidate. One tag: any save may touch several listings. */
export const CMS_TAG = "cms";

/** The fallback refresh, for when the revalidate call never arrives. */
const REVALIDATE_SECONDS = 300;

const API_URL = process.env.CMS_API_URL?.replace(/\/$/, "");

/** Where uploaded files are served from, as a browser reaches it. */
const MEDIA_URL = (process.env.NEXT_PUBLIC_CMS_URL ?? process.env.CMS_API_URL ?? "").replace(/\/$/, "");

/** Uploaded files come back as `/uploads/…`, relative to the CMS. */
const mediaUrl = (url: string | undefined) => (url ? (/^https?:\/\//.test(url) ? url : `${MEDIA_URL}${url}`) : undefined);

async function cmsGet<T>(path: string): Promise<T | null> {
  if (!API_URL) return null;
  try {
    const response = await fetch(`${API_URL}/api/public${path}`, {
      next: { tags: [CMS_TAG], revalidate: REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    // Unreachable or slow: the caller falls back to the built-in content.
    return null;
  }
}

type List<T> = { items: T[] };
type CmsMedia = { url: string; alt?: string };

/* ---------------------------------------------------------------- *
 * Blog
 * ---------------------------------------------------------------- */

type CmsBlog = {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  categoryName?: string;
  tags: string[];
  coverImage?: CmsMedia;
  publishDate?: string;
  createdAt: string;
};

const FALLBACK_POST_IMAGE = "/images/categories/office.jpg";

/**
 * Editor-written HTML, with the things a blog post never needs taken out.
 *
 * The body comes from signed-in staff, not from visitors, so this is a second
 * line rather than the only one: it stops a pasted embed or a compromised
 * editor account from running script on the public site.
 */
function cleanHtml(html: string): string {
  return html
    .replace(/<\s*(script|style|iframe|object|embed|form)[\s\S]*?<\s*\/\s*\1\s*>/gi, "")
    .replace(/<\s*(script|style|iframe|object|embed|form|link|meta)\b[^>]*>/gi, "")
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/(href|src)\s*=\s*("|')\s*javascript:[^"']*\2/gi, '$1="#"')
    .replace(/src\s*=\s*("|')(\/uploads\/[^"']*)\1/gi, (_match, quote: string, path: string) => `src=${quote}${MEDIA_URL}${path}${quote}`);
}

const wordCount = (html: string) => html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;

function toPost(blog: CmsBlog, courses: Course[]): BlogPost {
  // The CMS has no "related course" field. A post that came from the built-in
  // set keeps its link; a new one is matched on its first tag.
  const builtIn = POSTS.find((p) => p.slug === blog.slug);
  const tagged = courses.find((c) => blog.tags.some((tag) => tag.toLowerCase() === c.shortTitle.toLowerCase()));

  return {
    slug: blog.slug,
    title: blog.title,
    excerpt: blog.excerpt,
    category: blog.categoryName ?? "Blog",
    date: (blog.publishDate ?? blog.createdAt).slice(0, 10),
    // A built-in post keeps the reading time it was published with; a new one is estimated.
    readMinutes: builtIn?.readMinutes ?? Math.max(1, Math.round(wordCount(`${blog.excerpt} ${blog.body}`) / 200)),
    image: mediaUrl(blog.coverImage?.url) ?? builtIn?.image ?? FALLBACK_POST_IMAGE,
    courseSlug: builtIn?.courseSlug ?? tagged?.slug ?? "",
    courseName: builtIn?.courseName ?? tagged?.shortTitle ?? "",
    sections: [],
    html: cleanHtml(blog.body),
  };
}

/** Blog posts, newest first. */
export const getPosts = cache(async (): Promise<BlogPost[]> => {
  const data = await cmsGet<List<CmsBlog>>("/blogs?limit=200");
  if (!data?.items.length) return POSTS;
  const courses = await getCourses();
  return data.items.map((blog) => toPost(blog, courses));
});

export async function getPost(slug: string): Promise<BlogPost | undefined> {
  return (await getPosts()).find((post) => post.slug === slug);
}

/* ---------------------------------------------------------------- *
 * Events
 * ---------------------------------------------------------------- */

type CmsEvent = {
  slug: string;
  title: string;
  eventType: string;
  summary: string;
  coverImage?: CmsMedia;
  startsOn: string;
  endsOn?: string;
  startTime?: string;
  endTime?: string;
  tags: string[];
};

const EVENT_KINDS: Record<string, string> = {
  seminar: "Seminar",
  workshop: "Workshop",
  "demo-class": "Demo class",
  webinar: "Webinar",
  bootcamp: "Bootcamp",
  "guest-lecture": "Guest lecture",
  orientation: "Orientation",
  hackathon: "Hackathon",
};

/** "16:00" → "4:00 PM". */
function clock(time: string): string {
  const [hours, minutes] = time.split(":").map(Number);
  return `${hours % 12 || 12}:${String(minutes).padStart(2, "0")} ${hours < 12 ? "AM" : "PM"}`;
}

/** Today's date in India, as yyyy-mm-dd, whatever timezone the server runs in. */
const todayInIndia = () => new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });

/** Upcoming events, soonest first. One that has ended drops off the page. */
export const getEvents = cache(async (): Promise<EventItem[]> => {
  const data = await cmsGet<List<CmsEvent>>("/events?limit=200");
  if (!data?.items.length) return EVENTS;

  const today = todayInIndia();
  return data.items
    .filter((event) => (event.endsOn ?? event.startsOn).slice(0, 10) >= today)
    .sort((a, b) => a.startsOn.localeCompare(b.startsOn))
    .map((event) => ({
      id: event.slug,
      title: event.title,
      kind: EVENT_KINDS[event.eventType] ?? "Event",
      date: event.startsOn.slice(0, 10),
      time: event.startTime ? [event.startTime, event.endTime].filter(Boolean).map((t) => clock(t as string)).join(" – ") : "Timing on request",
      summary: event.summary,
      image: mediaUrl(event.coverImage?.url) ?? "/images/about/team.jpg",
      enquiry: event.tags[0] ?? event.title,
    }));
});

/* ---------------------------------------------------------------- *
 * Gallery
 * ---------------------------------------------------------------- */

type CmsAlbum = { images: { media: CmsMedia; caption?: string }[] };

/** Every photograph in every published album, as one wall. */
export const getPhotos = cache(async (): Promise<GalleryPhoto[]> => {
  const data = await cmsGet<List<CmsAlbum>>("/gallery?limit=200");
  const photos = (data?.items ?? []).flatMap((album) =>
    album.images.map((image) => ({
      src: mediaUrl(image.media.url) as string,
      caption: image.caption || image.media.alt || "GIT Education",
    })),
  );
  return photos.length ? photos : PHOTOS;
});

/* ---------------------------------------------------------------- *
 * FAQs
 * ---------------------------------------------------------------- */

type CmsFaq = { id: string; question: string; answer: string; featured: boolean };
type CmsFaqCategory = { name: string; slug: string; faqs: CmsFaq[] };

type Faq = [question: string, answer: string];

const getFaqCategories = cache(async (): Promise<CmsFaqCategory[]> => {
  const data = await cmsGet<List<CmsFaqCategory>>("/faq-categories");
  return data?.items ?? [];
});

/**
 * The CMS's FAQ categories, in its order, for the tabs on /faq.
 *
 * With no CMS this is the single built-in "General" list, so the page has the
 * same first tab either way.
 */
export async function getFaqGroups(): Promise<{ id: string; label: string; items: Faq[] }[]> {
  const categories = await getFaqCategories();
  if (!categories.length) return [{ id: "general", label: "General", items: GENERAL_FAQS }];
  return categories.map((category) => ({
    id: category.slug,
    label: category.name,
    items: category.faqs.map((faq): Faq => [faq.question, faq.answer]),
  }));
}

/** The short list on the home page: featured questions, or the first category when none are. */
export async function getHomeFaqs(): Promise<Faq[]> {
  const categories = await getFaqCategories();
  if (!categories.length) return GENERAL_FAQS;
  const featured = categories.flatMap((category) => category.faqs.filter((faq) => faq.featured));
  return (featured.length ? featured : categories[0].faqs).slice(0, 8).map((faq): Faq => [faq.question, faq.answer]);
}

/* ---------------------------------------------------------------- *
 * Reviews
 * ---------------------------------------------------------------- */

type CmsReview = { id: string; authorName: string; quote: string; courseName?: string; badge?: string };

const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

const getCmsReviews = cache(async (): Promise<CmsReview[]> => {
  const data = await cmsGet<List<CmsReview>>("/reviews?limit=500");
  return data?.items ?? [];
});

/** The /reviews wall, in the order set in the CMS. */
export async function getReviews(): Promise<StudentReview[]> {
  const reviews = await getCmsReviews();
  if (!reviews.length) return REVIEWS;

  const courses = await getCourses();
  return reviews.map((review) => {
    const course = courses.find((c) => c.shortTitle.toLowerCase() === review.courseName?.toLowerCase());
    return {
      initials: initialsOf(review.authorName),
      name: review.authorName,
      role: review.badge ?? "Student",
      text: review.quote,
      course: review.courseName ?? "All courses",
      href: course ? `/courses/${course.slug}` : "/courses",
    };
  });
}

/* ---------------------------------------------------------------- *
 * Courses
 * ---------------------------------------------------------------- */

type CmsCourse = {
  id: string;
  title: string;
  slug: string;
  segment: string;
  categoryName?: string;
  shortDescription: string;
  h1?: string;
  overview?: string;
  intro?: string;
  duration?: string;
  level?: string;
  levelLabel?: string;
  icon?: string;
  seats?: number;
  nextBatch?: string;
  weeklyHours?: string;
  ratingValue?: number;
  ratingCount?: number;
  modes: string[];
  languages: string[];
  batches: Course["batches"];
  certification?: string;
  eligibility?: string;
  highlights: string[];
  tools: string[];
  benefits: { title: string; body?: string; icon?: string }[];
  audience: { title: string; body?: string }[];
  syllabus: { title: string; hours?: number; topics: string[] }[];
  projects: { title: string; body: string; tags: string[] }[];
  careerRoles: { role: string; salaryStart?: string; market?: string }[];
  faqIds: string[];
  reviewIds: string[];
  relatedIds: string[];
  seo: { metaTitle?: string; metaDescription?: string; keywords: string[] };
};

const lines = (text: string | undefined) =>
  (text ?? "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

/**
 * The CMS keeps tools as a flat list; this page prints them in named groups.
 * An entry written "Group: one; two; three" is a whole group, and entries
 * without a colon are collected under a single "Tools" heading.
 */
function toToolGroups(tools: string[]): Course["tools"] {
  const groups: Course["tools"] = [];
  const loose: string[] = [];
  for (const entry of tools) {
    const colon = entry.indexOf(":");
    if (colon === -1) {
      loose.push(entry.trim());
      continue;
    }
    const items = entry
      .slice(colon + 1)
      .split(";")
      .map((item) => item.trim())
      .filter(Boolean);
    if (items.length) groups.push({ group: entry.slice(0, colon).trim(), items });
  }
  if (loose.length) groups.push({ group: "Tools", items: loose });
  return groups;
}

const DEMAND = new Set(["Moderate", "High", "Very high"]);
const LEVELS: Record<string, string> = { beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced" };

function toCourse(cms: CmsCourse, slugById: Map<string, string>, faqs: Map<string, CmsFaq>, reviews: Map<string, CmsReview>): Course {
  // FAQs and reviews live with the built-in course unless an editor has
  // linked their own on the course form, in which case those replace them.
  const builtIn = COURSES.find((c) => c.slug === cms.slug);
  const linkedFaqs = cms.faqIds.map((id) => faqs.get(id)).filter((faq): faq is CmsFaq => Boolean(faq));
  const linkedReviews = cms.reviewIds.map((id) => reviews.get(id)).filter((review): review is CmsReview => Boolean(review));

  const title = cms.h1 || cms.title;
  const tagline = cms.shortDescription;
  const summary = lines(cms.overview);
  // The catalogue decides where a course it knows sits. One added in the CMS
  // goes under its CMS category, in a single sub-category.
  const place = placeOf(cms.slug);

  return {
    slug: cms.slug,
    title,
    shortTitle: cms.title,
    category: place?.category ?? cms.categoryName ?? "Courses",
    subCategory: place?.subCategory ?? OTHER_SUB_CATEGORY,
    icon: cms.icon ?? "book",
    tagline,
    summary: summary.length ? summary : lines(cms.intro),
    seo: {
      title: cms.seo.metaTitle || title,
      description: cms.seo.metaDescription || tagline,
      keywords: cms.seo.keywords,
    },
    level: cms.levelLabel || LEVELS[cms.level ?? ""] || "",
    duration: cms.duration ?? "",
    weeklyHours: cms.weeklyHours ?? "",
    modes: cms.modes,
    languages: cms.languages,
    certification: cms.certification ?? "",
    seats: cms.seats ?? 0,
    rating: { value: cms.ratingValue ?? 0, count: cms.ratingCount ?? 0 },
    nextBatch: cms.nextBatch ?? "",
    highlights: cms.benefits.map((benefit) => ({ icon: benefit.icon ?? "check", title: benefit.title, text: benefit.body ?? "" })),
    outcomes: cms.highlights,
    audience: cms.audience.map((row) => (row.title && row.body ? `${row.title}: ${row.body}` : row.title || row.body || "")).filter(Boolean),
    eligibility: lines(cms.eligibility),
    curriculum: cms.syllabus.map((module) => ({
      title: module.title,
      hours: module.hours ? `${module.hours} hour${module.hours === 1 ? "" : "s"}` : "",
      topics: module.topics,
    })),
    tools: toToolGroups(cms.tools),
    projects: cms.projects.map((project) => ({ title: project.title, text: project.body, tags: project.tags })),
    careers: cms.careerRoles.map((career) => ({
      role: career.role,
      salary: career.salaryStart ?? "",
      demand: (DEMAND.has(career.market ?? "") ? career.market : "Moderate") as Course["careers"][number]["demand"],
    })),
    batches: cms.batches,
    faqs: linkedFaqs.length
      ? [...linkedFaqs.map((faq): Faq => [faq.question, faq.answer]), ...COMMON_FAQS]
      : (builtIn?.faqs ?? COMMON_FAQS),
    reviews: linkedReviews.length
      ? linkedReviews.map((review) => ({
          initials: initialsOf(review.authorName),
          name: review.authorName,
          role: review.badge ?? "Student",
          text: review.quote,
        }))
      : (builtIn?.reviews ?? []),
    reviewsNote: linkedReviews.length ? undefined : builtIn?.reviewsNote,
    related: cms.relatedIds.map((id) => slugById.get(id)).filter((slug): slug is string => Boolean(slug)),
  };
}

/**
 * The course catalogue, in the order the site lists it.
 *
 * When the CMS has published courses it is the whole catalogue: a course that
 * is unpublished or deleted there leaves the site, and a new one joins it.
 * A withdrawn course stays out even while the CMS still has it published.
 */
export const getCourses = cache(async (): Promise<Course[]> => {
  const data = await cmsGet<List<CmsCourse>>("/courses?limit=500");
  const items = (data?.items ?? []).filter((course) => course.segment === "courses" && course.slug && !(course.slug in WITHDRAWN_COURSES));
  if (!items.length) return COURSES;

  const [categories, reviewList] = await Promise.all([getFaqCategories(), getCmsReviews()]);
  const faqs = new Map(categories.flatMap((category) => category.faqs).map((faq) => [faq.id, faq]));
  const reviews = new Map(reviewList.map((review) => [review.id, review]));
  const slugById = new Map(items.map((course) => [course.id, course.slug]));

  return items.map((course) => toCourse(course, slugById, faqs, reviews));
});

export async function getCourse(slug: string): Promise<Course | undefined> {
  return (await getCourses()).find((course) => course.slug === slug);
}

/** Related courses, skipping any that are no longer published. */
export async function getRelatedCourses(course: Course): Promise<Course[]> {
  const courses = await getCourses();
  return course.related.map((slug) => courses.find((c) => c.slug === slug)).filter((c): c is Course => Boolean(c));
}

/** Courses grouped by category and sub-category, in catalogue order — used by the /courses index. */
export async function getCoursesByCategory(): Promise<CourseGroup[]> {
  return groupCourses(await getCourses());
}
