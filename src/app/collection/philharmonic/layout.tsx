import { Metadata } from "next";
import { generateSEOMetadata } from "@/lib/seo";
import { getPageMetadata } from "@/lib/metadata-config";

const pageMetadata = getPageMetadata("collection/philharmonic");

export const metadata: Metadata = generateSEOMetadata({
  title: pageMetadata.title,
  description: pageMetadata.description,
  keywords: pageMetadata.keywords,
  image: pageMetadata.ogImage,
  url: "/collection/philharmonic",
});

export default function PhilharmonicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}


