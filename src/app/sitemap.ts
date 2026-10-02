import type { MetadataRoute } from "next";

import { CATALOGUE, categoryHref } from "@/lib/catalogue";
import { getCourses, getPosts } from "@/lib/cms";
import { SITE, certificateHref, certificatePrograms } from "@/lib/site";

/**
 * /sitemap.xml — every page a search engine should know about, on this site's
 * own domain (SITE.url, from NEXT_PUBLIC_SITE_URL). Courses and blog posts
 * follow the CMS, so a newly published one is listed without a deploy.
 */

const STATIC_PATHS = [
  "/about",
  "/about/mission-vision",
  "/about/accreditations-awards",
  "/about/team",
  "/certificate-programs",
  "/college-partnerships",
  "/contact",
  "/blogs",
  "/events",
  "/faq",
  "/gallery",
  "/reviews",
  "/tools/career-track-finder",
  "/tools/salary-estimator",
  "/tools/training-matcher",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [courses, posts] = await Promise.all([getCourses(), getPosts()]);
  const entry = (path: string, priority: number, lastModified?: string): MetadataRoute.Sitemap[number] => ({
    url: `${SITE.url}${path}`,
    priority,
    ...(lastModified && { lastModified }),
  });

  return [
    entry("", 1),
    entry("/courses", 0.9),
    ...CATALOGUE.map((category) => entry(categoryHref(category), 0.9)),
    ...courses.map((course) => entry(`/courses/${course.slug}`, 0.8)),
    ...certificatePrograms.map((program) => entry(certificateHref(program.slug), 0.7)),
    ...STATIC_PATHS.map((path) => entry(path, 0.6)),
    ...posts.map((post) => entry(`/blogs/${post.slug}`, 0.5, post.date)),
  ];
}
