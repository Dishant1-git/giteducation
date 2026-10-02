import { NextResponse, type NextRequest } from "next/server";

/**
 * Applies the redirects kept in the CMS (SEO → Redirects).
 *
 * This runs in front of every page, so it must never wait on the CMS per
 * request. The list is fetched once and kept in memory; when it is older than
 * the window below the next request still answers from the old list and a
 * refresh runs in the background. Only the very first request after a start
 * waits, and then for no longer than the timeout.
 *
 * With no CMS_API_URL, or with the CMS down, the list is empty and every
 * request passes straight through.
 */

type Redirect = { from: string; to: string; type: number };

/** How long a fetched list is served before it is refreshed. */
const REFRESH_MS = 5 * 60 * 1000;

const API_URL = process.env.CMS_API_URL?.replace(/\/$/, "");

let redirects = new Map<string, Redirect>();
let fetchedAt = 0;
let pending: Promise<void> | null = null;

/** "/Old-Page/" and "/old-page" are the same address to a visitor. */
const normalise = (path: string) => (path.length > 1 ? path.replace(/\/+$/, "") : path).toLowerCase();

function refresh(): Promise<void> {
  pending ??= fetch(`${API_URL}/api/public/redirects`, { cache: "no-store", signal: AbortSignal.timeout(8000) })
    .then(async (response) => {
      if (!response.ok) return;
      const data = (await response.json()) as { items: Redirect[] };
      redirects = new Map(data.items.map((item) => [normalise(item.from), item]));
    })
    .catch(() => {
      // Unreachable or slow: keep serving the list we already have.
    })
    .finally(() => {
      // Stamped on failure too, so a CMS that is down is retried once per
      // window rather than on every request.
      fetchedAt = Date.now();
      pending = null;
    });
  return pending;
}

export async function proxy(request: NextRequest) {
  if (!API_URL) return NextResponse.next();

  if (fetchedAt === 0) await refresh();
  else if (Date.now() - fetchedAt > REFRESH_MS) void refresh();

  const match = redirects.get(normalise(request.nextUrl.pathname));
  if (!match) return NextResponse.next();

  const target = new URL(match.to, request.url);
  // A redirect to itself would loop; leave the page alone instead.
  if (target.origin === request.nextUrl.origin && normalise(target.pathname) === normalise(request.nextUrl.pathname)) {
    return NextResponse.next();
  }
  return NextResponse.redirect(target, match.type === 302 ? 302 : 301);
}

export const config = {
  // Pages only: not the API, Next's own files, or anything with a file extension.
  matcher: ["/((?!api/|_next/|.*\\.[\\w]+$).*)"],
};
