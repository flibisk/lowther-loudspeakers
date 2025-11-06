import { Metadata } from "next";
import { generateSEOMetadata } from "@/lib/seo";
import { getPageMetadata } from "@/lib/metadata-config";

const pageMetadata = getPageMetadata("brand/lasting-legacy");

export const metadata: Metadata = generateSEOMetadata({
  title: pageMetadata.title,
  description: pageMetadata.description,
  keywords: pageMetadata.keywords,
  image: pageMetadata.ogImage,
  url: "/brand/lasting-legacy",
});

export default function LastingLegacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}


