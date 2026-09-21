import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "GIT Education | Computer Training Institute in Jalandhar",
  description:
    "Basic Computer, MS Office, Advance Excel, Tally Prime with GST, Punjabi Typing, CAD/CAM and Graphic Design courses in Jalandhar.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
