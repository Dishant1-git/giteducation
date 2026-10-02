import { revalidateTag } from "next/cache";

import { CMS_TAG } from "@/lib/cms";

/**
 * POST /api/revalidate — called by the CMS after every successful save, so an
 * edit shows on the site on the next page view instead of when the cache
 * window in src/lib/cms.ts runs out.
 *
 * The caller proves itself with the shared REVALIDATE_SECRET (the same value
 * in this app's env and in cms-techcadd/cms-api/.env). Without one configured
 * the endpoint refuses everything, rather than letting anyone on the internet
 * flush the cache on demand.
 */
export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret || request.headers.get("x-revalidate-secret") !== secret) {
    return Response.json({ revalidated: false }, { status: 401 });
  }

  // expire: 0 — this is a webhook, so the next visitor must get the new
  // content, not one more serving of the old page while it refreshes.
  revalidateTag(CMS_TAG, { expire: 0 });
  return Response.json({ revalidated: true });
}
