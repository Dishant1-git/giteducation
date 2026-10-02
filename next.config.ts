import type { NextConfig } from "next";

import { WITHDRAWN_COURSES } from "./src/lib/catalogue";

/**
 * Images uploaded in the CMS (cms-techcadd/) are served by its API under
 * /uploads. Allowing exactly that path lets next/image optimise a blog cover
 * or gallery photo the same way it does the files in public/.
 */
const cmsUrl = process.env.NEXT_PUBLIC_CMS_URL ?? process.env.CMS_API_URL;
const cmsUploads = cmsUrl ? [new URL(`${cmsUrl.replace(/\/$/, "")}/uploads/**`)] : [];
/** True while the CMS is on this machine — local development and local test builds. */
const cmsIsLocal = cmsUrl ? ["localhost", "127.0.0.1"].includes(new URL(cmsUrl).hostname) : false;

const nextConfig: NextConfig = {
  // Courses the institute no longer runs keep their old addresses working.
  async redirects() {
    return Object.entries(WITHDRAWN_COURSES).map(([slug, destination]) => ({
      source: `/courses/${slug}`,
      destination,
      permanent: true,
    }));
  },
  images: {
    remotePatterns: cmsUploads,
    // The optimiser refuses to fetch from a local address by default. Allowed
    // only while the CMS itself is on localhost; with the CMS on a public host
    // this stays off.
    dangerouslyAllowLocalIP: cmsIsLocal,
    // Keep an optimised image for 30 days. An upload gets a new file name when
    // it is replaced, so a long window never serves a stale picture.
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
};

export default nextConfig;
