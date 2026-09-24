import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Icon } from "@/components/icon";
import { Reveal } from "@/components/motion";
import { POSTS, formatPostDate, getPost } from "@/lib/blog";
import { SITE } from "@/lib/site";

export function generateStaticParams() {
  return POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Article not found" };

  const path = `/blogs/${post.slug}`;
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: path },
    openGraph: { title: post.title, description: post.excerpt, url: path, type: "article", publishedTime: post.date, images: [post.image] },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const others = POSTS.filter((p) => p.slug !== post.slug);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    image: `${SITE.url}${post.image}`,
    author: { "@type": "Organization", name: SITE.name },
    publisher: { "@type": "Organization", name: SITE.name },
    mainEntityOfPage: `${SITE.url}/blogs/${post.slug}`,
  };

  return (
    <article data-enquiry-course={post.courseName}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <header className="on-inverse hero-surface relative isolate overflow-hidden px-5 pt-28 pb-14 text-white sm:pt-32 lg:px-8 lg:pb-16">
        <div className="panel-glow pointer-events-none absolute inset-0 -z-10" />
        <div className="grid-overlay pointer-events-none absolute inset-0 -z-10 opacity-50" />
        <div className="mx-auto max-w-[820px]">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2 text-[13px] text-white/60">
              <li>
                <Link href="/" className="transition-colors hover:text-accent-yellow">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/blogs" className="transition-colors hover:text-accent-yellow">
                  Blog
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <span aria-current="page" className="text-white">
                  {post.category}
                </span>
              </li>
            </ol>
          </nav>
          <Reveal>
            <p className="mt-8 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-wide">{post.category}</p>
            <h1 className="mt-6 font-display text-[clamp(2rem,4.5vw,3.2rem)] leading-[1.08] font-extrabold tracking-[-0.03em] text-balance">{post.title}</h1>
            <p className="mt-5 flex flex-wrap items-center gap-2 font-mono text-xs text-white/65">
              <span>By the {SITE.name} team</span>
              <span aria-hidden="true" className="size-1 rounded-full bg-white/40" />
              <time dateTime={post.date}>{formatPostDate(post.date)}</time>
              <span aria-hidden="true" className="size-1 rounded-full bg-white/40" />
              {post.readMinutes} min read
            </p>
          </Reveal>
        </div>
      </header>

      <div className="px-5 py-12 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-[820px]">
          <div className="relative aspect-video overflow-hidden rounded-panel bg-surface-sunken shadow-card">
            <Image src={post.image} alt="" fill priority sizes="(min-width: 860px) 820px, 100vw" className="object-cover" />
          </div>

          <p className="mt-10 text-lg leading-relaxed text-content-muted">{post.excerpt}</p>

          {post.sections.map((section) => (
            <section key={section.heading} className="mt-10">
              <h2 className="font-display text-2xl font-bold tracking-tight">{section.heading}</h2>
              {section.paragraphs.map((p) => (
                <p key={p} className="mt-4 text-base leading-relaxed">
                  {p}
                </p>
              ))}
              {section.list && (
                <ul className="mt-4 space-y-3">
                  {section.list.map((item) => (
                    <li key={item} className="flex gap-3 text-base leading-relaxed">
                      <Icon name="check" className="mt-1 size-4 shrink-0 text-action" strokeWidth={2.4} />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          <aside className="mt-14 flex flex-col items-start justify-between gap-5 rounded-panel border border-border-subtle bg-surface-raised p-6 shadow-card sm:flex-row sm:items-center sm:p-7">
            <div>
              <p className="font-display text-lg font-bold tracking-tight">Want to learn this hands-on?</p>
              <p className="mt-1 text-sm text-content-muted">Our {post.courseName} course covers it with practice on real sheets and files.</p>
            </div>
            <div className="flex w-full flex-col gap-2.5 sm:w-auto sm:flex-row">
              <Link
                href={`/courses/${post.courseSlug}`}
                className="inline-flex h-11 items-center justify-center rounded-full border border-border-strong px-5 text-sm font-semibold transition-colors hover:border-action hover:text-action"
              >
                See the course
              </Link>
              <button
                type="button"
                data-enquiry={post.courseName}
                className="inline-flex h-11 items-center justify-center rounded-full bg-action px-5 text-sm font-semibold text-white transition-colors hover:bg-action-hover"
              >
                Book a free demo
              </button>
            </div>
          </aside>
        </div>
      </div>

      <section className="border-t border-border-subtle bg-surface-sunken px-5 py-14 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-[1240px]">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="font-display text-2xl font-bold tracking-tight">More from the blog</h2>
            <Link href="/blogs" className="text-sm font-semibold text-action hover:underline">
              All posts →
            </Link>
          </div>
          <ul className="mt-8 grid gap-6 sm:grid-cols-2">
            {others.map((p) => (
              <li key={p.slug}>
                <article className="group relative flex h-full gap-4 rounded-card border border-border-subtle bg-surface-raised p-4 transition-colors hover:border-action/40">
                  <div className="relative aspect-square w-24 shrink-0 overflow-hidden rounded-control bg-surface-sunken">
                    <Image src={p.image} alt="" fill sizes="96px" className="object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-mono text-[11px] text-content-muted uppercase">{p.category}</p>
                    <h3 className="mt-1 font-display text-base leading-snug font-bold tracking-tight">
                      <Link href={`/blogs/${p.slug}`} className="after:absolute after:inset-0 group-hover:text-action">
                        {p.title}
                      </Link>
                    </h3>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </article>
  );
}
