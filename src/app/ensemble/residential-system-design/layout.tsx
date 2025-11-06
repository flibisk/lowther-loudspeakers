import { Metadata } from "next";
import { generateSEOMetadata } from "@/lib/seo";
import { getPageMetadata } from "@/lib/metadata-config";

const pageMetadata = getPageMetadata("ensemble/residential-system-design");

export const metadata: Metadata = generateSEOMetadata({
  title: pageMetadata.title,
  description: pageMetadata.description,
  keywords: pageMetadata.keywords,
  image: pageMetadata.ogImage,
  url: "/ensemble/residential-system-design",
});

export default function ResidentialSystemDesignLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}


