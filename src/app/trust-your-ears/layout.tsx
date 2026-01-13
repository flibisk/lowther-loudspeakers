import { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://lowtherloudspeakers.com';

export const metadata: Metadata = {
  title: 'Album of the Week | Trust Your Ears | Lowther Loudspeakers',
  description: "Trust Your Ears is Lowther's album club. Every week the community recommends and votes on a single record to listen to together. A simple way for Lowther owners to discover beautifully mastered music and hear what their speakers are truly capable of.",
  keywords: ['album club', 'music recommendation', 'vinyl', 'audiophile', 'album of the week', 'listening community', 'hi-fi music', 'Lowther', 'loudspeakers'],
  openGraph: {
    title: 'Album of the Week | Trust Your Ears',
    description: "Trust Your Ears is Lowther's album club. Every week the community recommends and votes on a single record to listen to together.",
    url: `${BASE_URL}/trust-your-ears`,
    siteName: 'Lowther Loudspeakers',
    images: [
      {
        url: `${BASE_URL}/images/og/trust-your-ears.jpeg`,
        width: 1200,
        height: 630,
        alt: 'Trust Your Ears - Lowther Album Club',
      },
    ],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Album of the Week | Trust Your Ears',
    description: "Trust Your Ears is Lowther's album club. Every week the community recommends and votes on a single record to listen to together.",
    images: [`${BASE_URL}/images/og/trust-your-ears.jpeg`],
  },
  alternates: {
    canonical: `${BASE_URL}/trust-your-ears`,
  },
};

export default function TrustYourEarsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
