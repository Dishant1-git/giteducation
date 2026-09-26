import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter } from "next/font/google";

import { EnquiryModal } from "@/components/enquiry-modal";
import { SiteChrome } from "@/components/site-chrome";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
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
    "Basic Computer, MS Office, Advance Excel, Tally Prime with GST, Punjabi Typing, CAD/CAM, Digital Marketing and Artificial Intelligence courses in Jalandhar.",
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: SITE.name,
    url: SITE.url,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${bricolage.variable}`}>
      <body>
        {/* First stop for keyboard and screen reader users on every page. */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <SiteHeader />
        <main id="main-content">{children}</main>
        <SiteFooter />
        <SiteChrome />
        <EnquiryModal />
      </body>
    </html>
  );
}
