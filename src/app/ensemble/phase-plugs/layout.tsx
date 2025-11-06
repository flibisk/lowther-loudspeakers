import { Metadata } from "next";
import { generateSEOMetadata } from "@/lib/seo";
import { getPageMetadata } from "@/lib/metadata-config";

const pageMetadata = getPageMetadata("ensemble/phase-plugs");

export const metadata: Metadata = generateSEOMetadata({
  title: pageMetadata.title,
  description: pageMetadata.description,
  keywords: pageMetadata.keywords,
  image: pageMetadata.ogImage,
  url: "/ensemble/phase-plugs",
});

export default function PhasePlugsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}


