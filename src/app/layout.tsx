import type { Metadata } from "next";
import { sarabun, hvmuse } from "@/lib/fonts";
import { Analytics } from "@vercel/analytics/react";
import SiteHeader from "@/components/site-header";
import { Footer } from "@/components/footer";
import { generateStructuredData } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lowther Loudspeakers - Handcrafted Excellence",
  description: "Discover the finest handcrafted loudspeakers from Lowther Loudspeakers. Masterpieces of acoustic engineering built to last a lifetime.",
  keywords: "loudspeakers, handcrafted, high-end audio, Lowther, speakers, audiophile",
  authors: [{ name: "Lowther Loudspeakers" }],
  creator: "Lowther Loudspeakers",
  publisher: "Lowther Loudspeakers",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://lowtherloudspeakers.com"),
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "/",
    title: "Lowther Loudspeakers - Handcrafted Excellence",
    description: "Discover the finest handcrafted loudspeakers from Lowther Loudspeakers. Masterpieces of acoustic engineering built to last a lifetime.",
    siteName: "Lowther Loudspeakers",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lowther Loudspeakers - Handcrafted Excellence",
    description: "Discover the finest handcrafted loudspeakers from Lowther Loudspeakers.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const NAV = [
  { label: 'Loudspeakers', href: '/category/loudspeakers', children: [
    { label: 'Quarter Wave', href: '/speakers/quarter-wave', desc: 'Discreet, architectural placement' },
    { label: 'Edilia', href: '/speakers/edilia', desc: 'Balanced, expressive presentation' },
    { label: 'Hegeman', href: '/speakers/hegeman', desc: 'Classic, room-filling stage' },
  ]},
  { label: 'Drive Units', href: '/category/drive-units', children: [
    { label: 'Grand Opera', href: '/collection/grand-opera' },
    { label: 'Philharmonic', href: '/collection/philharmonic' },
    { label: 'Concert', href: '/collection/concert' },
  ]},
  { label: 'Cables', href: '/category/cables' },
  { label: 'Build', href: '/build-a-lowther' },
  { label: 'Blog', href: '/blog' },
  { label: 'Listen', href: '/listen' },
  { label: 'Shop', href: process.env.NEXT_PUBLIC_SHOP_URL ?? 'https://shop.lowtherloudspeakers.com' },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Generate Organization schema for the entire site
  const organizationSchema = generateStructuredData("Organization", {});

  return (
    <html lang="en" className={`${sarabun.variable} ${hvmuse.variable} scroll-smooth`}>
      <head>
        {/* Organization Schema for Answer Engine Optimization (AEO) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
      </head>
      <body className="font-body antialiased">
        <SiteHeader nav={NAV} />
        <div className="min-h-screen flex flex-col">
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
        <Analytics />
      </body>
    </html>
  );
}
