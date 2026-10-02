import type { MetadataRoute } from "next";

import { SITE } from "@/lib/site";

/** /robots.txt — everything is public except the API; points crawlers at the sitemap. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
