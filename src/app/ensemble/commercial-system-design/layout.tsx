import { Metadata } from "next";
import { generateSEOMetadata } from "@/lib/seo";
import { getPageMetadata } from "@/lib/metadata-config";

const pageMetadata = getPageMetadata("ensemble/commercial-system-design");

export const metadata: Metadata = generateSEOMetadata({
  title: pageMetadata.title,
  description: pageMetadata.description,
  keywords: pageMetadata.keywords,
  image: pageMetadata.ogImage,
  url: "/ensemble/commercial-system-design",
});

export default function CommercialSystemDesignLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}


