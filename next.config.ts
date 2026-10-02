import type { NextConfig } from "next";

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
  images: {
    remotePatterns: cmsUploads,
    // The optimiser refuses to fetch from a local address by default. Allowed
    // only while the CMS itself is on localhost; with the CMS on a public host
    // this stays off.
    dangerouslyAllowLocalIP: cmsIsLocal,
  },
};

export default nextConfig;
