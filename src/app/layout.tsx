import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter } from "next/font/google";

import { EnquiryModal } from "@/components/enquiry-modal";
import { SiteChrome } from "@/components/site-chrome";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { CATALOGUE } from "@/lib/catalogue";
import { getNavPages } from "@/lib/cms";
import { SITE } from "@/lib/site";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const bricolage = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-bricolage" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} | Computer Training Institute in Jalandhar`,
    template: `%s | ${SITE.name}`,
  },
  description:
    "CAD/CAM, Basic Computer, MS Office, Advance Excel, Punjabi Typing, Web Designing, Graphic Designing, Digital Marketing and Tally Prime with GST courses in Jalandhar.",
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: SITE.name,
    url: SITE.url,
  },
  robots: { index: true, follow: true },
  // Files live in public/images/favicons (generated set: .ico, 16/32 png, apple touch, android chrome).
  icons: {
    icon: [
      { url: "/images/favicons/favicon.ico", sizes: "any" },
      { url: "/images/favicons/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/images/favicons/favicon-16x16.png", type: "image/png", sizes: "16x16" },
    ],
    shortcut: ["/images/favicons/favicon.ico"],
    apple: [{ url: "/images/favicons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

/**
 * Organisation and local-business schema, on every page: who the institute is,
 * where it is, the city it serves and the subjects it teaches (the catalogue's
 * categories and courses).
 */
const organisation = {
  "@type": "EducationalOrganization",
  "@id": `${SITE.url}/#organization`,
  name: SITE.name,
  legalName: SITE.legalName,
  url: SITE.url,
  logo: `${SITE.url}/images/logo/tce.png`,
  telephone: SITE.phone,
  email: SITE.email,
  foundingDate: String(SITE.established),
  address: {
    "@type": "PostalAddress",
    streetAddress: SITE.address.street,
    addressLocality: SITE.address.locality,
    addressRegion: SITE.address.region,
    postalCode: SITE.address.postalCode,
    addressCountry: SITE.address.country,
  },
  areaServed: { "@type": "City", name: SITE.address.locality },
  knowsAbout: CATALOGUE.flatMap((category) => [category.title, ...category.subCategories.flatMap((sub) => sub.courses.map((course) => course.label))]),
};

const SCHEMA = {
  "@context": "https://schema.org",
  "@graph": [
    organisation,
    {
      ...organisation,
      "@type": "LocalBusiness",
      "@id": `${SITE.url}/#localbusiness`,
      description: `${SITE.tagline}. ${CATALOGUE.map((category) => category.pageTitle).join(", ")}.`,
      openingHours: "Mo-Sa 08:00-19:00",
      parentOrganization: { "@id": `${SITE.url}/#organization` },
    },
  ],
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const navPages = await getNavPages();

  return (
    <html lang="en" className={`${inter.variable} ${bricolage.variable}`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }} />
        {/* First stop for keyboard and screen reader users on every page. */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <SiteHeader navPages={navPages} />
        <main id="main-content">{children}</main>
        <SiteFooter navPages={navPages} />
        <SiteChrome />
        <EnquiryModal />
      </body>
    </html>
  );
}
