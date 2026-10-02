import type { MetadataRoute } from "next";

import { SITE } from "@/lib/site";

/**
 * Web app manifest (served at /manifest.webmanifest). It is what Android uses when
 * someone adds the site to their home screen, and where the two android-chrome
 * icons in public/images/favicons are used.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE.name} — ${SITE.tagline}`,
    short_name: SITE.name,
    description: `Computer courses in ${SITE.address.locality}: CAD and design, basic computer, web and digital marketing, Tally and accounting.`,
    start_url: "/",
    display: "standalone",
    background_color: "#fcfbf8",
    theme_color: "#0d1330",
    icons: [
      { src: "/images/favicons/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { src: "/images/favicons/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
      { src: "/images/favicons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
