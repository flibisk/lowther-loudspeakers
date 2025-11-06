import { Metadata } from "next";
import { generateSEOMetadata } from "@/lib/seo";
import { getPageMetadata } from "@/lib/metadata-config";

const pageMetadata = getPageMetadata("brand/handcrafted");

export const metadata: Metadata = generateSEOMetadata({
  title: pageMetadata.title,
  description: pageMetadata.description,
  keywords: pageMetadata.keywords,
  image: pageMetadata.ogImage,
  url: "/brand/handcrafted",
});

export default function HandcraftedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}


