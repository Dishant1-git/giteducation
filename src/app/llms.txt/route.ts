import { CATALOGUE, categoryHref } from "@/lib/catalogue";
import { getCoursesByCategory } from "@/lib/cms";
import { SITE } from "@/lib/site";

/**
 * /llms.txt — a plain-text map of the site for AI assistants: who the
 * institute is, where it is, and every category and course with its address.
 * Built from the same catalogue the pages use, so it cannot drift from them.
 */

export const revalidate = 300;

export async function GET() {
  const groups = await getCoursesByCategory();
  const abs = (path: string) => `${SITE.url}${path}`;

  const lines = [
    `# ${SITE.name}`,
    "",
    `> ${SITE.legalName}, ${SITE.address.locality}, ${SITE.address.region}. Classroom computer courses with one computer per student, teaching since ${SITE.established}.`,
    "",
    `- Address: ${SITE.address.street}, ${SITE.address.locality}, ${SITE.address.region} ${SITE.address.postalCode}`,
    `- Phone: ${SITE.phone}`,
    `- Email: ${SITE.email}`,
    `- Hours: ${SITE.hours}`,
    "",
    "## Course categories",
    "",
    ...CATALOGUE.map((category) => `- [${category.pageTitle}](${abs(categoryHref(category))}): ${category.blurb}`),
    `- [All courses](${abs("/courses")})`,
    "",
    ...groups.flatMap((group) => [
      `## ${group.category}`,
      "",
      ...group.subCategories.flatMap((sub) => sub.courses.map((course) => `- [${course.title}](${abs(`/courses/${course.slug}`)}): ${sub.title}. ${course.duration}.`)),
      "",
    ]),
    "## More",
    "",
    `- [About](${abs("/about")})`,
    `- [Certificate programs](${abs("/certificate-programs")})`,
    `- [FAQ](${abs("/faq")})`,
    `- [Reviews](${abs("/reviews")})`,
    `- [Contact](${abs("/contact")})`,
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
