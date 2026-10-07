import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getEvent } from "@/lib/cms";
import { formatEventDate } from "@/lib/events";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = true;

function safePublicHref(value: string | undefined): string | undefined {
  if (!value) return undefined;
  if (value.startsWith("/") && !value.startsWith("//")) return value;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:" ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) return { title: "Event not found" };
  return {
    title: event.title,
    description: event.summary,
    alternates: { canonical: `/events/${event.id}` },
    openGraph: { title: event.title, description: event.summary, images: [event.image] },
  };
}

export default async function EventPage({ params }: Props) {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) notFound();

  const registrationUrl = safePublicHref(event.registrationUrl);
  const mapUrl = safePublicHref(event.mapUrl);

  return (
    <article>
      <header className="on-inverse hero-surface relative isolate overflow-hidden px-5 pt-28 pb-14 text-white sm:pt-32 lg:px-8 lg:pb-16">
        <div className="panel-glow pointer-events-none absolute inset-0 -z-10" />
        <div className="grid-overlay pointer-events-none absolute inset-0 -z-10 opacity-50" />
        <div className="mx-auto max-w-[1000px]">
          <nav aria-label="Breadcrumb" className="text-sm text-white/65">
            <Link href="/" className="hover:text-white">Home</Link>
            <span aria-hidden="true" className="px-2">/</span>
            <Link href="/events" className="hover:text-white">Events</Link>
            <span aria-hidden="true" className="px-2">/</span>
            <span aria-current="page" className="text-white">{event.title}</span>
          </nav>
          <p className="mt-8 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold">{event.kind}</p>
          <h1 className="mt-5 max-w-4xl font-display text-[clamp(2rem,5vw,3.6rem)] leading-tight font-extrabold tracking-tight">{event.title}</h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/75">{event.summary}</p>
          <p className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/75">
            <time dateTime={event.date}>{formatEventDate(event.date)}</time>
            <span>{event.time}</span>
            <span>{event.mode === "online" ? "Online" : event.venueName || event.city || "In person"}</span>
          </p>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1000px] gap-10 px-5 py-12 lg:grid-cols-[minmax(0,1fr)_280px] lg:px-8 lg:py-16">
        <div className="min-w-0">
          <div className="relative aspect-[16/9] overflow-hidden rounded-panel bg-surface-sunken">
            <Image src={event.image} alt="" fill sizes="(min-width: 1024px) 680px, 100vw" className="object-cover" />
          </div>
          {event.body && <div className="cms-prose mt-8" dangerouslySetInnerHTML={{ __html: event.body }} />}

          {event.highlights.length > 0 && (
            <section className="mt-10">
              <h2 className="font-display text-2xl font-bold tracking-tight">What you will take away</h2>
              <ul className="mt-4 list-inside list-disc space-y-2 text-content-muted">
                {event.highlights.map((highlight, index) => <li key={`${highlight.text}-${index}`}>{highlight.text}</li>)}
              </ul>
            </section>
          )}

          {event.agenda.length > 0 && (
            <section className="mt-10">
              <h2 className="font-display text-2xl font-bold tracking-tight">Agenda</h2>
              <ol className="mt-4 divide-y divide-border-subtle border-y border-border-subtle">
                {event.agenda.map((item, index) => (
                  <li key={`${item.title}-${index}`} className="py-4">
                    {item.timeLabel && <p className="text-xs font-semibold text-action">{item.timeLabel}</p>}
                    <h3 className="mt-1 font-semibold">{item.title}</h3>
                    {item.detail && <p className="mt-1 text-sm leading-relaxed text-content-muted">{item.detail}</p>}
                  </li>
                ))}
              </ol>
            </section>
          )}

          {event.speakers.length > 0 && (
            <section className="mt-10">
              <h2 className="font-display text-2xl font-bold tracking-tight">Speakers</h2>
              <ul className="mt-4 grid gap-4 sm:grid-cols-2">
                {event.speakers.map((speaker, index) => (
                  <li key={`${speaker.name}-${index}`} className="rounded-card border border-border-subtle p-5">
                    <div className="flex items-center gap-3">
                      {speaker.photo?.url && (
                        <Image src={speaker.photo.url} alt="" width={48} height={48} unoptimized className="size-12 rounded-full object-cover" />
                      )}
                      <div>
                        <h3 className="font-semibold">{speaker.name}</h3>
                        <p className="text-sm text-content-muted">{[speaker.role, speaker.org].filter(Boolean).join(" · ")}</p>
                      </div>
                    </div>
                    {speaker.bio && <p className="mt-3 text-sm leading-relaxed text-content-muted">{speaker.bio}</p>}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {event.images.length > 0 && (
            <section className="mt-10">
              <h2 className="font-display text-2xl font-bold tracking-tight">Event photos</h2>
              <ul className="mt-4 grid gap-4 sm:grid-cols-2">
                {event.images.map((image, index) => (
                  <li key={`${image.media.url}-${index}`}>
                    <Image src={image.media.url} alt={image.caption || image.media.alt || ""} width={image.media.width ?? 800} height={image.media.height ?? 600} unoptimized className="h-auto w-full rounded-card" />
                    {image.caption && <p className="mt-2 text-sm text-content-muted">{image.caption}</p>}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <aside className="h-fit rounded-panel border border-border-subtle bg-surface-sunken p-6 lg:sticky lg:top-28">
          <h2 className="font-display text-lg font-bold">Join this event</h2>
          {event.hostName && <p className="mt-2 text-sm text-content-muted">Hosted with {event.hostName}</p>}
          {(event.venueName || event.venueAddress || event.city) && (
            <p className="mt-4 text-sm leading-relaxed text-content-muted">
              {[event.venueName, event.venueAddress, event.city].filter(Boolean).join(", ")}
            </p>
          )}
          {event.endsOn && event.endsOn.slice(0, 10) !== event.date && (
            <p className="mt-3 text-sm text-content-muted">Through {formatEventDate(event.endsOn.slice(0, 10))}</p>
          )}
          {registrationUrl ? (
            <a href={registrationUrl} className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-action px-5 py-3 text-sm font-semibold text-white hover:bg-action-hover">
              Register now
            </a>
          ) : (
            <button type="button" data-enquiry={event.enquiry} className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-action px-5 py-3 text-sm font-semibold text-white hover:bg-action-hover">
              Reserve a free seat
            </button>
          )}
          {mapUrl && <a href={mapUrl} className="mt-4 block text-center text-sm font-semibold text-action hover:underline">View location</a>}
          <Link href="/events" className="mt-6 block border-t border-border-subtle pt-4 text-sm font-semibold text-action hover:underline">← All events</Link>
        </aside>
      </div>
    </article>
  );
}
