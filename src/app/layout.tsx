import type { Metadata } from "next";
import { sarabun, hvmuse } from "@/lib/fonts";
import { Analytics } from "@vercel/analytics/next";
import SiteHeader from "@/components/site-header";
import { Footer } from "@/components/footer";
import { generateStructuredData } from "@/lib/seo";
import { CurrencyProvider } from "@/contexts/currency-context";
import { CartProvider } from "@/contexts/cart-context";
import { WishlistProvider } from "@/contexts/wishlist-context";
import { CookieConsent } from "@/components/cookie-consent";
import { ClarityScript } from "@/components/clarity-script";
import { MetaPixel } from "@/components/meta-pixel";
import { AbandonedCartTracker } from "@/components/abandoned-cart-tracker";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.lowtherloudspeakers.com";

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
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: siteUrl,
    title: "Lowther Loudspeakers - Handcrafted Excellence",
    description: "Discover the finest handcrafted loudspeakers from Lowther Loudspeakers. Masterpieces of acoustic engineering built to last a lifetime.",
    siteName: "Lowther Loudspeakers",
    images: [
      {
        url: `${siteUrl}/images/og/default.jpg`,
        width: 1200,
        height: 630,
        alt: "Lowther Loudspeakers - Handcrafted Excellence",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lowther Loudspeakers - Handcrafted Excellence",
    description: "Discover the finest handcrafted loudspeakers from Lowther Loudspeakers.",
    images: [`${siteUrl}/images/og/default.jpg`],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: [
      { url: '/favicon.ico', sizes: 'any' },
    ],
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
  { label: 'Loudspeakers', href: '/products#masterpieces', children: [
    { label: 'Quarter Wave', href: '/speakers/quarter-wave', desc: 'Discreet, architectural placement' },
    { label: 'Edilia', href: '/speakers/edilia', desc: 'Balanced, expressive presentation' },
    { label: 'Hegeman', href: '/speakers/hegeman', desc: 'Classic, room-filling stage' },
  ]},
  { label: 'Drive Units', href: '/category/drive-units', children: [
    { label: 'Grand Opera', href: '/collection/grand-opera' },
    { label: 'Super Tweeter', href: '/collection/super-tweeter' },
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
  
  // Generate WebSite schema with sitelinks search box for Google
  const websiteSchema = generateStructuredData("WebSite", {});

  return (
    <html lang="en" className={`${sarabun.variable} ${hvmuse.variable} scroll-smooth`}>
      <head>
        {/* Favicon Links - Safari-compatible order and cache-busting */}
        <link rel="shortcut icon" href="/favicon.ico?v=2" />
        <link rel="icon" href="/favicon.ico?v=2" sizes="any" />
        <link rel="icon" type="image/png" href="/favicon-16x16.png?v=2" sizes="16x16" />
        <link rel="icon" type="image/png" href="/favicon-32x32.png?v=2" sizes="32x32" />
        <link rel="apple-touch-icon" type="image/png" href="/apple-touch-icon.png?v=2" sizes="180x180" />
        
        {/* Organization Schema for Answer Engine Optimization (AEO) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        {/* WebSite Schema with Sitelinks Search Box for Google */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
      </head>
      <body className="font-body antialiased">
        <CurrencyProvider>
          <CartProvider>
            <WishlistProvider>
              <SiteHeader nav={NAV} />
              <div className="min-h-screen flex flex-col">
                <main className="flex-1">
                  {children}
                </main>
                <Footer />
              </div>
              <Analytics />
              <ClarityScript />
              <MetaPixel />
              <CookieConsent />
              <AbandonedCartTracker />
            </WishlistProvider>
          </CartProvider>
        </CurrencyProvider>
      </body>
    </html>
  );
}
