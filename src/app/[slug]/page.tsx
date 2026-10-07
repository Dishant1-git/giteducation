import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { cleanHtml, getPage, getPosts } from "@/lib/cms";

export const dynamicParams = true;

type Props = { params: Promise<{ slug: string }> };

const safeHttpUrl = (value: string | undefined): string | undefined => {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:" ? url.toString() : undefined;
  } catch {
    return undefined;
  }
};

const safePageLink = (value: string | undefined): string | undefined => {
  if (!value) return undefined;
  if (value.startsWith("/") && !value.startsWith("//")) return value;
  return safeHttpUrl(value);
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPage(slug);
  if (!page) return { title: "Page not found" };

  const title = page.seo.metaTitle || page.title;
  const canonical = page.seo.canonicalUrl || `/${page.slug}`;
  return {
    title,
    description: page.seo.metaDescription,
    keywords: page.seo.keywords,
    alternates: { canonical },
    openGraph: { title, description: page.seo.metaDescription, url: canonical },
  };
}

export default async function CmsPage({ params }: Props) {
  const { slug } = await params;
  const page = await getPage(slug);
  if (!page) notFound();

  const visibleSections = page.sections.filter((section) => section.visible);
  const posts = visibleSections.some((section) => section.type === "blogs") ? await getPosts() : [];

  return (
    <article>
      <header className="on-inverse hero-surface relative isolate overflow-hidden px-5 pt-32 pb-16 text-white lg:px-8">
        <div className="panel-glow pointer-events-none absolute inset-0 -z-10" />
        <div className="mx-auto max-w-[1000px]">
          <nav aria-label="Breadcrumb" className="text-sm text-white/70">
            <Link href="/" className="hover:text-white">Home</Link>
            <span aria-hidden="true" className="px-2">/</span>
            <span aria-current="page" className="text-white">{page.title}</span>
          </nav>
          <h1 className="mt-8 max-w-4xl font-display text-[clamp(2.2rem,5vw,3.8rem)] leading-tight font-extrabold tracking-tight">{page.title}</h1>
        </div>
      </header>

      <div className="mx-auto max-w-[1000px] px-5 py-12 lg:px-8 lg:py-16">
        {page.content && (
          <div className="cms-prose" dangerouslySetInnerHTML={{ __html: cleanHtml(page.content) }} />
        )}

        <div className="space-y-12">
          {visibleSections.map((section, index) => {
            const href = safePageLink(section.linkUrl);
            return (
              <section key={`${section.type}-${index}`} className="border-t border-border-subtle pt-8">
                {section.title && <h2 className="mb-4 font-display text-2xl font-bold tracking-tight">{section.title}</h2>}
                {section.type === "rich-text" && section.body && (
                  <div className="cms-prose" dangerouslySetInnerHTML={{ __html: cleanHtml(section.body) }} />
                )}
                {section.type === "image" && section.media?.url && (
                  <Image
                    src={section.media.url}
                    alt={section.media.alt ?? ""}
                    width={section.media.width ?? 1200}
                    height={section.media.height ?? 800}
                    unoptimized
                    className="h-auto max-h-[720px] w-full rounded-panel object-cover"
                  />
                )}
                {section.type === "video" && href && (
                  <a href={href} {...(section.linkTarget === "new" ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="inline-flex items-center gap-2 font-semibold text-action hover:underline">
                    {section.linkLabel || "Watch video"} <span aria-hidden="true">→</span>
                  </a>
                )}
                {section.type === "cta" && href && (
                  <a href={href} {...(section.linkTarget === "new" ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="inline-flex rounded-full bg-action px-6 py-3 font-semibold text-white hover:bg-action-hover">
                    {section.linkLabel || "Learn more"}
                  </a>
                )}
                {section.type === "blogs" && (
                  <ul className="grid gap-4 sm:grid-cols-2">
                    {posts.slice(0, 4).map((post) => (
                      <li key={post.slug} className="rounded-card border border-border-subtle p-5">
                        <p className="text-xs font-semibold uppercase text-action">{post.category}</p>
                        <h3 className="mt-2 font-display text-lg font-bold">
                          <Link href={`/blogs/${post.slug}`} className="hover:text-action">{post.title}</Link>
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-content-muted">{post.excerpt}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            );
          })}
        </div>
      </div>
    </article>
  );
}
