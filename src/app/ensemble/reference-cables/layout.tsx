import { Metadata } from "next";
import { generateSEOMetadata } from "@/lib/seo";
import { getPageMetadata } from "@/lib/metadata-config";

const pageMetadata = getPageMetadata("ensemble/reference-cables");

export const metadata: Metadata = generateSEOMetadata({
  title: pageMetadata.title,
  description: pageMetadata.description,
  keywords: pageMetadata.keywords,
  image: pageMetadata.ogImage,
  url: "/ensemble/reference-cables",
});

export default function ReferenceCablesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}


