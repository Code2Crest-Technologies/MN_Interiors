import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Instagram } from "lucide-react";
import { Header, Wordmark } from "@/components/header";
import { brand, rooms } from "@/lib/content";
import { indexable, siteUrl } from "@/lib/site-config";
import "./globals.css";

const url = siteUrl();

export const metadata: Metadata = {
  title: { default: "MN Interiors | Cinematic interiors in Erode", template: "%s | MN Interiors" },
  description: "Explore modular kitchens, TV units, wall panelling, wardrobes and study furniture in an interactive interiors showcase for MN Interiors, Erode.",
  ...(url ? { metadataBase: new URL(url) } : {}),
  robots: { index: indexable, follow: indexable },
  ...(url ? { openGraph: { type: "website", siteName: brand.name, images: ["/media/exterior-start.webp"] } } : {}),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en-IN"><body>
    <a href="#main" className="skip-link">Skip to content</a>
    <Header />
    <main id="main" tabIndex={-1}>{children}</main>
    <footer className="site-footer">
      <div className="footer-main">
        <Link className="brand-link" href="/" aria-label="MN Interiors home"><Wordmark /></Link>
        <nav aria-label="Rooms">{rooms.map((room) => <Link key={room.id} href={`/#${room.id}`}>{room.label}</Link>)}</nav>
        <div className="footer-links">
          <Link href="/contact">Contact <ArrowUpRight size={15} /></Link>
          <a href={brand.instagram} target="_blank" rel="noopener noreferrer" aria-label="MN Interiors on Instagram">
            <Instagram size={17} /> Instagram <ArrowUpRight size={15} /></a>
        </div>
      </div>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} MN Interiors</span>
        <span>{indexable ? "Erode, Tamil Nadu" : "Concept website by Code2Crest Technologies"}</span></div>
    </footer>
  </body></html>;
}
